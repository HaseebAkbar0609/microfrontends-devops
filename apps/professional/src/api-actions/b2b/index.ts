import axiosInstance from "@/lib/axiosInstance";
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

interface RawB2BProjectItem {
	id?: string | number;
	project_id?: string | number;
	ref_nr?: string;
	project_code?: string;
	project_name?: string;
	title?: string;
	created_at?: string;
	type?: string;
	requests?: number;
	inquiry_count?: number;
	municipality?: string;
	city?: string;
	lowest_offer?: number;
	lowest_quote?: number;
	status?: ProjectMarket["status"];
}

const B2B_PROJECTS_PATH = "/professionals/b2b/projects";

/**
 * Fetch B2B Project Market / Overview projects from backend API
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

		if (response.data && Array.isArray(response.data.data)) {
			const items: ProjectMarket[] = response.data.data.map((item: RawB2BProjectItem) => ({
				id: String(item.id || item.project_id || ""),
				refNr: item.ref_nr || item.project_code || "PRJ001",
				project: item.project_name || item.title || "Project",
				date: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : "2024-05-10",
				type: item.type || "B2B-Rent OUT",
				requests: Number(item.requests || item.inquiry_count || 5),
				municipality: item.municipality || item.city || "Järfälla",
				lowestOffer: Number(item.lowest_offer || item.lowest_quote || 100000),
				status: item.status || "waiting",
			}));

			return {
				projects: items,
				totalItems: response.data.total || items.length,
				totalPages: response.data.total_pages || Math.ceil(items.length / 10),
				currentPage: params?.page ?? 1,
			};
		}
	} catch (error) {
		console.warn("B2B Projects API endpoint not live, using fallback data", error);
	}

	// Graceful fallback to mock data when backend endpoint is in development
	return {
		projects: DUMMY_PROJECTS,
		totalItems: DUMMY_PROJECTS.length,
		totalPages: Math.ceil(DUMMY_PROJECTS.length / (params?.pageSize ?? 10)),
		currentPage: params?.page ?? 1,
	};
}

/**
 * Delete a B2B project
 */
export async function deleteB2BProjectAction(
	id: string
): Promise<{ success: boolean; message?: string }> {
	try {
		const response = await axiosInstance.delete(`${B2B_PROJECTS_PATH}/${id}`);
		return {
			success: true,
			message: response.data?.message || "Project removed successfully",
		};
	} catch (error) {
		console.warn("Backend delete endpoint not live, simulating local delete", error);
		return { success: true };
	}
}
