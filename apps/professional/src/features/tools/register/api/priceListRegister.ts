import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	PriceListRegisterRow,
	GetPriceListRegisterListParams,
	GetPriceListRegisterListResponse,
	CreatePriceListFormData,
	PriceListArticleRow,
} from "../types";
import { MOCK_PRICE_LIST_REGISTER_DATA, MOCK_ARTICLE_DATA } from "../mockdata/priceLists";

export type { PriceListRegisterRow };

export type PriceListUpdateData = {
	id: string;
	baseCalculation?: string;
	updatePriceList?: string;
	calculation?: string;
	rounding?: string;
	increaseDecrease?: string;
	percentage?: string;
};

const mapPriceListFromApi = (item: Record<string, unknown>): PriceListRegisterRow => ({
	id: String(item.id ?? ""),
	isFavorite: Boolean(item.is_favorite ?? item.isFavorite ?? false),
	kod: String(item.kod ?? item.code ?? ""),
	prislista: String(item.prislista ?? item.name ?? ""),
	kategori: String(item.kategori ?? item.category ?? ""),
	kopplad: Number(item.kopplad ?? item.linked ?? 0),
	skapadAv: String(item.skapad_av ?? item.created_by ?? ""),
	datum: String(item.datum ?? item.date ?? ""),
	senastUppdaterad: String(item.senast_uppdaterad ?? item.last_updated ?? ""),
});

export async function getPriceListRegisterListAPIAction(
	params?: GetPriceListRegisterListParams,
): Promise<GetPriceListRegisterListResponse> {
	try {
		const queryParams: Record<string, string | number> = {};
		if (params?.page) queryParams.page = params.page;
		if (params?.limit) queryParams.limit = params.limit;
		if (params?.search) queryParams.search = params.search;
		if (params?.sortBy) queryParams.sort_by = params.sortBy;
		if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

		const res = await axiosInstance.get(API_PATH.PRICE_LISTS.LIST, { params: queryParams });
		const data = res.data?.data;

		if (data?.items) {
			return {
				data: (data.items as Record<string, unknown>[]).map(mapPriceListFromApi),
				total: data?.total ?? 0,
				page: data?.page ?? params?.page ?? 1,
				limit: data?.limit ?? params?.limit ?? 10,
				totalPages: Math.ceil((data?.total ?? 0) / (data?.limit ?? params?.limit ?? 10)),
			};
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("[getPriceListRegisterListAPIAction] API request failed, falling back to mock data:", error);
		}
	}

	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 10);
	const search = params?.search?.toLowerCase().trim();
	const sortBy = params?.sortBy;
	const sortOrder = params?.sortOrder;

	let filtered = [...MOCK_PRICE_LIST_REGISTER_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.kod.toLowerCase().includes(search) ||
				item.prislista.toLowerCase().includes(search) ||
				item.kategori.toLowerCase().includes(search) ||
				item.skapadAv.toLowerCase().includes(search),
		);
	}

	if (sortBy) {
		filtered.sort((a, b) => {
			const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? "");
			const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? "");
			const cmp = aVal.localeCompare(bVal);
			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const total = filtered.length;
	const totalPages = Math.ceil(total / limit) || 1;
	const startIndex = (page - 1) * limit;
	const paginatedData = filtered.slice(startIndex, startIndex + limit);

	return {
		data: paginatedData,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function togglePriceListFavoriteAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.post(API_PATH.PRICE_LISTS.TOGGLE_FAVORITE(id));
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("[togglePriceListFavoriteAPIAction] API request failed:", error);
		}
		const idx = MOCK_PRICE_LIST_REGISTER_DATA.findIndex((item) => item.id === id);
		if (idx !== -1) {
			MOCK_PRICE_LIST_REGISTER_DATA[idx].isFavorite = !MOCK_PRICE_LIST_REGISTER_DATA[idx].isFavorite;
		}
		return true;
	}
}

export async function updatePriceListAPIAction(data: PriceListUpdateData): Promise<boolean> {
	try {
		await axiosInstance.put(API_PATH.PRICE_LISTS.UPDATE(data.id), {
			base_calculation: data.baseCalculation,
			update_price_list: data.updatePriceList,
			calculation: data.calculation,
			rounding: data.rounding,
			increase_decrease: data.increaseDecrease,
			percentage: data.percentage,
		});
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("[updatePriceListAPIAction] API request failed:", error);
		}
		return false;
	}
}

export async function deletePriceListAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.delete(API_PATH.PRICE_LISTS.DELETE(id));
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.warn("[deletePriceListAPIAction] API request failed:", error);
		}
		return false;
	}
}

const mapPriceListToApi = (data: CreatePriceListFormData): Record<string, unknown> => ({
	kod: data.kod || null,
	name: data.benamning,
	date: data.datum,
	valid_from: data.giltigFran || null,
	valid_to: data.giltigTill || null,
	created_by: data.skapadAv,
	currency: data.valuta || "SEK",
	comment: data.kommentar || null,
	category: data.kategori,
	unit: data.enhet,
	customer: data.kund || null,
	supplier: data.leverantor || null,
});

export async function createPriceListAPIAction(
	data: CreatePriceListFormData,
	selectedArticles: PriceListArticleRow[],
): Promise<{ id: string }> {
	const payload = {
		...mapPriceListToApi(data),
		articles: selectedArticles.map((a) => ({
			article_id: a.id,
			price: a.customPrice || a.outPriceListA,
		})),
	};
	try {
		const res = await axiosInstance.post(API_PATH.PRICE_LISTS.CREATE, payload);
		return { id: String(res.data?.data?.id ?? "") };
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			const sanitizedMessage = error instanceof Error ? error.message : String(error);
			console.warn("[createPriceListAPIAction] API request failed:", sanitizedMessage);
		}
		throw error;
	}
}

const mapArticleFromApi = (item: Record<string, unknown>): PriceListArticleRow => ({
	id: String(item.id ?? ""),
	articleNo: String(item.article_no ?? item.articleNo ?? ""),
	benamning: String(item.description ?? item.benamning ?? ""),
	outPriceListA: String(item.out_price_list_a ?? item.outPriceListA ?? "0"),
	customPrice: String(item.custom_price ?? item.out_price_list_a ?? item.outPriceListA ?? "0"),
	calcCost: String(item.calculated_cost ?? item.calculatedCost ?? "0"),
	stock: Number(item.stock ?? 0),
	reserved: Number(item.reserved ?? 0),
	selected: false,
});

export async function getAvailableArticlesAPIAction(params?: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<{ data: PriceListArticleRow[]; total: number; page: number; limit: number; totalPages: number }> {
	try {
		const res = await axiosInstance.get(API_PATH.ARTICLES.LIST, {
			params: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 50,
				search: params?.search ?? "",
			},
		});
		const items = res.data?.data?.items ?? res.data?.data;
		if (Array.isArray(items)) {
			return {
				data: items.map(mapArticleFromApi),
				total: res.data?.data?.total ?? items.length,
				page: res.data?.data?.page ?? params?.page ?? 1,
				limit: res.data?.data?.limit ?? params?.limit ?? 50,
				totalPages: res.data?.data?.totalPages ?? 1,
			};
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			const sanitizedMessage = error instanceof Error ? error.message : String(error);
			console.warn("[getAvailableArticlesAPIAction] API request failed, falling back to mock data:", sanitizedMessage);
		}
	}

	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 50);
	const search = params?.search?.toLowerCase().trim();
	let filtered = [...MOCK_ARTICLE_DATA];
	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.articleNo.toLowerCase().includes(search) ||
				item.benamning.toLowerCase().includes(search),
		);
	}
	const total = filtered.length;
	const totalPages = Math.ceil(total / limit) || 1;
	const startIndex = (page - 1) * limit;
	const paginatedData = filtered.slice(startIndex, startIndex + limit);
	return { data: paginatedData, total, page, limit, totalPages };
}
