import type { TemplateDocument } from "../types/forecastTemplates.types";

/**
 * The templates the register starts with.
 *
 * None carries a `url`: a seed has no file behind it, which is the state the
 * row menu's reason text and the details dialog's note are written for. The
 * names differ from the file names on purpose — what the register calls a
 * template is not what the file happens to be called.
 */
export const INITIAL_TEMPLATES: TemplateDocument[] = [
	{
		id: "tpl-0101",
		templateNo: "0101",
		category: "budget",
		documentName: "Budgetmall 2026",
		fileName: "Budget_2026_mall.xlsx",
		date: "2026-06-30",
		description: "Årsbudget per kostnadsställe, med formler för påslag och indexuppräkning.",
	},
	{
		id: "tpl-0102",
		templateNo: "0102",
		category: "forecast",
		documentName: "Prognosunderlag kvartal",
		fileName: "Prognos_kvartal.xlsx",
		date: "2026-06-12",
		description: "Underlag för kvartalsprognos: intäkter, kostnader och täckningsbidrag.",
	},
	{
		id: "tpl-0103",
		templateNo: "0103",
		category: "calculation",
		documentName: "Kalkylmall entreprenad",
		fileName: "Kalkyl_entreprenad_v3.xlsx",
		date: "2026-05-28",
		description: "Standardmall för kalkyl av entreprenaduppdrag, med påslag och riskpost.",
	},
	{
		id: "tpl-0104",
		templateNo: "0104",
		category: "report",
		documentName: "Månadsrapport styrelsen",
		fileName: "Manadsrapport_styrelse.docx",
		date: "2026-05-04",
	},
	{
		id: "tpl-0105",
		templateNo: "0105",
		category: "other",
		documentName: "Checklista projektstart",
		fileName: "Checklista_projektstart.pdf",
		date: "2026-04-17",
		description: "Punkterna som ska vara avklarade innan ett projekt startar.",
	},
	{
		id: "tpl-0106",
		templateNo: "0106",
		category: "budget",
		documentName: "Likviditetsbudget",
		fileName: "Likviditetsbudget.xlsx",
		date: "2026-03-23",
	},
	{
		id: "tpl-0107",
		templateNo: "0107",
		category: "report",
		documentName: "Avvikelserapport",
		fileName: "Avvikelserapport.doc",
		date: "2026-02-09",
	},
	{
		id: "tpl-0108",
		templateNo: "0108",
		category: "other",
		documentName: "Mötesprotokoll ekonomi",
		fileName: "Protokoll_ekonomi.pdf",
		date: "2026-01-15",
		description: "Dagordning och protokollmall för det månatliga ekonomimötet.",
	},
];
