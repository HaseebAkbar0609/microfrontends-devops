import type { QualityDocument, QualityMainCategory } from "../types/quality";

export interface ChecklistItem {
	id: string;
	kontrollpunkt: string;
	category: string;
	krav: string;
	responsibleRole: string;
}

export const MOCK_CHECKLIST_ITEMS: ChecklistItem[] = [
	{ id: "CI001", kontrollpunkt: "Kontrollera säkerhetsutrustning", category: "Säkerhet", krav: "AFS 2001:1", responsibleRole: "Platschef" },
	{ id: "CI002", kontrollpunkt: "Besiktiga fundament", category: "Grund", krav: "SS-EN 1997", responsibleRole: "Förman" },
	{ id: "CI003", kontrollpunkt: "Slutbesiktning invändigt", category: "Slutbesiktning", krav: "BBR 2023", responsibleRole: "Platschef" },
];

const PLAN_DOC = (id: string, title: string, n: number, isTemplate = false): QualityDocument => ({
	id,
	title,
	fileType: "pdf",
	updatedText: `Updated ${n} day${n === 1 ? "" : "s"} ago`,
	starred: false,
	status: "published",
	categoryFrom: "Kontrollplan",
	subCategoryFrom: id.split(".").slice(0, 2).join("."),
	templateType: "Kontrollplan",
	tags: ["kontroll", "kvalitet"],
	owner: "Anna Svensson",
	linkedModules: ["KMA", "Produktion"],
	created: "2024-01-15",
	lastUpdated: "2025-01-10",
	recentActivity: `Published by Anna Svensson • ${n} day${n === 1 ? "" : "s"} ago`,
	description: "",
	isTemplate,
});

const DOC_STANDARD = (id: string, n: number): QualityDocument => ({
	id,
	title: `Consultancy Agreement – Standard`,
	fileType: "pdf",
	updatedText: "Updated 2 days ago",
	starred: false,
	status: "published",
	categoryFrom: "Agreements",
	subCategoryFrom: "Consultancy agreement",
	templateType: "Contract",
	tags: ["konsult", "avtal", "standard"],
	owner: "Anna Svensson",
	linkedModules: ["Legal", "Data IT"],
	created: "2024-01-15",
	lastUpdated: "2025-01-18",
	recentActivity: `Published by Anna Svensson • ${n === 1 ? "2 days ago" : `${n} days ago`}`,
	description: "",
});

const RISK_DOC = (id: string, title: string): QualityDocument => ({
	id,
	title,
	fileType: "pdf",
	updatedText: "Updated 3 days ago",
	starred: false,
	status: "published",
	categoryFrom: "Risk",
	subCategoryFrom: "Risk analysis",
	templateType: "Analysis",
	tags: ["risk", "analys"],
	owner: "Lars Andersson",
	linkedModules: ["Legal"],
	created: "2024-03-10",
	lastUpdated: "2025-02-05",
	recentActivity: "Published by Lars Andersson • 3 days ago",
	description: "",
});

export const MOCK_QUALITY_CATEGORIES: QualityMainCategory[] = [
	{
		id: "10",
		label: "10.0 Styrande dokument",
		subcategories: [
			{
				id: "10.1",
				label: "10.1 Kvalitetspolicy",
				documents: [
					DOC_STANDARD("10.1001", 2),
					DOC_STANDARD("10.1002", 2),
					DOC_STANDARD("10.1003", 2),
					DOC_STANDARD("10.1004", 2),
					DOC_STANDARD("10.1005", 3),
				],
			},
			{
				id: "10.2",
				label: "10.2 Kvalitetsmål",
				documents: [DOC_STANDARD("10.2001", 2), DOC_STANDARD("10.2002", 4)],
			},
			{
				id: "10.3",
				label: "10.3 Organisation och ansvar",
				documents: [DOC_STANDARD("10.3001", 2)],
			},
			{
				id: "10.4",
				label: "10.4 Dokumentstyrning",
				documents: [DOC_STANDARD("10.4001", 2), DOC_STANDARD("10.4002", 5)],
			},
			{
				id: "10.5",
				label: "10.5 Ledningens genomgång",
				documents: [DOC_STANDARD("10.5001", 2)],
			},
		],
	},
	{
		id: "11",
		label: "11.0 Risk- och kontrollhantering",
		subcategories: [
			{
				id: "11.1",
				label: "Riskhantering- rutin",
				documents: [
					RISK_DOC("11.1001", "Mail – risk analysis"),
					RISK_DOC("11.1002", "Risk assessment"),
					RISK_DOC("11.1003", "Mail – risk analysis"),
					RISK_DOC("11.1004", "Risk assessment"),
					RISK_DOC("11.1005", "Mail – risk analysis"),
				],
			},
			{
				id: "11.2",
				label: "Rutin- checklistor och ege...",
				documents: [
					RISK_DOC("11.2001", "Risk checklist"),
					RISK_DOC("11.2002", "Risk assessment"),
				],
			},
			{
				id: "11.3",
				label: "Checklista",
				documents: [RISK_DOC("11.3001", "Quality checklist")],
			},
		],
	},
	{
		id: "12",
		label: "12.0 Process- och produktstyrning",
		subcategories: [
			{
				id: "12.1",
				label: "Produkt- och processtyrning",
				documents: [DOC_STANDARD("12.1001", 2), DOC_STANDARD("12.1002", 2)],
			},
			{
				id: "12.2",
				label: "Leverantörsbedömning",
				documents: [DOC_STANDARD("12.2001", 3)],
			},
			{
				id: "12.3",
				label: "Avvikelsehantering och kvali...",
				documents: [DOC_STANDARD("12.3001", 2)],
			},
		],
	},
	{
		id: "13",
		label: "13.0 Kompetens och resurser",
		subcategories: [
			{
				id: "13.1",
				label: "Kompetens och utbildning",
				documents: [
					DOC_STANDARD("13.1001", 2),
					DOC_STANDARD("13.1002", 2),
					DOC_STANDARD("13.1003", 2),
					DOC_STANDARD("13.1004", 2),
					DOC_STANDARD("13.1005", 2),
				],
			},
		],
	},
	{
		id: "14",
		label: "14.0 Uppföljning och förbättring",
		subcategories: [
			{
				id: "14.1",
				label: "Intern revision och uppföljning",
				documents: [
					DOC_STANDARD("14.1001", 2),
					DOC_STANDARD("14.1002", 2),
					DOC_STANDARD("14.1003", 2),
				],
			},
			{
				id: "14.2",
				label: "Ledningens genomgång",
				documents: [
					DOC_STANDARD("14.2001", 2),
					DOC_STANDARD("14.2002", 2),
				],
			},
		],
	},
];

export const MOCK_QUALITY_PLAN_CATEGORIES: QualityMainCategory[] = [
	{
		id: "grund",
		label: "10.0 Grund",
		subcategories: [
			{
				id: "grund-mark",
				label: "10.1 Mark",
				documents: [
					PLAN_DOC("10.1.1", "Markbesiktning – Standard", 2, true),
					PLAN_DOC("10.1.2", "Markarbete – Uppfyllnad", 2),
					PLAN_DOC("10.1.3", "Markavvattning – Protokoll", 3),
					PLAN_DOC("10.1.4", "Marknivellering – Checklista", 4),
				],
			},
			{
				id: "grund-armering",
				label: "10.2 Armering",
				documents: [
					PLAN_DOC("10.2.1", "Armeringsprotokoll – Standard", 2, true),
					PLAN_DOC("10.2.2", "Armering – Dimensionskontroll", 3),
					PLAN_DOC("10.2.3", "Armering – Bindning", 5),
				],
			},
			{
				id: "grund-betong",
				label: "10.3 Betong",
				documents: [
					PLAN_DOC("10.3.1", "Betongprovning – Standard", 2, true),
					PLAN_DOC("10.3.2", "Betongpump – Protokoll", 2),
					PLAN_DOC("10.3.3", "Gjutning – Checklista", 3),
					PLAN_DOC("10.3.4", "Betongkvalitet – Rapport", 2),
					PLAN_DOC("10.3.5", "Härdning – Protokoll", 6),
					PLAN_DOC("10.3.6", "Betongytor – Standard", 1),
				],
			},
		],
	},
	{
		id: "stomme",
		label: "Stomme",
		subcategories: [
			{
				id: "stomme-vaggar",
				label: "S.1 Väggar",
				documents: [
					PLAN_DOC("S.1.1", "Vägguppbyggnad – Standard", 2, true),
					PLAN_DOC("S.1.2", "Lättbetongblock – Protokoll", 3),
					PLAN_DOC("S.1.3", "Regelstomme – Checklista", 2),
					PLAN_DOC("S.1.4", "Väggisolering – Rapport", 5),
				],
			},
			{
				id: "stomme-bjalklager",
				label: "S.2 Bjälklag",
				documents: [
					PLAN_DOC("S.2.1", "Bjälklag – Standard", 2, true),
					PLAN_DOC("S.2.2", "Plattbärlag – Protokoll", 3),
					PLAN_DOC("S.2.3", "Massivdäck – Checklista", 4),
					PLAN_DOC("S.2.4", "Bjälklagsavjämning – Rapport", 1),
				],
			},
		],
	},
	{
		id: "installation",
		label: "Installation",
		subcategories: [
			{
				id: "inst-vvs",
				label: "I.1 VVS",
				documents: [
					PLAN_DOC("I.1.1", "VVS-installation – Standard", 2, true),
					PLAN_DOC("I.1.2", "Rörinstallation – Protokoll", 3),
					PLAN_DOC("I.1.3", "Ventilation – Checklista", 2),
				],
			},
			{
				id: "inst-el",
				label: "I.2 El",
				documents: [
					PLAN_DOC("I.2.1", "Elinstallation – Standard", 2, true),
					PLAN_DOC("I.2.2", "Kablage – Protokoll", 4),
				],
			},
		],
	},
	{
		id: "badrum",
		label: "Badrum",
		subcategories: [
			{
				id: "badrum-kakel",
				label: "B.1 Kakel och klinker",
				documents: [
					PLAN_DOC("B.1.1", "Kakelläggning – Standard", 2, true),
					PLAN_DOC("B.1.2", "Klinker – Protokoll", 3),
					PLAN_DOC("B.1.3", "Fogning – Checklista", 2),
				],
			},
			{
				id: "badrum-sanitet",
				label: "B.2 Sanitet",
				documents: [
					PLAN_DOC("B.2.1", "WC-installation – Standard", 2, true),
					PLAN_DOC("B.2.2", "Dusch – Protokoll", 3),
					PLAN_DOC("B.2.3", "Sanitetsgods – Checklista", 4),
				],
			},
		],
	},
];

// ── Action Plan mock data ─────────────────────────────────────────────────────

const ACTION_DOC = (id: string, title: string, n: number): QualityDocument => ({
	id,
	title,
	fileType: "pdf",
	updatedText: `Updated ${n} day${n === 1 ? "" : "s"} ago`,
	starred: false,
	status: "published",
	categoryFrom: "Åtgärdsplaner",
	subCategoryFrom: "",
	templateType: "Action",
	tags: ["åtgärd", "kvalitet"],
	owner: "Lars Andersson",
	linkedModules: ["KMA"],
	created: "2025-01-10",
	lastUpdated: "2025-08-20",
	recentActivity: `Updated by Lars Andersson • ${n} day${n === 1 ? "" : "s"} ago`,
	description: "",
});

export const MOCK_ACTION_PLAN_CATEGORIES: QualityMainCategory[] = [
	{
		id: "avvikelser",
		label: "Uppföljning av avvikelser",
		subcategories: [
			{
				id: "avvikelser-inventering",
				label: "Inventeringslista",
				documents: [
					ACTION_DOC("AP.1.1", "Avvikelserapport – Betonggjutning", 2),
					ACTION_DOC("AP.1.2", "Avvikelserapport – Armering", 4),
					ACTION_DOC("AP.1.3", "Avvikelserapport – Isolering", 1),
					ACTION_DOC("AP.1.4", "Avvikelserapport – VVS", 3),
				],
			},
			{
				id: "avvikelser-armering",
				label: "Armering",
				documents: [
					ACTION_DOC("AP.1.5", "Armeringsåtgärd – Dimensionskontroll", 5),
					ACTION_DOC("AP.1.6", "Armeringsåtgärd – Rättning", 2),
					ACTION_DOC("AP.1.7", "Armeringsprotokoll – Uppföljning", 3),
				],
			},
			{
				id: "avvikelser-betong",
				label: "Betong",
				documents: [
					ACTION_DOC("AP.1.8", "Betongåtgärd – Sprickor", 1),
					ACTION_DOC("AP.1.9", "Betongåtgärd – Hållfasthet", 6),
					ACTION_DOC("AP.1.10", "Betongkvalitet – Åtgärdsplan", 2),
					ACTION_DOC("AP.1.11", "Gjutning – Korrigeringsprotokoll", 4),
					ACTION_DOC("AP.1.12", "Betong – Slutuppföljning", 1),
				],
			},
		],
	},
	{
		id: "riskåtgärder",
		label: "Riskåtgärder",
		subcategories: [
			{
				id: "risk-brand",
				label: "Brand & säkerhet",
				documents: [
					ACTION_DOC("AP.2.1", "Brandsäkerhetsåtgärd – Plan", 3),
					ACTION_DOC("AP.2.2", "Utrymningsplan – Uppdatering", 2),
					ACTION_DOC("AP.2.3", "Brandskyddskontroll – Protokoll", 5),
				],
			},
			{
				id: "risk-miljö",
				label: "Miljörisker",
				documents: [
					ACTION_DOC("AP.2.4", "Miljöriskåtgärd – Kemikalier", 1),
					ACTION_DOC("AP.2.5", "Miljökontroll – Avfall", 3),
				],
			},
		],
	},
	{
		id: "förbättringar",
		label: "Förbättringsåtgärder",
		subcategories: [
			{
				id: "förbättringar-process",
				label: "Processförbättringar",
				documents: [
					ACTION_DOC("AP.3.1", "Processförbättring – Betongblandning", 2),
					ACTION_DOC("AP.3.2", "Arbetsflöde – Optimering", 4),
					ACTION_DOC("AP.3.3", "Lean-åtgärd – Byggtid", 1),
				],
			},
			{
				id: "förbättringar-dokumentation",
				label: "Dokumentation",
				documents: [
					ACTION_DOC("AP.3.4", "Dokumentationsrutiner – Uppdatering", 2),
					ACTION_DOC("AP.3.5", "Digitaliseringsplan – KMA", 3),
				],
			},
		],
	},
];

export interface ActionPlanTemplate {
	id: string;
	name: string;
	version: string;
	lastUpdated: string;
	createdBy: string;
}

export const MOCK_ACTION_PLAN_TEMPLATES: ActionPlanTemplate[] = [
	{ id: "AP001", name: "Åtgärdsplan 1", version: "V2025-12", lastUpdated: "2026-01-28", createdBy: "Lars Andersson" },
	{ id: "AP002", name: "Åtgärdsplan 2", version: "v1.8", lastUpdated: "2025-01-08", createdBy: "Lars Andersson" },
	{ id: "AP003", name: "Åtgärdsplan 3", version: "v2.1", lastUpdated: "2025-04-09", createdBy: "Lars Andersson" },
	{ id: "AP004", name: "Åtgärdsplan 4", version: "v1.8", lastUpdated: "2025-04-09", createdBy: "Lars Andersson" },
];
