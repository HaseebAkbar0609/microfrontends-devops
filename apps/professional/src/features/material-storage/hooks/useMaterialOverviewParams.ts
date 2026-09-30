"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	MATERIAL_CATEGORY_IDS,
	MATERIAL_DEFAULT_PAGE_SIZE,
	MATERIAL_OVERVIEW_PARAMS as PARAM,
	MATERIAL_PAGE_SIZE_OPTIONS,
	MATERIAL_SORT_FIELDS,
	STOCK_FILTER_IDS,
} from "../constants/materialStorage.constants";
import type {
	MaterialCategoryId,
	MaterialStockQuery,
	SortOrder,
	StockFilter,
} from "../types/materialStorage.types";

/**
 * The table's query as read from the URL. The depot stays null until the user
 * picks one. articleId is the article "Visa artikel" shows, if it is open.
 */
export type MaterialOverviewParams = Omit<MaterialStockQuery, "depotId"> & {
	depotId: string | null;
	articleId: string | null;
};

function parseOption<T extends string>(value: string | null, allowed: readonly T[]): T | null {
	return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function parsePositiveInt(value: string | null): number | null {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Keeps the overview's depot, search, filters, sort and page in the URL, so a
 * reload or a Back from another page lands on the same view. Defaults are left
 * out of the URL. The open article is there too, so a link can open it.
 */
export function useMaterialOverviewParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const params = useMemo<MaterialOverviewParams>(() => {
		const pageSize = parsePositiveInt(searchParams.get(PARAM.pageSize));
		return {
			depotId: searchParams.get(PARAM.depot),
			search: searchParams.get(PARAM.search) ?? "",
			categoryId: parseOption(searchParams.get(PARAM.category), MATERIAL_CATEGORY_IDS),
			stockFilter: parseOption(searchParams.get(PARAM.stock), STOCK_FILTER_IDS) ?? "all",
			sortBy: parseOption(searchParams.get(PARAM.sortBy), MATERIAL_SORT_FIELDS),
			sortOrder: searchParams.get(PARAM.sortOrder) === "desc" ? "desc" : "asc",
			page: parsePositiveInt(searchParams.get(PARAM.page)) ?? 1,
			pageSize:
				pageSize !== null && (MATERIAL_PAGE_SIZE_OPTIONS as readonly number[]).includes(pageSize)
					? pageSize
					: MATERIAL_DEFAULT_PAGE_SIZE,
			articleId: searchParams.get(PARAM.article),
		};
	}, [searchParams]);

	const update = useCallback(
		(updates: Record<string, string | null>) => {
			const next = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value) next.set(key, value);
				else next.delete(key);
			});
			const query = next.toString();
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const setters = useMemo(() => {
		/** Anything that changes which rows match starts over on page 1. */
		const updateFilter = (key: string, value: string | null) =>
			update({ [key]: value, [PARAM.page]: null });

		return {
			setDepot: (depotId: string) => updateFilter(PARAM.depot, depotId),
			setSearch: (search: string) => updateFilter(PARAM.search, search.trim() ? search : null),
			setCategory: (categoryId: MaterialCategoryId | null) =>
				updateFilter(PARAM.category, categoryId),
			setStockFilter: (filter: StockFilter) =>
				updateFilter(PARAM.stock, filter === "all" ? null : filter),
			setSort: (field: string, order: SortOrder | null) =>
				update({ [PARAM.sortBy]: order ? field : null, [PARAM.sortOrder]: order, [PARAM.page]: null }),
			setPage: (page: number) => update({ [PARAM.page]: page > 1 ? String(page) : null }),
			setPageSize: (size: number) =>
				updateFilter(PARAM.pageSize, size === MATERIAL_DEFAULT_PAGE_SIZE ? null : String(size)),
			/** Opens "Visa artikel" for this article, or closes it with null. The table stays as it is. */
			setArticle: (articleId: string | null) => update({ [PARAM.article]: articleId }),
		};
	}, [update]);

	return { params, ...setters };
}
