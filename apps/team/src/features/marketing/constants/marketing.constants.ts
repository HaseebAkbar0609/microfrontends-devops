import type { BadgeTone, MarketingGroupId } from "../types";

export const MARKETING_BASE_HREF = "/module/business/marketing";
export const MARKETING_NEWSLETTER_HREF = `${MARKETING_BASE_HREF}/newsletter`;

/** Route slug reserved by the newsletter page; no group may claim it. */
export const MARKETING_RESERVED_SLUGS = ["newsletter"];

export const MARKETING_GROUP_IDS: MarketingGroupId[] = [
	"strategi",
	"innehall",
	"insikter",
	"organisation",
	"kontakter",
	"event",
];

export const MARKETING_LOCALE = "sv-SE";
export const MARKETING_CURRENCY = "SEK";

/** Rows per page in every register table. */
export const MARKETING_TABLE_PAGE_SIZE = 10;

/** At most this many select fields become toolbar filters, to keep the row readable. */
export const MARKETING_MAX_TOOLBAR_FILTERS = 2;

/**
 * The quarter the seed budget rows belong to. The prototype hard-coded
 * "Budget 2026 Q1" as a label while summing every budget row regardless of its
 * period, so the number and the label could disagree.
 */
export const MARKETING_BUDGET_PERIOD = "2026 Q1";

/** Id prefix for rows created at runtime. */
export const MARKETING_ROW_ID_PREFIX = "row";

/** Column separator for the recipient export; Excel in sv-SE expects a semicolon. */
export const MARKETING_CSV_DELIMITER = ";";

/**
 * Browsers silently drop `mailto:` URLs past roughly this length. The prototype
 * built the bcc list unbounded, so a large audience produced a link that simply
 * did nothing.
 */
export const MARKETING_MAILTO_MAX_LENGTH = 1800;

export const MARKETING_TONE_CLASS: Record<BadgeTone, string> = {
	neutral: "bg-slate-100 text-slate-600",
	info: "bg-sky-50 text-sky-700",
	positive: "bg-emerald-50 text-emerald-700",
	warning: "bg-amber-50 text-amber-700",
	danger: "bg-red-50 text-red-600",
};

/** Rendered in place of an empty cell. */
export const MARKETING_EMPTY_CELL = "–";
