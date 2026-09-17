import localizationConstants from "@/utils/translation/constants";
import type {
	DesignBudgetGroup,
	DesignBudgetSection,
} from "../types/designEkonomi";

export const DESIGN_BUDGET_GROUPS: DesignBudgetGroup[] = [
	{
		id: "g1",
		name: "Budget 01",
		items: [
			{
				id: "b1",
				datum: "2025-03-01",
				benamning: "Budget 1",
				typ: "Mark/Grund",
				belopp: 1580000,
				pdfName: "budget_01_mark.pdf",
				groupId: "g1",
			},
			{
				id: "b2",
				datum: "2025-04-01",
				benamning: "Budget 2",
				typ: "Hus/Byggnad",
				belopp: 1580000,
				pdfName: "budget_01_hus.pdf",
				groupId: "g1",
			},
			{
				id: "b3",
				datum: "2025-05-01",
				benamning: "Budget 3",
				typ: "Installation",
				belopp: 1580000,
				pdfName: "budget_01_installation.pdf",
				groupId: "g1",
			},
		],
	},
];

export const DESIGN_BUDGET_BREAKDOWN: DesignBudgetSection[] = [
	{
		id: "s1",
		title: localizationConstants.designEkonomiMarkKostnader,
		rows: [
			{ id: "r1", benamning: "Tomt", antal: 1, enhet: "st", aPris: 800000 },
			{ id: "r2", benamning: "Lagfart", antal: 1, enhet: "st", aPris: 20000 },
			{ id: "r3", benamning: "Pantbrev", antal: 1, enhet: "st", aPris: 15000 },
		],
	},
	{
		id: "s2",
		title: localizationConstants.designEkonomiKonsulter,
		rows: [
			{
				id: "r4",
				benamning: "Arkitekt",
				antal: 1,
				enhet: "st",
				aPris: 350000,
			},
			{
				id: "r5",
				benamning: "El-konsult",
				antal: 1,
				enhet: "st",
				aPris: 120000,
			},
			{
				id: "r6",
				benamning: "K-konsult",
				antal: 1,
				enhet: "st",
				aPris: 95000,
			},
		],
	},
];
