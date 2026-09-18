import { ANALYTICS_TOP_ROWS, MS_PER_DAY } from "./analytics.constants";

export type AnalyticsBarRow = { id: string; label: string; value: number };

type Countable = { id: string; label: string };

const OTHER_ROW_ID = "__other__";

function tally(keys: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}

/**
 * Counts entries per id, largest first. Rows past `topRows` are summed into a
 * single "other" row so the bars still add up to the whole sample.
 */
export function countById(
  entries: Countable[],
  otherLabel: string,
  topRows = ANALYTICS_TOP_ROWS
): AnalyticsBarRow[] {
  const labels = new Map(entries.map((entry) => [entry.id, entry.label]));
  const sorted = [...tally(entries.map((entry) => entry.id))]
    .map(([id, value]) => ({ id, label: labels.get(id) ?? id, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  const rest = sorted.slice(topRows).reduce((sum, row) => sum + row.value, 0);
  const top = sorted.slice(0, topRows);
  return rest > 0 ? [...top, { id: OTHER_ROW_ID, label: otherLabel, value: rest }] : top;
}

/** Parses an API timestamp (epoch ms or ISO string); null when unusable. */
export function parseTimestamp(value: string | number): Date | null {
  if (value === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Moves a local date to the Thursday of its ISO week (Monday-first). */
function toIsoThursday(date: Date): Date {
  const thursday = startOfLocalDay(date);
  thursday.setDate(thursday.getDate() + 3 - ((thursday.getDay() + 6) % 7));
  return thursday;
}

/** ISO 8601 week-numbering year and week of a date, in the viewer's time zone. */
export function getIsoWeek(date: Date): { year: number; week: number } {
  const thursday = toIsoThursday(date);
  const year = thursday.getFullYear();
  const firstThursday = toIsoThursday(new Date(year, 0, 4));
  // Rounding absorbs the hour a daylight-saving switch adds or removes.
  const week = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * MS_PER_DAY));
  return { year, week };
}

function weekId(date: Date): string {
  const { year, week } = getIsoWeek(date);
  return `${year}-W${week}`;
}

function monthId(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

/** Counts per ISO week for the `weeks` weeks ending with the week of `now`, oldest first. */
export function countPerWeek(
  dates: Date[],
  weeks: number,
  now: Date,
  formatLabel: (week: number) => string
): AnalyticsBarRow[] {
  const counts = tally(dates.map(weekId));
  const monday = startOfLocalDay(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return Array.from({ length: weeks }, (_, index) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() - 7 * (weeks - 1 - index));
    const id = weekId(start);
    return { id, label: formatLabel(getIsoWeek(start).week), value: counts.get(id) ?? 0 };
  });
}

/** Counts per calendar month for the `months` months ending with the month of `now`, oldest first. */
export function countPerMonth(
  dates: Date[],
  months: number,
  now: Date,
  formatLabel: (monthStart: Date) => string
): AnalyticsBarRow[] {
  const counts = tally(dates.map(monthId));

  return Array.from({ length: months }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const id = monthId(start);
    return { id, label: formatLabel(start), value: counts.get(id) ?? 0 };
  });
}
