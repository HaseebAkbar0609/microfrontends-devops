"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleRow, ArticleKpiStats } from "../types/article.types";
import {
	articleRepository,
	getArticlesAPIAction,
	deleteArticleAPIAction,
	toggleArticleFavoriteAPIAction,
} from "../utils/articleRepository";
import {
	DEFAULT_ARTICLE_PAGE_SIZE,
	ARTICLE_PAGE_PARAM,
	ARTICLE_LIMIT_PARAM,
	ARTICLE_SEARCH_PARAM,
	ARTICLE_STATUS_PARAM,
	ARTICLE_SORT_BY_PARAM,
	ARTICLE_SORT_ORDER_PARAM,
} from "../constants/article.constants";

export function useArticleOverview() {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get(ARTICLE_PAGE_PARAM) || "1");
	const pageSize = Number(
		searchParams.get(ARTICLE_LIMIT_PARAM) || String(DEFAULT_ARTICLE_PAGE_SIZE),
	);
	const searchQuery = searchParams.get(ARTICLE_SEARCH_PARAM) || "";
	const statusParam = searchParams.get(ARTICLE_STATUS_PARAM) || "all";
	const sortByParam = searchParams.get(ARTICLE_SORT_BY_PARAM) || "";
	const sortOrderParam = (searchParams.get(ARTICLE_SORT_ORDER_PARAM) || "asc") as
		| "asc"
		| "desc";

	const [articles, setArticles] = useState<ArticleRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchArticles = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getArticlesAPIAction();
			setArticles(res.data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		fetchArticles();
		const unsubscribe = articleRepository.subscribe(fetchArticles);
		return () => {
			unsubscribe();
		};
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

	const handleStatusFilterChange = useCallback(
		(status: "all" | "active" | "inactive") => {
			updateSearchParams({
				[ARTICLE_STATUS_PARAM]: status === "all" ? null : status,
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

	const handleToggleFavorite = useCallback(async (id: string) => {
		try {
			const newFavState = await toggleArticleFavoriteAPIAction(id);
			setArticles((prev) =>
				prev.map((item) => (item.id === id ? { ...item, isFavorite: newFavState } : item)),
			);
		} catch {
			// Ignore or toast
		}
	}, []);

	const handleDelete = useCallback(async () => {
		if (!deletingId) return;
		try {
			await deleteArticleAPIAction(deletingId);
			setArticles((prev) => prev.filter((item) => item.id !== deletingId));
			showToast("success", t(localizationConstants.deleteSuccessMessage));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setDeletingId(null);
		}
	}, [deletingId, t]);

	const filteredArticles = useMemo(() => {
		return articles.filter((item) => {
			const matchesSearch =
				!searchQuery ||
				item.articleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				statusParam === "all" ||
				(statusParam === "active" && item.status === "active") ||
				(statusParam === "inactive" && item.status === "inactive");
			return matchesSearch && matchesStatus;
		});
	}, [articles, searchQuery, statusParam]);

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

	const kpiStats: ArticleKpiStats = useMemo(() => {
		const total = articles.length;
		const active = articles.filter((a) => a.status === "active").length;
		return {
			totalArticles: total,
			activeArticles: active,
			mappedArticles: total,
		};
	}, [articles]);

	return {
		data: paginatedArticles,
		totalItems,
		isLoading,
		searchQuery,
		statusParam,
		sortByParam,
		sortOrderParam,
		page,
		pageSize,
		deletingId,
		setDeletingId,
		kpiStats,
		handleSearchChange,
		handleStatusFilterChange,
		handleSort,
		handlePageChange,
		handlePageSizeChange,
		handleToggleFavorite,
		handleDelete,
		router,
	};
}
