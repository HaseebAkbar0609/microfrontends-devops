"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";
import type {
	MaterialDepot,
	MaterialStockQuery,
} from "../types/materialStorage.types";
import type { MaterialOverviewParams } from "./useMaterialOverviewParams";

const NO_DEPOTS: MaterialDepot[] = [];

/** The requested depot if it exists, otherwise the default one. */
function resolveDepotId(depots: MaterialDepot[], requested: string | null): string | null {
	if (requested && depots.some((depot) => depot.id === requested)) return requested;
	return depots.find((depot) => depot.isDefault)?.id ?? depots[0]?.id ?? null;
}

/**
 * Depots, the selected depot's KPIs and the current table page. KPIs are their
 * own query keyed on the depot alone, so searching or paging the table does not
 * reload the cards.
 */
export function useMaterialStockOverview(params: MaterialOverviewParams) {
	const depotsQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.depots,
		queryFn: materialStockService.getDepots,
	});
	const depots = depotsQuery.data ?? NO_DEPOTS;
	const depotId = resolveDepotId(depots, params.depotId);

	const kpisQuery = useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.kpis, depotId],
		queryFn: () => materialStockService.getStockKpis(depotId as string),
		enabled: depotId !== null,
	});

	const stockQuery: MaterialStockQuery | null = depotId ? { ...params, depotId } : null;
	const stockPageQuery = useQuery({
		queryKey: [...MATERIAL_QUERY_KEYS.stock, stockQuery],
		queryFn: () => materialStockService.getStockPage(stockQuery as MaterialStockQuery),
		enabled: stockQuery !== null,
		placeholderData: keepPreviousData,
	});

	const retry = () => {
		if (depotsQuery.isError) void depotsQuery.refetch();
		else void stockPageQuery.refetch();
	};

	return {
		depots,
		depotId,
		kpis: kpisQuery.data,
		isKpisLoading: kpisQuery.isPending,
		stockPage: stockPageQuery.data,
		/** The previous page stays in place for the pager, but its rows give way to skeletons. */
		isStockLoading: stockPageQuery.isPending || stockPageQuery.isPlaceholderData,
		isStockError: depotsQuery.isError || stockPageQuery.isError,
		retry,
	};
}
