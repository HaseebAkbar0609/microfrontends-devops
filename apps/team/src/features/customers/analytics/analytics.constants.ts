import type { LanguageCode } from "@/constants/constant";

/**
 * How many of the newest records one analytics request fetches. The API has no
 * aggregate endpoint for these breakdowns yet, so they are counted in the
 * browser; the card says so whenever the sample is smaller than the total.
 */
export const ANALYTICS_SAMPLE_SIZE = 500;

/** Page size for requests that only need the list's `total_items`. */
export const COUNT_ONLY_PAGE_SIZE = 1;

/** Bars shown per breakdown before the rest are summed into "Other". */
export const ANALYTICS_TOP_ROWS = 8;

export const LEADS_WEEKS_SHOWN = 8;
export const LEADS_MONTHS_SHOWN = 6;

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const ANALYTICS_STALE_TIME_MS = 5 * 60 * 1000;

export const ANALYTICS_LOCALES: Record<LanguageCode, string> = {
  swe: "sv-SE",
  en: "en-GB",
};

export const ANALYTICS_QUERY_KEYS = {
  privateSummary: ["private-customers-analytics"],
  activeCustomersSample: ["private-customers-analytics", "active-sample"],
  leadsSample: ["leads-analytics-sample"],
  acceptedLeadsCount: ["leads-analytics-accepted-count"],
  activeProfessionalsSample: ["professionals-analytics", "active-sample"],
  pendingProfessionalsCount: ["professionals-analytics", "pending-count"],
} as const;
