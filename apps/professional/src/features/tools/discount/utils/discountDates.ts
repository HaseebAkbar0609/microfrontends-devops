import { format } from "date-fns";
import { parseDateValue } from "@/utils/date";

/** Display pattern for discount validity dates — locale-neutral and unambiguous. */
const VALIDITY_DATE_PATTERN = "d MMM yyyy";

/** Fallback shown when a validity date is missing or unparseable. */
const VALIDITY_FALLBACK = "-";

/** Formats an ISO date (YYYY-MM-DD) for the card's validity meta row. */
export function formatValidityDate(value?: string | null): string {
	const parsed = parseDateValue(value ?? undefined);
	return parsed ? format(parsed, VALIDITY_DATE_PATTERN) : VALIDITY_FALLBACK;
}
