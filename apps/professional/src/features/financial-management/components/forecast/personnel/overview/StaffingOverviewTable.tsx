"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EmployeeOverviewItem } from "@/features/personnel/types/personnelOverview.types";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { STAFFING_COLUMNS } from "../../../../constants/forecastPersonnel.constants";
import type { StaffingSortField } from "../../../../types/forecastPersonnel.types";
import { formatSek } from "../../../../utils/economyFormatters";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";
/** Two-line heads in small caps, as the frame sets them. */
const HEAD = "h-auto py-3 text-xs font-semibold tracking-wider whitespace-normal text-slate-500 uppercase";

export interface StaffingOverviewTableProps {
	employees: EmployeeOverviewItem[];
	sortField: StaffingSortField | null;
	sortDir: SortDir;
	onSort: (field: StaffingSortField) => void;
	emptyKey: TranslationKeys;
	isLoading: boolean;
}

function LoadingRows() {
	return (
		<>
			{[0, 1, 2, 3, 4].map((row) => (
				<TableRow key={row} className="hover:bg-transparent" aria-busy>
					{STAFFING_COLUMNS.map((column) => (
						<TableCell key={column.key} className={CELL}>
							<Skeleton className="h-4 w-full" />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}

/** Who is on the payroll, what each costs, and how long each stays. */
export function StaffingOverviewTable({
	employees,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	isLoading,
}: StaffingOverviewTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{STAFFING_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
								className={cn(HEAD, column.key === "monthlyCost" && "text-right")}
							/>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<LoadingRows />
					) : employees.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={STAFFING_COLUMNS.length} className="py-10 text-center text-sm text-slate-500">
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						employees.map((employee) => (
							<TableRow key={employee.id} className="hover:bg-slate-50">
								<TableCell className={cn(CELL, "font-medium")}>{employee.name}</TableCell>
								<TableCell className={cn(CELL, "text-slate-600")}>{employee.role}</TableCell>
								<TableCell className={cn(CELL, "text-right font-medium tabular-nums")}>
									{formatSek(employee.monthlyCost)}
								</TableCell>
								<TableCell className={cn(CELL, "tabular-nums")}>{employee.startDate}</TableCell>
								<TableCell className={cn(CELL, "tabular-nums")}>
									{employee.endDate ?? (
										<span className="text-slate-500">
											<Translate text={localizationConstants.forecastPersonnelPermanent} />
										</span>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default StaffingOverviewTable;
