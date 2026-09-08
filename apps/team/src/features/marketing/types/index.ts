import type { LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";

/** The six clusters the 19 registers are grouped into. */
export type MarketingGroupId =
	| "strategi"
	| "innehall"
	| "insikter"
	| "organisation"
	| "kontakter"
	| "event";

export type MarketingFieldType =
	| "text"
	| "number"
	| "date"
	| "url"
	| "select"
	| "textarea";

/**
 * Pill tint. The prototype hard-coded a list of five Swedish words and tinted
 * every select against it, so `Ja`, `PNG` and `Marknadschef` rendered as
 * statuses while `Aktiv`, `Lead` and `Godkänd` fell through to grey.
 */
export type BadgeTone = "neutral" | "info" | "positive" | "warning" | "danger";

/**
 * A select option is both stored value and display text, so the two are kept
 * apart: `id` is written to the row, `labelKey` is what the user reads.
 */
export type MarketingSelectOption = {
	id: string;
	labelKey: TranslationKeys;
	tone?: BadgeTone;
};

export type MarketingField = {
	name: string;
	labelKey: TranslationKeys;
	type: MarketingFieldType;
	options?: readonly MarketingSelectOption[];
	/** Minimum column width, for cells holding prose rather than a value. */
	width?: string;
};

export type MarketingSection = {
	slug: string;
	titleKey: TranslationKeys;
	descriptionKey: TranslationKeys;
	icon: LucideIcon;
	fields: MarketingField[];
};

export type MarketingGroup = {
	id: MarketingGroupId;
	titleKey: TranslationKeys;
	icon: LucideIcon;
	sections: MarketingSection[];
};

/**
 * One row's values. The prototype's whole domain model was
 * `Record<string, string | number>` with no ids, so a mistyped key read
 * `undefined` and every list key was an array index.
 */
export type MarketingRowValues = Record<string, string | number>;

export type MarketingRow = {
	id: string;
	values: MarketingRowValues;
};

/** Rows are stored per register, keyed `${group}:${section}`. */
export type MarketingRowsBySection = Record<string, MarketingRow[]>;

/** One point on the traffic chart. */
export type TrafficPoint = {
	/** Short axis label, kept literal so the axis cannot drift from the series. */
	label: string;
	visitors: number;
	conversions: number;
	organic: number;
};

export type TrafficSource = {
	id: string;
	labelKey: TranslationKeys;
	share: number;
	chartColor: string;
};

/** The audience a newsletter is addressed to. */
export type NewsletterAudience = "tradespeople" | "privateIndividuals" | "all";

export type NewsletterRecipient = {
	name: string;
	email: string;
	/** Contact status option id, e.g. `active`. */
	status: string;
	audience: Exclude<NewsletterAudience, "all">;
};

/** Everything the marketing module exposes to its pages. */
export type MarketingContextValue = {
	getRows: (sectionKey: string) => MarketingRow[];
	addRow: (sectionKey: string, values: MarketingRowValues) => void;
	updateRow: (
		sectionKey: string,
		rowId: string,
		values: MarketingRowValues,
	) => void;
	removeRow: (sectionKey: string, rowId: string) => void;
};
