import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Sunday first, to index straight off `Date.prototype.getUTCDay()`. */
const WEEKDAY_SHORT_KEYS: TranslationKeys[] = [
	localizationConstants.weekdayShortSun,
	localizationConstants.weekdayShortMon,
	localizationConstants.weekdayShortTue,
	localizationConstants.weekdayShortWed,
	localizationConstants.weekdayShortThu,
	localizationConstants.weekdayShortFri,
	localizationConstants.weekdayShortSat,
];

/** A real calendar day as `yyyy-MM-dd` — "2026-02-30" is refused. */
export function isIsoDate(value: string): boolean {
	if (!ISO_DATE.test(value)) return false;
	const date = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** A time of day as `HH:mm`, 24-hour. */
export function isTime(value: string): boolean {
	return HH_MM.test(value);
}

/**
 * "Tis 2024-12-17" — the frames' date, the weekday from translation keys and
 * UTC getters rather than a date library's locale, which disagrees between
 * server and client here (see `personalliggare/ledgerDate.ts`).
 */
export function formatMeetingDate(isoDate: string, t: (key: TranslationKeys) => string): string {
	if (!isIsoDate(isoDate)) return isoDate;
	const weekday = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
	return `${t(WEEKDAY_SHORT_KEYS[weekday])} ${isoDate}`;
}

/** "15:00 | 2024-12-17" as the protocol shows a moment, or whichever half is set; "" for neither. */
export function momentLabel(date: string, time: string): string {
	return [time, date].filter(Boolean).join(" | ");
}

/**
 * Where an end falls before its start: `"date"` when it ends on an earlier
 * day, `"time"` when the same day ends earlier, `null` otherwise — or while a
 * day is missing. An end equal to its start is allowed. ISO days and `HH:mm`
 * times compare correctly as text.
 */
export function rangeInversion(
	startDate: string,
	startTime: string,
	endDate: string,
	endTime: string,
): "date" | "time" | null {
	if (!startDate || !endDate) return null;
	if (endDate < startDate) return "date";
	if (endDate === startDate && startTime && endTime && endTime < startTime) return "time";
	return null;
}
