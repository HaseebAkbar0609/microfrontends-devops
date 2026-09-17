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

export interface ProjectColumnPickerProps<TKey extends string> {
	/** The columns on offer, in display order. */
	columns: readonly { key: TKey; labelKey: string }[];
	visibleColumns: ReadonlySet<TKey>;
	onToggleColumn: (key: TKey) => void;
	/**
	 * The trigger's accessible name. Defaults to "Filter", which the project
	 * list has always used; a caller can name it for what it does.
	 */
	ariaLabelKey?: string;
}

/**
 * The `+` in a project table's last header cell: which columns to show.
 *
 * Generic over the column key since the Tidsplan list draws the same `+`. The
 * project list passes its own ten columns and renders exactly as before.
 */
export function ProjectColumnPicker<TKey extends string>({
	columns,
	visibleColumns,
	onToggleColumn,
	ariaLabelKey = localizationConstants.filter,
}: ProjectColumnPickerProps<TKey>) {
	const t = useTranslate();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(ariaLabelKey)}
					className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				className="w-56 rounded-md border border-slate-200 bg-white p-2 shadow-md"
			>
				{columns.map((column) => (
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
