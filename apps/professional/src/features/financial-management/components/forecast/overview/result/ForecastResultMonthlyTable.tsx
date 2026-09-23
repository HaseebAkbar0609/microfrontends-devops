"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SortDir } from "@/utils/tableSort";
import { FORECAST_RESULT_MONTH_KEYS } from "../../../../constants/forecastResult.constants";
import type { ForecastMonthlyRow, ForecastMonthlySortField } from "../../../../types/forecastResult.types";
import { formatNumber } from "../../../../utils/economyFormatters";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";
const NUMERIC = "text-right tabular-nums";
const COLUMN_COUNT = FORECAST_RESULT_MONTH_KEYS.length + 1;

export interface ForecastResultMonthlyTableProps {
	rows: ForecastMonthlyRow[];
	/** The Prognos resultat row: every shown role summed, month by month. */
	totals: number[];
	sortField: ForecastMonthlySortField | null;
	sortDir: SortDir;
	onSort: (field: ForecastMonthlySortField) => void;
	emptyKey: TranslationKeys;
}

function Amount({ value }: { value: number }) {
	return <span className={value < 0 ? "text-red-600" : undefined}>{formatNumber(value)}</span>;
}

/**
 * Månad: each role's twelve months, with Prognos resultat totalling each one
 * over every role the filter leaves. The table scrolls sideways inside itself,
 * so the page never does.
 */
export function ForecastResultMonthlyTable({ rows, totals, sortField, sortDir, onSort, emptyKey }: ForecastResultMonthlyTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[72rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<SortableHead
							labelKey={localizationConstants.forecastResultColRole}
							onSort={() => onSort("role")}
							active={sortField === "role"}
							dir={sortDir}
						/>
						{FORECAST_RESULT_MONTH_KEYS.map((labelKey, month) => {
							const field: ForecastMonthlySortField = `month-${month}`;
							return (
								<SortableHead
									key={labelKey}
									labelKey={labelKey}
									onSort={() => onSort(field)}
									active={sortField === field}
									dir={sortDir}
									className="text-right"
								/>
							);
						})}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={COLUMN_COUNT} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50">
								<TableCell className={CELL}>{row.role}</TableCell>
								{FORECAST_RESULT_MONTH_KEYS.map((labelKey, month) => (
									<TableCell key={labelKey} className={cn(CELL, NUMERIC)}>
										<Amount value={row.months[month] ?? 0} />
									</TableCell>
								))}
							</TableRow>
						))
					)}

					{/* Prognos resultat, set off by a gap as the frame draws it. */}
					{rows.length > 0 && (
						<>
							<TableRow className="border-0 hover:bg-transparent">
								<TableCell colSpan={COLUMN_COUNT} className="h-7 p-0" />
							</TableRow>
							<TableRow className="border-0 bg-slate-100 hover:bg-slate-100">
								<TableCell className={cn(CELL, "font-semibold")}>
									<Translate text={localizationConstants.forecastResultSummaryRow} />
								</TableCell>
								{totals.map((total, month) => (
									<TableCell key={FORECAST_RESULT_MONTH_KEYS[month]} className={cn(CELL, NUMERIC, "font-semibold")}>
										<Amount value={total} />
									</TableCell>
								))}
							</TableRow>
						</>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default ForecastResultMonthlyTable;
