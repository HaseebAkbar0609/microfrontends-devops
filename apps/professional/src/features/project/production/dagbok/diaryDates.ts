import { daysBetween, parseIsoDay } from "../tidsplan/timeline";
import { FULL_WORKDAY_HOURS } from "./projectDiary.config";
import type { WorkforceRow } from "./types";

/** Whether a string is a real `yyyy-MM-dd` day — 2026-02-30 is not. */
export function isIsoDate(value: string | null | undefined): value is string {
	return typeof value === "string" && parseIsoDay(value) !== null;
}

/**
 * "Byggdag N/M": the day's place in the project, counting its start as day 1.
 * `null` when the project has no dates or the day falls outside them.
 */
export function constructionDay(start: string, end: string, date: string): { day: number; total: number } | null {
	if (!isIsoDate(start) || !isIsoDate(end) || !isIsoDate(date)) return null;
	const total = daysBetween(start, end) + 1;
	const day = daysBetween(start, date) + 1;
	if (total < 1 || day < 1 || day > total) return null;
	return { day, total };
}

export interface MonthCell {
	/** `yyyy-MM-dd`. */
	date: string;
	day: number;
	inMonth: boolean;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** `yyyy-MM-dd` for a UTC calendar day. */
function isoOf(year: number, monthIndex: number, day: number): string {
	const date = new Date(Date.UTC(year, monthIndex, day));
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/**
 * A month as whole weeks starting on Sunday, as the frame draws it. Leading and
 * trailing days of the neighbouring months fill the first and last week. Works
 * in UTC throughout, so a day never shifts with the reader's time zone.
 */
export function monthGrid(year: number, monthIndex: number): MonthCell[] {
	const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
	const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
	const weeks = Math.ceil((firstWeekday + daysInMonth) / 7);

	return Array.from({ length: weeks * 7 }, (_, index) => {
		const offset = index - firstWeekday + 1;
		const date = isoOf(year, monthIndex, offset);
		return { date, day: Number(date.slice(8)), inMonth: offset >= 1 && offset <= daysInMonth };
	});
}

/** The month shown next to or before this one, as `{ year, monthIndex }`. */
export function shiftMonth(year: number, monthIndex: number, by: number): { year: number; monthIndex: number } {
	const date = new Date(Date.UTC(year, monthIndex + by, 1));
	return { year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() };
}

/** `{ year, monthIndex }` of a `yyyy-MM-dd`. */
export function monthOf(date: string): { year: number; monthIndex: number } {
	return { year: Number(date.slice(0, 4)), monthIndex: Number(date.slice(5, 7)) - 1 };
}

/**
 * A diary day's legend colour: a full workday when its workforce averages at
 * least eight hours a person, a part day when it logged fewer, and neither when
 * nobody was on site.
 */
export function workdayKind(workforce: readonly WorkforceRow[]): "full" | "part" | null {
	const people = workforce.reduce((sum, row) => sum + (row.own ?? 0) + (row.ue ?? 0), 0);
	const hours = workforce.reduce((sum, row) => sum + row.hours, 0);
	if (people === 0 || hours === 0) return null;
	return hours / people >= FULL_WORKDAY_HOURS ? "full" : "part";
}
