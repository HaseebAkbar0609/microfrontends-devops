"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_COLUMNS } from "../../../constants/forecastList.constants";
import type { ForecastListRow } from "../../../types/forecastList.types";
import { formatForecastField } from "../../../utils/forecastList";

export interface ForecastDetailsDialogProps {
	row: ForecastListRow | null;
	open: boolean;
	onClose: () => void;
}

/**
 * Visa detaljer: a forecast's every column, read-only, in two columns. There
 * is no frame for it yet, nor a detail page to link to.
 */
export function ForecastDetailsDialog({ row, open, onClose }: ForecastDetailsDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open={open && row !== null} onOpenChange={(next) => !next && onClose()}>
			{row && (
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{t(localizationConstants.forecastDetailsTitle, { object: row.objectNo })}</DialogTitle>
						<DialogDescription>
							{row.customer} · {row.projectName}
						</DialogDescription>
					</DialogHeader>

					<dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
						{FORECAST_LIST_COLUMNS.map((column) => (
							<div key={column.key} className="min-w-0">
								<dt className="text-xs text-slate-500">
									<Translate text={column.labelKey} />
								</dt>
								<dd className="font-medium break-words text-slate-900">{formatForecastField(row, column.key, t)}</dd>
							</div>
						))}
					</dl>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
							<Translate text={localizationConstants.confirmClose} />
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
}

export default ForecastDetailsDialog;
