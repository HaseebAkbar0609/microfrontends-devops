import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { SkallKravDoc } from "../types/kalkyl";
import { DUMMY_SKALL_KRAV_LIST } from "../constants/skallKravMock";

export interface GetSkallKravParams {
	search?: string;
	typ?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetSkallKravResponse {
	data: SkallKravDoc[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Normalizes raw API response item to typed SkallKravDoc
 */
export function mapSkallKravDocFromApi(item: Record<string, unknown>, index = 0): SkallKravDoc {
	return {
		id: String(item.id ?? item._id ?? `skk-${index + 1}`),
		datum: String(item.datum ?? item.date ?? item.createdAt ?? new Date().toISOString().slice(0, 10)),
		typ: String(item.typ ?? item.type ?? item.category ?? "Referenslista"),
		filename: String(item.filename ?? item.fileName ?? item.name ?? "filename.pdf"),
		fileUrl: typeof item.fileUrl === "string" ? item.fileUrl : typeof item.url === "string" ? item.url : undefined,
		fileSize: typeof item.fileSize === "string" ? item.fileSize : typeof item.size === "string" ? item.size : undefined,
	};
}

/**
 * Filters mock list for fallback when API is unavailable
 */
function filterMockSkallKravList(params: GetSkallKravParams = {}): SkallKravDoc[] {
	const q = params.search?.trim().toLowerCase() ?? "";
	const filterTyp = params.typ?.trim() ?? "";

	return DUMMY_SKALL_KRAV_LIST.filter((doc) => {
		if (filterTyp && filterTyp !== "all" && doc.typ !== filterTyp) {
			return false;
		}
		if (!q) return true;
		return (
			doc.typ.toLowerCase().includes(q) ||
			doc.filename.toLowerCase().includes(q) ||
			doc.datum.includes(q)
		);
	});
}

/**
 * Fetches requirement documents with fallback
 */
export async function getSkallKravListAPIAction(
	params: GetSkallKravParams = {},
): Promise<GetSkallKravResponse> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.SKALL_KRAV, {
			params: {
				search: params.search,
				typ: params.typ && params.typ !== "all" ? params.typ : undefined,
				page: params.page,
				limit: params.limit,
				sort_by: params.sortBy,
				sort_order: params.sortOrder,
			},
		});

		const payload = response.data?.data ?? response.data;
		if (Array.isArray(payload)) {
			const data = payload.map((item, idx) =>
				mapSkallKravDocFromApi(item as Record<string, unknown>, idx),
			);
			const total = Number(response.data?.total ?? data.length);
			const page = Number(response.data?.page ?? params.page ?? 1);
			const limit = Number(response.data?.limit ?? params.limit ?? 10);
			return {
				data,
				total,
				page,
				limit,
				totalPages: Math.max(1, Math.ceil(total / limit)),
			};
		}
		const fallbackData = filterMockSkallKravList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	} catch (error) {
		console.warn(
			`[SkallKrav API] GET ${API_PATH.CALCULATION.SKALL_KRAV} failed, using fallback:`,
			error instanceof Error ? error.message : error,
		);
		const fallbackData = filterMockSkallKravList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	}
}

/**
 * Uploads a new requirement document
 */
export async function uploadSkallKravDocAPIAction(
	file: File,
	typ = "Referenslista",
): Promise<{ success: boolean; item: SkallKravDoc }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("typ", typ);

	try {
		const response = await axiosInstance.post(API_PATH.CALCULATION.SKALL_KRAV, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			item: {
				id: String(data?.id ?? `skk-${Date.now()}`),
				datum: new Date().toISOString().slice(0, 10),
				typ: String(data?.typ ?? typ),
				filename: file.name,
				fileUrl: data?.fileUrl ?? URL.createObjectURL(file),
				fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
			},
		};
	} catch (error) {
		console.warn(
			`[SkallKrav API] POST ${API_PATH.CALCULATION.SKALL_KRAV} failed, saving locally:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			item: {
				id: `skk-${Date.now()}`,
				datum: new Date().toISOString().slice(0, 10),
				typ,
				filename: file.name,
				fileUrl: URL.createObjectURL(file),
				fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
			},
		};
	}
}

/**
 * Deletes a requirement document
 */
export async function deleteSkallKravDocAPIAction(id: string): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.delete(API_PATH.CALCULATION.SKALL_KRAV_DOC(id));
		return {
			success: response?.status === 200 || response?.status === 204,
		};
	} catch (error) {
		console.warn(
			`[SkallKrav API] DELETE ${API_PATH.CALCULATION.SKALL_KRAV_DOC(id)} failed:`,
			error instanceof Error ? error.message : error,
		);
		return { success: true };
	}
}
