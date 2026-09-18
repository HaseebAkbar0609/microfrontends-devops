import { DAYS_PER_WEEK, MS_PER_DAY } from "../constants/sales.constants";
import {
	BOOKING_STATS_DAYS,
	CALL_LIST_STATUSES,
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
/** An ISO week. `id` is `yyyy-Www`: unique across years and sorts by date. */
export type IsoWeek = { id: string; week: number };
export type WeekCount = IsoWeek & { count: number };

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

/** The local calendar day of a date, as `yyyy-mm-dd`. */
export function toLocalDateKey(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

/** The local calendar day of an ISO timestamp, as `yyyy-mm-dd`. */
export function toDateKey(iso: string | undefined): string {
	if (!iso) return "";
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return "";
	return toLocalDateKey(parsed);
}

/** ISO-8601 week of a `yyyy-mm-dd` key, or null for an invalid key. */
export function getIsoWeek(dateKey: string): IsoWeek | null {
	const date = new Date(`${dateKey}T00:00:00.000Z`);
	if (Number.isNaN(date.getTime())) return null;
	const dayIndex = (date.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
	// The Thursday of the week decides which year the week belongs to.
	date.setUTCDate(date.getUTCDate() - dayIndex + 3);
	const year = date.getUTCFullYear();
	const firstThursday = new Date(Date.UTC(year, 0, 4));
	const firstIndex = (firstThursday.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
	firstThursday.setUTCDate(firstThursday.getUTCDate() - firstIndex + 3);
	const week =
		1 +
		Math.round(
			(date.getTime() - firstThursday.getTime()) / (DAYS_PER_WEEK * MS_PER_DAY),
		);
	return { id: `${year}-W${String(week).padStart(2, "0")}`, week };
}

/** The `count` calendar days ending on `todayKey`, oldest first. */
export function getRecentDayKeys(todayKey: string, count = BOOKING_STATS_DAYS): string[] {
	const today = new Date(`${todayKey}T00:00:00.000Z`).getTime();
	if (Number.isNaN(today)) return [];
	return Array.from({ length: count }, (_, index) =>
		new Date(today - (count - 1 - index) * MS_PER_DAY).toISOString().slice(0, 10),
	);
}

/** The Monday-to-Sunday calendar days of the week holding `todayKey`. */
export function getWeekDayKeys(todayKey: string): string[] {
	const today = new Date(`${todayKey}T00:00:00.000Z`);
	if (Number.isNaN(today.getTime())) return [];
	const daysUntilSunday = (DAYS_PER_WEEK - today.getUTCDay()) % DAYS_PER_WEEK;
	const sunday = new Date(today.getTime() + daysUntilSunday * MS_PER_DAY);
	return getRecentDayKeys(sunday.toISOString().slice(0, 10), DAYS_PER_WEEK);
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

/**
 * Everything the meeting booker page counts, derived from the CRM companies.
 * `bookerNames` are the current meeting bookers, listed even before they log
 * anything; anyone else who booked still gets a row.
 */
export function getMeetingBookerStats(
	companies: SalesCompany[],
	todayKey: string,
	bookerNames: string[],
): MeetingBookerStats {
	const rows = toRows(companies);
	const weekKeys = new Set(getWeekDayKeys(todayKey));
	const dayCounts = new Map<string, number>();
	const weekCounts = new Map<string, WeekCount>();
	const bookers = new Map<string, BookerStats>(
		bookerNames.map((name) => [name, emptyBookerStats(name)]),
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
		// Calls and bookings count on the day they were logged. The meeting's
		// own time only orders the list of booked meetings.
		const dayKey = toDateKey(activity.date);

		if (activity.type === "call") {
			callsTotal += 1;
			if (dayKey === todayKey) callsToday += 1;
			if (stats) {
				stats.calls += 1;
				if (weekKeys.has(dayKey)) stats.callsWeek += 1;
			}
		}

		if (activity.type === "meeting") {
			if (activity.meetingAt) bookedMeetings.push(row);
			if (dayKey === todayKey) meetingsToday += 1;
			if (weekKeys.has(dayKey)) meetingsThisWeek += 1;
			dayCounts.set(dayKey, (dayCounts.get(dayKey) ?? 0) + 1);
			const isoWeek = getIsoWeek(dayKey);
			if (isoWeek) {
				const weekCount = weekCounts.get(isoWeek.id) ?? { ...isoWeek, count: 0 };
				weekCount.count += 1;
				weekCounts.set(isoWeek.id, weekCount);
			}
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
		perWeek: [...weekCounts.values()].sort((a, b) => a.id.localeCompare(b.id)),
		perBooker: [...bookers.values()].sort(
			(a, b) =>
				b.meetings - a.meetings || b.calls - a.calls || compareText(a.name, b.name),
		),
	};
}
