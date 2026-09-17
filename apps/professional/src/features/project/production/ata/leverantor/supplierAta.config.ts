import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { SupplierAtaStatus } from "../types";

/** The UE tab's `?section=` id and the query parameter holding the selected supplier. */
export const ATA_SUPPLIER_SECTION = "leverantor";
export const ATA_SUPPLIER_QUERY_PARAM = "leverantor";

/* Radix Select cannot take `""` as a value. These can never be record ids —
   `parseRecordIdParam` only allows letters, digits, `-` and `_`. */
export const SUPPLIER_SELECT_ALL = ":all";
export const SUPPLIER_NO_LINK = ":none";

export const SUPPLIER_ATA_PAGE_SIZE = 10;

export const SUPPLIER_ATA_STATUSES = [
	"ej_granskad",
	"forhandling",
	"ok",
	"redovisad",
] as const satisfies readonly SupplierAtaStatus[];

/** Which grouped-table column each status counts under. */
export const SUPPLIER_ATA_BUCKET: Record<SupplierAtaStatus, "approved" | "inReview" | "notApproved"> = {
	ok: "approved",
	redovisad: "approved",
	forhandling: "inReview",
	ej_granskad: "notApproved",
};

export type SupplierGroupSortField = "name" | "total" | "count" | "approved" | "inReview" | "notApproved";

export const SUPPLIER_GROUP_COLUMNS: { key: SupplierGroupSortField; labelKey: TranslationKeys }[] = [
	{ key: "name", labelKey: localizationConstants.ataSupplierColCompanyName },
	{ key: "total", labelKey: localizationConstants.ataSupplierColTotal },
	{ key: "count", labelKey: localizationConstants.ataSupplierColCount },
	{ key: "approved", labelKey: localizationConstants.ataSupplierColApproved },
	{ key: "inReview", labelKey: localizationConstants.ataSupplierColInReview },
	{ key: "notApproved", labelKey: localizationConstants.ataSupplierColNotApproved },
];

export type SupplierAtaSortField = "date" | "number" | "linked" | "amount" | "status" | "attested" | "attestDate";

export const SUPPLIER_ATA_COLUMNS: { key: SupplierAtaSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.ataColDate },
	{ key: "number", labelKey: localizationConstants.ataColNumber },
	{ key: "linked", labelKey: localizationConstants.ataSupplierColLinkedAta },
	{ key: "amount", labelKey: localizationConstants.ataColAmount },
	{ key: "status", labelKey: localizationConstants.ataColStatus },
	{ key: "attested", labelKey: localizationConstants.ataSupplierColAttested },
	{ key: "attestDate", labelKey: localizationConstants.ataSupplierColAttestDate },
];
