import { format, parseISO, isValid } from "date-fns";

/**
 * Parses ISO or standard date string safely into a Date object
 */
export function parseDateValue(val?: string): Date | undefined {
	if (!val) return undefined;
	const parsedIso = parseISO(val);
	if (isValid(parsedIso)) return parsedIso;
	const parsed = new Date(val);
	if (isValid(parsed)) return parsed;
	return undefined;
}

/**
 * An API timestamp as a plain date for display — the API sends full ISO strings
 * with microseconds (`2026-09-23T09:24:23.272000+00:00`), which are not meant to
 * be shown raw. Unparseable values come back empty rather than as broken text.
 */
export function formatApiDate(val?: string): string {
	const parsed = parseDateValue(val);
	return parsed ? format(parsed, "yyyy-MM-dd") : "";
}

/** As `formatApiDate`, plus the time — for message and comment timestamps. */
export function formatApiDateTime(val?: string): string {
	const parsed = parseDateValue(val);
	return parsed ? format(parsed, "yyyy-MM-dd HH:mm") : "";
}
