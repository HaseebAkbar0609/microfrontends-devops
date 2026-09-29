"use client";

import { useMemo } from "react";
import type { DataTableColumn } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MATERIAL_CATEGORY_LABELS } from "../../constants/materialStorage.constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialStockRow } from "../../types/materialStorage.types";
import { StockStatusBadge } from "../common/StockStatusBadge";

/** Columns of the Figma stock table. Every one sorts; keys match MaterialStockSortField. */
export function useMaterialStockColumns(): DataTableColumn<MaterialStockRow>[] {
	const t = useTranslate();
	const { formatPrice, formatAmount, formatQuantity } = useMaterialFormatters();

	return useMemo(
		() => [
			{ key: "articleNo", label: localizationConstants.materialColArticleNo, sortable: true, cellClassName: "text-slate-900" },
			{ key: "name", label: localizationConstants.materialColName, sortable: true, cellClassName: "text-slate-900" },
			{
				key: "categoryId",
				label: localizationConstants.materialColCategory,
				sortable: true,
				render: (row) => t(MATERIAL_CATEGORY_LABELS[row.categoryId]),
			},
			{ key: "depotName", label: localizationConstants.materialColDepot, sortable: true },
			{
				key: "inStock",
				label: localizationConstants.materialColInStock,
				sortable: true,
				render: (row) => formatQuantity(row.inStock, row.unit),
			},
			{
				key: "reserved",
				label: localizationConstants.materialColReserved,
				sortable: true,
				render: (row) => formatQuantity(row.reserved, row.unit),
			},
			{
				key: "available",
				label: localizationConstants.materialColAvailable,
				sortable: true,
				render: (row) => formatQuantity(row.available, row.unit),
			},
			{
				key: "purchasePrice",
				label: localizationConstants.materialColPurchasePrice,
				sortable: true,
				render: (row) => formatPrice(row.purchasePrice),
			},
			{
				key: "salesPrice",
				label: localizationConstants.materialColSalesPrice,
				sortable: true,
				render: (row) => formatPrice(row.salesPrice),
			},
			{
				key: "stockValue",
				label: localizationConstants.materialColStockValue,
				sortable: true,
				render: (row) => formatAmount(row.stockValue),
			},
			{
				key: "status",
				label: localizationConstants.materialColStatus,
				sortable: true,
				render: (row) => <StockStatusBadge status={row.status} />,
			},
		],
		[t, formatPrice, formatAmount, formatQuantity],
	);
}
