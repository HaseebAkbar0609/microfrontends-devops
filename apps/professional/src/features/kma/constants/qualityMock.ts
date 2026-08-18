import type { QualityDocument, QualityMainCategory } from "../types/quality";

const PLAN_DOC = (id: string, n: number): QualityDocument => ({
	id,
	title: `Consultancy Agreement – Standard`,
	fileType: "pdf",
	updatedText: `Updated ${n} day${n === 1 ? "" : "s"} ago`,
	starred: false,
	status: "published",
	categoryFrom: "Agreements",
	subCategoryFrom: "Consultancy agreement",
	templateType: "Contract",
	tags: ["konsult", "avtal", "standard"],
	owner: "Anna Svensson",
	linkedModules: ["Legal", "Data IT"],
	created: "2024-01-15",
	lastUpdated: "2025-01-10",
	recentActivity: `Published by Anna Svensson • ${n} day${n === 1 ? "" : "s"} ago`,
	description: "",
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
					PLAN_DOC("10.11", 2),
					PLAN_DOC("10.1.2", 2),
					PLAN_DOC("10.1.3", 3),
					PLAN_DOC("10.1.4", 4),
				],
			},
			{
				id: "grund-armering",
				label: "10.2 Armering",
				documents: [
					PLAN_DOC("10.2.1", 2),
					PLAN_DOC("10.2.2", 3),
					PLAN_DOC("10.2.3", 5),
				],
			},
			{
				id: "grund-betong",
				label: "10.3 Betong",
				documents: [
					PLAN_DOC("10.3.1", 2),
					PLAN_DOC("10.3.2", 2),
					PLAN_DOC("10.3.3", 3),
					PLAN_DOC("10.3.4", 2),
					PLAN_DOC("10.3.5", 6),
					PLAN_DOC("10.3.6", 1),
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
					PLAN_DOC("S.1.1", 2),
					PLAN_DOC("S.1.2", 3),
					PLAN_DOC("S.1.3", 2),
					PLAN_DOC("S.1.4", 5),
				],
			},
			{
				id: "stomme-bjalklager",
				label: "S.2 Bjälklag",
				documents: [
					PLAN_DOC("S.2.1", 2),
					PLAN_DOC("S.2.2", 3),
					PLAN_DOC("S.2.3", 4),
					PLAN_DOC("S.2.4", 1),
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
					PLAN_DOC("I.1.1", 2),
					PLAN_DOC("I.1.2", 3),
					PLAN_DOC("I.1.3", 2),
				],
			},
			{
				id: "inst-el",
				label: "I.2 El",
				documents: [
					PLAN_DOC("I.2.1", 2),
					PLAN_DOC("I.2.2", 4),
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
					PLAN_DOC("B.1.1", 2),
					PLAN_DOC("B.1.2", 3),
					PLAN_DOC("B.1.3", 2),
				],
			},
			{
				id: "badrum-sanitet",
				label: "B.2 Sanitet",
				documents: [
					PLAN_DOC("B.2.1", 2),
					PLAN_DOC("B.2.2", 3),
					PLAN_DOC("B.2.3", 4),
				],
			},
		],
	},
];
