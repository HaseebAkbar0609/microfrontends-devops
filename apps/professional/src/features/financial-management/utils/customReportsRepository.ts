import { generateTempId } from "@/lib/tempId";
import {
	CUSTOM_REPORT_MAX_COUNT,
	STORAGE_KEY_CUSTOM_REPORTS,
} from "../constants/forecastCustomReports.constants";
import { INITIAL_CUSTOM_REPORTS } from "../mock/forecastCustomReports.mock";
import type { CustomReport, CustomReportInput } from "../types/forecastCustomReports.types";
import { orderedColumns, readStoredColumns } from "./forecastCustomReports";

/**
 * Prognos's custom-report register, kept in the browser.
 *
 * There is no reports endpoint, so this stands in for one. Unlike the sibling
 * Rapporterlista register, which holds a file's bytes and therefore cannot
 * leave memory, a report here is a name, a list of column keys and a date —
 * so it is written to `localStorage` and survives a reload, which is the whole
 * point of saving one.
 *
 * Every read is validated: a record whose columns the list no longer offers is
 * dropped rather than rendered as blank cells.
 */
let reports: CustomReport[] | null = null;

function parse(raw: string): CustomReport[] | null {
	const value: unknown = JSON.parse(raw);
	if (!Array.isArray(value)) return null;

	const records: CustomReport[] = [];
	for (const item of value) {
		if (!item || typeof item !== "object") continue;
		const record = item as Partial<CustomReport>;
		const columns = readStoredColumns(record.columns);
		if (!columns) continue;
		if (typeof record.id !== "string" || typeof record.name !== "string") continue;
		if (typeof record.reportNo !== "string" || typeof record.date !== "string") continue;
		records.push({ id: record.id, reportNo: record.reportNo, name: record.name, columns, date: record.date });
	}

	/* An empty register is a register the reader emptied; only a missing key
	   means "never opened", and only that brings the seeds back. */
	return records;
}

function load(): CustomReport[] {
	if (reports) return reports;
	if (typeof window === "undefined") return INITIAL_CUSTOM_REPORTS.map((report) => ({ ...report }));

	try {
		const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_REPORTS);
		if (stored !== null) {
			const parsed = parse(stored);
			if (parsed) {
				reports = parsed;
				return reports;
			}
		}
	} catch {
		/* Unreadable or blocked storage: start from the seed rather than fail. */
	}

	reports = INITIAL_CUSTOM_REPORTS.map((report) => ({ ...report }));
	persist();
	return reports;
}

function persist(): void {
	if (typeof window === "undefined" || !reports) return;
	try {
		localStorage.setItem(STORAGE_KEY_CUSTOM_REPORTS, JSON.stringify(reports));
	} catch {
		/* A full or blocked store must not break the screen. */
	}
}

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listCustomReports(): CustomReport[] {
	return [...load()].sort((a, b) => b.date.localeCompare(a.date));
}

/** The number the next report gets, continuing the register's own series. */
function nextReportNo(current: CustomReport[]): string {
	const highest = current.reduce((max, report) => {
		const parsed = Number(report.reportNo);
		return Number.isFinite(parsed) && parsed > max ? parsed : max;
	}, 0);
	return String(highest + 1).padStart(4, "0");
}

/** Files a report, or refuses one the dialog should already have stopped. */
export function createCustomReport(input: CustomReportInput, today: string): CustomReport | undefined {
	const current = load();
	const columns = orderedColumns(input.columns);
	const name = input.name.trim();
	if (!name || columns.length === 0) return undefined;
	if (current.length >= CUSTOM_REPORT_MAX_COUNT) return undefined;

	const report: CustomReport = {
		id: generateTempId(),
		reportNo: nextReportNo(current),
		name,
		columns,
		date: today,
	};

	reports = [report, ...current];
	persist();
	return report;
}

export function removeCustomReport(id: string): void {
	reports = load().filter((report) => report.id !== id);
	persist();
}
