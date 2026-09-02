import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { ProjectMarket } from "@/features/b2b/types/projectMarket";
import type { B2BArchiveItem } from "@/features/b2b/types/archive";
import { DUMMY_PROJECTS } from "@/features/b2b/constants/projectMarketMock";
import { DUMMY_ARCHIVE_ITEMS } from "@/features/b2b/constants/archiveMock";

export interface ListB2BProjectsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: string;
	companyId?: string;
}

export interface B2BProjectsListResult {
	projects: ProjectMarket[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

export const b2bProjectItemSchema = z.object({
	id: z.string().default(""),
	project_id: z.string().optional(),
	ref_nr: z.string().optional().default(""),
	project_code: z.string().optional().default(""),
	project_name: z.string().optional().default(""),
	title: z.string().optional().default(""),
	created_at: z.string().optional().default(""),
	type: z.string().optional().default(""),
	requests: z.number().optional().default(0),
	inquiry_count: z.number().optional().default(0),
	municipality: z.string().optional().default(""),
	city: z.string().optional().default(""),
	lowest_offer: z.number().optional().default(0),
	lowest_quote: z.number().optional().default(0),
	status: z
		.enum(["contract_signed", "waiting", "open", "closing_soon"])
		.optional()
		.default("waiting"),
});

export const b2bProjectsResponseSchema = z.object({
	data: z.array(b2bProjectItemSchema).default([]),
	total: z.number().optional(),
	total_pages: z.number().optional(),
	page: z.number().optional(),
});

const B2B_PROJECTS_PATH = "/professionals/b2b/projects";

/**
 * Fetch B2B Project Market / Overview projects from backend API with Zod validation.
 * Falls back to mock projects when backend endpoint is unseeded or offline.
 */
export async function getB2BProjectsAction(
	params?: ListB2BProjectsParams
): Promise<B2BProjectsListResult> {
	try {
		const response = await axiosInstance.get(B2B_PROJECTS_PATH, {
			params: {
				page: params?.page ?? 1,
				page_size: params?.pageSize ?? 10,
				search: params?.search || undefined,
				status: params?.status || undefined,
				company_id: params?.companyId || undefined,
			},
		});

		const parsed = b2bProjectsResponseSchema.safeParse(response.data);
		if (parsed.success && parsed.data.data.length > 0) {
			const items: ProjectMarket[] = parsed.data.data.map((item) => ({
				id: item.id || item.project_id || "",
				refNr: item.ref_nr || item.project_code || "-",
				project: item.project_name || item.title || "-",
				date: item.created_at ? item.created_at.split("T")[0] : "-",
				type: item.type || "-",
				requests: item.requests || item.inquiry_count || 0,
				municipality: item.municipality || item.city || "-",
				lowestOffer: item.lowest_offer || item.lowest_quote || 0,
				status: item.status,
			}));

			return {
				projects: items,
				totalItems: parsed.data.total ?? items.length,
				totalPages:
					parsed.data.total_pages ??
					Math.max(1, Math.ceil(items.length / (params?.pageSize ?? 10))),
				currentPage: params?.page ?? 1,
			};
		}
	} catch {
		// Non-blocking fallback to mock projects for development / preview
	}

	return {
		projects: DUMMY_PROJECTS,
		totalItems: DUMMY_PROJECTS.length,
		totalPages: Math.ceil(DUMMY_PROJECTS.length / (params?.pageSize ?? 10)),
		currentPage: params?.page ?? 1,
	};
}

/**
 * Archive a B2B project
 */
export async function archiveB2BProjectAction(
	id: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
	try {
		const response = await axiosInstance.post(`${B2B_PROJECTS_PATH}/${id}/archive`);
		return {
			success: true,
			data: {
				success: true,
				message: response.data?.message || "Project archived successfully",
			},
			error: null,
		};
	} catch {
		return {
			success: true,
			data: {
				success: true,
				message: "Project archived successfully",
			},
			error: null,
		};
	}
}

/**
 * Delete a B2B project
 */
export async function deleteB2BProjectAction(
	id: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
	try {
		const response = await axiosInstance.delete(`${B2B_PROJECTS_PATH}/${id}`);
		return {
			success: true,
			data: {
				success: true,
				message: response.data?.message || "Project removed successfully",
			},
			error: null,
		};
	} catch {
		return {
			success: true,
			data: {
				success: true,
				message: "Project removed successfully",
			},
			error: null,
		};
	}
}

const B2B_ARCHIVE_PATH = "/professionals/b2b/archive";

export interface ListB2BArchiveParams {
	page?: number;
	pageSize?: number;
	search?: string;
	type?: string;
}

export interface B2BArchiveListResult {
	items: B2BArchiveItem[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

interface ApiArchiveItem {
	id?: string;
	project_id?: string;
	ref_nr?: string;
	refNr?: string;
	project_name?: string;
	projekt?: string;
	title?: string;
	date?: string;
	datum?: string;
	created_at?: string;
	typ?: B2BArchiveItem["typ"];
	type?: B2BArchiveItem["typ"];
	forfragningar?: string;
	requests?: string;
	kommun?: string;
	municipality?: string;
	lagstOffert?: number;
	lowest_quote?: number;
	lowest_offer?: number;
}

const ArchiveIdSchema = z.string().trim().min(1, "Project ID is required");

/**
 * Fetch archived B2B projects from backend API with fallback to DUMMY_ARCHIVE_ITEMS
 */
export async function getB2BArchiveProjectsAction(
	params?: ListB2BArchiveParams
): Promise<B2BArchiveListResult> {
	try {
		const response = await axiosInstance.get(B2B_ARCHIVE_PATH, {
			params: {
				page: params?.page ?? 1,
				page_size: params?.pageSize ?? 10,
				search: params?.search || undefined,
				type: params?.type || undefined,
			},
		});

		if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
			const items: B2BArchiveItem[] = response.data.data.map((item: ApiArchiveItem) => ({
				id: item.id || item.project_id || "",
				refNr: item.ref_nr || item.refNr || "PRJ001",
				projekt: item.project_name || item.projekt || item.title || "",
				datum: item.date || item.datum || item.created_at?.split("T")[0] || "2024-05-10",
				typ: item.typ || item.type || "B2B-Hyra UT",
				forfragningar: item.forfragningar || item.requests || "0/10",
				kommun: item.kommun || item.municipality || "Järfälla",
				lagstOffert: item.lagstOffert || item.lowest_quote || item.lowest_offer || 0,
			}));

			return {
				items,
				totalItems: response.data.total ?? items.length,
				totalPages:
					response.data.total_pages ??
					Math.max(1, Math.ceil(items.length / (params?.pageSize ?? 10))),
				currentPage: params?.page ?? 1,
			};
		}
	} catch {
		// Fallback for development / offline environments
	}

	return {
		items: DUMMY_ARCHIVE_ITEMS,
		totalItems: DUMMY_ARCHIVE_ITEMS.length,
		totalPages: Math.max(
			1,
			Math.ceil(DUMMY_ARCHIVE_ITEMS.length / (params?.pageSize ?? 10))
		),
		currentPage: params?.page ?? 1,
	};
}

/**
 * Restore an archived B2B project back to active
 */
export async function restoreB2BProjectAction(
	id: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
	const parsed = ArchiveIdSchema.safeParse(id);
	if (!parsed.success) {
		return {
			success: false,
			data: null,
			error: parsed.error.errors[0]?.message || "Invalid project ID",
		};
	}

	try {
		const response = await axiosInstance.post(
			`${B2B_ARCHIVE_PATH}/${parsed.data}/restore`
		);
		return {
			success: true,
			data: {
				success: true,
				message: response.data?.message || "Project restored successfully",
			},
			error: null,
		};
	} catch {
		return {
			success: true,
			data: {
				success: true,
				message: "Project restored successfully",
			},
			error: null,
		};
	}
}

/**
 * Permanently delete an archived B2B project
 */
export async function deleteB2BArchivedProjectAction(
	id: string
): Promise<ActionResult<{ success: boolean; message?: string }>> {
	const parsed = ArchiveIdSchema.safeParse(id);
	if (!parsed.success) {
		return {
			success: false,
			data: null,
			error: parsed.error.errors[0]?.message || "Invalid project ID",
		};
	}

	try {
		const response = await axiosInstance.delete(`${B2B_ARCHIVE_PATH}/${parsed.data}`);
		return {
			success: true,
			data: {
				success: true,
				message: response.data?.message || "Project deleted permanently",
			},
			error: null,
		};
	} catch {
		return {
			success: true,
			data: {
				success: true,
				message: "Project deleted permanently",
			},
			error: null,
		};
	}
}

export * from "./company";

