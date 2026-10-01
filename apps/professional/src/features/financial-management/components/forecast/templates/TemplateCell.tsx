"use client";

import { RecordFileNameCell } from "@/components/table/RecordFileNameCell";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import {
	TEMPLATE_CATEGORY_LABELS,
	TEMPLATE_FILE_RULES,
} from "../../../constants/forecastTemplates.constants";
import type { TemplateColumnKey, TemplateDocument } from "../../../types/forecastTemplates.types";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

export interface TemplateCellProps {
	template: TemplateDocument;
	columnKey: TemplateColumnKey;
}

/**
 * One column's cell for one template.
 *
 * The `+` decides which columns a row draws, so the row cannot lay its cells
 * out in a fixed order; it asks for them by key instead.
 */
export function TemplateCell({ template, columnKey }: TemplateCellProps) {
	const t = useTranslate();

	switch (columnKey) {
		case "templateNo":
			return <TableCell className={cn(CELL, "font-medium tabular-nums")}>{template.templateNo}</TableCell>;

		case "category":
			return (
				<TableCell className={CELL}>
					<Badge variant="category">{t(TEMPLATE_CATEGORY_LABELS[template.category])}</Badge>
				</TableCell>
			);

		case "date":
			return <TableCell className={cn(CELL, "tabular-nums")}>{template.date}</TableCell>;

		case "documentName":
			return (
				<TableCell className="max-w-[18rem] px-4 py-3.5 text-sm text-slate-900">
					<span className="block truncate" title={template.documentName}>
						{template.documentName}
					</span>
				</TableCell>
			);

		case "fileName":
			return (
				<TableCell className="max-w-[20rem] px-4 py-2">
					<RecordFileNameCell fileName={template.fileName} types={TEMPLATE_FILE_RULES.types} />
				</TableCell>
			);
	}
}

export default TemplateCell;
