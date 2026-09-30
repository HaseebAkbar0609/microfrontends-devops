"use client";

import { useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";

/** One article's stock in one depot; undefined until both are chosen and the answer is in. */
export function useMaterialStockLevel(articleId: string, depotId: string) {
	const { data } = useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.stockLevel, articleId, depotId],
		queryFn: () => materialStockService.getStockLevel(articleId, depotId),
		enabled: Boolean(articleId && depotId),
	});
	return data;
}
