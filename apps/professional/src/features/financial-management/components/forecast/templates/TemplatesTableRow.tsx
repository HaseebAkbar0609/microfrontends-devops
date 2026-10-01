"use client";

import { Eye, ExternalLink, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RowActionMenu, RowMenuAction } from "@/features/project/production/components/RowActionMenu";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import type { TemplateColumnKey, TemplateDocument } from "../../../types/forecastTemplates.types";
import { TemplateCell } from "./TemplateCell";

export interface TemplatesTableRowProps {
	template: TemplateDocument;
	/** The columns the `+` is showing, in header order. */
	columns: readonly { key: TemplateColumnKey }[];
	onView: () => void;
	onOpenFile: () => void;
	onDelete: () => void;
}

/** One template: whichever columns are shown, then the eye and the ⋮. */
export function TemplatesTableRow({
	template,
	columns,
	onView,
	onOpenFile,
	onDelete,
}: TemplatesTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow className="group hover:bg-slate-50">
			{columns.map((column) => (
				<TemplateCell key={column.key} template={template} columnKey={column.key} />
			))}

			{/* Pinned, so the actions stay reachable while the table scrolls sideways.
			    A sticky cell drops the row's hover colour unless it repeats it. */}
			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastTemplatesViewDetailsFor, {
							template: template.templateNo,
						})}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>

					<RowActionMenu
						ariaLabel={t(localizationConstants.forecastTemplatesRowActionsFor, {
							template: template.templateNo,
						})}
					>
						<RowMenuAction
							icon={ExternalLink}
							labelKey={localizationConstants.forecastTemplatesOpenFile}
							/* A seeded template, and a new one after a reload, holds no file. */
							reasonKey={template.url ? null : localizationConstants.forecastTemplatesNoFile}
							onSelect={onOpenFile}
						/>
						<RowMenuAction
							icon={Trash2}
							labelKey={localizationConstants.forecastTemplatesDelete}
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

export default TemplatesTableRow;
