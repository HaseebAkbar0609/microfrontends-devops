import type { RecordDocumentsTableCopy } from "@/components/table/RecordDocumentsTable";
import type { RecordFileRules } from "@/features/project/shared/recordFiles";
import { acceptAttribute } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { DocumentCategory, DocumentSortField } from "../types/forecastDocuments.types";
import { ECONOMY_FORECAST_DOCUMENTS_URL } from "./economyNav.config";

export const DOCUMENTS_PAGE_SIZE = 10;

export const DOCUMENTS_BASE_ROUTE = ECONOMY_FORECAST_DOCUMENTS_URL;

/** Every address the document centre answers on, built from one base. */
export function documentRoutes(basePath: string = DOCUMENTS_BASE_ROUTE) {
	return {
		list: basePath,
		create: `${basePath}/create`,
	};
}

/** The register's columns in the frame's order; every one sorts. */
export const DOCUMENT_COLUMNS: { key: DocumentSortField; labelKey: TranslationKeys }[] = [
	{ key: "documentNo", labelKey: localizationConstants.forecastDocumentsColId },
	{ key: "category", labelKey: localizationConstants.forecastDocumentsColCategory },
	{ key: "fileName", labelKey: localizationConstants.forecastDocumentsColFile },
	{ key: "date", labelKey: localizationConstants.forecastDocumentsColDate },
];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, TranslationKeys> = {
	agreement: localizationConstants.forecastDocumentsCategoryAgreement,
	report: localizationConstants.forecastDocumentsCategoryReport,
	invoice: localizationConstants.forecastDocumentsCategoryInvoice,
	budget: localizationConstants.forecastDocumentsCategoryBudget,
	other: localizationConstants.forecastDocumentsCategoryOther,
};

/** The categories in the order the Filter menu and the create page list them. */
export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
	"agreement",
	"report",
	"invoice",
	"budget",
	"other",
];

/**
 * What the document centre may hold. The card tells the reader "PNG-, JPG- och
 * PDF-filer är tillåtna", so that is what the picker accepts — the two must not
 * disagree. The ceiling is the register's, not one record's: this is a list.
 */
export const DOCUMENT_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
	},
	maxBytes: 10 * 1024 * 1024,
	maxCount: 200,
};

export const DOCUMENT_FILE_ACCEPT = acceptAttribute(DOCUMENT_FILE_RULES.types);

/**
 * How many files one upload may carry. Separate from the register's own
 * ceiling above: without it the picker would only refuse a batch at 200,
 * which no one reaches, and its refusal would read "högst 200 filer".
 */
export const DOCUMENT_BATCH_MAX = 20;

/** What the staged table on the create page calls a document and its file. */
export const DOCUMENT_TABLE_COPY: RecordDocumentsTableCopy = {
	dateKey: localizationConstants.forecastDocumentsColDate,
	nameKey: localizationConstants.forecastDocumentsColDocName,
	fileKey: localizationConstants.forecastDocumentsColFile,
	viewFileKey: localizationConstants.forecastDocumentsBtnViewFile,
	emptyKey: localizationConstants.forecastDocumentsNoFilesYet,
	notHeldKey: localizationConstants.forecastDocumentsFileNotHeld,
	removeKey: localizationConstants.forecastDocumentsRemoveFile,
};
