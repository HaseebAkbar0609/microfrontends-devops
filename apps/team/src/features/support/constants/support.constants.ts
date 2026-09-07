/**
 * Business constants for the support desk. Every SLA figure, threshold and
 * document prefix the feature depends on is declared here rather than inline.
 */

/** Minutes granted to resolve a ticket, by priority. */
export const SLA_MINUTES_CRITICAL = 30;
export const SLA_MINUTES_HIGH = 60;
export const SLA_MINUTES_MEDIUM = 240;
export const SLA_MINUTES_LOW = 240;

/** Below this many minutes remaining the SLA countdown turns amber. */
export const SLA_WARNING_THRESHOLD_MINUTES = 60;

/** Ticket ids are `TF-2481`; new ids continue from the highest seen. */
export const TICKET_ID_PREFIX = "TF";
export const TICKET_ID_FLOOR = 2400;

/** Countries the first line covers. */
export const SUPPORT_COUNTRIES = [
	"Sverige",
	"Norge",
	"Danmark",
	"Finland",
] as const;

/** Open tickets a country is expected to absorb, used to scale the load bars. */
export const COUNTRY_LOAD_CAPACITY = 40;

/** Table paging. */
export const SUPPORT_TABLE_PAGE_SIZE = 10;
export const SUPPORT_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

/** Locale used to format ticket timestamps. */
export const SUPPORT_LOCALE = "sv-SE";

/**
 * "Now" for anything derived from the seed data. Reading the real clock during
 * render would produce different markup on the server than on the client and
 * trip a hydration mismatch; tickets created at runtime use the real clock,
 * since that only happens in a client event handler.
 */
export const SUPPORT_REFERENCE_DATE = "2026-09-03T09:00:00.000Z";
