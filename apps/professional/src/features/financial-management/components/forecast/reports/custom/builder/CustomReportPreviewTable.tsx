"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_CELL_CLASS, FORECAST_NUMERIC_FIELDS } from "../../../../../constants/forecastList.constants";
import type { ForecastListRow, ForecastListSortField } from "../../../../../types/forecastList.types";
import { formatForecastField } from "../../../../../utils/forecastList";

export interface CustomReportPreviewTableProps {
	rows: ForecastListRow[];
	/** The report's columns, in the list's own order. */
	columns: { key: ForecastListSortField; labelKey: TranslationKeys }[];
	sortField?: ForecastListSortField | null;
	sortDir?: SortDir;
	/** Omitted in the preview dialog, where the report is only read. */
	onSort?: (field: ForecastListSortField) => void;
	emptyKey: TranslationKeys;
}

/**
 * The report as it stands: the chosen columns and nothing else — no eye, no ⋮,
 * since a report is read rather than acted on. Prognoslista's own table draws
 * all thirteen columns with an action column pinned to them, which is why this
 * is its own table rather than that one with switches.
 */
export function CustomReportPreviewTable({
	rows,
	columns,
	sortField = null,
	sortDir = null,
	onSort,
	emptyKey,
}: CustomReportPreviewTableProps) {
	const t = useTranslate();

	return (
		<div className="w-full overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{columns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={onSort ? () => onSort(column.key) : undefined}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={columns.length} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50">
								{columns.map((column) => (
									<TableCell
										key={column.key}
										className={cn(
											FORECAST_CELL_CLASS,
											FORECAST_NUMERIC_FIELDS.has(column.key) && "tabular-nums",
										)}
									>
										{formatForecastField(row, column.key, t)}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default CustomReportPreviewTable;
