import {
	addDays,
	differenceInCalendarDays,
	format,
	getISOWeek,
	isSameDay,
	isValid,
	parse,
	parseISO,
} from "date-fns";
import type { OrderTimeplanTask } from "../types/timeplan.types";

export interface TimelineDay {
	dayNumber: number;
	dateStr: string;
	isToday: boolean;
}

export interface TimelineWeek {
	weekNumber: number;
	days: TimelineDay[];
}

export interface TimelineMonth {
	monthName: string;
	monthKey: string;
	year: number;
	colSpan: number;
}

export interface TimelineGridData {
	startDate: Date;
	endDate: Date;
	totalDays: number;
	months: TimelineMonth[];
	weeks: TimelineWeek[];
	todayIndex: number | null;
}

/**
 * Safely parses standard dates in YYYY-MM-DD or YYYY/MM/DD format
 */
export function safeParseDate(dateStr?: string | null): Date {
	if (!dateStr) return new Date();
	const normalized = dateStr.replace(/\//g, "-").trim();
	const parsedIso = parseISO(normalized);
	if (isValid(parsedIso)) return parsedIso;

	const parsedSlash = parse(dateStr, "yyyy/MM/dd", new Date());
	if (isValid(parsedSlash)) return parsedSlash;

	const parsedDash = parse(dateStr, "yyyy-MM-dd", new Date());
	if (isValid(parsedDash)) return parsedDash;

	return new Date();
}

/**
 * Dynamically computes months, ISO weeks, and day columns based on real calendar dates
 */
export function generateTimelineGrid(
	baseStartDateStr?: string | null,
	weeksCount: number = 4
): TimelineGridData {
	const baseStart = safeParseDate(baseStartDateStr);
	const today = new Date();

	const totalDays = weeksCount * 7;
	const gridEndDate = addDays(baseStart, totalDays - 1);

	const weeks: TimelineWeek[] = [];
	const monthMap = new Map<string, { monthName: string; monthKey: string; year: number; count: number }>();

	let todayIndex: number | null = null;

	for (let w = 0; w < weeksCount; w++) {
		const weekDays: TimelineDay[] = [];
		const firstDayOfWeek = addDays(baseStart, w * 7);
		const weekNumber = getISOWeek(firstDayOfWeek);

		for (let d = 0; d < 7; d++) {
			const dayIndex = w * 7 + d;
			const currentDay = addDays(baseStart, dayIndex);
			const isToday = isSameDay(currentDay, today);

			if (isToday) {
				todayIndex = dayIndex;
			}

			const dayNumber = currentDay.getDate();
			const dateStr = format(currentDay, "yyyy-MM-dd");
			weekDays.push({ dayNumber, dateStr, isToday });

			// Accumulate month spans
			const monthKey = format(currentDay, "yyyy-MM");
			const monthName = format(currentDay, "MMMM");
			const year = currentDay.getFullYear();

			if (!monthMap.has(monthKey)) {
				monthMap.set(monthKey, { monthName, monthKey, year, count: 1 });
			} else {
				const existing = monthMap.get(monthKey)!;
				existing.count += 1;
			}
		}

		weeks.push({ weekNumber, days: weekDays });
	}

	const months: TimelineMonth[] = Array.from(monthMap.values()).map((m) => ({
		monthName: m.monthName,
		monthKey: m.monthKey,
		year: m.year,
		colSpan: m.count,
	}));

	return {
		startDate: baseStart,
		endDate: gridEndDate,
		totalDays,
		months,
		weeks,
		todayIndex,
	};
}

/**
 * Computes exact start index, duration in calendar days, and percentage positioning
 */
export function computeTaskGanttMetrics(
	task: OrderTimeplanTask,
	gridStartDate: Date,
	totalDays: number
): {
	startDayIndex: number;
	durationDays: number;
	leftPercent: number;
	widthPercent: number;
	isWithinRange: boolean;
} {
	let startDayIndex = 0;
	let durationDays = task.durationDays ?? 3;
	let isWithinRange = true;

	// 1. If startDayIndex is explicitly provided on the task
	if (typeof task.startDayIndex === "number" && task.startDayIndex >= 0) {
		startDayIndex = Math.max(0, Math.min(totalDays - 1, task.startDayIndex));
		const maxDays = totalDays - startDayIndex;
		durationDays = Math.max(1, Math.min(maxDays, task.durationDays ?? 1));
		isWithinRange = task.startDayIndex < totalDays && (task.durationDays ?? 0) > 0;
	}
	// 2. Otherwise calculate from task.startDate and task.endDate relative to gridStartDate
	else if (task.startDate) {
		const taskStart = safeParseDate(task.startDate);
		const taskEnd = task.endDate ? safeParseDate(task.endDate) : addDays(taskStart, durationDays - 1);
		const rawStartIndex = differenceInCalendarDays(taskStart, gridStartDate);
		const rawDuration = Math.max(1, differenceInCalendarDays(taskEnd, taskStart) + 1);

		if (rawStartIndex < totalDays && rawStartIndex + rawDuration > 0) {
			startDayIndex = Math.max(0, Math.min(totalDays - 1, rawStartIndex));
			const maxDays = totalDays - startDayIndex;
			durationDays = Math.max(1, Math.min(maxDays, rawDuration));
			isWithinRange = (task.durationDays ?? rawDuration) > 0;
		} else {
			isWithinRange = false;
		}
	}

	const leftPercent = (startDayIndex / totalDays) * 100;
	const widthPercent = (durationDays / totalDays) * 100;

	return {
		startDayIndex,
		durationDays,
		leftPercent,
		widthPercent,
		isWithinRange,
	};
}
