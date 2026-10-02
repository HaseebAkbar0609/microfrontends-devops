"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	FORECAST_ACTION_COLUMN,
	FORECAST_CELL_CLASS,
	FORECAST_LIST_COLUMNS,
	FORECAST_LIST_STATUSES,
	FORECAST_NUMERIC_FIELDS,
} from "../../../constants/forecastList.constants";
import type { ForecastListRow, ForecastListSortField } from "../../../types/forecastList.types";
import { formatForecastField } from "../../../utils/forecastList";
import { ForecastRowMenu } from "./ForecastRowMenu";

const CELL = FORECAST_CELL_CLASS;

/** Every column but Status, which is a tag; the actions follow it. */
const TEXT_FIELDS = FORECAST_LIST_COLUMNS.map((column) => column.key).filter((key) => key !== "status");

/** Kostnadsställe is cut short, as the frame draws it, with the whole value in its tooltip. */
const TRUNCATED: Partial<Record<ForecastListSortField, string>> = { costCentre: "max-w-24" };
const NUMERIC = FORECAST_NUMERIC_FIELDS;

export interface ForecastListTableRowProps {
	row: ForecastListRow;
	onView: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

export function ForecastListTableRow({ row, onView, onToggleArchive, onDelete }: ForecastListTableRowProps) {
	const t = useTranslate();
	const status = FORECAST_LIST_STATUSES[row.status];

	return (
		<TableRow className="group hover:bg-slate-50">
			{TEXT_FIELDS.map((field) => {
				const text = formatForecastField(row, field, t);
				const truncate = TRUNCATED[field];
				return (
					<TableCell key={field} className={cn(CELL, NUMERIC.has(field) && "tabular-nums", truncate)}>
						{truncate ? (
							<span className="block truncate" title={text}>
								{text}
							</span>
						) : (
							text
						)}
					</TableCell>
				);
			})}
			<TableCell className={CELL}>
				<span className={cn("rounded-sm px-1.5 py-0.5 text-[11px] font-semibold", status.className)}>
					{t(status.labelKey)}
				</span>
			</TableCell>
			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastViewDetailsFor, { object: row.objectNo })}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>
					<ForecastRowMenu
						objectNo={row.objectNo}
						archived={row.archived}
						onView={onView}
						onToggleArchive={onToggleArchive}
						onDelete={onDelete}
					/>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default ForecastListTableRow;
