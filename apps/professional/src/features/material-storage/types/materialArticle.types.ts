import type { MaterialArticle, MaterialStockRow, MaterialUnit } from "./materialStorage.types";
import type { MaterialTransactionType, WithdrawalLinkType } from "./materialTransaction.types";

/** What "Visa artikel" (TFS-1075) shows about one article: the article and its stock in every depot that carries it. */
export interface MaterialArticleDetails {
	article: MaterialArticle;
	stock: MaterialStockRow[];
}

/** A completed transaction as a line in the article's history, with the names it refers to looked up. */
export interface MaterialStockEvent {
	id: string;
	reference: string;
	type: MaterialTransactionType;
	/** ISO timestamp */
	createdAt: string;
	depotId: string;
	depotName: string;
	/** Signed: positive into stock, negative out of it. */
	quantityChange: number;
	unit: MaterialUnit;
	/** Withdrawals only: what the material went to, and that record's reference (e.g. PRJ-2026-0147). */
	linkType: WithdrawalLinkType | null;
	linkReference: string | null;
	/** Receipts only. */
	supplierOrderNo: string | null;
	/** Adjustments only, e.g. "Inventering". */
	reason: string | null;
	createdBy: string | null;
}

/** An article's prices from a date on. */
export interface MaterialPriceChange {
	articleId: string;
	/** yyyy-MM-dd */
	date: string;
	purchasePrice: number;
	salesPrice: number;
	changedBy: string;
}
