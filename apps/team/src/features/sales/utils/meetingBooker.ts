import { DAYS_PER_WEEK, MS_PER_DAY } from "../constants/sales.constants";
import {
	BOOKING_STATS_DAYS,
	CALL_LIST_STATUSES,
	MEETING_BOOKERS,
} from "../constants/meetingBooker.constants";
import type { SalesActivity, SalesCompany } from "../types";
import { compareText } from "./salesFormatters";

export type ActivityRow = {
	id: string;
	companyId: string;
	companyName: string;
	activity: SalesActivity;
};

export type ReminderSummary = {
	overdue: number;
	today: number;
	total: number;
	rows: ActivityRow[];
};

export type BookerStats = {
	name: string;
	calls: number;
	callsWeek: number;
	meetings: number;
	meetingsWeek: number;
};

export type DayCount = { dateKey: string; count: number };
export type WeekCount = { week: number; count: number };

export type MeetingBookerStats = {
	callsToday: number;
	callsTotal: number;
	meetingsToday: number;
	meetingsThisWeek: number;
	reminders: ReminderSummary;
	bookedMeetings: ActivityRow[];
	perDay: DayCount[];
	perWeek: WeekCount[];
	perBooker: BookerStats[];
};

export type CallListFilters = { category: string; region: string };

/** The calendar day of an ISO timestamp, as `yyyy-mm-dd`. */
export function toDateKey(iso: string | undefined): string {
	if (!iso) return "";
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return "";
	return parsed.toISOString().slice(0, 10);
}

/** ISO-8601 week number of a `yyyy-mm-dd` key. */
export function getIsoWeek(dateKey: string): number {
	const date = new Date(`${dateKey}T00:00:00.000Z`);
	if (Number.isNaN(date.getTime())) return 0;
	const dayIndex = (date.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
	date.setUTCDate(date.getUTCDate() - dayIndex + 3);
	const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
	const firstIndex = (firstThursday.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
	firstThursday.setUTCDate(firstThursday.getUTCDate() - firstIndex + 3);
	return (
		1 +
		Math.round(
			(date.getTime() - firstThursday.getTime()) / (DAYS_PER_WEEK * MS_PER_DAY),
		)
	);
}

/** The `count` calendar days ending on `todayKey`, oldest first. */
export function getRecentDayKeys(todayKey: string, count = BOOKING_STATS_DAYS): string[] {
	const today = new Date(`${todayKey}T00:00:00.000Z`).getTime();
	if (Number.isNaN(today)) return [];
	return Array.from({ length: count }, (_, index) =>
		new Date(today - (count - 1 - index) * MS_PER_DAY).toISOString().slice(0, 10),
	);
}

/** Companies to call, narrowed by the category and region filters. */
export function getCallList(
	companies: SalesCompany[],
	filters: CallListFilters,
): SalesCompany[] {
	return companies.filter(
		(company) =>
			CALL_LIST_STATUSES.includes(company.status) &&
			(!filters.category || company.category === filters.category) &&
			(!filters.region || company.region === filters.region),
	);
}

function toRows(companies: SalesCompany[]): ActivityRow[] {
	return companies.flatMap((company) =>
		company.activities.map((activity) => ({
			id: activity.id,
			companyId: company.id,
			companyName: company.name,
			activity,
		})),
	);
}

function emptyBookerStats(name: string): BookerStats {
	return { name, calls: 0, callsWeek: 0, meetings: 0, meetingsWeek: 0 };
}

/** Everything the meeting booker page counts, derived from the CRM companies. */
export function getMeetingBookerStats(
	companies: SalesCompany[],
	todayKey: string,
): MeetingBookerStats {
	const rows = toRows(companies);
	const weekKeys = new Set(getRecentDayKeys(todayKey, DAYS_PER_WEEK));
	const dayCounts = new Map<string, number>();
	const weekCounts = new Map<number, number>();
	const bookers = new Map<string, BookerStats>(
		MEETING_BOOKERS.map((name) => [name, emptyBookerStats(name)]),
	);
	const reminderRows: ActivityRow[] = [];
	const bookedMeetings: ActivityRow[] = [];
	let callsToday = 0;
	let callsTotal = 0;
	let meetingsToday = 0;
	let meetingsThisWeek = 0;

	for (const row of rows) {
		const { activity } = row;
		const stats =
			activity.booker &&
			(bookers.get(activity.booker) ?? emptyBookerStats(activity.booker));
		if (stats && activity.booker) bookers.set(activity.booker, stats);

		if (activity.type === "call") {
			const dayKey = toDateKey(activity.date);
			callsTotal += 1;
			if (dayKey === todayKey) callsToday += 1;
			if (stats) {
				stats.calls += 1;
				if (weekKeys.has(dayKey)) stats.callsWeek += 1;
			}
		}

		if (activity.type === "meeting" && activity.meetingAt) {
			const dayKey = toDateKey(activity.meetingAt);
			bookedMeetings.push(row);
			if (dayKey === todayKey) meetingsToday += 1;
			if (weekKeys.has(dayKey)) meetingsThisWeek += 1;
			dayCounts.set(dayKey, (dayCounts.get(dayKey) ?? 0) + 1);
			const week = getIsoWeek(dayKey);
			weekCounts.set(week, (weekCounts.get(week) ?? 0) + 1);
			if (stats) {
				stats.meetings += 1;
				if (weekKeys.has(dayKey)) stats.meetingsWeek += 1;
			}
		}

		if (activity.followUpAt && !activity.done) reminderRows.push(row);
	}

	const overdue = reminderRows.filter(
		(row) => row.activity.followUpAt < todayKey,
	).length;
	const dueToday = reminderRows.filter(
		(row) => row.activity.followUpAt === todayKey,
	).length;

	return {
		callsToday,
		callsTotal,
		meetingsToday,
		meetingsThisWeek,
		reminders: {
			overdue,
			today: dueToday,
			total: reminderRows.length,
			rows: reminderRows.sort((a, b) =>
				a.activity.followUpAt.localeCompare(b.activity.followUpAt),
			),
		},
		bookedMeetings: bookedMeetings.sort((a, b) =>
			(a.activity.meetingAt ?? "").localeCompare(b.activity.meetingAt ?? ""),
		),
		perDay: getRecentDayKeys(todayKey).map((dateKey) => ({
			dateKey,
			count: dayCounts.get(dateKey) ?? 0,
		})),
		perWeek: [...weekCounts.entries()]
			.map(([week, count]) => ({ week, count }))
			.sort((a, b) => a.week - b.week),
		perBooker: [...bookers.values()].sort(
			(a, b) =>
				b.meetings - a.meetings || b.calls - a.calls || compareText(a.name, b.name),
		),
	};
}
