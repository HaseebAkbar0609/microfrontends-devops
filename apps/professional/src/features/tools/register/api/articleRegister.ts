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
} from "../types";
import {
	MOCK_ARTICLE_DATA,
	MOCK_SUPPLIER_ARTICLE_DATA,
	MOCK_SUPPLIER_ARTICLE_DETAIL,
	MOCK_ARTICLE_DETAIL,
} from "../mockdata/articles";

export async function getArticleListAPIAction(
	params: GetArticleListParams = {},
): Promise<GetArticleListResponse> {
	const { page = 1, limit = 10, search = "", status = "all", sortBy, sortOrder } = params;

	try {
		const res = await axiosInstance.get(API_PATH.ARTICLES.LIST, {
			params: { page, limit, search, status, sortBy, sortOrder },
		});
		if (res.data?.data) {
			return {
				data: res.data.data,
				total: res.data.total ?? res.data.data.length,
				page: res.data.page ?? page,
				limit: res.data.limit ?? limit,
				totalPages: res.data.totalPages ?? 1,
			};
		}
	} catch {
		// Fallback to client-side filtered mock data
	}

	let filtered = [...MOCK_ARTICLE_DATA];

	if (search.trim()) {
		const q = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.articleNo.toLowerCase().includes(q) ||
				item.description.toLowerCase().includes(q),
		);
	}

	if (status !== "all") {
		filtered = filtered.filter((item) => item.status === status);
	}

	if (sortBy) {
		filtered.sort((a, b) => {
			const aVal = (a as unknown as Record<string, string | number>)[sortBy] ?? "";
			const bVal = (b as unknown as Record<string, string | number>)[sortBy] ?? "";

			let cmp = 0;
			if (typeof aVal === "number" && typeof bVal === "number") {
				cmp = aVal - bVal;
			} else {
				cmp = String(aVal).localeCompare(String(bVal));
			}

			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
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

export async function getSupplierArticleListAPIAction(
	params: GetSupplierArticleListParams = {},
): Promise<GetSupplierArticleListResponse> {
	const { page = 1, limit = 10, search = "", supplier = "all", sortBy, sortOrder } = params;

	try {
		const res = await axiosInstance.get(API_PATH.ARTICLES.SUPPLIER_ARTICLES_LIST, {
			params: { page, limit, search, supplier, sortBy, sortOrder },
		});
		if (res.data?.data) {
			return {
				data: res.data.data,
				total: res.data.total ?? res.data.data.length,
				page: res.data.page ?? page,
				limit: res.data.limit ?? limit,
				totalPages: res.data.totalPages ?? 1,
			};
		}
	} catch {
		// Fallback to client-side filtered mock data
	}

	let filtered = [...MOCK_SUPPLIER_ARTICLE_DATA];

	if (search.trim()) {
		const q = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.supplierArticleNo.toLowerCase().includes(q) ||
				item.supplierName.toLowerCase().includes(q) ||
				item.supplierDescription.toLowerCase().includes(q),
		);
	}

	if (supplier !== "all") {
		filtered = filtered.filter(
			(item) => item.supplierName.toLowerCase() === supplier.toLowerCase(),
		);
	}

	if (sortBy) {
		filtered.sort((a, b) => {
			const aVal = (a as unknown as Record<string, string | number>)[sortBy] ?? "";
			const bVal = (b as unknown as Record<string, string | number>)[sortBy] ?? "";

			let cmp = 0;
			if (typeof aVal === "number" && typeof bVal === "number") {
				cmp = aVal - bVal;
			} else {
				cmp = String(aVal).localeCompare(String(bVal));
			}

			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
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

export async function toggleArticleFavoriteAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.post(API_PATH.ARTICLES.TOGGLE_FAVORITE(id));
		return true;
	} catch {
		const idx = MOCK_ARTICLE_DATA.findIndex((item) => item.id === id);
		if (idx !== -1) {
			MOCK_ARTICLE_DATA[idx].isFavorite = !MOCK_ARTICLE_DATA[idx].isFavorite;
		}
		return true;
	}
}

export async function getSupplierArticleDetailAPIAction(
	id: string,
): Promise<SupplierArticleDetail | null> {
	try {
		const res = await axiosInstance.get(`${API_PATH.ARTICLES.SUPPLIER_ARTICLES_LIST}/${id}`);
		if (res.data?.data) {
			return res.data.data;
		}
	} catch {
		// Fallback to mock data
	}

	return MOCK_SUPPLIER_ARTICLE_DETAIL[id] ?? null;
}

export async function importArticleAPIAction(
	file: File,
	mapping: ArticleImportMapping,
): Promise<ArticleImportResult> {
	try {
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
	} catch {
		return { successCount: 0, failureCount: 1, errors: [{ row: 0, message: "Import failed" }] };
	}
}

export async function createArticleAPIAction(
	data: CreateArticleFormData,
): Promise<{ id: string }> {
	try {
		const res = await axiosInstance.post(API_PATH.ARTICLES.CREATE, data);
		return { id: res.data?.id ?? res.data?.data?.id ?? "new-article" };
	} catch {
		return { id: "new-article" };
	}
}

export async function getArticleDetailAPIAction(
	id: string,
): Promise<ArticleDetail | null> {
	try {
		const res = await axiosInstance.get(API_PATH.ARTICLES.GET(id));
		if (res.data?.data) {
			return res.data.data;
		}
	} catch {
		// Fallback to mock data
	}

	return MOCK_ARTICLE_DETAIL[id] ?? null;
}

