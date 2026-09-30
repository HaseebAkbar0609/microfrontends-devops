import { MATERIAL_RECEIPT_REFERENCE_PREFIX } from "../constants/materialStorage.constants";
import type {
	MaterialTransaction,
	MaterialTransactionStatus,
	ReceiveMaterialInput,
} from "../types/materialTransaction.types";
import { applyReceipt, formatTransactionReference } from "../utils/materialReceipt";
import { materialMockStore as store, respondWith } from "./materialMockStore";

function recordReceipt(input: ReceiveMaterialInput, status: MaterialTransactionStatus): MaterialTransaction {
	const article = store.articles().find((candidate) => candidate.id === input.articleId);
	const depot = store.depots().find((candidate) => candidate.id === input.depotId);
	if (!article || !depot) throw new Error("Unknown article or depot");

	const sequence = store.transactions().filter((transaction) => transaction.type === "receipt").length + 1;
	const now = new Date();
	const transaction: MaterialTransaction = {
		...input,
		id: `tx_${now.getTime()}_${sequence}`,
		reference: formatTransactionReference(MATERIAL_RECEIPT_REFERENCE_PREFIX, now.getFullYear(), sequence),
		type: "receipt",
		status,
		unit: article.unit,
		createdAt: now.toISOString(),
	};
	store.addTransaction(transaction);
	return transaction;
}

/** "Ta in material" (TFS-1073): book a receipt into stock, or keep it as a draft. */
export const materialReceiptService = {
	receive(input: ReceiveMaterialInput): Promise<MaterialTransaction> {
		return respondWith(() => {
			if (input.quantity === null || input.quantity <= 0) throw new Error("A receipt needs a quantity");
			const transaction = recordReceipt(input, "completed");
			store.setStockEntries(applyReceipt(store.stockEntries(), input.articleId, input.depotId, input.quantity));
			return transaction;
		});
	},

	/** Saves the receipt without touching stock. */
	saveDraft(input: ReceiveMaterialInput): Promise<MaterialTransaction> {
		return respondWith(() => recordReceipt(input, "draft"));
	},
};
