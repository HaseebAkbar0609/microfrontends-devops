import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { InspectionType } from "./types";

/**
 * The six kinds, in the order an inspection runs through a build. A tuple, so
 * the schema's `z.enum` and the Typ select both read it.
 */
export const INSPECTION_TYPES = [
	"byggmote",
	"forbesiktning",
	"slutbesiktning",
	"efterbesiktning",
	"garantibesiktning",
	"sarskild",
] as const satisfies readonly InspectionType[];

/** Each kind's label — the Order module's inspection keys, which name no module. */
export const INSPECTION_TYPE_LABELS: Record<InspectionType, TranslationKeys> = {
	byggmote: localizationConstants.inspectionTypeByggmote,
	forbesiktning: localizationConstants.inspectionTypeForbesiktning,
	slutbesiktning: localizationConstants.inspectionTypeSlutbesiktning,
	efterbesiktning: localizationConstants.inspectionTypeEfterbesiktning,
	garantibesiktning: localizationConstants.inspectionTypeGarantibesiktning,
	sarskild: localizationConstants.inspectionTypeSarskild,
};

/** What the frame's dialog shows in Typ before anything is picked. */
export const DEFAULT_INSPECTION_TYPE: InspectionType = "byggmote";

/** The Filter entry that shows archived inspections. Cannot collide with a type code. */
export const INSPECTION_ARCHIVED_FILTER = "archived";

const MEGABYTE = 1024 * 1024;

/** Per file. `inspectionFileSizeError` says "10 MB" — change both together. */
export const INSPECTION_FILE_MAX_BYTES = 10 * MEGABYTE;

/** At most this many documents on one inspection. */
export const INSPECTION_DOCUMENTS_MAX = 10;

/**
 * What "PNG-, JPG- och PDF-filer är tillåtna" allows, each extension with the
 * content type a stored file is served as. Serving by extension rather than by
 * the browser's guess keeps a renamed file from opening as something else.
 */
export const INSPECTION_FILE_TYPES: Record<string, string> = {
	".pdf": "application/pdf",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
};

export const INSPECTION_FILE_EXTENSIONS = Object.keys(INSPECTION_FILE_TYPES);

/** The picker's advisory filter: extensions and content types together. */
export const INSPECTION_FILE_ACCEPT = [
	...INSPECTION_FILE_EXTENSIONS,
	...Array.from(new Set(Object.values(INSPECTION_FILE_TYPES))),
].join(",");

/** Chips shown before the dialog's chevron collapses the rest — the frame draws two. */
export const INSPECTION_CHIPS_COLLAPSED = 2;

export type InspectionSortField = "date" | "type" | "inspectionDate" | "document";

export const INSPECTION_COLUMNS: { key: InspectionSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.inspectionColDate },
	{ key: "type", labelKey: localizationConstants.inspectionColType },
	{ key: "inspectionDate", labelKey: localizationConstants.inspectionColInspectionDate },
	{ key: "document", labelKey: localizationConstants.inspectionColPdf },
];
