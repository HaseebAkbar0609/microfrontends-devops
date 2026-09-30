import { MATERIAL_MOCK_LATENCY_MS } from "../constants/materialStorage.constants";
import {
	MOCK_MATERIAL_ARTICLES,
	MOCK_MATERIAL_DEPOTS,
	MOCK_MATERIAL_STOCK,
} from "../data/materialStorage.mock";
import type { MaterialStockEntry } from "../types/materialStorage.types";
import type { MaterialTransaction } from "../types/materialTransaction.types";
import { buildStockRows } from "../utils/materialStockOverview";

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
	stockEntries: () => stockEntries,
	stockRows: () => buildStockRows(MOCK_MATERIAL_ARTICLES, MOCK_MATERIAL_DEPOTS, stockEntries),
	setStockEntries(next: MaterialStockEntry[]) {
		stockEntries = next;
	},
	transactions: () => transactions,
	addTransaction(transaction: MaterialTransaction) {
		transactions = [transaction, ...transactions];
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
