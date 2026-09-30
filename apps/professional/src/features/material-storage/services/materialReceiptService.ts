import type {
	MaterialReceiptTransaction,
	MaterialTransactionStatus,
	ReceiveMaterialInput,
} from "../types/materialTransaction.types";
import { applyReceipt } from "../utils/materialStockChanges";
import { materialMockStore as store, respondWith } from "./materialMockStore";

function recordReceipt(input: ReceiveMaterialInput, status: MaterialTransactionStatus): MaterialReceiptTransaction {
	const transaction: MaterialReceiptTransaction = { ...input, ...store.newTransaction("receipt", input, status) };
	store.addTransaction(transaction);
	return transaction;
}

/** "Ta in material" (TFS-1073): book a receipt into stock, or keep it as a draft. */
export const materialReceiptService = {
	receive(input: ReceiveMaterialInput): Promise<MaterialReceiptTransaction> {
		return respondWith(() => {
			if (input.quantity === null || input.quantity <= 0) throw new Error("A receipt needs a quantity");
			const transaction = recordReceipt(input, "completed");
			store.setStockEntries(applyReceipt(store.stockEntries(), input.articleId, input.depotId, input.quantity));
			return transaction;
		});
	},

	/** Saves the receipt without touching stock. */
	saveDraft(input: ReceiveMaterialInput): Promise<MaterialReceiptTransaction> {
		return respondWith(() => recordReceipt(input, "draft"));
	},
};
