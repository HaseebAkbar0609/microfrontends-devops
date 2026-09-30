"use client";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialStockRow } from "../../types/materialStorage.types";
import { ArticleCard, ArticleEmptyText } from "./ArticleCard";

interface ArticleDepotStockCardProps {
	stock: MaterialStockRow[];
	/** The overview's depot, set in bold. */
	depotId: string;
}

/** "Lager per depå" on Översikt: I lager in each depot that carries the article, largest first. */
export function ArticleDepotStockCard({ stock, depotId }: ArticleDepotStockCardProps) {
	const { formatQuantity } = useMaterialFormatters();
	const rows = [...stock].sort((a, b) => b.inStock - a.inStock);

	return (
		<ArticleCard title={localizationConstants.materialTabDepotStock} className="h-full">
			{rows.length === 0 ? (
				<ArticleEmptyText text={localizationConstants.materialStatusOutOfStock} />
			) : (
				<dl>
					{rows.map((row) => (
						<div
							key={row.depotId}
							className={cn(
								"flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 text-sm last:border-b-0",
								row.depotId === depotId ? "font-semibold text-slate-900" : "text-slate-700",
							)}
						>
							<dt className="min-w-0 break-words">{row.depotName}</dt>
							<dd className="whitespace-nowrap tabular-nums">{formatQuantity(row.inStock, row.unit)}</dd>
						</div>
					))}
				</dl>
			)}
		</ArticleCard>
	);
}
