"use client";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_COLUMNS } from "../../../../../constants/forecastList.constants";
import type { ForecastListSortField } from "../../../../../types/forecastList.types";

export interface CustomReportColumnPanelProps {
	draftColumns: ReadonlySet<ForecastListSortField>;
	onToggleColumn: (key: ForecastListSortField) => void;
	onApply: () => void;
	onDiscard: () => void;
	/** Whether the ticks differ from what the table is showing. */
	pendingChanges: boolean;
	pendingCount: number;
	/** Set when the reader tried to untick the only column left. */
	lastColumnBlocked: boolean;
}

/**
 * Which columns the report carries.
 *
 * The ticks are a draft: Spara applies them to the table, Kasta bort returns
 * them to what is applied. A thirteen-column table that re-laid itself out on
 * every tick would be unreadable, and the frame draws both buttons.
 */
export function CustomReportColumnPanel({
	draftColumns,
	onToggleColumn,
	onApply,
	onDiscard,
	pendingChanges,
	pendingCount,
	lastColumnBlocked,
}: CustomReportColumnPanelProps) {
	const t = useTranslate();

	return (
		<div className="rounded-lg border border-slate-200 bg-white p-4">
			<h2 id="custom-report-columns" className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.forecastCustomReportsColumns} />
			</h2>
			<p className="mt-1 text-xs text-slate-500">
				<Translate text={localizationConstants.forecastCustomReportsColumnsHint} />
			</p>

			<div role="group" aria-labelledby="custom-report-columns" className="mt-3 flex flex-col">
				{FORECAST_LIST_COLUMNS.map((column) => (
					<label
						key={column.key}
						className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal text-slate-700 hover:bg-slate-50"
					>
						<Checkbox
							checked={draftColumns.has(column.key)}
							onCheckedChange={() => onToggleColumn(column.key)}
						/>
						<Translate text={column.labelKey} />
					</label>
				))}
			</div>

			{lastColumnBlocked && (
				<p className="mt-2 text-xs text-red-600">
					<Translate text={localizationConstants.forecastCustomReportsLastColumn} />
				</p>
			)}

			{pendingChanges && (
				<p className="mt-2 text-xs text-slate-500">
					{t(localizationConstants.forecastCustomReportsPendingChanges, { count: pendingCount })}
				</p>
			)}

			<div className="mt-4 flex flex-col gap-2">
				<Button
					type="button"
					onClick={onApply}
					disabled={!pendingChanges}
					aria-label={t(localizationConstants.forecastCustomReportsApplyColumnsAria)}
					className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 disabled:cursor-not-allowed"
				>
					<Check className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.buttonSave} />
				</Button>
				<Button
					type="button"
					variant="secondary"
					onClick={onDiscard}
					disabled={!pendingChanges}
					aria-label={t(localizationConstants.forecastCustomReportsDiscardColumnsAria)}
					className="h-10 w-full cursor-pointer gap-2 bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:cursor-not-allowed"
				>
					<X className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.forecastCustomReportsDiscard} />
				</Button>
			</div>
		</div>
	);
}

export default CustomReportColumnPanel;
