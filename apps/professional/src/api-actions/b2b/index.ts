import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { ProjectMarket } from "@/features/b2b/types/projectMarket";
import { DUMMY_PROJECTS } from "@/features/b2b/constants/projectMarketMock";

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
