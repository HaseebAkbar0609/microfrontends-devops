import type {
	ClaimItem,
	ClaimTemplate,
} from "../types/claims.types";

export const CLAIMS_BASE_ROUTE = "/module/financial-management/economy/claims";
export const CREATE_CLAIM_ROUTE = `${CLAIMS_BASE_ROUTE}/create`;
export const CLAIM_TEMPLATES_BASE_ROUTE = `${CLAIMS_BASE_ROUTE}/templates`;
export const CREATE_CLAIM_TEMPLATE_ROUTE = `${CLAIM_TEMPLATES_BASE_ROUTE}/create`;

export const STORAGE_KEY_CLAIMS = "tfs_economy_claims_data";
export const STORAGE_KEY_CLAIM_TEMPLATES = "tfs_economy_claim_templates_data";

export const DEFAULT_CLAIMS_PAGE_SIZE = 10;
export const CLAIMS_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_CLAIM_TEMPLATES_PAGE_SIZE = 10;
export const CLAIM_TEMPLATES_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const ALLOWED_FILE_EXTENSIONS = ".png, .jpg, .jpeg, .pdf";
export const ALLOWED_FILE_TYPES_LABEL = "PNG-, JPG- och PDF-filer är tillåtna.";

export const DEFAULT_TEMPLATE_TITLES = [
	"Mall Title",
	"Leveransavvikelse",
	"Skadat material",
	"Felaktig fakturering",
	"Besiktningsanmärkning",
	"Försenat arbete",
] as const;

export const DEFAULT_TEMPLATE_DATES = [
	"2024/01/01",
	"2024/02/01",
	"2024/03/01",
	"2024/04/01",
	"2024/05/01",
] as const;

export const DEFAULT_SUPPLIERS = [
	"Cleaning Services AB",
	"Ahlsell AB",
	"Dahl Sverige AB",
	"Beijer Byggmaterial AB",
	"Cramo AB",
	"Elektroskandia Sverige AB",
] as const;

export const DEFAULT_OBJECTS = [
	{ id: "OR501", name: "Overhead Central", objectId: "OR501" },
	{ id: "OR502", name: "Nytt sovrum Göteborg", objectId: "OR502" },
	{ id: "OR503", name: "Ombyggnad golv Uppsala", objectId: "OR503" },
	{ id: "P2025-001", name: "Nytt badrum Nacka", objectId: "P2025-001" },
	{ id: "P2025-002", name: "Tillbyggnad Täby", objectId: "P2025-002" },
] as const;

export const DEFAULT_DEFICIENCY_TYPES = [
	"Service, Delivery",
	"Product fault",
	"Wrong delivery",
	"Damaged goods",
	"Late delivery",
	"Defective work",
	"Billing deviation",
] as const;

export const DEFAULT_DESIRED_ACTIONS = [
	"Kreditering",
	"Omfakturing",
	"Åtgärdande av fel",
	"Prisavdrag",
	"Hävning av köp",
	"Ny leverans",
] as const;

export const SEED_CLAIM_TEMPLATES: ClaimTemplate[] = [
	{
		id: "#MA001",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Standardmall för hantering av reklamationer vid bristande leveranskvalitet.",
		updatedAt: "2024/01/01",
	},
	{
		id: "#MA002",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Mall för reklamation av skadat gods och materialavvikelser.",
		updatedAt: "2024/01/01",
	},
	{
		id: "#MA003",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Mall för krav på kreditering vid felaktigt debiterade arbetstimmar.",
		updatedAt: "2024/01/01",
	},
	{
		id: "#MA004",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Standardmall för försenad etablering och leveransavvikelse.",
		updatedAt: "2024/01/01",
	},
	{
		id: "#MA005",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Mall för åtgärdande av fel vid underkänd slutbesiktning.",
		updatedAt: "2024/01/01",
	},
	{
		id: "#MA006",
		name: "Mall Namn",
		title: "Mall Title",
		date: "2024/01/01",
		description: "Mall för prisavdrag och vite vid avtalsbrott.",
		updatedAt: "2024/01/01",
	},
];

export const SEED_CLAIMS: ClaimItem[] = [
	{
		id: "001",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-001",
		object: "OR501",
		objectId: "OR501",
		objectName: "Overhead Central",
		responsible: "Kalle Anderson",
		deficiencyType: "Service, Delivery",
		incidentDate: "2026-01-01",
		supplierContact: "Anna Svensson",
		responseDeadline: "2026-01-15",
		deficiencyDescription: "Städtjänst levererades ej enligt specificerat städschema och avtal.",
		disputedAmount: 12000,
		desiredAction: "Kreditering",
		templateId: "TPL-001",
		templateName: "Badrumsrenovering ROT",
		title: "Reklamation avseende utebliven städleverans",
		description: "Bestrider delar av månadsfaktura på grund av bristfälligt genomförd lokalvård.",
		status: "sent",
		documents: [
			{
				id: "doc-001-1",
				date: "2024-05-10",
				name: "avvikelse_rapport_001.pdf",
				fileType: "PDF",
				fileSize: "1.2 MB",
			},
			{
				id: "doc-001-2",
				date: "2024-05-10",
				name: "faktura_kopia_001.pdf",
				fileType: "PDF",
				fileSize: "850 KB",
			},
		],
		createdAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "002",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-002",
		object: "OR501",
		objectId: "OR501",
		objectName: "Overhead Central",
		responsible: "Kalle Anderson",
		deficiencyType: "Product fault",
		incidentDate: "2026-01-01",
		supplierContact: "Johan Lindqvist",
		responseDeadline: "2026-01-15",
		deficiencyDescription: "Material och maskiner som levererades uppvisade allvarliga funktionsfel.",
		disputedAmount: 12000,
		desiredAction: "Åtgärdande av fel",
		templateId: "TPL-002",
		templateName: "Hemstädning RUT",
		title: "Reklamation avseende maskinfel",
		description: "Utrustning fungerade inte vid driftstart och orsakade driftstopp.",
		status: "sent",
		documents: [
			{
				id: "doc-002-1",
				date: "2024-05-10",
				name: "inspektionsprotokoll.pdf",
				fileType: "PDF",
				fileSize: "2.1 MB",
			},
		],
		createdAt: "2026-01-01T09:00:00Z",
	},
	{
		id: "003",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-003",
		object: "P2025-001",
		objectId: "P2025-001",
		objectName: "Nytt badrum Nacka",
		responsible: "Kalle Anderson",
		deficiencyType: "Service, Delivery",
		incidentDate: "2026-01-01",
		supplierContact: "Anna Svensson",
		responseDeadline: "2026-01-20",
		deficiencyDescription: "Slutstädning ej godkänd vid besiktning.",
		disputedAmount: 12000,
		desiredAction: "Kreditering",
		title: "Reklamation slutstädning badrum",
		description: "Besiktningsanmärkning gällande kvarvarande byggdamm och smuts.",
		status: "sent",
		documents: [
			{
				id: "doc-003-1",
				date: "2024-05-10",
				name: "besiktningsprotokoll.pdf",
				fileType: "PDF",
				fileSize: "1.4 MB",
			},
		],
		createdAt: "2026-01-01T10:00:00Z",
	},
	{
		id: "004",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-004",
		object: "P2025-002",
		objectId: "P2025-002",
		objectName: "Tillbyggnad Täby",
		responsible: "Kalle Anderson",
		deficiencyType: "Service, Delivery",
		incidentDate: "2026-01-01",
		supplierContact: "Anna Svensson",
		responseDeadline: "2026-01-20",
		deficiencyDescription: "Försenad etablering och bristande personalbemanning.",
		disputedAmount: 12000,
		desiredAction: "Prisavdrag",
		title: "Reklamation försening Täby",
		description: "Kräver vite/prisavdrag för 5 dagars försening.",
		status: "sent",
		documents: [],
		createdAt: "2026-01-01T11:00:00Z",
	},
	{
		id: "005",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-005",
		object: "OR502",
		objectId: "OR502",
		objectName: "Nytt sovrum Göteborg",
		responsible: "Kalle Anderson",
		deficiencyType: "Service, Delivery",
		incidentDate: "2026-01-01",
		supplierContact: "Erik Holm",
		responseDeadline: "2026-01-25",
		deficiencyDescription: "Felaktiga kemikalier användes som skadade ytbeläggning.",
		disputedAmount: 12000,
		desiredAction: "Åtgärdande av fel",
		title: "Skada på ytskikt Göteborg",
		description: "Kräver återställande av skadat golv.",
		status: "sent",
		documents: [
			{
				id: "doc-005-1",
				date: "2024-05-10",
				name: "skaderapport.pdf",
				fileType: "PDF",
				fileSize: "3.0 MB",
			},
		],
		createdAt: "2026-01-01T12:00:00Z",
	},
	{
		id: "006",
		date: "2026-01-01",
		supplier: "Cleaning Services AB",
		linkedInvoice: "FA-2026-006",
		object: "OR503",
		objectId: "OR503",
		objectName: "Ombyggnad golv Uppsala",
		responsible: "Kalle Anderson",
		deficiencyType: "Service, Delivery",
		incidentDate: "2026-01-01",
		supplierContact: "Kalle Larsson",
		responseDeadline: "2026-01-25",
		deficiencyDescription: "Arbete avbröts i förtid utan skriftligt godkännande.",
		disputedAmount: 12000,
		desiredAction: "Kreditering",
		title: "Avbrutet arbete Uppsala",
		description: "Kreditering för fakturerade men ej utförda timmar.",
		status: "sent",
		documents: [],
		createdAt: "2026-01-01T13:00:00Z",
	},
];
