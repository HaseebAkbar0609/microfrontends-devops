import type { ForecastDocument } from "../types/forecastDocuments.types";

/**
 * The documents the centre starts with.
 *
 * None carries a `url`: a seed has no file behind it, which is the state the
 * row menu's reason text and the details dialog's note are written for.
 */
export const INITIAL_DOCUMENTS: ForecastDocument[] = [
	{
		id: "doc-0101",
		documentNo: "0101",
		category: "agreement",
		fileName: "Ramavtal_2026.pdf",
		date: "2026-07-02",
	},
	{
		id: "doc-0102",
		documentNo: "0102",
		category: "report",
		fileName: "Kvartalsrapport_Q2.pdf",
		date: "2026-06-18",
	},
	{
		id: "doc-0103",
		documentNo: "0103",
		category: "invoice",
		fileName: "Faktura_10482.pdf",
		date: "2026-05-30",
	},
	{
		id: "doc-0104",
		documentNo: "0104",
		category: "budget",
		fileName: "Budgetunderlag.pdf",
		date: "2026-05-11",
	},
	{
		id: "doc-0105",
		documentNo: "0105",
		category: "other",
		fileName: "Ritning_plan3.png",
		date: "2026-04-22",
	},
	{
		id: "doc-0106",
		documentNo: "0106",
		category: "report",
		fileName: "Platsbesok_foto.jpg",
		date: "2026-03-09",
	},
];
