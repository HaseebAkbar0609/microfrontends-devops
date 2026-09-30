import type { MaterialArticle, MaterialUnit } from "./materialStorage.types";

/** More types (withdrawal, transfer, reservation, adjustment, return) arrive with TFS-1074 and TFS-1077. */
export type MaterialTransactionType = "receipt";

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

export interface MaterialTransaction extends ReceiveMaterialInput {
	id: string;
	/** Shown to users, e.g. INL-2026-0001. */
	reference: string;
	type: MaterialTransactionType;
	status: MaterialTransactionStatus;
	unit: MaterialUnit;
	/** ISO timestamp */
	createdAt: string;
}

export interface MaterialStockLevel {
	inStock: number;
	reserved: number;
	available: number;
}

/** The article fields "Ta in material" fills in when a material is picked or preset from a row. */
export type ReceiveArticleDefaults = Pick<MaterialArticle, "id" | "supplierName" | "purchasePrice">;

/** Where the dialog was opened from: the overview button presets the depot, a row also the article. */
export interface ReceiveMaterialPreset {
	depotId: string | null;
	article: ReceiveArticleDefaults | null;
}
