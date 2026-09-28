"use client";

import { Download, Eye, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RowActionMenu, RowMenuAction } from "@/features/project/production/components/RowActionMenu";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN, FORECAST_CELL_CLASS } from "../../../../constants/forecastList.constants";
import type { CustomReport } from "../../../../types/forecastCustomReports.types";
import { customReportFileName } from "../../../../utils/forecastCustomReports";
import { ReportFileCell } from "../ReportFileCell";

export interface CustomReportsTableRowProps {
	report: CustomReport;
	onView: () => void;
	onDownload: () => void;
	onDelete: () => void;
}

/** One saved report: its number, the name it was given, its sheet and its date. */
export function CustomReportsTableRow({ report, onView, onDownload, onDelete }: CustomReportsTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow className="group hover:bg-slate-50">
			<TableCell className={cn(FORECAST_CELL_CLASS, "font-medium tabular-nums")}>{report.reportNo}</TableCell>

			<TableCell className={FORECAST_CELL_CLASS}>
				<Badge variant="category">{report.name}</Badge>
			</TableCell>

			<TableCell className="max-w-[20rem] px-4 py-2">
				<ReportFileCell fileName={customReportFileName(report)} />
			</TableCell>

			<TableCell className={cn(FORECAST_CELL_CLASS, "tabular-nums")}>{report.date}</TableCell>

			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastCustomReportsViewDetailsFor, { report: report.reportNo })}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>

					<RowActionMenu
						ariaLabel={t(localizationConstants.forecastCustomReportsRowActionsFor, { report: report.reportNo })}
					>
						{/* The sheet is written from the live list, so this is never unavailable. */}
						<RowMenuAction
							icon={Download}
							labelKey={localizationConstants.forecastCustomReportsDownload}
							reasonKey={null}
							onSelect={onDownload}
						/>
						<RowMenuAction
							icon={Trash2}
							labelKey={localizationConstants.forecastReportsDelete}
							reasonKey={null}
							destructive
							onSelect={onDelete}
						/>
					</RowActionMenu>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default CustomReportsTableRow;
