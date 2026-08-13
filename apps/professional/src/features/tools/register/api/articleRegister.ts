import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	GetArticleListParams,
	GetArticleListResponse,
	GetSupplierArticleListParams,
	GetSupplierArticleListResponse,
	SupplierArticleDetail,
	ArticleDetail,
	ArticleImportMapping,
	ArticleImportResult,
	CreateArticleFormData,
	ArticleRow,
	SupplierArticleRow,
	PriceListRow,
} from "../types";
import { normalizeRegisterStatus } from "../utils/registerHelpers";
import { getSupplierRegisterListAPIAction } from "./supplierRegister";

const normalizeSupplierArticleStatus = (val: unknown): SupplierArticleRow["status"] => {
	if (val == null) return "unmapped";
	const s = String(val).toLowerCase();
	if (s === "mapped") return "mapped";
	return "unmapped";
};

const ARTICLE_SORT_MAP: Record<string, string> = {
	articleNo: "article_no",
	description: "benamning",
	outPriceListA: "out_price_list_a",
	calculatedCost: "calculated_cost",
	stock: "stock",
	reserved: "reserved",
	available: "available",
	stockValue: "stock_value",
	status: "status",
};

const SUPPLIER_ARTICLE_SORT_MAP: Record<string, string> = {
	supplierArticleNo: "supplier_article_no",
	supplierName: "supplier_name",
	supplierDescription: "supplier_description",
	purchasePrice: "purchase_price",
	linkedToArticle: "article_no",
	status: "status",
};

const mapArticleFromApi = (item: Record<string, unknown>): ArticleRow => ({
	id: String(item.id ?? ""),
	isFavorite: Boolean(item.is_favorite ?? item.isFavorite ?? false),
	articleNo: String(item.article_no ?? item.articleNo ?? ""),
	description: String(item.description ?? item.benamning ?? ""),
	outPriceListA: String(item.out_price_list_a ?? item.outPriceListA ?? ""),
	calculatedCost: String(item.calculated_cost ?? item.calculatedCost ?? ""),
	stock: Number(item.stock ?? 0),
	reserved: Number(item.reserved ?? 0),
	available: Number(item.available ?? 0),
	stockValue: String(item.stock_value ?? item.stockValue ?? ""),
	status: normalizeRegisterStatus(String(item.status ?? "active")),
});

const mapPriceListRowFromApi = (row: Record<string, unknown>): PriceListRow => ({
	id: String(row.id ?? ""),
	priceList: String(row.price_list ?? row.priceList ?? ""),
	benamning: String(row.benamning ?? ""),
	prisUt: String(row.pris_ut ?? row.prisUt ?? ""),
	prisKalkyl: String(row.pris_kalkyl ?? row.prisKalkyl ?? ""),
	tgProcent: String(row.tg_procent ?? row.tgProcent ?? ""),
	tbSek: String(row.tb_sek ?? row.tbSek ?? ""),
	kostnad: String(row.kostnad ?? ""),
	andringsDatum: String(row.andrings_datum ?? row.andringsDatum ?? ""),
});

const mapArticleDetailFromApi = (data: Record<string, unknown>): ArticleDetail => {
	const rawRows = Array.isArray(data.price_list_rows) ? data.price_list_rows : [];
	return {
		id: String(data.id ?? ""),
		articleNo: String(data.article_no ?? data.articleNo ?? ""),
		benamning: String(data.benamning ?? data.description ?? ""),
		ean: String(data.ean ?? ""),
		leverantor: String(data.leverantor ?? ""),
		leverantorId: String(data.leverantor_id ?? data.leverantorId ?? ""),
		husarbete: String(data.husarbete ?? ""),
		supplierArticleNo: String(data.supplier_article_no ?? data.supplierArticleNo ?? ""),
		typHusarbete: String(data.typ_husarbete ?? data.typHusarbete ?? ""),
		enhet: String(data.enhet ?? ""),
		typAvArtikel: String(data.typ_av_artikel ?? data.typAvArtikel ?? ""),
		lagerVara: String(data.lager_vara ?? data.lagerVara ?? ""),
		priceListRows: (rawRows as Record<string, unknown>[]).map(mapPriceListRowFromApi),
		forsaljning: String(data.forsaljning ?? ""),
		moms: String(data.moms ?? ""),
		forsaljningSE: String(data.forsaljning_se ?? data.forsaljningSE ?? ""),
		forsaljningEU: String(data.forsaljning_eu ?? data.forsaljningEU ?? ""),
		lagerkonto: String(data.lagerkonto ?? ""),
		forsaljningEUMoms: String(data.forsaljning_eu_moms ?? data.forsaljningEUMoms ?? ""),
		forsaljningExport: String(data.forsaljning_export ?? data.forsaljningExport ?? ""),
		inkop: String(data.inkop ?? ""),
		priserA: String(data.priser_a ?? data.priserA ?? ""),
		europrislista: String(data.europrislista ?? ""),
		kampanj: String(data.kampanj ?? ""),
		vipPriser: String(data.vip_priser ?? data.vipPriser ?? ""),
		kalkylkostnad: String(data.kalkylkostnad ?? ""),
		bestallningspunkt: String(data.bestallningspunkt ?? ""),
		iLager: String(data.i_lager ?? data.iLager ?? ""),
		vikt: String(data.vikt ?? ""),
		langd: String(data.langd ?? ""),
		bredd: String(data.bredd ?? ""),
		hojd: String(data.hojd ?? ""),
		material: String(data.material ?? ""),
		forsaljningSESkattskyldighet: String(
			data.forsaljning_se_skattskyldighet ?? data.forsaljningSESkattskyldighet ?? "",
		),
		momsSESkattskyldighet: String(
			data.moms_se_skattskyldighet ?? data.momsSESkattskyldighet ?? "",
		),
		forsaljningEUSkattskyldighet: String(
			data.forsaljning_eu_skattskyldighet ?? data.forsaljningEUSkattskyldighet ?? "",
		),
		lagerforandring: String(data.lagerforandring ?? ""),
	};
};

const mapArticleToApi = (data: CreateArticleFormData): Record<string, unknown> => ({
	article_no: data.articleNr || null,
	benamning: data.benamning,
	ean: data.ean || null,
	leverantor: data.leverantor,
	husarbete: data.husarbete || null,
	supplier_article_no: data.supplierArticleNo || null,
	typ_husarbete: data.typHusarbete || null,
	enhet: data.enhet,
	typ_av_artikel: data.typAvArtikel,
	lager_vara: data.lagerVara || null,
	forsaljning: data.forsaljning,
	moms: data.moms,
	forsaljning_se: data.forsaljningSE || null,
	forsaljning_eu: data.forsaljningEU || null,
	lagerkonto: data.lagerkonto || null,
	forsaljning_eu_moms: data.forsaljningEUMoms || null,
	forsaljning_export: data.forsaljningExport || null,
	inkop: data.inkop || null,
	priser_a: data.priserA || null,
	europrislista: data.europrislista || null,
	kampanj: data.kampanj || null,
	vip_priser: data.vipPriser || null,
	kalkylkostnad: data.kalkylkostnad || null,
	bestallningspunkt: data.bestallningspunkt || null,
	i_lager: data.iLager || null,
	vikt: data.vikt || null,
	langd: data.langd || null,
	bredd: data.bredd || null,
	hojd: data.hojd || null,
	material: data.material || null,
	forsaljning_se_skattskyldighet: data.forsaljningSESkattskyldighet,
	moms_se_skattskyldighet: data.momsSESkattskyldighet || null,
	forsaljning_eu_skattskyldighet: data.forsaljningEUSkattskyldighet || null,
	lagerforandring: data.lagerforandring || null,
	price_list_rows: (data.priceListRows ?? []).map((row) => ({
		price_list: row.priceList || null,
		benamning: row.benamning || null,
		pris_ut: row.prisUt || null,
		pris_kalkyl: row.prisKalkyl || null,
		tg_procent: row.tgProcent || null,
		tb_sek: row.tbSek || null,
		kostnad: row.kostnad || null,
		andrings_datum: row.andringsDatum || null,
	})),
});

const mapSupplierArticleFromApi = (item: Record<string, unknown>): SupplierArticleRow => ({
	id: String(item.id ?? ""),
	supplierArticleNo: String(item.supplier_article_no ?? item.supplierArticleNo ?? ""),
	supplierName: String(item.supplier_name ?? item.supplierName ?? ""),
	supplierDescription: String(
		item.supplier_description ?? item.supplierDescription ?? "",
	),
	purchasePrice: String(item.purchase_price ?? item.purchasePrice ?? ""),
	linkedToArticle: String(item.linked_article_no ?? item.linkedToArticle ?? ""),
	status: normalizeSupplierArticleStatus(item.status),
});

const mapSupplierArticleDetailFromApi = (
	data: Record<string, unknown>,
): SupplierArticleDetail => {
	const rawTiers = Array.isArray(data.discount_tiers) ? data.discount_tiers : [];
	const rawImages = Array.isArray(data.images) ? data.images : [];
	const rawDocuments = Array.isArray(data.documents) ? data.documents : [];
	return {
		id: String(data.id ?? ""),
		articleNo: String(data.article_no ?? data.articleNo ?? ""),
		articleName: String(data.article_name ?? data.articleName ?? ""),
		articleDescription: String(
			data.article_description ?? data.articleDescription ?? "",
		),
		category: String(data.category ?? ""),
		unitPrice: String(data.unit_price ?? data.unitPrice ?? ""),
		currency: String(data.currency ?? "SEK"),
		taxVat: String(data.tax_vat ?? data.taxVat ?? ""),
		discountTiers: (rawTiers as Record<string, unknown>[]).map((tier) => ({
			minQty: String(tier.min_qty ?? tier.minQty ?? ""),
			discount: String(tier.discount ?? ""),
		})),
		supplierName: String(data.supplier_name ?? data.supplierName ?? ""),
		supplierId: String(data.supplier_id ?? data.supplierId ?? ""),
		supplierArticleNo: String(
			data.supplier_article_no ?? data.supplierArticleNo ?? "",
		),
		supplierDescription: String(
			data.supplier_description ?? data.supplierDescription ?? "",
		),
		purchasePrice: String(data.purchase_price ?? data.purchasePrice ?? ""),
		leadTime: String(data.lead_time ?? data.leadTime ?? ""),
		status: (["active", "inactive", "discontinued"].includes(String(data.status ?? "").toLowerCase())
		? String(data.status).toLowerCase() as SupplierArticleDetail["status"]
		: "active"),
		weight: String(data.vikt ?? data.weight ?? ""),
		length: String(data.langd ?? data.length ?? ""),
		width: String(data.bredd ?? data.width ?? ""),
		height: String(data.hojd ?? data.height ?? ""),
		material: String(data.material ?? ""),
		linkedArticleNo: String(
			data.linked_article_no ?? data.linkedArticleNo ?? "",
		),
		images: (rawImages as Record<string, unknown>[]).map((img) => ({
			id: String(img.id ?? ""),
			url: String(img.url ?? ""),
			name: String(img.name ?? ""),
		})),
		documents: (rawDocuments as Record<string, unknown>[]).map((doc) => ({
			id: String(doc.id ?? ""),
			name: String(doc.name ?? ""),
			type: String(doc.type ?? "PDF"),
			url: String(doc.url ?? ""),
		})),
	};
};

export async function getArticleListAPIAction(
	params: GetArticleListParams = {},
): Promise<GetArticleListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params.page) queryParams.page = params.page;
	if (params.limit) queryParams.limit = params.limit;
	if (params.search) queryParams.search = params.search;
	if (params.status && params.status !== "all") queryParams.status = params.status;
	if (params.sortBy) queryParams.sort_by = ARTICLE_SORT_MAP[params.sortBy] ?? params.sortBy;
	if (params.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get(API_PATH.ARTICLES.LIST, { params: queryParams });

	const items = res.data?.data;
	if (!Array.isArray(items)) {
		throw new Error("Invalid article list response");
	}

	const total = Number(res.data?.total_items ?? items.length);
	const page = Number(res.data?.current_page ?? params.page ?? 1);
	const rawLimit = Number(res.data?.page_size ?? params.limit ?? 10);
	const limit = rawLimit > 0 ? rawLimit : (params.limit && params.limit > 0 ? params.limit : 10);

	return {
		data: (items as Record<string, unknown>[]).map(mapArticleFromApi),
		total,
		page,
		limit,
		totalPages: res.data?.total_pages != null ? Number(res.data.total_pages) : (Math.ceil(total / limit) || 1),
	};
}

export async function getSupplierArticleListAPIAction(
	params: GetSupplierArticleListParams = {},
): Promise<GetSupplierArticleListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params.page) queryParams.page = params.page;
	if (params.limit) queryParams.limit = params.limit;
	if (params.search) queryParams.search = params.search;
	if (params.supplier && params.supplier !== "all") queryParams.supplier = params.supplier;
	if (params.sortBy) {
		queryParams.sort_by = SUPPLIER_ARTICLE_SORT_MAP[params.sortBy] ?? params.sortBy;
	}
	if (params.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get(API_PATH.ARTICLES.SUPPLIER_ARTICLES_LIST, {
		params: queryParams,
	});

	const items = res.data?.data;
	if (!Array.isArray(items)) {
		throw new Error("Invalid supplier article list response");
	}

	const rawSupplierLimit = Number(res.data?.page_size ?? params.limit ?? 10);
	const supplierLimit = rawSupplierLimit > 0 ? rawSupplierLimit : params.limit && params.limit > 0 ? params.limit : 10;
	const supplierTotal = Number(res.data?.total_items ?? items.length);
	const supplierPage = Number(res.data?.current_page ?? params.page ?? 1);

	return {
		data: (items as Record<string, unknown>[]).map(mapSupplierArticleFromApi),
		total: supplierTotal,
		page: supplierPage,
		limit: supplierLimit,
		totalPages: res.data?.total_pages != null ? Number(res.data.total_pages) : (Math.ceil(supplierTotal / supplierLimit) || 1),
	};
}

export async function toggleArticleFavoriteAPIAction(id: string): Promise<void> {
	await axiosInstance.post(API_PATH.ARTICLES.TOGGLE_FAVORITE(id));
}

export async function getSupplierArticleDetailAPIAction(
	id: string,
): Promise<SupplierArticleDetail> {
	const res = await axiosInstance.get(`${API_PATH.ARTICLES.SUPPLIER_ARTICLES_LIST}/${id}`);
	const data = res.data?.data;
	if (!data) {
		throw new Error("Supplier article not found");
	}
	return mapSupplierArticleDetailFromApi(data);
}

export async function importArticleAPIAction(
	file: File,
	mapping: ArticleImportMapping,
): Promise<ArticleImportResult> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("mapping", JSON.stringify(mapping));

	const res = await axiosInstance.post(API_PATH.ARTICLES.IMPORT, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return {
		successCount: res.data?.successCount ?? 0,
		failureCount: res.data?.failureCount ?? 0,
		errors: res.data?.errors ?? [],
	};
}

export async function downloadArticleImportTemplateAPIAction(): Promise<void> {
	const res = await axiosInstance.get(`${API_PATH.ARTICLES.LIST}/import/template`, {
		responseType: "blob",
	});

	const url = URL.createObjectURL(res.data);
	const link = document.createElement("a");
	link.href = url;
	link.download = "articles_import_template.csv";
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 100);
}

export async function createArticleAPIAction(
	data: CreateArticleFormData,
): Promise<{ id: string }> {
	const payload = mapArticleToApi(data);
	const res = await axiosInstance.post(API_PATH.ARTICLES.CREATE, payload);
	return { id: String(res.data?.data?.id ?? "") };
}

export async function updateArticleAPIAction(
	id: string,
	data: CreateArticleFormData,
): Promise<{ id: string }> {
	const payload = mapArticleToApi(data);
	const res = await axiosInstance.put(API_PATH.ARTICLES.UPDATE(id), payload);
	return { id: String(res.data?.data?.id ?? id) };
}

export async function deleteArticleAPIAction(id: string): Promise<void> {
	await axiosInstance.delete(API_PATH.ARTICLES.DELETE(id));
}

export async function updateSupplierArticleAPIAction(
	id: string,
	data: Record<string, unknown>,
): Promise<{ id: string }> {
	const res = await axiosInstance.post(API_PATH.ARTICLES.SUPPLIER_ARTICLES_UPDATE, {
		id,
		...data,
	});
	return { id: String(res.data?.data?.id ?? id) };
}

export async function deleteSupplierArticleAPIAction(id: string): Promise<void> {
	await axiosInstance.delete(API_PATH.ARTICLES.SUPPLIER_ARTICLES_DELETE(id));
}

const MAX_OPTIONS_PAGES = 10;

export async function getSupplierNameOptionsAPIAction(): Promise<
	{ value: string; label: string }[]
> {
	const seen = new Set<string>();
	const options: { value: string; label: string }[] = [];
	const first = await getSupplierRegisterListAPIAction({ page: 1, limit: 100 });
	for (const row of first.data) {
		const name = row.name.trim();
		if (!name || seen.has(name)) continue;
		seen.add(name);
		options.push({ value: name, label: name });
	}
	const totalPages = Math.min(first.totalPages ?? 1, MAX_OPTIONS_PAGES);
	for (let p = 2; p <= totalPages; p++) {
		const r = await getSupplierRegisterListAPIAction({ page: p, limit: first.limit });
		for (const row of r.data) {
			const name = row.name.trim();
			if (!name || seen.has(name)) continue;
			seen.add(name);
			options.push({ value: name, label: name });
		}
	}
	return options;
}

export async function getSupplierArticleNumberOptionsAPIAction(
	supplierName?: string,
): Promise<{ value: string; label: string }[]> {
	if (!supplierName) return [];
	const seen = new Set<string>();
	const options: { value: string; label: string }[] = [];
	const first = await getSupplierArticleListAPIAction({ page: 1, limit: 100, supplier: supplierName });
	for (const row of first.data) {
		const no = row.supplierArticleNo.trim();
		if (!no || seen.has(no)) continue;
		seen.add(no);
		options.push({ value: no, label: no });
	}
	const totalPages = Math.min(first.totalPages ?? 1, MAX_OPTIONS_PAGES);
	for (let p = 2; p <= totalPages; p++) {
		const r = await getSupplierArticleListAPIAction({ page: p, limit: first.limit, supplier: supplierName });
		for (const row of r.data) {
			const no = row.supplierArticleNo.trim();
			if (!no || seen.has(no)) continue;
			seen.add(no);
			options.push({ value: no, label: no });
		}
	}
	return options;
}

export async function getArticleDetailAPIAction(id: string): Promise<ArticleDetail> {
	const res = await axiosInstance.get(API_PATH.ARTICLES.GET(id));
	const data = res.data?.data;
	if (!data) {
		throw new Error("Article not found");
	}
	return mapArticleDetailFromApi(data);
}
