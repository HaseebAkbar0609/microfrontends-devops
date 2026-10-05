"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RISK_LEVEL_META } from "../../../constants/forecastRisk.constants";
import { FORECAST_STATISTICS_ACTIVITY_COLUMNS } from "../../../constants/forecastStatistics.constants";
import type {
	StatisticsActivityRow,
	StatisticsActivitySortField,
} from "../../../types/forecastStatistics.types";
import { formatNumber, formatSekCompact } from "../../../utils/economyFormatters";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

export interface StatisticsActivityTableProps {
	rows: StatisticsActivityRow[];
	sortField: StatisticsActivitySortField | null;
	sortDir: SortDir;
	onSort: (field: StatisticsActivitySortField) => void;
}

/**
 * What every module is carrying and what it is exposed to.
 *
 * One risk column, not the two the frame draws — both of its columns held the
 * same kind of pill, which reads as a duplicated column rather than two
 * measures. The pill and the amount's colour come from the one map
 * Riskhantering already uses.
 */
export function StatisticsActivityTable({
	rows,
	sortField,
	sortDir,
	onSort,
}: StatisticsActivityTableProps) {
	const t = useTranslate();

	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{FORECAST_STATISTICS_ACTIVITY_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={FORECAST_STATISTICS_ACTIVITY_COLUMNS.length}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={localizationConstants.forecastStatisticsActivityEmpty} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => {
							const level = RISK_LEVEL_META[row.level];
							return (
								<TableRow key={row.id} className="hover:bg-slate-50">
									<TableCell className={cn(CELL, "font-medium")}>{row.projectName}</TableCell>
									<TableCell className={CELL}>
										<Translate text={row.moduleKey} />
									</TableCell>
									<TableCell className={cn(CELL, "tabular-nums")}>
										{formatNumber(row.caseVolume)}
									</TableCell>
									<TableCell className={CELL}>
										<Badge variant={level.variant}>{t(level.labelKey)}</Badge>
									</TableCell>
									{/* The amount is tinted to agree with the pill beside it. */}
									<TableCell className={cn(CELL, "tabular-nums", level.amountClass)}>
										{formatSekCompact(row.exposure)}
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default StatisticsActivityTable;
