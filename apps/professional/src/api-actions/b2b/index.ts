import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { ProjectMarket } from "@/features/b2b/types/projectMarket";
import type { B2BArchiveItem } from "@/features/b2b/types/archive";
import type { B2BSeeOfferDetail } from "@/features/b2b/types/seeOffer";
import { formatApiDate } from "@/utils/date";
import { b2bSeeOfferDetailSchema } from "./seeOffer";

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
	error?: string | null;
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
 * Fetch B2B Project Market / Overview projects from the backend API.
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
			},
		});

		const parsed = b2bProjectsResponseSchema.safeParse(response.data);
		if (!parsed.success) {
			return {
				projects: [],
				totalItems: 0,
				totalPages: 1,
				currentPage: params?.page ?? 1,
				error: "Unexpected response from server",
			};
		}

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
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		return {
			projects: [],
			totalItems: 0,
			totalPages: 1,
			currentPage: params?.page ?? 1,
			error: apiError.response?.data?.message || "Failed to load projects",
		};
	}
}

/**
 * Every Overview project for this company, across all backend pages.
 *
 * The Overview screen sorts, filters by status and paginates in the browser.
 * It used to fetch a single page (its own page size) and then paginate that
 * page again, so it only ever held the first 10 projects and showed
 * "Page 1 of 1" — anything past them could not be reached.
 */
export async function getAllB2BProjectsAction(
	search?: string
): Promise<{ projects: ProjectMarket[]; error: string | null }> {
	const projects: ProjectMarket[] = [];
	let page = 1;
	let totalPages = 1;

	do {
		const res = await getB2BProjectsAction({ page, pageSize: 100, search });
		if (res.error) {
			return { projects: [], error: res.error };
		}
		projects.push(...res.projects);
		totalPages = res.totalPages;
		if (res.projects.length === 0) break;
		page += 1;
	} while (page <= totalPages);

	return { projects, error: null };
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
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		return {
			success: false,
			data: null,
			error: apiError.response?.data?.message || "Failed to archive project",
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
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		return {
			success: false,
			data: null,
			error: apiError.response?.data?.message || "Failed to remove project",
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
	error?: string | null;
}

export const b2bArchiveItemSchema = z.object({
	id: z.string(),
	project_id: z.string().optional(),
	ref_nr: z.string().default(""),
	project_name: z.string().default(""),
	created_at: z.string().default(""),
	type: z.enum(["B2B-Hyra UT", "B2B-Offert", "B2B-Hyra IN"]),
	requests: z.string().default("0"),
	municipality: z.string().default(""),
	lowest_offer: z.number().default(0),
	has_offer: z.boolean().default(false),
});

export const b2bArchiveResponseSchema = z.object({
	data: z.array(b2bArchiveItemSchema).default([]),
	total: z.number().default(0),
	total_pages: z.number().default(0),
	page: z.number().default(1),
});

/** The backend's page-size ceiling for this endpoint. */
const ARCHIVE_FETCH_PAGE_SIZE = 100;

const ArchiveIdSchema = z.string().trim().min(1, "Project ID is required");

function archiveErrorMessage(error: unknown, fallback: string): string {
	const apiError = error as { response?: { data?: { message?: string } } };
	return apiError.response?.data?.message || fallback;
}

/**
 * Fetch this company's archived B2B projects.
 *
 * The Archive screen sorts, filters and paginates in the browser, so this
 * returns every archived row — walking the backend's pages — rather than one
 * page. Handing it a single page would sort and paginate only that slice, and
 * rows past the first page could never be reached.
 */
export async function getB2BArchiveProjectsAction(
	params?: ListB2BArchiveParams
): Promise<B2BArchiveListResult> {
	const items: B2BArchiveItem[] = [];
	let page = 1;
	let totalPages = 1;
	let totalItems = 0;

	try {
		do {
			const response = await axiosInstance.get(B2B_ARCHIVE_PATH, {
				params: {
					page,
					page_size: ARCHIVE_FETCH_PAGE_SIZE,
					search: params?.search || undefined,
					type: params?.type || undefined,
				},
			});

			const parsed = b2bArchiveResponseSchema.safeParse(response.data);
			if (!parsed.success) {
				return {
					items: [],
					totalItems: 0,
					totalPages: 1,
					currentPage: 1,
					error: "Unexpected response from server",
				};
			}

			for (const item of parsed.data.data) {
				items.push({
					id: item.id,
					refNr: item.ref_nr,
					projekt: item.project_name,
					datum: formatApiDate(item.created_at),
					typ: item.type,
					forfragningar: item.requests,
					kommun: item.municipality,
					lagstOffert: item.lowest_offer,
					hasOffer: item.has_offer,
				});
			}
			totalPages = parsed.data.total_pages;
			totalItems = parsed.data.total;
			page += 1;
		} while (page <= totalPages);

		return { items, totalItems, totalPages: Math.max(1, totalPages), currentPage: 1 };
	} catch (error: unknown) {
		return {
			items: [],
			totalItems: 0,
			totalPages: 1,
			currentPage: 1,
			error: archiveErrorMessage(error, "Failed to load archived projects"),
		};
	}
}

/**
 * Fetch one archived project in the See Offer shape (the backend reuses the
 * offer detail for this company's archived engagement).
 */
export async function getB2BArchiveOfferDetailAction(
	projectId: string
): Promise<ActionResult<B2BSeeOfferDetail>> {
	const parsedId = ArchiveIdSchema.safeParse(projectId);
	if (!parsedId.success) {
		return { success: false, data: null, error: "Invalid project ID" };
	}

	try {
		const response = await axiosInstance.get(`${B2B_ARCHIVE_PATH}/${parsedId.data}`);
		const parsed = b2bSeeOfferDetailSchema.safeParse(response.data?.data ?? response.data);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return { success: false, data: null, error: "Unexpected response from server" };
	} catch (error: unknown) {
		return {
			success: false,
			data: null,
			error: archiveErrorMessage(error, "Failed to load archived project"),
		};
	}
}

/**
 * Restore an archived B2B project to the state it had before it was archived.
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
	} catch (error: unknown) {
		return {
			success: false,
			data: null,
			error: archiveErrorMessage(error, "Failed to restore project"),
		};
	}
}

/**
 * Remove an archived B2B project from this company's lists.
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
				message: response.data?.message || "Project deleted",
			},
			error: null,
		};
	} catch (error: unknown) {
		return {
			success: false,
			data: null,
			error: archiveErrorMessage(error, "Failed to delete project"),
		};
	}
}

export * from "./company";
export {
	getB2BAgreementDetailAction,
	createB2BAgreementAction,
	sendB2BAgreementAction,
	uploadB2BAgreementFileAction,
	downloadB2BAgreementDocAction,
	downloadB2BAgreementTemplatesAction,
} from "./agreements";

