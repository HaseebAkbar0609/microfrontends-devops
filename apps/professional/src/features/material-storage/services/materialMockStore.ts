import {
	MATERIAL_MOCK_LATENCY_MS,
	MATERIAL_TRANSACTION_PREFIXES,
} from "../constants/materialStorage.constants";
import {
	MOCK_MATERIAL_ARTICLES,
	MOCK_MATERIAL_DEPOTS,
	MOCK_MATERIAL_STOCK,
} from "../data/materialStorage.mock";
import { MOCK_MATERIAL_LINK_TARGETS, MOCK_MATERIAL_WORK_STEPS } from "../data/materialWithdrawal.mock";
import type { MaterialStockEntry } from "../types/materialStorage.types";
import type {
	MaterialTransaction,
	MaterialTransactionStatus,
	MaterialTransactionType,
} from "../types/materialTransaction.types";
import { buildStockRows } from "../utils/materialStockOverview";
import { formatTransactionReference } from "../utils/materialStockChanges";

/**
 * The mock backend's state for Materialhantering: stock per depot and the
 * transactions that changed it. It lasts for the browser session, like the
 * other mock-backed modules, and goes away with the services once the API exists.
 */
let stockEntries: MaterialStockEntry[] = [...MOCK_MATERIAL_STOCK];
let transactions: MaterialTransaction[] = [];

export const materialMockStore = {
	depots: () => MOCK_MATERIAL_DEPOTS,
	articles: () => MOCK_MATERIAL_ARTICLES,
	linkTargets: () => MOCK_MATERIAL_LINK_TARGETS,
	workSteps: () => MOCK_MATERIAL_WORK_STEPS,
	stockEntries: () => stockEntries,
	stockRows: () => buildStockRows(MOCK_MATERIAL_ARTICLES, MOCK_MATERIAL_DEPOTS, stockEntries),
	setStockEntries(next: MaterialStockEntry[]) {
		stockEntries = next;
	},
	transactions: () => transactions,
	addTransaction(transaction: MaterialTransaction) {
		transactions = [transaction, ...transactions];
	},

	/** The fields every new transaction gets: id, the next reference of its type, the article's unit and a timestamp. */
	newTransaction<TType extends MaterialTransactionType>(
		type: TType,
		{ articleId, depotId }: { articleId: string; depotId: string },
		status: MaterialTransactionStatus,
	) {
		const article = MOCK_MATERIAL_ARTICLES.find((candidate) => candidate.id === articleId);
		const depot = MOCK_MATERIAL_DEPOTS.find((candidate) => candidate.id === depotId);
		if (!article || !depot) throw new Error("Unknown article or depot");

		const sequence = transactions.filter((transaction) => transaction.type === type).length + 1;
		const now = new Date();
		return {
			id: `tx_${now.getTime()}_${sequence}`,
			reference: formatTransactionReference(MATERIAL_TRANSACTION_PREFIXES[type], now.getFullYear(), sequence),
			type,
			status,
			unit: article.unit,
			createdAt: now.toISOString(),
		};
	},
};

/**
 * Answers after a simulated round trip, doing the work at the end of it so the
 * UI's pending state lasts as long as the change does. A throw becomes a rejection.
 */
export function respondWith<T>(work: () => T): Promise<T> {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			try {
				resolve(work());
			} catch (error) {
				reject(error);
			}
		}, MATERIAL_MOCK_LATENCY_MS),
	);
}
