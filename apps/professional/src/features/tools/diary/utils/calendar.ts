import { DiaryEntry, WEEKDAY_KEYS } from "../constants/data";

export interface CalendarDay {
	day: number;
	weekdayKey: string;
	entries: DiaryEntry[];
}

export const buildDays = (
	year: number,
	month: number,
	entries: DiaryEntry[],
): CalendarDay[] => {
	const daysInMonth = new Date(year, month, 0).getDate();
	return Array.from({ length: daysInMonth }, (_, index) => {
		const day = index + 1;
		const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		return {
			day,
			weekdayKey: WEEKDAY_KEYS[new Date(year, month - 1, day).getDay()],
			entries: entries.filter((entry) => entry.date === dateStr),
		};
	});
};
