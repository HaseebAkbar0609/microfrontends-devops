"use client";

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";
import type { MaterialArticle } from "../types/materialStorage.types";

export const depotArticleIdsQuery = (depotId: string) => ({
	queryKey: [...MATERIAL_QUERY_KEYS.depotArticles, depotId],
	queryFn: () => materialStockService.getDepotArticleIds(depotId),
});

/**
 * The articles a depot carries, out of all articles. Undefined until the first
 * answer; while another depot's list loads, the previous one stays so the
 * chosen material does not blink out.
 */
export function useDepotArticles(depotId: string, articles: MaterialArticle[]) {
	const { data: articleIds } = useQuery({
		...depotArticleIdsQuery(depotId),
		enabled: Boolean(depotId),
		placeholderData: keepPreviousData,
	});

	return useMemo(() => {
		if (!articleIds) return undefined;
		const carried = new Set(articleIds);
		return articles.filter((article) => carried.has(article.id));
	}, [articleIds, articles]);
}
