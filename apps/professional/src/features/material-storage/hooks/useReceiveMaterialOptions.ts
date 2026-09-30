"use client";

import { useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";
import type { MaterialArticle, MaterialDepot } from "../types/materialStorage.types";

const NO_DEPOTS: MaterialDepot[] = [];
const NO_ARTICLES: MaterialArticle[] = [];
const NO_SUPPLIERS: string[] = [];

/** What "Ta in material" chooses from. Depots share their cache with the overview. */
export function useReceiveMaterialOptions() {
	const depotsQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.depots,
		queryFn: materialStockService.getDepots,
	});
	const articlesQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.articles,
		queryFn: materialStockService.getArticles,
	});
	const suppliersQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.suppliers,
		queryFn: materialStockService.getSuppliers,
	});

	return {
		depots: depotsQuery.data ?? NO_DEPOTS,
		articles: articlesQuery.data ?? NO_ARTICLES,
		suppliers: suppliersQuery.data ?? NO_SUPPLIERS,
	};
}
