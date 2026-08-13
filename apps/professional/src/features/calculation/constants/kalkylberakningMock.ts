import type { KalkylberakningSection, KalkylTemplate, OverheadRow } from "../types/kalkyl";

export const DUMMY_TEMPLATES: KalkylTemplate[] = [
	{ id: "t1", benamning: "Badrum", sektion: 8, mall: "Standard", datum: "2025-08-01" },
	{ id: "t2", benamning: "Kök", sektion: 7, mall: "PRO", datum: "2025-08-01" },
	{ id: "t3", benamning: "Ombyggnad", sektion: 4, mall: "Standard", datum: "2025-09-01" },
];

export const DEFAULT_SECTIONS: KalkylberakningSection[] = [
	{
		id: "s-konsulter",
		name: "Konsulter",
		isOpen: true,
		rows: [{ id: "r-k-1", artikel: "", benamning: "", antal: "", enhet: "", aPris: "", paslagPct: "" }],
	},
];

export const TEMPLATE_SECTIONS: KalkylberakningSection[] = [
	{
		id: "s-consultant",
		name: "Consultant",
		isOpen: true,
		rows: [
			{ id: "r-c-1", artikel: "RC1", benamning: "Arkitekt", antal: "1", enhet: "st", aPris: "80000", paslagPct: "10" },
			{ id: "r-c-2", artikel: "RC2", benamning: "Elritning", antal: "2", enhet: "jun", aPris: "39025", paslagPct: "10" },
		],
	},
	{
		id: "s-material",
		name: "Material",
		isOpen: true,
		rows: [
			{ id: "r-m-1", artikel: "RM1", benamning: "Kakelplattor", antal: "200", enhet: "m2", aPris: "1200", paslagPct: "12" },
			{ id: "r-m-2", artikel: "RM2", benamning: "Parkettgolv", antal: "100", enhet: "m2", aPris: "2260", paslagPct: "12" },
		],
	},
	{
		id: "s-ue",
		name: "UE",
		isOpen: true,
		rows: [
			{ id: "r-u-1", artikel: "RC1", benamning: "Elentreprenör", antal: "1", enhet: "st", aPris: "800000", paslagPct: "10" },
			{ id: "r-u-2", artikel: "RC2", benamning: "Rörläggning", antal: "1", enhet: "st", aPris: "649000", paslagPct: "10" },
		],
	},
];

export const DEFAULT_OVERHEAD_ROWS: OverheadRow[] = [
	{
		id: "oh-1",
		artikel: "1005",
		benamning: "Arbetsrättsräddning",
		antal: "1",
		enhet: "tim",
		aPris: "150000",
		paslagPct: "10",
		justering: "0",
	},
	{
		id: "oh-2",
		artikel: "850",
		benamning: "Etablering",
		antal: "1",
		enhet: "tim",
		aPris: "25000",
		paslagPct: "10",
		justering: "0",
	},
];
