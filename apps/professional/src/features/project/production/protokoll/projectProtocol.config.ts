import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { acceptAttribute, type RecordFileRules } from "../../shared/recordFiles";
import type { ProtocolKind, ProtocolType } from "./types";

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

/** The "Skapa protokoll" menu's items, in the frame's order, and what each dialog is titled. */
export const PROTOCOL_KINDS = ["standard", "action", "upload"] as const satisfies readonly ProtocolKind[];

export const PROTOCOL_KIND_META: Record<ProtocolKind, { menuKey: TranslationKeys; titleKey: TranslationKeys }> = {
	standard: {
		menuKey: localizationConstants.projectProtocolCreateStandard,
		titleKey: localizationConstants.projectProtocolDialogStandard,
	},
	action: {
		menuKey: localizationConstants.projectProtocolCreateAction,
		titleKey: localizationConstants.projectProtocolDialogAction,
	},
	upload: {
		menuKey: localizationConstants.projectProtocolUpload,
		titleKey: localizationConstants.projectProtocolDialogUpload,
	},
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

/** Benämning's limit, as the record's other free-text names use. */
export const PROTOCOL_NAME_MAX_LENGTH = 120;

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
