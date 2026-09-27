"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierArticleRow } from "../types/article.types";
import {
	getSupplierArticlesAPIAction,
	deleteSupplierArticleAPIAction,
} from "../utils/articleRepository";
import {
	DEFAULT_ARTICLE_PAGE_SIZE,
	ARTICLE_PAGE_PARAM,
	ARTICLE_LIMIT_PARAM,
	ARTICLE_SEARCH_PARAM,
	ARTICLE_SORT_BY_PARAM,
	ARTICLE_SORT_ORDER_PARAM,
} from "../constants/article.constants";

export function useSupplierArticleOverview() {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get(ARTICLE_PAGE_PARAM) || "1");
	const pageSize = Number(
		searchParams.get(ARTICLE_LIMIT_PARAM) || String(DEFAULT_ARTICLE_PAGE_SIZE),
	);
	const searchQuery = searchParams.get(ARTICLE_SEARCH_PARAM) || "";
	const supplierParam = searchParams.get("supplier") || "all";
	const sortByParam = searchParams.get(ARTICLE_SORT_BY_PARAM) || "";
	const sortOrderParam = (searchParams.get(ARTICLE_SORT_ORDER_PARAM) || "asc") as
		| "asc"
		| "desc";

	const [articles, setArticles] = useState<SupplierArticleRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchArticles = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getSupplierArticlesAPIAction();
			setArticles(res.data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		fetchArticles();
	}, [fetchArticles]);

	const updateSearchParams = useCallback(
		(updates: Record<string, string | null>) => {
			const current = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value === null || value === "") {
					current.delete(key);
				} else {
					current.set(key, value);
				}
			});
			router.replace(`?${current.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	const handleSearchChange = useCallback(
		(val: string) => {
			updateSearchParams({
				[ARTICLE_SEARCH_PARAM]: val || null,
				[ARTICLE_PAGE_PARAM]: "1",
			});
		},
		[updateSearchParams],
	);

	const handleSupplierFilterChange = useCallback(
		(sup: string) => {
			updateSearchParams({
				supplier: sup === "all" ? null : sup,
				[ARTICLE_PAGE_PARAM]: "1",
			});
		},
		[updateSearchParams],
	);

	const handleSort = useCallback(
		(columnKey: string) => {
			let newOrder: "asc" | "desc" = "asc";
			if (sortByParam === columnKey && sortOrderParam === "asc") {
				newOrder = "desc";
			}
			updateSearchParams({
				[ARTICLE_SORT_BY_PARAM]: columnKey,
				[ARTICLE_SORT_ORDER_PARAM]: newOrder,
			});
		},
		[sortByParam, sortOrderParam, updateSearchParams],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			updateSearchParams({ [ARTICLE_PAGE_PARAM]: String(newPage) });
		},
		[updateSearchParams],
	);

	const handlePageSizeChange = useCallback(
		(newSize: number) => {
			updateSearchParams({
				[ARTICLE_LIMIT_PARAM]: String(newSize),
				[ARTICLE_PAGE_PARAM]: "1",
			});
		},
		[updateSearchParams],
	);

	const handleDelete = useCallback(async () => {
		if (!deletingId) return;
		try {
			await deleteSupplierArticleAPIAction(deletingId);
			setArticles((prev) => prev.filter((item) => item.id !== deletingId));
			showToast("success", t(localizationConstants.deleteSuccessMessage));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setDeletingId(null);
		}
	}, [deletingId, t]);

	const selectOptions = useMemo(() => {
		const unique = Array.from(new Set(articles.map((a) => a.supplierName)));
		return unique.map((name) => ({ label: name, value: name }));
	}, [articles]);

	const filteredArticles = useMemo(() => {
		return articles.filter((item) => {
			const matchesSearch =
				!searchQuery ||
				item.supplierArticleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.supplierDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesSupplier =
				supplierParam === "all" || item.supplierName === supplierParam;
			return matchesSearch && matchesSupplier;
		});
	}, [articles, searchQuery, supplierParam]);

	const sortedArticles = useMemo(() => {
		if (!sortByParam) return filteredArticles;
		return [...filteredArticles].sort((a, b) => {
			const aVal = (a as unknown as Record<string, unknown>)[sortByParam] ?? "";
			const bVal = (b as unknown as Record<string, unknown>)[sortByParam] ?? "";
			if (aVal < bVal) return sortOrderParam === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrderParam === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredArticles, sortByParam, sortOrderParam]);

	const totalItems = sortedArticles.length;
	const paginatedArticles = useMemo(() => {
		const start = (page - 1) * pageSize;
		return sortedArticles.slice(start, start + pageSize);
	}, [sortedArticles, page, pageSize]);

	return {
		data: paginatedArticles,
		totalItems,
		isLoading,
		searchQuery,
		supplierParam,
		sortByParam,
		sortOrderParam,
		page,
		pageSize,
		deletingId,
		setDeletingId,
		selectOptions,
		handleSearchChange,
		handleSupplierFilterChange,
		handleSort,
		handlePageChange,
		handlePageSizeChange,
		handleDelete,
		router,
	};
}
