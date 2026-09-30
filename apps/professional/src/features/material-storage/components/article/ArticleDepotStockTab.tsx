"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialStockRow } from "../../types/materialStorage.types";
import { StockStatusBadge } from "../common/StockStatusBadge";
import { ArticleTable, type ArticleTableColumn } from "./ArticleTable";

const COLUMNS: ArticleTableColumn[] = [
	{ label: localizationConstants.materialColDepot },
	{ label: localizationConstants.materialColInStock, numeric: true },
	{ label: localizationConstants.materialColReserved, numeric: true },
	{ label: localizationConstants.materialColAvailable, numeric: true },
	{ label: localizationConstants.materialColStockValue, numeric: true },
	{ label: localizationConstants.materialColStatus },
];

/** "Lager per depå": the article's full stock picture in every depot that carries it. */
export function ArticleDepotStockTab({ stock, depotId }: { stock: MaterialStockRow[]; depotId: string }) {
	const { formatQuantity, formatAmount } = useMaterialFormatters();

	return (
		<ArticleTable columns={COLUMNS} emptyText={localizationConstants.materialStatusOutOfStock} isEmpty={stock.length === 0}>
			{stock.map((row) => (
				<TableRow key={row.depotId} className={cn(row.depotId === depotId && "font-semibold")}>
					<TableCell className="whitespace-normal text-slate-900">{row.depotName}</TableCell>
					<TableCell className="text-right tabular-nums">{formatQuantity(row.inStock, row.unit)}</TableCell>
					<TableCell className="text-right tabular-nums">{formatQuantity(row.reserved, row.unit)}</TableCell>
					<TableCell className="text-right tabular-nums">{formatQuantity(row.available, row.unit)}</TableCell>
					<TableCell className="text-right tabular-nums">{formatAmount(row.stockValue)}</TableCell>
					<TableCell>
						<StockStatusBadge status={row.status} />
					</TableCell>
				</TableRow>
			))}
		</ArticleTable>
	);
}
