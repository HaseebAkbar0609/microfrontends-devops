"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectSortField } from "../hooks/useProjectOverviewFilters";
import { PROJECT_COLUMNS } from "./projectColumns";

export interface ProjectColumnPickerProps {
	visibleColumns: Set<ProjectSortField>;
	onToggleColumn: (key: ProjectSortField) => void;
}

/** The `+` in the last header cell: which of the ten columns to show. */
export function ProjectColumnPicker({
	visibleColumns,
	onToggleColumn,
}: ProjectColumnPickerProps) {
	const t = useTranslate();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.filter)}
					className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				className="w-56 rounded-md border border-slate-200 bg-white p-2 shadow-md"
			>
				{PROJECT_COLUMNS.map((column) => (
					<label
						key={column.key}
						className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal text-slate-700 hover:bg-slate-50"
					>
						<Checkbox
							checked={visibleColumns.has(column.key)}
							onCheckedChange={() => onToggleColumn(column.key)}
						/>
						<Translate text={column.labelKey} />
					</label>
				))}
			</PopoverContent>
		</Popover>
	);
}

export default ProjectColumnPicker;
