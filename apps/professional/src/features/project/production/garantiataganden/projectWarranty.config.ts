import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { acceptAttribute, type RecordFileRules } from "../../shared/recordFiles";

export type WarrantySortField = "date" | "name";

/** The two columns the frame draws, both sortable. */
export const WARRANTY_COLUMNS: { key: WarrantySortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.projectWarrantyColDate },
	{ key: "name", labelKey: localizationConstants.projectWarrantyColName },
];

/** Benämning's limit, as the record's other free-text names use. */
export const WARRANTY_NAME_MAX_LENGTH = 120;

export type WarrantyDocumentSortField = "date" | "name" | "file";

/** The Dokument card's columns, all three sortable as the frame draws them. */
export const WARRANTY_DOCUMENT_COLUMNS: { key: WarrantyDocumentSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.projectWarrantyColDate },
	{ key: "name", labelKey: localizationConstants.projectWarrantyColName },
	{ key: "file", labelKey: localizationConstants.projectWarrantyColDocument },
];

const MEGABYTE = 1024 * 1024;

/**
 * "PNG-, JPG- och PDF-filer är tillåtna", one file per document — Handlingar's
 * rules, which the frame's PDF rows follow. Each extension maps to the content
 * type a stored file is served as, so a renamed file never opens as something
 * else. `projectWarrantyFileSizeError` says "10 MB" — change both.
 */
export const WARRANTY_FILE_RULES: RecordFileRules = {
	types: { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" },
	maxBytes: 10 * MEGABYTE,
	maxCount: 1,
};

export const WARRANTY_FILE_ACCEPT = acceptAttribute(WARRANTY_FILE_RULES.types);
