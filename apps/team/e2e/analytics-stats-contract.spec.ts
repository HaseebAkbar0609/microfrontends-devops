/**
 * The arithmetic behind the Analytics tabs.
 *
 * ISO week numbering is the part most often wrong at a year boundary: the last
 * days of December can belong to week 1 of the next year, and the first days of
 * January to week 52 or 53 of the previous one. These dates are checked against
 * the ISO 8601 definition. Follows admin-user-contract.spec.ts: no browser.
 */
import { expect, test } from "@playwright/test";
import {
	countByText,
	countPerMonth,
	getIsoWeek,
} from "../src/features/customers/analytics/analyticsStats";

// Local noon, so no time zone can push a date onto the neighbouring day.
const day = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);

for (const [date, year, week] of [
	[day(2026, 1, 1), 2026, 1], // a Thursday: week 1 by definition
	[day(2024, 12, 30), 2025, 1], // Monday of the week holding 2 January 2025
	[day(2021, 1, 3), 2020, 53], // Sunday closing 2020's 53rd week
	[day(2020, 12, 31), 2020, 53],
	[day(2027, 1, 1), 2026, 53], // 2026 starts on a Thursday, so it has 53 weeks
	[day(2026, 3, 30), 2026, 14], // the Monday after the spring clock change
	[day(2026, 10, 26), 2026, 44], // the Monday after the autumn clock change
] as const) {
	test(`${date.toDateString()} is ISO ${year}-W${week}`, () => {
		expect(getIsoWeek(date)).toEqual({ year, week });
	});
}

test("free text groups ignoring case and surrounding spaces", () => {
	const rows = countByText(["Göteborg", "göteborg ", " GÖTEBORG", "Malmö"], { unknown: "?", other: "…" });
	expect(rows[0]).toMatchObject({ label: "Göteborg", value: 3 });
	expect(rows[1]).toMatchObject({ label: "Malmö", value: 1 });
});

test("blanks and the missing marker count as unknown", () => {
	const rows = countByText(["", "  ", "N/A", "Lund"], { unknown: "Okänd", other: "…" }, "N/A");
	expect(rows.find((row) => row.label === "Okänd")?.value).toBe(3);
});

test("rows past the top are summed, so the bars still total the sample", () => {
	const cities = ["a", "a", "a", "b", "b", "c", "d", "e", "f", "g", "h"];
	const rows = countByText(cities, { unknown: "?", other: "Övriga" });
	expect(rows.reduce((sum, row) => sum + row.value, 0)).toBe(cities.length);
});

test("months run oldest first and cross the year boundary", () => {
	const rows = countPerMonth([day(2025, 12, 5), day(2026, 1, 9)], 3, day(2026, 1, 20), (start) => start.toISOString().slice(0, 7));
	expect(rows.map((row) => row.value)).toEqual([0, 1, 1]);
});
