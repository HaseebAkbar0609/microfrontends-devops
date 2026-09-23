"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SortDir } from "@/utils/tableSort";
import { FORECAST_RESULT_YEARLY_COLUMNS } from "../../../../constants/forecastResult.constants";
import type { ForecastYearlyRow, ForecastYearlySortField } from "../../../../types/forecastResult.types";
import { formatNumber } from "../../../../utils/economyFormatters";
import { yearlyContribution } from "../../../../utils/forecastResult";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";
const NUMERIC = "text-right tabular-nums";
const TOTAL_CELL = "bg-slate-100 font-semibold";

export interface ForecastResultYearlyTableProps {
	rows: ForecastYearlyRow[];
	totals: { revenue: number; costs: number; contribution: number };
	sortField: ForecastYearlySortField | null;
	sortDir: SortDir;
	onSort: (field: ForecastYearlySortField) => void;
	emptyKey: TranslationKeys;
}

/** A figure that reads red once it is a loss. */
function Amount({ value }: { value: number }) {
	return <span className={value < 0 ? "text-red-600" : undefined}>{formatNumber(value)}</span>;
}

/**
 * Årlig: what each object brings in, what it costs and what it leaves, with
 * the grey band under the table totalling those three over every row the
 * filter leaves — not only the page on screen.
 */
export function ForecastResultYearlyTable({ rows, totals, sortField, sortDir, onSort, emptyKey }: ForecastResultYearlyTableProps) {
	const t = useTranslate();

	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[56rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{FORECAST_RESULT_YEARLY_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
								className={column.numeric ? "text-right" : undefined}
							/>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={FORECAST_RESULT_YEARLY_COLUMNS.length} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50">
								<TableCell className={CELL}>{row.objectName}</TableCell>
								<TableCell className={cn(CELL, NUMERIC)}>{formatNumber(row.revenue)}</TableCell>
								<TableCell className={cn(CELL, NUMERIC)}>{formatNumber(row.costs)}</TableCell>
								<TableCell className={cn(CELL, NUMERIC)}>
									<Amount value={yearlyContribution(row)} />
								</TableCell>
								<TableCell className={cn(CELL, "tabular-nums")}>{row.startDate}</TableCell>
								<TableCell className={cn(CELL, "tabular-nums")}>{row.endDate}</TableCell>
							</TableRow>
						))
					)}

					{/* The frame's band, in the same table so its figures stay under
					    their columns: the totals alone, set off by a gap. */}
					{rows.length > 0 && (
						<>
							<TableRow className="border-0 hover:bg-transparent">
								<TableCell colSpan={FORECAST_RESULT_YEARLY_COLUMNS.length} className="h-7 p-0" />
							</TableRow>
							<TableRow className="border-0 hover:bg-transparent">
								<TableCell className={CELL}>
									<span className="sr-only">{t(localizationConstants.forecastResultTotalsLabel)}</span>
								</TableCell>
								<TableCell className={cn(CELL, NUMERIC, TOTAL_CELL)}>{formatNumber(totals.revenue)}</TableCell>
								<TableCell className={cn(CELL, NUMERIC, TOTAL_CELL)}>{formatNumber(totals.costs)}</TableCell>
								<TableCell className={cn(CELL, NUMERIC, TOTAL_CELL)}>
									<Amount value={totals.contribution} />
								</TableCell>
								<TableCell className={CELL} />
								<TableCell className={CELL} />
							</TableRow>
						</>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default ForecastResultYearlyTable;
