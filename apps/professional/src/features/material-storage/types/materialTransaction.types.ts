import type { MaterialArticle, MaterialUnit } from "./materialStorage.types";

/** More types (transfer, reservation, adjustment, return) arrive with TFS-1077. */
export type MaterialTransactionType = "receipt" | "withdrawal";

/** A draft is saved but has not changed any stock yet. */
export type MaterialTransactionStatus = "draft" | "completed";

/** What "Ta in material" sends. Optional fields left empty are null. */
export interface ReceiveMaterialInput {
	depotId: string;
	articleId: string;
	/** Only a draft may leave it out. */
	quantity: number | null;
	supplierName: string | null;
	unitPrice: number | null;
	/** yyyy-MM-dd */
	deliveryDate: string;
	supplierOrderNo: string | null;
	comment: string | null;
}

/** The "Koppla till" switch in "Ta ut material": what the withdrawn material is booked against. */
export type WithdrawalLinkType = "order" | "project" | "invoice" | "internal";

/** The link types that point at a record to choose (all but Internt uttag). */
export type WithdrawalTargetType = Exclude<WithdrawalLinkType, "internal">;

/** An order, project or invoice material can be withdrawn to, e.g. PRJ-2026-0147 – Renovering Storgatan 12. */
export interface MaterialLinkTarget {
	id: string;
	type: WithdrawalTargetType;
	reference: string;
	name: string;
}

/** A project's arbetsmoment, e.g. "Innerväggar plan 2". */
export interface MaterialWorkStep {
	id: string;
	projectId: string;
	name: string;
}

/** What "Ta ut material" sends. Optional fields left empty are null. */
export interface WithdrawMaterialInput {
	depotId: string;
	articleId: string;
	/** Only a draft may leave it out. */
	quantity: number | null;
	linkType: WithdrawalLinkType;
	/** The order, project or invoice; null for Internt uttag, or a draft that has none yet. */
	linkId: string | null;
	workStepId: string | null;
	/** Utpris per unit; null for Internt uttag, which is valued at purchase price. */
	salesPrice: number | null;
	/** Whether the material becomes an invoice line to the customer. */
	addInvoiceLine: boolean;
	comment: string | null;
}

interface MaterialTransactionBase {
	id: string;
	/** Shown to users, e.g. INL-2026-0001. */
	reference: string;
	status: MaterialTransactionStatus;
	unit: MaterialUnit;
	/** ISO timestamp */
	createdAt: string;
}

export interface MaterialReceiptTransaction extends MaterialTransactionBase, ReceiveMaterialInput {
	type: "receipt";
}

export interface MaterialWithdrawalTransaction extends MaterialTransactionBase, WithdrawMaterialInput {
	type: "withdrawal";
	/** Tillgängligt before the withdrawal, which the confirmation (TFS-1079) shows as "Lager före". */
	availableBefore: number;
}

export type MaterialTransaction = MaterialReceiptTransaction | MaterialWithdrawalTransaction;

export interface MaterialStockLevel {
	inStock: number;
	reserved: number;
	available: number;
}

/** The article fields the stock dialogs fill in when a material is picked or preset from a row. */
export type MaterialArticleDefaults = Pick<MaterialArticle, "id" | "supplierName" | "purchasePrice" | "salesPrice">;

/** Where a stock dialog was opened from: the overview button presets the depot, a row also the article. */
export interface MaterialDialogPreset {
	depotId: string | null;
	article: MaterialArticleDefaults | null;
}
