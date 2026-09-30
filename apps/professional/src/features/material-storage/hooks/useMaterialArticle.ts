"use client";

import { useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialArticleService } from "../services/materialArticleService";

/**
 * What "Visa artikel" loads. Each is its own query, so a tab only waits for its
 * own data; Översikt and Transaktioner share the events. All sit under the
 * material-storage key, so a receipt or withdrawal refreshes them.
 */
export function useMaterialArticle(articleId: string) {
	return useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.article, articleId],
		queryFn: () => materialArticleService.getArticleDetails(articleId),
	});
}

export function useArticleStockEvents(articleId: string) {
	return useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.articleEvents, articleId],
		queryFn: () => materialArticleService.getStockEvents(articleId),
	});
}

export function useArticlePriceHistory(articleId: string) {
	return useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.priceHistory, articleId],
		queryFn: () => materialArticleService.getPriceHistory(articleId),
	});
}
