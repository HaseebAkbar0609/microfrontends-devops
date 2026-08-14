import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	PriceListRegisterRow,
	GetPriceListRegisterListParams,
	GetPriceListRegisterListResponse,
	CreatePriceListFormData,
	PriceListArticleRow,
	PriceListDetail,
} from "../types";

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

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

const PRICE_LIST_SORT_MAP: Record<string, string> = {
	prislista: "name",
	kategori: "category",
	valuta: "currency",
	giltigPeriod: "valid_from",
	skapadAv: "created_by",
	senastUppdaterad: "updated_at",
	kopplad: "linked",
	datum: "date",
	kod: "kod",
	status: "status",
};

function toSortBy(sortBy?: string): string | undefined {
	if (!sortBy) return undefined;
	return PRICE_LIST_SORT_MAP[sortBy] ?? sortBy;
}

const mapPriceListFromApi = (item: Record<string, unknown>): PriceListRegisterRow => ({
	id: String(item.id ?? ""),
	isFavorite: Boolean(item.is_favorite ?? false),
	kod: String(item.kod ?? ""),
	prislista: String(item.name ?? ""),
	kategori: String(item.category ?? ""),
	valuta: String(item.currency ?? ""),
	status: (item.status as PriceListRegisterRow["status"]) ?? "active",
	giltigFran: String(item.valid_from ?? ""),
	giltigTill: String(item.valid_to ?? ""),
	kopplad: Number(item.linked ?? 0),
	skapadAv: String(item.created_by ?? ""),
	datum: String(item.date ?? item.created_at ?? ""),
	senastUppdaterad: String(item.updated_at ?? ""),
});

export async function getPriceListRegisterListAPIAction(
	params?: GetPriceListRegisterListParams,
): Promise<GetPriceListRegisterListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	const sortBy = toSortBy(params?.sortBy);
	if (sortBy) queryParams.sort_by = sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	if (params?.currency && params.currency !== "all") queryParams.currency = params.currency;
	if (params?.category && params.category !== "all") queryParams.category = params.category;

	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
		API_PATH.PRICE_LISTS.LIST,
		{ params: queryParams },
	);
	const items = Array.isArray(res.data?.data) ? res.data.data : [];
	const total = res.data?.total_items ?? items.length;
	const limit = res.data?.page_size ?? params?.limit ?? 10;
	return {
		data: items.map(mapPriceListFromApi),
		total,
		page: res.data?.current_page ?? params?.page ?? 1,
		limit,
		totalPages: res.data?.total_pages ?? (Math.ceil(total / limit) || 1),
	};
}

export async function togglePriceListFavoriteAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.post(API_PATH.PRICE_LISTS.TOGGLE_FAVORITE(id));
		return true;
	} catch {
		return false;
	}
}

export async function updatePriceListAPIAction(data: PriceListUpdateData): Promise<boolean> {
	await axiosInstance.put(API_PATH.PRICE_LISTS.UPDATE(data.id), {
		base_calculation: data.baseCalculation,
		update_price_list: data.updatePriceList,
		calculation: data.calculation,
		rounding: data.rounding,
		increase_decrease: data.increaseDecrease,
		percentage: data.percentage,
	});
	return true;
}

export async function deletePriceListAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.delete(API_PATH.PRICE_LISTS.DELETE(id));
		return true;
	} catch {
		return false;
	}
}

const mapPriceListToApi = (data: CreatePriceListFormData): Record<string, unknown> => ({
	kod: data.kod || null,
	name: data.benamning,
	date: data.datum || null,
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
	const res = await axiosInstance.post(API_PATH.PRICE_LISTS.CREATE, payload);
	return { id: String(res.data?.data?.id ?? "") };
}

const mapArticleFromApi = (item: Record<string, unknown>): PriceListArticleRow => ({
	id: String(item.id ?? ""),
	articleNo: String(item.article_no ?? ""),
	benamning: String(item.benamning ?? ""),
	outPriceListA: String(item.out_price_list_a ?? "0"),
	customPrice: String(item.out_price_list_a ?? "0"),
	calcCost: String(item.calculated_cost ?? "0"),
	stock: Number(item.stock ?? 0),
	reserved: Number(item.reserved ?? 0),
	selected: false,
});

export async function getAvailableArticlesAPIAction(params?: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<{ data: PriceListArticleRow[]; total: number; page: number; limit: number; totalPages: number }> {
	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(API_PATH.ARTICLES.LIST, {
		params: {
			page: params?.page ?? 1,
			limit: params?.limit ?? 50,
			search: params?.search ?? "",
		},
	});
	const items = Array.isArray(res.data?.data) ? res.data.data : [];
	const total = res.data?.total_items ?? items.length;
	const limit = res.data?.page_size ?? params?.limit ?? 50;
	return {
		data: items.map(mapArticleFromApi),
		total,
		page: res.data?.current_page ?? params?.page ?? 1,
		limit,
		totalPages: res.data?.total_pages ?? (Math.ceil(total / limit) || 1),
	};
}

const mapArticleDetailFromApi = (item: Record<string, unknown>): PriceListDetail["articles"][number] => ({
	id: String(item.id ?? ""),
	isFavorite: false,
	articleNo: String(item.article_no ?? ""),
	benamning: String(item.benamning ?? ""),
	utprislistaA: String(item.price ?? item.out_price_list_a ?? "0"),
	kalkylKostnad: String(item.calculated_cost ?? item.calc_cost ?? "0"),
	lager: Number(item.stock ?? 0),
	reserverat: Number(item.reserved ?? 0),
	disponibelt: Number(item.available ?? 0),
	lagervarde: String(item.stock_value ?? "0"),
	land: String(item.land ?? item.country ?? ""),
	status: item.status === "inactive" ? "inactive" : "active",
});

export async function getPriceListDetailAPIAction(id: string): Promise<PriceListDetail | null> {
	const res = await axiosInstance.get(API_PATH.PRICE_LISTS.GET(id));
	const data = res.data?.data;
	if (!data) return null;
	return {
		id: String(data?.id ?? ""),
		kod: String(data?.kod ?? ""),
		benamning: String(data?.name ?? ""),
		datum: String(data?.date ?? ""),
		giltigFran: String(data?.valid_from ?? ""),
		giltigTill: String(data?.valid_to ?? ""),
		skapadAv: String(data?.created_by ?? ""),
		valuta: String(data?.currency ?? ""),
		kommentar: String(data?.comment ?? ""),
		kategori: String(data?.category ?? ""),
		enhet: String(data?.unit ?? ""),
		kund: Array.isArray(data?.customer) ? data.customer.map(String) : data?.customer ? [String(data.customer)] : [],
		leverantor: Array.isArray(data?.supplier)
			? data.supplier.map(String)
			: data?.supplier
				? [String(data.supplier)]
				: [],
		articles: Array.isArray(data?.articles)
			? (data.articles as Record<string, unknown>[]).map(mapArticleDetailFromApi)
			: [],
		baseCalculation: String(data?.base_calculation ?? ""),
		updatePriceList: String(data?.update_price_list ?? ""),
		calculation: String(data?.calculation ?? ""),
		rounding: String(data?.rounding ?? ""),
		increaseDecrease: String(data?.increase_decrease ?? ""),
		percentage: String(data?.percentage ?? ""),
	};
}