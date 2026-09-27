import type {
	CalculationTemplateOption,
	OverheadRow,
	SupplierPriceListItem,
	TemplateCostSection,
} from "../types/templateCalculation";

export const DEFAULT_BLANK_SECTIONS: TemplateCostSection[] = [
	{
		id: "sec-konsulter",
		categoryType: "konsulter",
		title: "Konsulter",
		isOpen: true,
		rows: [
			{
				id: "row-k-blank-1",
				artikel: "0",
				benamning: "0",
				antal: "0",
				enhet: "0",
				aPris: "0",
				paslagPct: "0",
			},
		],
	},
];

export const DEFAULT_OVERHEAD_ROWS: OverheadRow[] = [
	{
		id: "ov-1",
		artikel: "1005",
		benamning: "Arbetsledning",
		antal: "1",
		enhet: "tim",
		aPris: "150000",
		paslagPct: "10",
		justering: "0",
	},
	{
		id: "ov-2",
		artikel: "850",
		benamning: "Etablering",
		antal: "1",
		enhet: "tim",
		aPris: "25000",
		paslagPct: "10",
		justering: "0",
	},
];

export const DEFAULT_TEMPLATE_SECTIONS: TemplateCostSection[] = [
	{
		id: "sec-konsulter",
		categoryType: "konsulter",
		title: "Konsulter",
		isOpen: true,
		rows: [
			{
				id: "row-k-1",
				artikel: "1001",
				benamning: "Arkitekt",
				antal: "0",
				enhet: "tim",
				aPris: "750",
				paslagPct: "10",
			},
			{
				id: "row-k-2",
				artikel: "1002",
				benamning: "Konsult",
				antal: "0",
				enhet: "tim",
				aPris: "750",
				paslagPct: "10",
			},
		],
	},
	{
		id: "sec-arbete",
		categoryType: "arbete",
		title: "Arbete",
		isOpen: true,
		rows: [
			{
				id: "row-a-1",
				artikel: "1001",
				benamning: "Arbete",
				antal: "0",
				enhet: "tim",
				aPris: "750",
				paslagPct: "10",
			},
			{
				id: "row-a-2",
				artikel: "1002",
				benamning: "Projektledare",
				antal: "0",
				enhet: "tim",
				aPris: "750",
				paslagPct: "10",
			},
		],
	},
	{
		id: "sec-material",
		categoryType: "material",
		title: "Material",
		isOpen: true,
		rows: [
			{
				id: "row-m-1",
				artikel: "",
				levArtikel: "Lee456..",
				leverantor: "Beijer",
				benamning: "Byggmaterial",
				antal: "0",
				enhet: "kr",
				aPris: "28500",
				paslagPct: "10",
			},
			{
				id: "row-m-2",
				artikel: "1002",
				levArtikel: "",
				leverantor: "",
				benamning: "Förbrukning",
				antal: "0",
				enhet: "kr",
				aPris: "10500",
				paslagPct: "10",
			},
		],
	},
	{
		id: "sec-uc",
		categoryType: "uc",
		title: "UC",
		isOpen: true,
		rows: [
			{
				id: "row-u-1",
				artikel: "1001",
				benamning: "Elektriker",
				antal: "0",
				enhet: "st",
				aPris: "148000",
				paslagPct: "10",
			},
			{
				id: "row-u-2",
				artikel: "1002",
				benamning: "Målare",
				antal: "0",
				enhet: "st",
				aPris: "50000",
				paslagPct: "10",
			},
		],
	},
];

export const CALCULATION_TEMPLATE_OPTIONS: CalculationTemplateOption[] = [
	{
		id: "mall-badrum",
		name: "Badrum",
		description: "Standard",
		mallType: "Standard",
		sektionCount: 8,
		datum: "2025-09-01",
		sections: DEFAULT_TEMPLATE_SECTIONS,
	},
	{
		id: "mall-kok",
		name: "Kök",
		description: "PRO",
		mallType: "PRO",
		sektionCount: 7,
		datum: "2025-09-01",
		sections: DEFAULT_TEMPLATE_SECTIONS,
	},
	{
		id: "mall-ombyggnad",
		name: "Ombyggnad",
		description: "Standard",
		mallType: "Standard",
		sektionCount: 4,
		datum: "2025-09-01",
		sections: DEFAULT_TEMPLATE_SECTIONS,
	},
	{
		id: "mall-standard-bygg",
		name: "Mallnamn",
		description: "Standard bygg och renoveringsmall",
		mallType: "Standard",
		sektionCount: 4,
		datum: "2025-09-01",
		sections: DEFAULT_TEMPLATE_SECTIONS,
	},
	{
		id: "mall-villa-nybyggnation",
		name: "Villa / Nybyggnation",
		description: "Komplett kalkylmall för enfamiljshus och villor",
		mallType: "PRO",
		sektionCount: 4,
		datum: "2025-09-01",
		sections: [
			{
				id: "sec-v-konsulter",
				categoryType: "konsulter",
				title: "Konsulter",
				isOpen: true,
				rows: [
					{ id: "v-k-1", artikel: "K101", benamning: "Bygglovsarkitekt", antal: "1", enhet: "st", aPris: "45000", paslagPct: "10" },
					{ id: "v-k-2", artikel: "K102", benamning: "Konstruktör", antal: "1", enhet: "st", aPris: "32000", paslagPct: "10" },
				],
			},
			{
				id: "sec-v-arbete",
				categoryType: "arbete",
				title: "Arbete",
				isOpen: true,
				rows: [
					{ id: "v-a-1", artikel: "A101", benamning: "Snickare", antal: "350", enhet: "tim", aPris: "680", paslagPct: "12" },
					{ id: "v-a-2", artikel: "A102", benamning: "Plattsättare", antal: "80", enhet: "tim", aPris: "720", paslagPct: "12" },
				],
			},
			{
				id: "sec-v-material",
				categoryType: "material",
				title: "Material",
				isOpen: true,
				rows: [
					{ id: "v-m-1", artikel: "M101", levArtikel: "BE-9912", leverantor: "Beijer Bygg", benamning: "Trävirke & Reglar", antal: "1", enhet: "parti", aPris: "145000", paslagPct: "15" },
					{ id: "v-m-2", artikel: "M102", levArtikel: "XL-3301", leverantor: "XL-Bygg", benamning: "Isolering & Gips", antal: "1", enhet: "parti", aPris: "65000", paslagPct: "15" },
				],
			},
			{
				id: "sec-v-uc",
				categoryType: "uc",
				title: "UC",
				isOpen: true,
				rows: [
					{ id: "v-u-1", artikel: "U101", benamning: "Mark & Schakt", antal: "1", enhet: "st", aPris: "220000", paslagPct: "10" },
					{ id: "v-u-2", artikel: "U102", benamning: "VVS-installation", antal: "1", enhet: "st", aPris: "185000", paslagPct: "10" },
				],
			},
		],
	},
	{
		id: "mall-badrumsrenovering",
		name: "Badrumsrenovering",
		description: "Standardiserad mall för våtrum och badrum",
		sections: [
			{
				id: "sec-b-arbete",
				categoryType: "arbete",
				title: "Arbete",
				isOpen: true,
				rows: [
					{ id: "b-a-1", artikel: "A201", benamning: "Rivning & Sanering", antal: "24", enhet: "tim", aPris: "650", paslagPct: "10" },
					{ id: "b-a-2", artikel: "A202", benamning: "Tätskikt & Plattsättning", antal: "40", enhet: "tim", aPris: "750", paslagPct: "10" },
				],
			},
			{
				id: "sec-b-material",
				categoryType: "material",
				title: "Material",
				isOpen: true,
				rows: [
					{ id: "b-m-1", artikel: "M201", levArtikel: "KK-1002", leverantor: "Kakelpalatset", benamning: "Klinker & Kakel", antal: "35", enhet: "m2", aPris: "450", paslagPct: "15" },
				],
			},
			{
				id: "sec-b-uc",
				categoryType: "uc",
				title: "UC",
				isOpen: true,
				rows: [
					{ id: "b-u-1", artikel: "U201", benamning: "Behörig Elektriker", antal: "1", enhet: "st", aPris: "35000", paslagPct: "10" },
					{ id: "b-u-2", artikel: "U202", benamning: "Auktoriserad VVS", antal: "1", enhet: "st", aPris: "48000", paslagPct: "10" },
				],
			},
		],
	},
];

export const MOCK_SUPPLIER_PRICE_LISTS: SupplierPriceListItem[] = [
	{ id: "sp-1", articleNo: "ART-9901", supplier: "Beijer Byggmaterial", name: "Gipsskiva Normal 12,5x1200x2400", unit: "st", price: 149 },
	{ id: "sp-2", articleNo: "ART-9902", supplier: "Beijer Byggmaterial", name: "Regel Trä 45x70 C24", unit: "lpm", price: 34 },
	{ id: "sp-3", articleNo: "ART-9903", supplier: "Ahlsell", name: "Rörböj 90 gr 110mm PP", unit: "st", price: 89 },
	{ id: "sp-4", articleNo: "ART-9904", supplier: "Ahlsell", name: "Kopparrör 15x1,0 Glödgat 5m", unit: "st", price: 320 },
	{ id: "sp-5", articleNo: "ART-9905", supplier: "Elektroskandia", name: "Installationskabel FQ 3G1,5", unit: "m", price: 18 },
	{ id: "sp-6", articleNo: "ART-9906", supplier: "Dahl Sverige", name: "Golvvärmeslang 16x2,0 240m", unit: "rle", price: 3490 },
];
