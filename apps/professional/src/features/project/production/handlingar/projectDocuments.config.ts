import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { acceptAttribute, type RecordFileRules } from "../../shared/recordFiles";
import type { DrawingCategory, ProjectDocumentKind } from "./types";

/** The tabs, in the frame's order. Handlingar is the default and stays out of the URL. */
export const DOCUMENT_VIEWS = ["handlingar", "ritningar", "kontrakt", "arkiv"] as const;
export type DocumentView = (typeof DOCUMENT_VIEWS)[number];

export const DOCUMENT_VIEW_LABELS: Record<DocumentView, TranslationKeys> = {
	handlingar: localizationConstants.projectDocumentsTabDocuments,
	ritningar: localizationConstants.projectDocumentsTabDrawings,
	kontrakt: localizationConstants.projectDocumentsTabContracts,
	arkiv: localizationConstants.projectDocumentsTabArchive,
};

/** The active tab each kind lives on; archived files of every kind share Arkiv. */
export const VIEW_KIND: Record<Exclude<DocumentView, "arkiv">, ProjectDocumentKind> = {
	handlingar: "handling",
	ritningar: "ritning",
	kontrakt: "kontrakt",
};

export const DOCUMENT_KINDS = ["handling", "ritning", "kontrakt"] as const satisfies readonly ProjectDocumentKind[];

export interface DocumentKindMeta {
	kindKey: TranslationKeys;
	/** The toolbar button and the dialog's title. */
	uploadKey: TranslationKeys;
	/** The dialog's file row. */
	fileLabelKey: TranslationKeys;
	emptyKey: TranslationKeys;
	emptyDescKey: TranslationKeys;
}

export const DOCUMENT_KIND_META: Record<ProjectDocumentKind, DocumentKindMeta> = {
	handling: {
		kindKey: localizationConstants.projectDocumentsKindDocument,
		uploadKey: localizationConstants.projectDocumentsUploadDocument,
		fileLabelKey: localizationConstants.projectDocumentsColFile,
		emptyKey: localizationConstants.projectDocumentsEmptyDocuments,
		emptyDescKey: localizationConstants.projectDocumentsEmptyDocumentsDesc,
	},
	ritning: {
		kindKey: localizationConstants.projectDocumentsKindDrawing,
		uploadKey: localizationConstants.projectDocumentsUploadDrawing,
		fileLabelKey: localizationConstants.projectDocumentsKindDrawing,
		emptyKey: localizationConstants.projectDocumentsEmptyDrawings,
		emptyDescKey: localizationConstants.projectDocumentsEmptyDrawingsDesc,
	},
	kontrakt: {
		kindKey: localizationConstants.projectDocumentsKindContract,
		uploadKey: localizationConstants.projectDocumentsUploadContract,
		fileLabelKey: localizationConstants.projectDocumentsKindContract,
		emptyKey: localizationConstants.projectDocumentsEmptyContracts,
		emptyDescKey: localizationConstants.projectDocumentsEmptyContractsDesc,
	},
};

/** A tuple, so the schema's `z.enum` and the Kategori select both read it. */
export const DRAWING_CATEGORIES = ["a", "k", "vvs", "e", "konstruktion"] as const satisfies readonly DrawingCategory[];

export const DRAWING_CATEGORY_LABELS: Record<DrawingCategory, TranslationKeys> = {
	a: localizationConstants.projectDocumentsCategoryA,
	k: localizationConstants.projectDocumentsCategoryK,
	vvs: localizationConstants.projectDocumentsCategoryVvs,
	e: localizationConstants.projectDocumentsCategoryE,
	konstruktion: localizationConstants.projectDocumentsCategoryConstruction,
};

const MEGABYTE = 1024 * 1024;

/**
 * "PNG-, JPG- och PDF-filer är tillåtna", one file per row. Each extension maps
 * to the content type a stored file is served as, so a renamed file never opens
 * as something else. `projectDocumentsFileSizeError` says "10 MB" — change both.
 */
export const DOCUMENT_FILE_RULES: RecordFileRules = {
	types: { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" },
	maxBytes: 10 * MEGABYTE,
	maxCount: 1,
};

export const DOCUMENT_FILE_ACCEPT = acceptAttribute(DOCUMENT_FILE_RULES.types);

export const DOCUMENT_NAME_MAX_LENGTH = 120;
export const DRAWING_NUMBER_MAX_LENGTH = 40;
export const DOCUMENT_PAGE_SIZE = 10;

/** Filter values that cannot collide with a category or kind code. */
export const FILE_FILTER_PDF = "file:pdf";
export const FILE_FILTER_IMAGES = "file:images";

export type DocumentColumnKey = "date" | "name" | "file" | "category" | "kind" | "createdBy";

export interface DocumentColumn {
	key: DocumentColumnKey;
	labelKey: TranslationKeys;
	/** Skapad av is drawn without a sort icon. */
	sortable: boolean;
}

const column = (key: DocumentColumnKey, labelKey: TranslationKeys, sortable = true): DocumentColumn => ({ key, labelKey, sortable });

const DATE = column("date", localizationConstants.projectDocumentsColDate);
const NAME = column("name", localizationConstants.projectDocumentsColName);
const CREATED_BY = column("createdBy", localizationConstants.projectDocumentsColCreatedBy, false);

/** Each tab's columns, as the frames draw them; Kontrakt and Arkiv follow Handlingar and Ritningar. */
export const DOCUMENT_VIEW_COLUMNS: Record<DocumentView, readonly DocumentColumn[]> = {
	handlingar: [DATE, NAME, column("file", localizationConstants.projectDocumentsColFile), CREATED_BY],
	ritningar: [
		DATE,
		column("name", localizationConstants.projectDocumentsColDrawingNumber),
		column("category", localizationConstants.projectDocumentsColCategory),
		CREATED_BY,
	],
	kontrakt: [DATE, NAME, column("file", localizationConstants.projectDocumentsColContract), CREATED_BY],
	arkiv: [DATE, NAME, column("kind", localizationConstants.projectDocumentsColKind), CREATED_BY],
};
