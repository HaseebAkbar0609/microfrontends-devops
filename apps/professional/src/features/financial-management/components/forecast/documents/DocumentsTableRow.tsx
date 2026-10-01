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
import {
	DOCUMENT_CATEGORY_LABELS,
	DOCUMENT_FILE_RULES,
} from "../../../constants/forecastDocuments.constants";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import type { ForecastDocument } from "../../../types/forecastDocuments.types";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

export interface DocumentsTableRowProps {
	document: ForecastDocument;
	onView: () => void;
	onOpenFile: () => void;
	onDelete: () => void;
}

/** One filed document: its number, what it is, the file itself and its date. */
export function DocumentsTableRow({ document, onView, onOpenFile, onDelete }: DocumentsTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow className="group hover:bg-slate-50">
			<TableCell className={cn(CELL, "font-medium tabular-nums")}>{document.documentNo}</TableCell>

			<TableCell className={CELL}>
				<Badge variant="category">{t(DOCUMENT_CATEGORY_LABELS[document.category])}</Badge>
			</TableCell>

			<TableCell className="max-w-[20rem] px-4 py-2">
				<RecordFileNameCell fileName={document.fileName} types={DOCUMENT_FILE_RULES.types} />
			</TableCell>

			<TableCell className={cn(CELL, "tabular-nums")}>{document.date}</TableCell>

			{/* Pinned, so the actions stay reachable while the table scrolls
			    sideways. A sticky cell drops the row hover unless it repeats it. */}
			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastDocumentsViewDetailsFor, {
							document: document.documentNo,
						})}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>

					<RowActionMenu
						ariaLabel={t(localizationConstants.forecastDocumentsRowActionsFor, {
							document: document.documentNo,
						})}
					>
						<RowMenuAction
							icon={ExternalLink}
							labelKey={localizationConstants.forecastDocumentsOpenFile}
							/* A seeded document, and a new one after a reload, holds no file. */
							reasonKey={document.url ? null : localizationConstants.forecastDocumentsNoFile}
							onSelect={onOpenFile}
						/>
						<RowMenuAction
							icon={Trash2}
							labelKey={localizationConstants.forecastDocumentsDelete}
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

export default DocumentsTableRow;
