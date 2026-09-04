/**
 * Business constants for the sales CRM. Every financial or business number the
 * feature depends on is declared here rather than inline at the call site.
 */

/** Length in days of a generated demo account. */
export const DEMO_TRIAL_DAYS = 14;

/** Length in days of a generated test account. */
export const TEST_TRIAL_DAYS = 30;

/** Default number of days a new quote stays valid. */
export const DEFAULT_QUOTE_VALID_DAYS = 30;

/** Default seat count pre-filled on a new quote. */
export const DEFAULT_QUOTE_USERS = 25;

/** Discount granted for each payment term, as a fraction of the monthly gross. */
export const TERM_DISCOUNT_MONTHLY = 0;
export const TERM_DISCOUNT_QUARTERLY = 0.05;
export const TERM_DISCOUNT_YEARLY = 0.15;

/** Number of months covered by a single invoice for each payment term. */
export const TERM_MONTHS_MONTHLY = 1;
export const TERM_MONTHS_QUARTERLY = 3;
export const TERM_MONTHS_YEARLY = 12;

/** Months used to project the running annual cost on a quote. */
export const MONTHS_PER_YEAR = 12;

/** Bounds accepted by the extra-discount input, in percent. */
export const MIN_EXTRA_DISCOUNT_PERCENT = 0;
export const MAX_EXTRA_DISCOUNT_PERCENT = 100;

/** Document number prefixes. */
export const QUOTE_NUMBER_PREFIX = "TF";
export const ORDER_NUMBER_PREFIX = "OB";
export const INVOICE_NUMBER_PREFIX = "F";

/** Hosts used when generating trial credentials and payment links. */
export const TRIAL_ACCOUNT_DOMAIN = "timeflow.se";
export const PAYMENT_LINK_BASE_URL = "https://pay.timeflowsystem.eu";

/** Locale and currency used to format money and dates in this feature. */
export const SALES_LOCALE = "sv-SE";
export const SALES_CURRENCY = "SEK";

/** Table paging. */
export const SALES_TABLE_PAGE_SIZE = 10;
export const SALES_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

/** Separator and byte-order mark used by the CSV import/export. */
export const CSV_DELIMITER = ";";
export const CSV_BYTE_ORDER_MARK = "\uFEFF";
export const CSV_FILE_NAME_PREFIX = "timeflow-sales-companies";

/** Milliseconds in one day, used for trial expiry maths. */
export const MS_PER_DAY = 86_400_000;

/**
 * "Today" for everything derived from the seed data (trial days remaining,
 * quote validity). Mirrors `mockDates.ts` in the professional app: deriving
 * these from `Date.now()` would render a different value on the server than on
 * the client and trip a hydration mismatch. Records created at runtime use the
 * real clock, since that only ever happens in a client event handler.
 */
export const SALES_REFERENCE_DATE = "2026-09-04T00:00:00.000Z";

/** Legal name printed on the quote and order confirmation documents. */
export const SELLER_LEGAL_NAME = "Timeflow Sverige AB";
