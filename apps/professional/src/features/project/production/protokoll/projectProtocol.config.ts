import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { acceptAttribute, type RecordFileRules } from "../../shared/recordFiles";
import type { DialogProtocolKind, MeetingCategory, ProtocolKind, ProtocolType } from "./types";

/** The kinds of protocol, in the order a build meets them. A tuple, so the schema and the Typ select both read it. */
export const PROTOCOL_TYPES = [
	"byggmote",
	"egenkontroll",
	"kvalitetskontroll",
	"skyddsrond",
	"slutbesiktning",
] as const satisfies readonly ProtocolType[];

export const PROTOCOL_TYPE_LABELS: Record<ProtocolType, TranslationKeys> = {
	byggmote: localizationConstants.projectProtocolTypeByggmote,
	egenkontroll: localizationConstants.projectProtocolTypeEgenkontroll,
	kvalitetskontroll: localizationConstants.projectProtocolTypeKvalitetskontroll,
	skyddsrond: localizationConstants.projectProtocolTypeSkyddsrond,
	slutbesiktning: localizationConstants.projectProtocolTypeSlutbesiktning,
};

/** The "Skapa protokoll" menu's items, in the frame's order. */
export const PROTOCOL_KINDS = ["standard", "action", "upload"] as const satisfies readonly ProtocolKind[];

export const PROTOCOL_KIND_MENU_KEYS: Record<ProtocolKind, TranslationKeys> = {
	standard: localizationConstants.projectProtocolCreateStandard,
	action: localizationConstants.projectProtocolCreateAction,
	upload: localizationConstants.projectProtocolUpload,
};

/** The kinds the short dialog creates, and what it is titled for each. Standard opens Nytt möte. */
export const PROTOCOL_DIALOG_KINDS = ["action", "upload"] as const satisfies readonly DialogProtocolKind[];

export const PROTOCOL_DIALOG_TITLE_KEYS: Record<DialogProtocolKind, TranslationKeys> = {
	action: localizationConstants.projectProtocolDialogAction,
	upload: localizationConstants.projectProtocolDialogUpload,
};

/** Kategori's choices, in the order the select lists them. */
export const MEETING_CATEGORIES = [
	"bygg",
	"ekonomi",
	"elVvs",
	"installation",
	"markAnlaggning",
	"maleri",
] as const satisfies readonly MeetingCategory[];

export const MEETING_CATEGORY_LABELS: Record<MeetingCategory, TranslationKeys> = {
	bygg: localizationConstants.projectProtocolCategoryBygg,
	ekonomi: localizationConstants.projectProtocolCategoryEkonomi,
	elVvs: localizationConstants.projectProtocolCategoryElVvs,
	installation: localizationConstants.projectProtocolCategoryInstallation,
	markAnlaggning: localizationConstants.projectProtocolCategoryMarkAnlaggning,
	maleri: localizationConstants.projectProtocolCategoryMaleri,
};

/** The Filter entry that shows archived protocols. Cannot collide with a type code. */
export const PROTOCOL_ARCHIVED_FILTER = "archived";

export type ProtocolSortField = "date" | "type" | "file";

/** The frame's three sortable columns. Handling and ⋮ are plain headers. */
export const PROTOCOL_COLUMNS: { key: ProtocolSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.projectProtocolColDate },
	{ key: "type", labelKey: localizationConstants.projectProtocolColType },
	{ key: "file", labelKey: localizationConstants.projectProtocolColPdf },
];

/** Benämning's limit, as the record's other free-text names use — a meeting's Rubrik too. */
export const PROTOCOL_NAME_MAX_LENGTH = 120;

/** A meeting's short text fields: a name, Adress, Ort, Plats, Ämne. */
export const PROTOCOL_FIELD_MAX_LENGTH = 120;

/** Protokoll nr. */
export const PROTOCOL_NUMBER_MAX_LENGTH = 20;

/** Post nr — "113 50", with room for a foreign code. */
export const PROTOCOL_POSTAL_CODE_MAX_LENGTH = 10;

/** Information, Kommentar, a point's Beskrivning and Beslut. */
export const PROTOCOL_NOTE_MAX_LENGTH = 2000;

/** A point's Nr. */
export const PROTOCOL_POINT_NR_MAX_LENGTH = 10;

/** Deltagare per meeting. */
export const PROTOCOL_PARTICIPANTS_MAX = 50;

/** A point's prefilled Nr, "001". */
export const PROTOCOL_POINT_NR_DIGITS = 3;

/** Protokoll nr's sequence after the project number, "5001-01". */
export const PROTOCOL_NUMBER_SEQUENCE_DIGITS = 2;

/** The points table's first page size. */
export const PROTOCOL_POINTS_PAGE_SIZE = 10;

/** "Rader per sida" starts here, as the frame draws it. */
export const PROTOCOL_PAGE_SIZE = 10;

const MEGABYTE = 1024 * 1024;

/**
 * Ladda upp takes an existing protocol — a PDF, as the list's PDF column says.
 * `projectProtocolFileSizeError` says "10 MB" — change both.
 */
export const PROTOCOL_FILE_RULES: RecordFileRules = {
	types: { ".pdf": "application/pdf" },
	maxBytes: 10 * MEGABYTE,
	maxCount: 1,
};

export const PROTOCOL_FILE_ACCEPT = acceptAttribute(PROTOCOL_FILE_RULES.types);
