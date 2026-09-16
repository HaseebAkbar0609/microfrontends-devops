import {
	CircleUser,
	Network,
	Package,
	ReceiptText,
	Wrench,
	type LucideIcon,
} from "lucide-react";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { acceptAttribute, type RecordFileRules } from "../../shared/recordFiles";
import type { AtaAttested, AtaSection, AtaStatus } from "./types";

/* ─── Sections ─────────────────────────────────────────────────────────── */

export const ATA_SECTIONS = [
	"staff",
	"material",
	"machines",
	"ue",
	"supplierAta",
] as const satisfies readonly AtaSection[];

/** Staff rows name a person and count hours; the other four name a supplier and an invoice. */
export type AtaSectionKind = "staff" | "supplier";

export const ATA_SECTION_CONFIG: Record<
	AtaSection,
	{ titleKey: TranslationKeys; totalKey: TranslationKeys; icon: LucideIcon; kind: AtaSectionKind }
> = {
	staff: {
		titleKey: localizationConstants.projectAtaSectionStaff,
		totalKey: localizationConstants.viewAtaTotalStaff,
		icon: CircleUser,
		kind: "staff",
	},
	material: {
		titleKey: localizationConstants.projectAtaSectionMaterial,
		totalKey: localizationConstants.viewAtaTotalMaterial,
		icon: Package,
		kind: "supplier",
	},
	machines: {
		titleKey: localizationConstants.projectAtaSectionMachines,
		totalKey: localizationConstants.viewAtaTotalMachines,
		icon: Wrench,
		kind: "supplier",
	},
	ue: {
		titleKey: localizationConstants.projectAtaSectionUe,
		totalKey: localizationConstants.viewAtaTotalUe,
		icon: Network,
		kind: "supplier",
	},
	supplierAta: {
		titleKey: localizationConstants.projectAtaSectionSupplierAta,
		totalKey: localizationConstants.viewAtaTotalSupplierAta,
		icon: ReceiptText,
		kind: "supplier",
	},
};

export const ATA_PARTY_LABELS: Record<AtaSectionKind, TranslationKeys> = {
	staff: localizationConstants.createAtaColPerson,
	supplier: localizationConstants.createAtaColSupplier,
};

export const ATA_PARTY_REQUIRED: Record<AtaSectionKind, TranslationKeys> = {
	staff: localizationConstants.projectAtaPersonRequired,
	supplier: localizationConstants.projectAtaSupplierRequired,
};

/** A line table's columns, in the frame's order. */
export type AtaLineColumn =
	| "date" | "party" | "resourceNo" | "description" | "amount" | "quantity" | "invoiceNo"
	| "unit" | "netPrice" | "netSum" | "markup" | "unitPrice" | "secondary" | "activity" | "location";

export const ATA_LINE_COLUMNS: Record<AtaSectionKind, readonly AtaLineColumn[]> = {
	staff: ["date", "party", "resourceNo", "description", "amount", "quantity", "unit", "netPrice", "netSum", "markup", "unitPrice", "secondary", "activity", "location"],
	supplier: ["date", "party", "resourceNo", "description", "amount", "invoiceNo", "unit", "netPrice", "netSum", "markup", "unitPrice", "secondary", "activity", "location"],
};

/** Column labels; `party` is looked up per kind in `ATA_PARTY_LABELS`. */
export const ATA_LINE_COLUMN_LABELS: Record<Exclude<AtaLineColumn, "party">, TranslationKeys> = {
	date: localizationConstants.createAtaColDate,
	resourceNo: localizationConstants.projectAtaColResourceNo,
	description: localizationConstants.createAtaColDescription,
	amount: localizationConstants.createAtaColAmount,
	quantity: localizationConstants.createAtaColQuantity,
	invoiceNo: localizationConstants.projectAtaColInvoiceNo,
	unit: localizationConstants.createAtaColUnit,
	netPrice: localizationConstants.projectAtaColNetPrice,
	netSum: localizationConstants.createAtaColNetSum,
	markup: localizationConstants.createAtaColPercentage,
	unitPrice: localizationConstants.viewAtaColPricePerUnit,
	secondary: localizationConstants.projectAtaColSecondaryPercent,
	activity: localizationConstants.createAtaColActivity,
	location: localizationConstants.createAtaColPosition,
};

/* ─── Status ───────────────────────────────────────────────────────────── */

export const ATA_STATUSES = ["utkast", "forhandling", "ok", "redovisad"] as const satisfies readonly AtaStatus[];

/** Label, badge tone (`null` = plain text) and lifecycle rank for sorting. */
export const ATA_STATUS_META: Record<
	AtaStatus,
	{ labelKey: TranslationKeys; badge: "success" | "info" | "warning" | null; rank: number }
> = {
	utkast: { labelKey: localizationConstants.ataStatusDraft, badge: null, rank: 0 },
	forhandling: { labelKey: localizationConstants.ataStatusNegotiation, badge: "warning", rank: 1 },
	ok: { labelKey: localizationConstants.ataStatusOk, badge: "success", rank: 2 },
	redovisad: { labelKey: localizationConstants.ataStatusAccounted, badge: "info", rank: 3 },
};

export const ATA_ATTESTED_LABELS: Record<AtaAttested, TranslationKeys> = {
	ja: localizationConstants.ataAttestedYes,
	ej_klart: localizationConstants.ataAttestedPending,
};

/* ─── List ─────────────────────────────────────────────────────────────── */

export type AtaListSortField = "date" | "number" | "linked" | "amount" | "status" | "attested";

export const ATA_LIST_COLUMNS: { key: AtaListSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.ataColDate },
	{ key: "number", labelKey: localizationConstants.ataColNumber },
	{ key: "linked", labelKey: localizationConstants.ataColLinkedLevAta },
	{ key: "amount", labelKey: localizationConstants.ataColAmount },
	{ key: "status", labelKey: localizationConstants.ataColStatus },
	{ key: "attested", labelKey: localizationConstants.ataColAttested },
];

/* ─── Form ─────────────────────────────────────────────────────────────── */

/** The rail's two steps. With the list off, StepRail only uses them as names. */
export const ATA_STEP_KEYS: TranslationKeys[] = [
	localizationConstants.projectAtaProjectInfo,
	localizationConstants.createAtaDetailedInfo,
];

/** Step 1 validates these before Förhandsgranska. */
export const ATA_STEP_ONE_FIELDS = ["client", "info"] as const;

export const ATA_TEXT_MAX_LENGTH = 120;
export const ATA_LONG_TEXT_MAX_LENGTH = 2000;
/** "Egen personal 02": the count is zero-padded to two digits. */
export const ATA_COUNT_DIGITS = 2;

/** Line-item bounds, checked by the row dialog's schema. */
export const ATA_LINE_LIMITS = {
	rows: 50,
	quantity: 99_999,
	netPrice: 999_999_999,
	percent: 100,
	resourceNo: 20,
	unit: 10,
	invoiceNo: 30,
	description: 200,
	shortText: 80,
} as const;

const MEGABYTE = 1024 * 1024;

/** "PNG-, JPG- och PDF-filer är tillåtna", each with the content type it is served as. */
export const ATA_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
	},
	/* `projectAtaFileSizeError` says "10 MB" — change both together. */
	maxBytes: 10 * MEGABYTE,
	maxCount: 20,
};

export const ATA_FILE_ACCEPT = acceptAttribute(ATA_FILE_RULES.types);
export const ATA_DOCUMENT_NAME_MAX_LENGTH = 120;
