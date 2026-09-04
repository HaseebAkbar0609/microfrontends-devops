import { parseISO, isValid } from "date-fns";

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
