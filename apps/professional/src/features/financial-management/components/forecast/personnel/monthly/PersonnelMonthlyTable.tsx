"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PERSONNEL_KATEGORI_LABELS,
	PERSONNEL_MONTH_KEYS,
	PERSONNEL_MONTHLY_LEAD_COLUMNS,
} from "../../../../constants/forecastPersonnel.constants";
import type {
	PersonnelMonthlyRow,
	PersonnelMonthlySortField,
} from "../../../../types/forecastPersonnel.types";
import { formatNumber } from "../../../../utils/economyFormatters";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";
const NUMERIC = "text-right tabular-nums";

function Amount({ value }: { value: number }) {
	return <span className={value < 0 ? "text-red-600" : undefined}>{formatNumber(value)}</span>;
}

export interface PersonnelMonthlyTableProps {
	rows: PersonnelMonthlyRow[];
	/** Löneprognos: every shown role summed, month by month. */
	totals: number[];
	/** The months the selection left, as indexes into the year. */
	monthKeys: TranslationKeys[];
	sortField: PersonnelMonthlySortField | null;
	sortDir: SortDir;
	onSort: (field: PersonnelMonthlySortField) => void;
	emptyKey: TranslationKeys;
	isLoading: boolean;
}

/**
 * Månads-analys: each role's salary month by month, with Löneprognos totalling
 * every one over the roles the selection leaves. The table scrolls sideways
 * inside itself, so the page never does.
 */
export function PersonnelMonthlyTable({
	rows,
	totals,
	monthKeys,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	isLoading,
}: PersonnelMonthlyTableProps) {
	const t = useTranslate();
	const columnCount = PERSONNEL_MONTHLY_LEAD_COLUMNS.length + monthKeys.length;
	const firstMonth = PERSONNEL_MONTH_KEYS.indexOf(monthKeys[0]);

	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[72rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{PERSONNEL_MONTHLY_LEAD_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						{monthKeys.map((labelKey, index) => {
							const field: PersonnelMonthlySortField = `month-${firstMonth + index}`;
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
					{isLoading ? (
						[0, 1, 2, 3, 4].map((row) => (
							<TableRow key={row} className="hover:bg-transparent" aria-busy>
								{Array.from({ length: columnCount }).map((_, cell) => (
									<TableCell key={cell} className={CELL}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))
					) : rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={columnCount} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-slate-50">
								<TableCell className={CELL}>{row.role}</TableCell>
								<TableCell className={cn(CELL, "text-slate-600")}>
									{t(PERSONNEL_KATEGORI_LABELS[row.kategori])}
								</TableCell>
								{row.months.map((amount, month) => (
									<TableCell key={monthKeys[month]} className={cn(CELL, NUMERIC)}>
										<Amount value={amount} />
									</TableCell>
								))}
							</TableRow>
						))
					)}

					{/* Löneprognos, set off by a gap as the frame draws it. */}
					{!isLoading && rows.length > 0 && (
						<>
							<TableRow className="border-0 hover:bg-transparent">
								<TableCell colSpan={columnCount} className="h-7 p-0" />
							</TableRow>
							<TableRow className="border-0 bg-slate-100 hover:bg-slate-100">
								<TableCell colSpan={PERSONNEL_MONTHLY_LEAD_COLUMNS.length} className={cn(CELL, "font-semibold")}>
									<Translate text={localizationConstants.forecastPersonnelSummaryRow} />
								</TableCell>
								{totals.map((total, month) => (
									<TableCell key={monthKeys[month]} className={cn(CELL, NUMERIC, "font-semibold")}>
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

export default PersonnelMonthlyTable;
