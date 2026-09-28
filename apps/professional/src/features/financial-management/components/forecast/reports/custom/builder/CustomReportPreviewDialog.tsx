"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ForecastListRow, ForecastListSortField } from "../../../../../types/forecastList.types";
import { CustomReportPreviewTable } from "./CustomReportPreviewTable";

export interface CustomReportPreviewDialogProps {
	rows: ForecastListRow[];
	columns: { key: ForecastListSortField; labelKey: TranslationKeys }[];
	emptyKey: TranslationKeys;
	/** True when ticks are waiting to be applied, so the reader knows what is missing. */
	pendingChanges: boolean;
	onClose: () => void;
}

/**
 * The report as it will be filed and downloaded: every row the list holds
 * rather than the page in view, under the columns that have been applied.
 */
export function CustomReportPreviewDialog({
	rows,
	columns,
	emptyKey,
	pendingChanges,
	onClose,
}: CustomReportPreviewDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastCustomReportsPreviewTitle} />
					</DialogTitle>
				</DialogHeader>

				<p className="text-xs text-slate-500">
					{/* Every row the list holds, not the page the builder was showing. */}
					{t(localizationConstants.forecastCustomReportsPreviewRowCount, { count: rows.length })}
				</p>

				{pendingChanges && (
					<p className="text-xs text-amber-700">
						<Translate text={localizationConstants.forecastCustomReportsPreviewUnapplied} />
					</p>
				)}

				<div className="max-h-[60vh] overflow-auto rounded-md border border-slate-200">
					<CustomReportPreviewTable rows={rows} columns={columns} emptyKey={emptyKey} />
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.buttonClose} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CustomReportPreviewDialog;
