"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import { REPORT_COLUMNS } from "../../../constants/forecastReports.constants";
import type { ReportDocument, ReportSortField } from "../../../types/forecastReports.types";
import { ReportsTableRow } from "./ReportsTableRow";

export interface ReportsTableProps {
	reports: ReportDocument[];
	sortField: ReportSortField | null;
	sortDir: SortDir;
	onSort: (field: ReportSortField) => void;
	emptyKey: TranslationKeys;
	onView: (report: ReportDocument) => void;
	onOpenFile: (report: ReportDocument) => void;
	onDelete: (report: ReportDocument) => void;
}

/**
 * Rapporterlista's table: four sortable columns, then the eye and ⋮ in a
 * column pinned to the right. The table scrolls sideways inside itself, so the
 * page never does.
 */
export function ReportsTable({
	reports,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	onView,
	onOpenFile,
	onDelete,
}: ReportsTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{REPORT_COLUMNS.map((column) => (
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
					{reports.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={REPORT_COLUMNS.length + 1}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						reports.map((report) => (
							<ReportsTableRow
								key={report.id}
								report={report}
								onView={() => onView(report)}
								onOpenFile={() => onOpenFile(report)}
								onDelete={() => onDelete(report)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default ReportsTable;
