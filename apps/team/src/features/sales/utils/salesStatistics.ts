import { SALES_STATUSES } from "../constants/salesStatuses";
import {
	SALES_CATEGORIES,
	SALES_REGIONS,
} from "../constants/salesTaxonomy";
import type { SalesCompany } from "../types";
import {
	getIsoWeek,
	getMeetingBookerStats,
	getRecentDayKeys,
	toDateKey,
	type BookerStats,
} from "./meetingBooker";
import { getInvoicedAmount } from "./salesFormatters";

/** Days covered by the per-day breakdowns. */
export const STATISTICS_DAYS = 14;

export type BarRow = {
	id: string;
	/** Translation key, for rows whose label is UI copy. */
	labelKey?: string;
	/** Literal text, for rows labelled by data such as a date. */
	label?: string;
	value: number;
};

export type BookerResult = BookerStats & {
	/** Meetings per call, between 0 and 1. Zero when nobody has called. */
	bookingRate: number;
};

export type SalesStatistics = {
	companies: number;
	meetings: number;
	calls: number;
	invoiced: number;
	pipeline: BarRow[];
	meetingsPerDay: BarRow[];
	callsPerDay: BarRow[];
	meetingsPerWeek: BarRow[];
	byCategory: BarRow[];
	byRegion: BarRow[];
	bookerResults: BookerResult[];
};

function countBy(
	companies: SalesCompany[],
	field: "category" | "region",
	options: { id: string; labelKey: string }[],
): BarRow[] {
	return options
		.map((option) => ({
			id: option.id,
			labelKey: option.labelKey,
			value: companies.filter((company) => company[field] === option.id).length,
		}))
		.filter((row) => row.value > 0)
		.sort((a, b) => b.value - a.value);
}

/** Everything the statistics page charts, derived from the CRM companies. */
export function getSalesStatistics(
	companies: SalesCompany[],
	todayKey: string,
): SalesStatistics {
	const dayKeys = getRecentDayKeys(todayKey, STATISTICS_DAYS);
	const meetingsByDay = new Map<string, number>();
	const callsByDay = new Map<string, number>();
	const meetingsByWeek = new Map<number, number>();
	let meetings = 0;
	let calls = 0;
	let invoiced = 0;

	for (const company of companies) {
		invoiced += getInvoicedAmount(company);

		for (const activity of company.activities) {
			if (activity.type === "call") {
				calls += 1;
				const dayKey = toDateKey(activity.date);
				callsByDay.set(dayKey, (callsByDay.get(dayKey) ?? 0) + 1);
			}

			if (activity.type === "meeting" && activity.meetingAt) {
				meetings += 1;
				const dayKey = toDateKey(activity.meetingAt);
				meetingsByDay.set(dayKey, (meetingsByDay.get(dayKey) ?? 0) + 1);
				const week = getIsoWeek(dayKey);
				meetingsByWeek.set(week, (meetingsByWeek.get(week) ?? 0) + 1);
			}
		}
	}

	const perDay = (source: Map<string, number>): BarRow[] =>
		dayKeys.map((dateKey) => ({
			id: dateKey,
			// Day and month only; the year is the same across a two-week window.
			label: dateKey.slice(5),
			value: source.get(dateKey) ?? 0,
		}));

	return {
		companies: companies.length,
		meetings,
		calls,
		invoiced,
		pipeline: SALES_STATUSES.map((status) => ({
			id: status.id,
			labelKey: status.labelKey,
			value: companies.filter((company) => company.status === status.id).length,
		})),
		meetingsPerDay: perDay(meetingsByDay),
		callsPerDay: perDay(callsByDay),
		meetingsPerWeek: [...meetingsByWeek.entries()]
			.map(([week, value]) => ({ id: String(week), label: String(week), value }))
			.sort((a, b) => Number(a.id) - Number(b.id)),
		byCategory: countBy(companies, "category", SALES_CATEGORIES),
		byRegion: countBy(companies, "region", SALES_REGIONS),
		bookerResults: getMeetingBookerStats(companies, todayKey).perBooker.map(
			(booker) => ({
				...booker,
				bookingRate: booker.calls > 0 ? booker.meetings / booker.calls : 0,
			}),
		),
	};
}
