import { fileRejection, mintTypedUrl, revokeUrls } from "@/features/project/shared/recordFiles";
import { generateTempId } from "@/lib/tempId";
import { REPORT_FILE_RULES } from "../constants/forecastReports.constants";
import { INITIAL_REPORTS } from "../mock/forecastReports.mock";
import type { ReportDocument, ReportUploadInput } from "../types/forecastReports.types";

/**
 * Prognos's report register, in memory.
 *
 * There is no reports endpoint, so this stands in for one as the project
 * record's document service does: a module-level array every read goes
 * through, each mutator reassigning it. An upload survives a visit to another
 * screen; a hard reload returns to the seed. Nothing is written to browser
 * storage — a file's bytes have no business there (AGENTS.md rule 6), and a
 * `blob:` URL could not survive a reload anyway.
 *
 * It also stands in for the upload endpoint, so it owns the files' `blob:`
 * URLs: minted when an upload is stored, revoked when one is deleted.
 */
let reports: ReportDocument[] = INITIAL_REPORTS.map((report) => ({ ...report }));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listReports(): ReportDocument[] {
	return [...reports].sort((a, b) => b.date.localeCompare(a.date));
}

/** The number the next report gets, continuing the register's own series. */
function nextReportNo(): string {
	const highest = reports.reduce((max, report) => {
		const parsed = Number(report.reportNo);
		return Number.isFinite(parsed) && parsed > max ? parsed : max;
	}, 0);
	return String(highest + 1).padStart(4, "0");
}

/**
 * Stores an upload, or refuses one the dialog should already have stopped: a
 * file of the wrong type or over the size ceiling, or a register already full.
 * The dialog's checks run in the browser; these stand where the endpoint's
 * would.
 */
export function createReport(input: ReportUploadInput, today: string): ReportDocument | undefined {
	if (fileRejection(input.file, REPORT_FILE_RULES)) return undefined;
	if (reports.length >= REPORT_FILE_RULES.maxCount) return undefined;

	const report: ReportDocument = {
		id: generateTempId(),
		reportNo: nextReportNo(),
		category: input.category,
		fileName: input.file.name,
		fileSize: input.file.size,
		date: today,
		url: mintTypedUrl(input.file, REPORT_FILE_RULES.types),
	};

	reports = [report, ...reports];
	return report;
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeReport(id: string): void {
	const target = reports.find((report) => report.id === id);
	if (!target) return;
	reports = reports.filter((report) => report !== target);
	revokeUrls([target]);
}
