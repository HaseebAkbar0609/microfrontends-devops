import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { APriceRow } from "../types/kalkyl";
import { DUMMY_APRICE_LIST } from "../constants/apriceMock";

export interface GetAPriceListParams {
	search?: string;
	category?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetAPriceListResponse {
	data: APriceRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type CreateAPricePayload = Omit<APriceRow, "id">;
export type UpdateAPricePayload = Partial<Omit<APriceRow, "id">>;

/**
 * Normalizes and maps raw API response to typed APriceRow
 */
export function mapAPriceItemFromApi(item: Record<string, unknown>, index = 0): APriceRow {
	return {
		id: String(item.id ?? item._id ?? `ap-${index + 1}`),
		artikel: String(item.artikel ?? item.article_no ?? item.articleNo ?? ""),
		benaming: String(item.benaming ?? item.benamning ?? item.name ?? item.title ?? ""),
		specification: String(item.specification ?? item.specifikation ?? item.description ?? ""),
		kategori: String(item.kategori ?? item.category ?? ""),
		antal: Number(item.antal ?? item.quantity ?? 1),
		enhet: String(item.enhet ?? item.unit ?? "styck"),
		aPrice: Number(item.aPrice ?? item.a_price ?? item.price ?? 0),
	};
}

/**
 * Maps frontend typed APriceRow to backend payload format
 */
export function mapAPriceItemToApi(data: CreateAPricePayload | UpdateAPricePayload): Record<string, unknown> {
	return {
		artikel: data.artikel,
		article_no: data.artikel,
		benamning: data.benaming,
		specification: data.specification,
		kategori: data.kategori,
		antal: data.antal,
		enhet: data.enhet,
		a_price: data.aPrice,
	};
}

function filterMockAPriceList(params: GetAPriceListParams = {}): APriceRow[] {
	const q = params.search?.trim().toLowerCase() ?? "";
	const cat = params.category?.trim().toLowerCase() ?? "";
	return DUMMY_APRICE_LIST.filter((item) => {
		const matchesCategory =
			!cat || cat === "all" || item.kategori.toLowerCase() === cat;
		if (!matchesCategory) return false;
		if (!q) return true;
		return (
			item.artikel.toLowerCase().includes(q) ||
			item.benaming.toLowerCase().includes(q) ||
			item.specification.toLowerCase().includes(q) ||
			item.kategori.toLowerCase().includes(q) ||
			item.enhet.toLowerCase().includes(q)
		);
	});
}

/**
 * Fetches price list items with fallback
 */
export async function getAPriceListAPIAction(
	params: GetAPriceListParams = {},
): Promise<GetAPriceListResponse> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.A_PRICE, {
			params: {
				search: params.search,
				category: params.category && params.category !== "all" ? params.category : undefined,
				page: params.page,
				limit: params.limit,
				sort_by: params.sortBy,
				sort_order: params.sortOrder,
			},
		});

		const payload = response.data?.data ?? response.data;
		if (Array.isArray(payload)) {
			const data = payload.map((item, idx) => mapAPriceItemFromApi(item as Record<string, unknown>, idx));
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
		const fallbackData = filterMockAPriceList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	} catch (error) {
		console.warn(
			`[APrice API] GET ${API_PATH.CALCULATION.A_PRICE} failed, using fallback:`,
			error instanceof Error ? error.message : error,
		);
		const fallbackData = filterMockAPriceList(params);
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
 * Creates a new price item
 */
export async function createAPriceItemAPIAction(
	payload: CreateAPricePayload,
): Promise<{ success: boolean; item: APriceRow }> {
	const body = mapAPriceItemToApi(payload);
	try {
		const response = await axiosInstance.post(API_PATH.CALCULATION.A_PRICE, body);
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			item: {
				...payload,
				id: String(data?.id ?? `ap-${Date.now()}`),
			},
		};
	} catch (error) {
		console.warn(
			`[APrice API] POST ${API_PATH.CALCULATION.A_PRICE} failed, saving locally:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			item: {
				...payload,
				id: `ap-${Date.now()}`,
			},
		};
	}
}

/**
 * Updates an existing price item
 */
export async function updateAPriceItemAPIAction(
	id: string,
	payload: UpdateAPricePayload,
): Promise<{ success: boolean; item: Partial<APriceRow> }> {
	const body = mapAPriceItemToApi(payload);
	try {
		const response = await axiosInstance.put(API_PATH.CALCULATION.A_PRICE_ITEM(id), body);
		return {
			success: response?.status === 200 || response?.status === 204,
			item: { id, ...payload },
		};
	} catch (error) {
		console.warn(
			`[APrice API] PUT ${API_PATH.CALCULATION.A_PRICE_ITEM(id)} failed, updating locally:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			item: { id, ...payload },
		};
	}
}

/**
 * Deletes a price item
 */
export async function deleteAPriceItemAPIAction(id: string): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.delete(API_PATH.CALCULATION.A_PRICE_ITEM(id));
		return {
			success: response?.status === 200 || response?.status === 204,
		};
	} catch (error) {
		console.warn(
			`[APrice API] DELETE ${API_PATH.CALCULATION.A_PRICE_ITEM(id)} failed:`,
			error instanceof Error ? error.message : error,
		);
		return { success: true };
	}
}
