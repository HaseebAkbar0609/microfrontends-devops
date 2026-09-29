"use client";

import { Eye, ExternalLink, Trash2 } from "lucide-react";

import { RecordFileNameCell } from "@/components/table/RecordFileNameCell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RowActionMenu, RowMenuAction } from "@/features/project/production/components/RowActionMenu";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import { REPORT_CATEGORY_LABELS, REPORT_FILE_RULES } from "../../../constants/forecastReports.constants";
import type { ReportDocument } from "../../../types/forecastReports.types";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

export interface ReportsTableRowProps {
	report: ReportDocument;
	onView: () => void;
	onOpenFile: () => void;
	onDelete: () => void;
}

/** One filed report: its number, what it covers, the file itself and its date. */
export function ReportsTableRow({ report, onView, onOpenFile, onDelete }: ReportsTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow className="group hover:bg-slate-50">
			<TableCell className={cn(CELL, "font-medium tabular-nums")}>{report.reportNo}</TableCell>

			<TableCell className={CELL}>
				<Badge variant="category">{t(REPORT_CATEGORY_LABELS[report.category])}</Badge>
			</TableCell>

			<TableCell className="max-w-[20rem] px-4 py-2">
				<RecordFileNameCell fileName={report.fileName} types={REPORT_FILE_RULES.types} />
			</TableCell>

			<TableCell className={cn(CELL, "tabular-nums")}>{report.date}</TableCell>

			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastReportsViewDetailsFor, { report: report.reportNo })}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>

					<RowActionMenu
						ariaLabel={t(localizationConstants.forecastReportsRowActionsFor, { report: report.reportNo })}
					>
						<RowMenuAction
							icon={ExternalLink}
							labelKey={localizationConstants.forecastReportsOpenFile}
							/* A seeded report, and an uploaded one after a reload, holds no file. */
							reasonKey={report.url ? null : localizationConstants.forecastReportsNoFile}
							onSelect={onOpenFile}
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

export default ReportsTableRow;
