import type { RecordFileRules } from "@/features/project/shared/recordFiles";
import { acceptAttribute } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { CaseItem, CaseCategory, CaseStatus } from "../types/cases.types";

export const CASES_BASE_ROUTE = "/module/financial-management/economy/cases";
/** Prognos shows the same register under its own tab. */
export const FORECAST_CASES_BASE_ROUTE = "/module/financial-management/forecast/cases";

/**
 * Where the register's screens live, built in one place so no component writes
 * a path. Ekonomi's call sites pass nothing; Prognos passes its own base.
 */
export function casesRoutes(basePath: string = CASES_BASE_ROUTE) {
	return {
		list: basePath,
		create: `${basePath}/create`,
		import: `${basePath}/import`,
		detail: (id: string) => `${basePath}/${id}`,
		conversation: (id: string) => `${basePath}/${id}/conversation`,
		/** Editing reuses the create screen, told which case to load. */
		edit: (id: string) => `${basePath}/create?edit=${id}`,
	};
}

export const STORAGE_KEY_CASES = "tfs_economy_cases_data_v8";

/**
 * A case's description, its creator and its conversation — the parts that name
 * people and carry their words. They are kept out of `localStorage` (AGENTS.md
 * rule 6) and held here instead: encoded, in `sessionStorage`, so a reply
 * survives a reload without leaving plain text on disk.
 */
export const STORAGE_KEY_CASE_THREADS = "tfs_economy_case_threads_v1";

/** What a reply may carry. */
export const CASE_MESSAGE_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".doc": "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".xls": "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	},
	maxBytes: 10 * 1024 * 1024,
	/** Files one reply may carry. */
	maxCount: 5,
};

export const CASE_MESSAGE_FILE_ACCEPT = acceptAttribute(CASE_MESSAGE_FILE_RULES.types);

/**
 * Each status's label and the colours it wears. One map, so the row's badge,
 * the detail header's pill and the register's sorting always agree.
 */
export const CASE_STATUS_META: Record<
	CaseStatus,
	{ labelKey: TranslationKeys; bgClass: string; textClass: string; hoverClass: string }
> = {
	not_started: {
		labelKey: localizationConstants.casesStatusNotStarted,
		bgClass: "bg-sky-400",
		textClass: "text-white",
		hoverClass: "hover:bg-sky-500",
	},
	ongoing: {
		labelKey: localizationConstants.casesStatusOngoing,
		bgClass: "bg-orange-500",
		textClass: "text-white",
		hoverClass: "hover:bg-orange-600",
	},
	completed: {
		labelKey: localizationConstants.casesStatusCompleted,
		bgClass: "bg-emerald-500",
		textClass: "text-white",
		hoverClass: "hover:bg-emerald-600",
	},
	closed: {
		labelKey: localizationConstants.casesStatusClosed,
		bgClass: "bg-slate-500",
		textClass: "text-white",
		hoverClass: "hover:bg-slate-600",
	},
	rejected: {
		labelKey: localizationConstants.casesStatusRejected,
		bgClass: "bg-rose-500",
		textClass: "text-white",
		hoverClass: "hover:bg-rose-600",
	},
};

export const DEFAULT_CASES_PAGE_SIZE = 10;
export const CASES_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const DEFAULT_CREATOR_ROLE = "Arbetsledare";

/**
 * What a case may carry. The documents card tells the reader "PNG-, JPG- och
 * PDF-filer är tillåtna", so that is what the picker accepts — the two used to
 * disagree.
 */
export const CASE_DOCUMENT_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
	},
	maxBytes: 10 * 1024 * 1024,
	maxCount: 10,
};

export const CASE_IMAGE_FILE_RULES: RecordFileRules = {
	types: {
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
	},
	maxBytes: 10 * 1024 * 1024,
	maxCount: 10,
};

export const CASE_DOCUMENT_FILE_ACCEPT = acceptAttribute(CASE_DOCUMENT_FILE_RULES.types);
export const CASE_IMAGE_FILE_ACCEPT = acceptAttribute(CASE_IMAGE_FILE_RULES.types);

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
		date: "2026-01-01",
		status: "ongoing",
		description: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
		messages: [
			{
				id: "msg-5000-1",
				caseId: "5000",
				author: "Stefan Eriksson",
				authorRole: "SE",
				content: "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
				createdAt: "2026-05-01 | 12:00 pm",
				isInternal: false,
			},
			{
				id: "msg-5000-2",
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
				id: "doc-5000-1",
				name: "felrapport-skärm.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "140 KB",
				category: "document",
			},
			{
				id: "doc-5000-2",
				name: "maskinspecifikation.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "85 KB",
				category: "document",
			},
		],
		images: [
			{
				id: "img-5000-1",
				name: "screenshooter_png",
				date: "2026-05-01",
				fileType: "image/png",
				fileSize: "840 KB",
				category: "image",
			},
			{
				id: "img-5000-2",
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
		caseNumber: "5001",
		title: "Fakturaunderlag saknas för mars",
		category: "billing",
		createdBy: "Anna Lind",
		createdRole: "Ekonomi",
		date: "2026-01-02",
		status: "not_started",
		description: "Underlag för underleverantörsakuror behöver kompletteras innan betalning.",
		messages: [],
		documents: [
			{
				id: "doc-5001-1",
				name: "fakturaunderlag.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "210 KB",
				category: "document",
			},
		],
		images: [],
		createdAt: "2026-01-02 11:00",
	},
	{
		id: "5002",
		caseNumber: "5002",
		title: "Uppdatering av systembehörigheter",
		category: "administrative",
		createdBy: "Erik Karlsson",
		createdRole: "Projektledare",
		date: "2026-01-03",
		status: "completed",
		description: "Behörighetsändring för ny projektpersonal är utförd och verifierad.",
		messages: [],
		documents: [
			{
				id: "doc-5002-1",
				name: "behörighetsmatris.pdf",
				date: "2024-05-10",
				fileType: "application/pdf",
				fileSize: "95 KB",
				category: "document",
			},
		],
		images: [],
		createdAt: "2026-01-03 10:00",
	},
	{
		id: "5003",
		caseNumber: "5003",
		title: "Problem med nätverksanslutning",
		category: "technical",
		createdBy: "Johan Berg",
		createdRole: "Installatör",
		date: "2026-01-04",
		status: "ongoing",
		description: "VPN-kopplingen bryts med jämna mellanrum från hemmakontoret.",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-04 09:30",
	},
	{
		id: "5004",
		caseNumber: "5004",
		title: "Fråga angående momsdeklaration",
		category: "billing",
		createdBy: "Maria Holm",
		createdRole: "Redovisning",
		date: "2026-01-05",
		status: "completed",
		description: "Avstämning mot Skatteverkets preliminära momsredovisning.",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-05 09:00",
	},
	{
		id: "5005",
		caseNumber: "5005",
		title: "Licensförnyelse programvara",
		category: "support",
		createdBy: "Lars Nilsson",
		createdRole: "IT",
		date: "2026-01-06",
		status: "completed",
		description: "Årlig licensförnyelse har slutförts för samtliga moduler.",
		messages: [],
		documents: [],
		images: [],
		createdAt: "2026-01-06 08:30",
	},
];
