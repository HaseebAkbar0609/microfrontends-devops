"use client";

import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REPORT_CATEGORY_LABELS, REPORT_FILE_RULES } from "../../../constants/forecastReports.constants";
import type { ReportDocument } from "../../../types/forecastReports.types";
import { formatFileSize } from "../../../utils/forecastReports";

/** One labelled line of the record. */
function DetailRow({ labelKey, children }: { labelKey: TranslationKeys; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1 border-b border-slate-100 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
			<span className="text-xs font-medium text-slate-500 sm:w-32 sm:shrink-0">
				<Translate text={labelKey} />
			</span>
			<div className="min-w-0 text-sm text-slate-900">{children}</div>
		</div>
	);
}

export interface ReportDetailsDialogProps {
	report: ReportDocument;
	/** Opens the held file in a new tab; absent on a report that holds none. */
	onOpenFile: () => void;
	onClose: () => void;
}

/**
 * What the eye opens: the filed report as the register holds it. The file
 * itself opens from here too, or says why it cannot — a seeded report, and an
 * uploaded one after a reload, holds no file.
 */
export function ReportDetailsDialog({ report, onOpenFile, onClose }: ReportDetailsDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastReportsDetailsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					<DetailRow labelKey={localizationConstants.forecastReportsColId}>
						<span className="tabular-nums">{report.reportNo}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastReportsColCategory}>
						<Badge variant="category">{t(REPORT_CATEGORY_LABELS[report.category])}</Badge>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastReportsColFile}>
						<div className="flex items-center gap-2.5">
							<RecordFileIcon fileName={report.fileName} types={REPORT_FILE_RULES.types} />
							<span className="truncate" title={report.fileName}>
								{report.fileName}
							</span>
						</div>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastReportsColDate}>
						<span className="tabular-nums">{report.date}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastReportsDetailSize}>
						{report.fileSize === undefined ? (
							<span className="text-slate-500">
								<Translate text={localizationConstants.forecastReportsSizeUnknown} />
							</span>
						) : (
							<span className="tabular-nums">{formatFileSize(report.fileSize)}</span>
						)}
					</DetailRow>
				</div>

				{!report.url && (
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.forecastReportsNoFile} />
					</p>
				)}

				<DialogFooter className="gap-2 sm:gap-3">
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.buttonClose} />
					</Button>
					<Button
						type="button"
						onClick={onOpenFile}
						disabled={!report.url}
						className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 disabled:cursor-not-allowed"
					>
						<ExternalLink className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastReportsOpenFile} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ReportDetailsDialog;
