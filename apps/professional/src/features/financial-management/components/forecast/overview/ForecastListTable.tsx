"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SortDir } from "@/utils/tableSort";
import { FORECAST_ACTION_COLUMN, FORECAST_LIST_COLUMNS } from "../../../constants/forecastList.constants";
import type { ForecastListRow, ForecastListSortField } from "../../../types/forecastList.types";
import { ForecastListTableRow } from "./ForecastListTableRow";

export interface ForecastListTableProps {
	rows: ForecastListRow[];
	sortField: ForecastListSortField | null;
	sortDir: SortDir;
	onSort: (field: ForecastListSortField) => void;
	emptyKey: TranslationKeys;
	onView: (row: ForecastListRow) => void;
	onDelete: (row: ForecastListRow) => void;
}

/**
 * Prognoslista's table: thirteen sortable columns, then the eye and ⋮ in a
 * column pinned to the right. The table scrolls sideways inside itself, so
 * the page never does.
 */
export function ForecastListTable({ rows, sortField, sortDir, onSort, emptyKey, onView, onDelete }: ForecastListTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[80rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{FORECAST_LIST_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						<TableHead className={cn(FORECAST_ACTION_COLUMN, "z-20 w-24")}>
							<span className="sr-only">
								<Translate text={localizationConstants.actionsAriaLabel} />
							</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={FORECAST_LIST_COLUMNS.length + 1} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<ForecastListTableRow key={row.id} row={row} onView={() => onView(row)} onDelete={() => onDelete(row)} />
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default ForecastListTable;
