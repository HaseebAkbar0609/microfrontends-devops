import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";

export type WarrantySortField = "date" | "name";

/** The two columns the frame draws, both sortable. */
export const WARRANTY_COLUMNS: { key: WarrantySortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.projectWarrantyColDate },
	{ key: "name", labelKey: localizationConstants.projectWarrantyColName },
];

/** Benämning's limit, as the record's other free-text names use. */
export const WARRANTY_NAME_MAX_LENGTH = 120;
