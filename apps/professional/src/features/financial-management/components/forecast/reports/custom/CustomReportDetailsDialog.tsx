"use client";

import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_COLUMNS } from "../../../../constants/forecastList.constants";
import { REPORT_FILE_RULES } from "../../../../constants/forecastReports.constants";
import type { CustomReport } from "../../../../types/forecastCustomReports.types";
import { customReportFileName } from "../../../../utils/forecastCustomReports";
import { ReportDetailRow } from "../ReportDetailRow";

export interface CustomReportDetailsDialogProps {
	report: CustomReport;
	onDownload: () => void;
	onClose: () => void;
}

/** What the eye opens: the saved report, and which columns it carries. */
export function CustomReportDetailsDialog({ report, onDownload, onClose }: CustomReportDetailsDialogProps) {
	const t = useTranslate();
	const fileName = customReportFileName(report);
	const columns = FORECAST_LIST_COLUMNS.filter((column) => report.columns.includes(column.key));

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastReportsDetailsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					<ReportDetailRow labelKey={localizationConstants.forecastReportsColId}>
						<span className="tabular-nums">{report.reportNo}</span>
					</ReportDetailRow>

					<ReportDetailRow labelKey={localizationConstants.forecastCustomReportsColName}>
						<Badge variant="category">{report.name}</Badge>
					</ReportDetailRow>

					<ReportDetailRow labelKey={localizationConstants.forecastReportsColFile}>
						<div className="flex items-center gap-2.5">
							<RecordFileIcon fileName={fileName} types={REPORT_FILE_RULES.types} />
							<span className="truncate" title={fileName}>
								{fileName}
							</span>
						</div>
					</ReportDetailRow>

					<ReportDetailRow labelKey={localizationConstants.forecastReportsColDate}>
						<span className="tabular-nums">{report.date}</span>
					</ReportDetailRow>

					<ReportDetailRow labelKey={localizationConstants.forecastCustomReportsColumns}>
						<div className="flex flex-wrap gap-1.5">
							{columns.map((column) => (
								<Badge key={column.key} variant="category">
									{t(column.labelKey)}
								</Badge>
							))}
						</div>
						<p className="mt-1.5 text-xs text-slate-500">
							{t(localizationConstants.forecastCustomReportsColumnCount, { count: columns.length })}
						</p>
					</ReportDetailRow>
				</div>

				<DialogFooter className="gap-2 sm:gap-3">
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.buttonClose} />
					</Button>
					<Button
						type="button"
						onClick={onDownload}
						className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800"
					>
						<Download className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastCustomReportsDownload} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CustomReportDetailsDialog;
