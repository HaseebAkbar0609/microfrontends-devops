import type { CaseItem, CaseCategory } from "../types/cases.types";

export const CASES_BASE_ROUTE = "/module/financial-management/economy/cases";
export const CREATE_CASE_ROUTE = `${CASES_BASE_ROUTE}/create`;

export const STORAGE_KEY_CASES = "tfs_economy_cases_data_v6";

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
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "ongoing",
		description: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
		messages: [
			{
				id: "msg-1",
				caseId: "5000",
				author: "Stefan Eriksson",
				authorRole: "SE",
				content: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
				createdAt: "2026-05-01 | 12:00 pm",
				isInternal: false,
			},
			{
				id: "msg-2",
				caseId: "5000",
				author: "IT Support",
				authorRole: "IT",
				content: "Jag tror att ditt fönster inte fungerar, installera ett nytt fönster",
				createdAt: "2026-05-01 | 12:00 pm",
				isInternal: false,
			},
		],
		documents: [
			{
				id: "doc-1",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
			{
				id: "doc-2",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
		],
		images: [
			{
				id: "img-1",
				name: "screenshooter_png",
				date: "2026-05-01",
				fileType: "image/png",
				fileSize: "840 KB",
				category: "image",
			},
			{
				id: "img-photo",
				name: "Photo.img",
				date: "2024-05-10",
				fileType: "image/png",
				fileSize: "520 KB",
				category: "image",
			},
		],
		createdAt: "2026-01-01 12:00",
		updatedAt: "2026-05-01 12:00",
	},
	{
		id: "5001",
		caseNumber: "5000",
		title: "info",
		category: "info",
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "not_started",
		description: "info",
		messages: [],
		documents: [
			{
				id: "doc-5001-1",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
		],
		images: [],
		createdAt: "2026-01-01 11:00",
	},
	{
		id: "5002",
		caseNumber: "5000",
		title: "info",
		category: "info",
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "completed",
		description: "info",
		messages: [],
		documents: [
			{
				id: "doc-5002-1",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
		],
		images: [],
		createdAt: "2026-01-01 10:00",
	},
	{
		id: "5003",
		caseNumber: "5000",
		title: "info",
		category: "info",
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "completed",
		description: "info",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-01 09:30",
	},
	{
		id: "5004",
		caseNumber: "5000",
		title: "info",
		category: "info",
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "completed",
		description: "info",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-01 09:00",
	},
	{
		id: "5005",
		caseNumber: "5000",
		title: "info",
		category: "info",
		createdBy: "Kalle Andersson",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "completed",
		description: "info",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-01 08:30",
	},
	{
		id: "M005",
		caseNumber: "M005",
		title: "info",
		category: "info",
		createdBy: "info",
		createdRole: "Pelles Måleri",
		date: "2026-01-01",
		status: "not_started",
		description: "info",
		messages: [],
		documents: [
			{
				id: "doc-m005-1",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
			{
				id: "doc-m005-2",
				name: "filename.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "PDF",
				category: "document",
			},
		],
		images: [
			{
				id: "img-m005-1",
				name: "Photo.img",
				date: "2024-05-10",
				fileType: "image/png",
				fileSize: "520 KB",
				category: "image",
			},
		],
		createdAt: "2026-01-01 08:00",
	},
];
