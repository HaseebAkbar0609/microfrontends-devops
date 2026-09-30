"use client";

import { useQuery } from "@tanstack/react-query";
import { MATERIAL_QUERY_KEYS } from "../constants/materialStorage.constants";
import { materialStockService } from "../services/materialStockService";
import { useMaterialCatalog } from "./useMaterialCatalog";

const NO_SUPPLIERS: string[] = [];

/** What "Ta in material" chooses from: depots, articles and suppliers. */
export function useReceiveMaterialOptions() {
	const catalog = useMaterialCatalog();
	const suppliersQuery = useQuery({
		queryKey: MATERIAL_QUERY_KEYS.suppliers,
		queryFn: materialStockService.getSuppliers,
	});

	return { ...catalog, suppliers: suppliersQuery.data ?? NO_SUPPLIERS };
}
