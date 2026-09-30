"use client";

import { useCallback, useMemo } from "react";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { MaterialRowAction } from "../../hooks/useMaterialOverviewActions";
import type {
	MaterialStockRow,
	MaterialStockSortField,
	SortOrder,
} from "../../types/materialStorage.types";
import { buildMaterialRowActions } from "./materialRowActions";
import { useMaterialStockColumns } from "./useMaterialStockColumns";

interface MaterialStockTableProps {
	rows: MaterialStockRow[];
	loading: boolean;
	error: boolean;
	onRetry: () => void;
	skeletonRows: number;
	sortBy: MaterialStockSortField | null;
	sortOrder: SortOrder;
	onSort: (field: string, order: SortOrder | null) => void;
	onRowAction: (action: MaterialRowAction, row: MaterialStockRow) => void;
}

export function MaterialStockTable({
	rows,
	loading,
	error,
	onRetry,
	skeletonRows,
	sortBy,
	sortOrder,
	onSort,
	onRowAction,
}: MaterialStockTableProps) {
	const t = useTranslate();
	const openArticle = useCallback((row: MaterialStockRow) => onRowAction("view", row), [onRowAction]);
	const columns = useMaterialStockColumns(openArticle);
	const actions = useMemo(() => buildMaterialRowActions(onRowAction), [onRowAction]);

	if (error) {
		return (
			<div role="alert" className="flex flex-col items-center gap-3 px-4 py-12 text-sm text-slate-600">
				<Translate text={localizationConstants.materialStockLoadError} />
				<Button variant="outline" className="cursor-pointer" onClick={onRetry}>
					<Translate text={localizationConstants.retry} />
				</Button>
			</div>
		);
	}

	return (
		<DataTable
			data={rows}
			columns={columns}
			rowKey={(row) => row.id}
			actions={actions}
			actionsLabel={(row) => t(localizationConstants.materialRowActionsLabel, { name: row.name })}
			loading={loading}
			skeletonRows={skeletonRows}
			emptyMessageKey={localizationConstants.materialStockEmpty}
			sortBy={sortBy ?? undefined}
			sortOrder={sortOrder}
			onSort={onSort}
		/>
	);
}
