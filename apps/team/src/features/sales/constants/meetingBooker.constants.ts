import type { SalesCompanyStatus } from "../types";

/**
 * Statuses that belong in the call list: everything not yet quoted. A company
 * leaves the list on its own as soon as the seller moves it forward.
 */
export const CALL_LIST_STATUSES: SalesCompanyStatus[] = ["prospect", "lead"];

/** Days shown in the per-day booking statistics. */
export const BOOKING_STATS_DAYS = 7;
