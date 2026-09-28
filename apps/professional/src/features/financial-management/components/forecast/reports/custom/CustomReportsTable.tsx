"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../../constants/forecastList.constants";
import { CUSTOM_REPORT_COLUMNS } from "../../../../constants/forecastCustomReports.constants";
import type { CustomReport, CustomReportSortField } from "../../../../types/forecastCustomReports.types";
import { CustomReportsTableRow } from "./CustomReportsTableRow";

export interface CustomReportsTableProps {
	reports: CustomReport[];
	sortField: CustomReportSortField | null;
	sortDir: SortDir;
	onSort: (field: CustomReportSortField) => void;
	emptyKey: TranslationKeys;
	onView: (report: CustomReport) => void;
	onDownload: (report: CustomReport) => void;
	onDelete: (report: CustomReport) => void;
}

/**
 * Anpassade rapporter's table: four sortable columns, then the eye and ⋮ in a
 * column pinned to the right. The table scrolls sideways inside itself, so the
 * page never does.
 */
export function CustomReportsTable({
	reports,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	onView,
	onDownload,
	onDelete,
}: CustomReportsTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{CUSTOM_REPORT_COLUMNS.map((column) => (
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
								colSpan={CUSTOM_REPORT_COLUMNS.length + 1}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						reports.map((report) => (
							<CustomReportsTableRow
								key={report.id}
								report={report}
								onView={() => onView(report)}
								onDownload={() => onDownload(report)}
								onDelete={() => onDelete(report)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default CustomReportsTable;
