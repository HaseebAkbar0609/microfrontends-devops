import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

/**
 * The Gantt's time axis, built from dates.
 *
 * Pure and UTC throughout. Two reasons:
 *
 * - **Time zones.** date-fns `getISOWeek` reads *local* getters. A `yyyy-MM-dd`
 *   string parses as UTC midnight, which is the previous calendar day for
 *   anyone west of Greenwich — so 2024-12-30 (ISO 2025-W01) would come out as
 *   week 52, and every bar would shift a day.
 * - **One language source.** No `Intl`, no `toLocaleDateString`, no date-fns
 *   locale. Labels are composed from translation keys by the caller, so the
 *   month and week words switch with the rest of the page. (It would also keep
 *   server and client markup identical — `utils/userLanguage.ts` returns "sv"
 *   on the server — but `AppShell` renders a loader until auth is ready, so
 *   page content does not server-render today.)
 *
 * The existing project Gantt hardcodes "Mars 2026" over "Vecka 10–13", with
 * the same days 8–14 under every week and bars placed by cell index rather than
 * by their dates. None of that is reused.
 */

const DAY_MS = 86_400_000;

const MONTH_KEYS: TranslationKeys[] = [
	localizationConstants.monthJanuary,
	localizationConstants.monthFebruary,
	localizationConstants.monthMarch,
	localizationConstants.monthApril,
	localizationConstants.monthMay,
	localizationConstants.monthJune,
	localizationConstants.monthJuly,
	localizationConstants.monthAugust,
	localizationConstants.monthSeptember,
	localizationConstants.monthOctober,
	localizationConstants.monthNovember,
	localizationConstants.monthDecember,
];

/** "Okt" in Swedish, "Oct" in English — for month cells too narrow for the full name. */
const MONTH_SHORT_KEYS: TranslationKeys[] = [
	localizationConstants.monthJan,
	localizationConstants.monthFeb,
	localizationConstants.monthMar,
	localizationConstants.monthApr,
	localizationConstants.monthMay,
	localizationConstants.monthJun,
	localizationConstants.monthJul,
	localizationConstants.monthAug,
	localizationConstants.monthSep,
	localizationConstants.monthOct,
	localizationConstants.monthNov,
	localizationConstants.monthDec,
];

export interface TimelineDay {
	iso: string;
	dayOfMonth: number;
}

export interface TimelineSpan {
	key: string;
	/** For a month: its full name's key. For a week: unused. */
	labelKey?: TranslationKeys;
	/** For a month: its short name's key, for a cell only a few days wide. */
	shortLabelKey?: TranslationKeys;
	/** For a month: the year. For a week: the ISO week number. */
	value: number;
	/** How many day columns the header cell covers. */
	span: number;
}

export interface Timeline {
	days: TimelineDay[];
	months: TimelineSpan[];
	weeks: TimelineSpan[];
}

/**
 * Midnight UTC for a `yyyy-MM-dd`, or `null` for anything unparseable —
 * including impossible dates like 2026-02-30, which `Date` would roll forward
 * into March rather than reject.
 */
export function parseIsoDay(iso: string): number | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
	const time = Date.parse(`${iso}T00:00:00Z`);
	if (Number.isNaN(time)) return null;
	return new Date(time).toISOString().slice(0, 10) === iso ? time : null;
}

function toIso(time: number): string {
	return new Date(time).toISOString().slice(0, 10);
}

/** Monday is 0. */
function isoWeekday(time: number): number {
	return (new Date(time).getUTCDay() + 6) % 7;
}

/**
 * The ISO 8601 week: the week belongs to the year of its Thursday, and week 1
 * is the one holding that year's first Thursday.
 *
 * Checked at the edges: 2024-12-30 → 2025 W01, 2021-01-01 → 2020 W53.
 */
export function isoWeek(time: number): number {
	const thursday = time + (3 - isoWeekday(time)) * DAY_MS;
	const year = new Date(thursday).getUTCFullYear();
	const dayOfYear = Math.floor((thursday - Date.UTC(year, 0, 1)) / DAY_MS);
	return 1 + Math.floor(dayOfYear / 7);
}

/** Whole days from `from` to `to`, both `yyyy-MM-dd`. */
export function daysBetween(from: string, to: string): number {
	const start = parseIsoDay(from);
	const end = parseIsoDay(to);
	if (start === null || end === null) return 0;
	return Math.round((end - start) / DAY_MS);
}

/** Groups consecutive days that share a key into header spans. */
function spansOf(
	days: number[],
	keyOf: (time: number) => string,
	build: (time: number, span: number) => TimelineSpan,
): TimelineSpan[] {
	const spans: TimelineSpan[] = [];
	let runStart = 0;

	for (let index = 1; index <= days.length; index++) {
		if (
			index === days.length ||
			keyOf(days[index]) !== keyOf(days[runStart])
		) {
			spans.push(build(days[runStart], index - runStart));
			runStart = index;
		}
	}
	return spans;
}

/**
 * The axis for an inclusive range, padded out to whole ISO weeks so every week
 * column holds seven days, Monday to Sunday.
 *
 * A week that crosses a month boundary simply splits across two month cells:
 * the month row and the week row carry independent spans.
 */
export function buildTimeline(from: string, to: string): Timeline {
	const start = parseIsoDay(from);
	const end = parseIsoDay(to);
	if (start === null || end === null || end < start) {
		return { days: [], months: [], weeks: [] };
	}

	const first = start - isoWeekday(start) * DAY_MS;
	const last = end + (6 - isoWeekday(end)) * DAY_MS;

	const times: number[] = [];
	for (let time = first; time <= last; time += DAY_MS) times.push(time);

	const days = times.map((time) => ({
		iso: toIso(time),
		dayOfMonth: new Date(time).getUTCDate(),
	}));

	const months = spansOf(
		times,
		(time) => toIso(time).slice(0, 7),
		(time, span) => {
			const date = new Date(time);
			return {
				key: toIso(time).slice(0, 7),
				labelKey: MONTH_KEYS[date.getUTCMonth()],
				shortLabelKey: MONTH_SHORT_KEYS[date.getUTCMonth()],
				value: date.getUTCFullYear(),
				span,
			};
		},
	);

	const weeks = spansOf(
		times,
		(time) => toIso(time - isoWeekday(time) * DAY_MS),
		(time, span) => ({
			key: toIso(time),
			value: isoWeek(time),
			span,
		}),
	);

	return { days, months, weeks };
}

/** `yyyy-MM-dd` → `yyyy/MM/dd`, the project module's table format. */
export function formatStartDate(iso: string): string {
	return iso.replaceAll("-", "/");
}
