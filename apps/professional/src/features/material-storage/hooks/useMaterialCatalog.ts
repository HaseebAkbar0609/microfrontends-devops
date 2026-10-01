"use client";

import { useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";
import type { MaterialArticle, MaterialDepot } from "../types/materialStorage.types";

const NO_DEPOTS: MaterialDepot[] = [];
const NO_ARTICLES: MaterialArticle[] = [];

/** The depots and articles the stock dialogs choose from. Depots share their cache with the overview. */
export function useMaterialCatalog() {
	const depotsQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.depots,
		queryFn: materialStockService.getDepots,
	});
	const articlesQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.articles,
		queryFn: materialStockService.getArticles,
	});

	return {
		depots: depotsQuery.data ?? NO_DEPOTS,
		articles: articlesQuery.data ?? NO_ARTICLES,
	};
}
