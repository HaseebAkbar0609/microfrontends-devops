import type { ReportDocument } from "../types/forecastReports.types";

/**
 * The reports already filed, until an upload endpoint exists. None carries a
 * `url`: a seed has no file behind it, which is what the row menu's reason
 * text is for. A report uploaded in the browser does carry one, for as long as
 * the tab lives.
 */
export const INITIAL_REPORTS: ReportDocument[] = [
	{
		id: "rep-0101",
		reportNo: "0101",
		category: "result",
		fileName: "Resultatprognos 2026 Q1.pdf",
		date: "2026-04-03",
	},
	{
		id: "rep-0102",
		reportNo: "0102",
		category: "liquidity",
		fileName: "Likviditetsrapport mars.pdf",
		date: "2026-04-08",
	},
	{
		id: "rep-0103",
		reportNo: "0103",
		category: "risk",
		fileName: "Riskexponering kunder.xlsx",
		date: "2026-05-12",
	},
	{
		id: "rep-0104",
		reportNo: "0104",
		category: "personnel",
		fileName: "Personalkostnader halvår.pdf",
		date: "2026-06-30",
	},
	{
		id: "rep-0105",
		reportNo: "0105",
		category: "result",
		fileName: "Resultatprognos 2026 Q2.pdf",
		date: "2026-07-02",
	},
	{
		id: "rep-0106",
		reportNo: "0106",
		category: "other",
		fileName: "Underlag styrelsemöte.docx",
		date: "2026-07-18",
	},
];
