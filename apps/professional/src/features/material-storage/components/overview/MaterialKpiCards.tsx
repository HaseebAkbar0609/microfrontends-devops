"use client";

import { Box, Coins, Flag, Lock, TriangleAlert } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialStockKpis } from "../../types/materialStorage.types";
import { MaterialKpiCard, type MaterialKpiCardProps } from "./MaterialKpiCard";

interface MaterialKpiCardsProps {
	kpis: MaterialStockKpis | undefined;
	loading: boolean;
}

/** The five cards above the table, for the selected depot. */
export function MaterialKpiCards({ kpis, loading }: MaterialKpiCardsProps) {
	const { formatAmount, formatCount } = useMaterialFormatters();

	const cards: Omit<MaterialKpiCardProps, "loading">[] = [
		{
			label: localizationConstants.materialKpiStockValue,
			icon: Coins,
			tone: "blue",
			value: kpis && formatAmount(kpis.stockValue),
		},
		{
			label: localizationConstants.materialKpiArticlesInStock,
			icon: Box,
			tone: "green",
			value: kpis && formatCount(kpis.articlesInStock),
		},
		{
			label: localizationConstants.materialKpiLowStock,
			icon: TriangleAlert,
			tone: "orange",
			emphasis: true,
			value: kpis && formatCount(kpis.lowStockCount),
		},
		{
			label: localizationConstants.materialKpiReorderPoint,
			icon: Flag,
			tone: "violet",
			value: kpis && formatCount(kpis.reorderPointCount),
		},
		{
			label: localizationConstants.materialKpiReserved,
			icon: Lock,
			tone: "blue",
			value: kpis && formatAmount(kpis.reservedValue),
		},
	];

	return (
		// One row of five on desktop, as in Figma; tablets wrap.
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
			{cards.map((card) => (
				<MaterialKpiCard key={card.label} {...card} loading={loading} />
			))}
		</div>
	);
}
