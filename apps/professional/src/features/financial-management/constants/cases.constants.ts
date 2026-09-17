import type { CaseItem, CaseCategory } from "../types/cases.types";

export const CASES_BASE_ROUTE = "/module/financial-management/economy/cases";
export const CREATE_CASE_ROUTE = `${CASES_BASE_ROUTE}/create`;

export const STORAGE_KEY_CASES = "tfs_economy_cases_data_v5";

export const DEFAULT_CASES_PAGE_SIZE = 10;
export const CASES_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const DEFAULT_CREATOR_ROLE = "Arbetsledare";

export const ALLOWED_CASE_FILE_EXTENSIONS = ".png, .jpg, .jpeg, .pdf, .docx, .xlsx";
export const ALLOWED_CASE_IMAGE_EXTENSIONS = ".png, .jpg, .jpeg, .webp";

export const CASE_CATEGORIES: readonly CaseCategory[] = [
	"info",
	"billing",
	"support",
	"technical",
	"administrative",
	"other",
] as const;

export const SEED_CASES: CaseItem[] = [
	{
		id: "5000",
		caseNumber: "5000",
		title: "Min laptop startar inte",
		category: "info",
		createdBy: "Kalle Svensson",
		createdRole: "Pelles Måleri",
		date: "2026-05-01",
		status: "completed",
		description: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
		messages: [
			{
				id: "msg-1",
				caseId: "5000",
				author: "Stefan Eriksson",
				authorRole: "Kund",
				content: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
				createdAt: "2026-05-01 | 12:00 pm",
				isInternal: false,
			},
			{
				id: "msg-2",
				caseId: "5000",
				author: "IT Support",
				authorRole: "IT Support",
				content: "Jag tror att ditt fönster inte fungerar, installera ett nytt fönster",
				createdAt: "2026-05-01 | 12:00 pm",
				isInternal: false,
			},
		],
		documents: [],
		images: [
			{
				id: "img-1",
				name: "screeshoterror..png",
				date: "2026-05-01",
				fileType: "image/png",
				fileSize: "840 KB",
				category: "image",
			},
		],
		createdAt: "2026-05-01 12:00",
		updatedAt: "2026-05-01 12:00",
	},
	{
		id: "M101",
		caseNumber: "M101",
		title: "info",
		category: "info",
		createdBy: "info",
		createdRole: "info",
		date: "2024-05-10",
		status: "not_started",
		description: "info",
		messages: [
			{
				id: "msg-m101",
				caseId: "M101",
				author: "info",
				authorRole: "info",
				content: "info",
				createdAt: "2024-05-10 | 10:00 am",
				isInternal: false,
			},
		],
		documents: [
			{
				id: "doc-m1",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
			{
				id: "doc-m2",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
		],
		images: [
			{
				id: "img-photo",
				name: "Photo.img",
				date: "2024-05-10",
				fileType: "image/png",
				fileSize: "520 KB",
				category: "image",
			},
		],
		createdAt: "2024-05-10 10:00",
		updatedAt: "2024-05-10 10:00",
	},
	{
		id: "5001",
		caseNumber: "5001",
		title: "Avvikelse på leverantörsfaktura",
		category: "billing",
		createdBy: "Kalle Andersson",
		createdRole: "Arbetsledare",
		date: "2025-01-01",
		status: "not_started",
		description: "Avvikelse identifierad mellan beställningsorder och inkommande faktura från leverantör.",
		messages: [],
		documents: [
			{
				id: "doc-3",
				name: "Faktura_underlag.pdf",
				date: "2025-01-01",
				fileType: "application/pdf",
				fileSize: "1.8 MB",
				category: "document",
			},
		],
		images: [],
		createdAt: "2025-01-01 11:00",
	},
	{
		id: "5002",
		caseNumber: "5002",
		title: "Supportärende gällande integration",
		category: "support",
		createdBy: "Kalle Andersson",
		createdRole: "Arbetsledare",
		date: "2026-01-01",
		status: "ongoing",
		description: "Synkronisering med bankgiro slutförd utan felaktigheter.",
		messages: [
			{
				id: "msg-3",
				caseId: "5002",
				author: "Support Team",
				authorRole: "IT",
				content: "Synkroniseringen har genomförts och verifierats framgångsrikt.",
				createdAt: "2026-01-01 14:00",
			},
		],
		documents: [],
		images: [],
		createdAt: "2026-01-01 08:30",
		updatedAt: "2026-01-01 14:00",
	},
	{
		id: "5003",
		caseNumber: "5003",
		title: "Teknisk fråga kring projektfiler",
		category: "technical",
		createdBy: "Kalle Andersson",
		createdRole: "Arbetsledare",
		date: "2026-01-02",
		status: "ongoing",
		description: "Fråga angående export av ritningar och bilagor i systemet.",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-02 10:00",
	},
];
