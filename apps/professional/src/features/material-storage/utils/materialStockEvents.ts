import type { MaterialStockEvent } from "../types/materialArticle.types";
import type { MaterialTransaction } from "../types/materialTransaction.types";

// Only type imports here: tests/material-article.test.cjs runs this file on its own.

/** In, out, or signed as counted: a receipt adds, a withdrawal takes, an adjustment is already signed. */
function quantityChange(transaction: MaterialTransaction): number {
	const quantity = transaction.quantity ?? 0;
	if (transaction.type === "withdrawal") return -quantity;
	return quantity;
}

/**
 * An article's history as the article view lists it: completed transactions
 * only (a draft has not moved any stock), newest first, with depot and linked
 * record names looked up.
 */
export function toStockEvents(
	transactions: readonly MaterialTransaction[],
	depotNames: Readonly<Record<string, string>>,
	linkReferences: Readonly<Record<string, string>>,
): MaterialStockEvent[] {
	return transactions
		.filter((transaction) => transaction.status === "completed")
		.map((transaction) => {
			const isWithdrawal = transaction.type === "withdrawal";
			return {
				id: transaction.id,
				reference: transaction.reference,
				type: transaction.type,
				createdAt: transaction.createdAt,
				depotId: transaction.depotId,
				depotName: depotNames[transaction.depotId] ?? "",
				quantityChange: quantityChange(transaction),
				unit: transaction.unit,
				linkType: isWithdrawal ? transaction.linkType : null,
				linkReference: isWithdrawal && transaction.linkId ? (linkReferences[transaction.linkId] ?? null) : null,
				supplierOrderNo: transaction.type === "receipt" ? transaction.supplierOrderNo : null,
				reason: transaction.type === "adjustment" ? transaction.reason : null,
				createdBy: transaction.createdBy,
			};
		})
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Påslag: how much the sales price adds on top of the purchase price, in percent. Null without a purchase price. */
export function markupPercent(purchasePrice: number, salesPrice: number): number | null {
	return purchasePrice > 0 ? ((salesPrice - purchasePrice) / purchasePrice) * 100 : null;
}

/** Bruttomarginal: the share of the sales price that is left after the purchase price, in percent. Null without a sales price. */
export function grossMarginPercent(purchasePrice: number, salesPrice: number): number | null {
	return salesPrice > 0 ? ((salesPrice - purchasePrice) / salesPrice) * 100 : null;
}
