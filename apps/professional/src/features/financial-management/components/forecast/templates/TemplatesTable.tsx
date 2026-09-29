"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectColumnPicker } from "@/features/project/components/ProjectColumnPicker";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import type {
	TemplateColumnKey,
	TemplateDocument,
	TemplateSortField,
} from "../../../types/forecastTemplates.types";
import { TemplatesTableRow } from "./TemplatesTableRow";

type TemplateColumn = { key: TemplateColumnKey; labelKey: TranslationKeys };

export interface TemplatesTableProps {
	templates: TemplateDocument[];
	/** Every column on offer — what the `+` lists, including the hidden ones. */
	columns: readonly TemplateColumn[];
	/** The ones being drawn, in header order. */
	shownColumns: readonly TemplateColumn[];
	visibleColumns: ReadonlySet<TemplateColumnKey>;
	onToggleColumn: (key: TemplateColumnKey) => void;
	sortField: TemplateSortField | null;
	sortDir: SortDir;
	onSort: (field: TemplateSortField) => void;
	emptyKey: TranslationKeys;
	onView: (template: TemplateDocument) => void;
	onOpenFile: (template: TemplateDocument) => void;
	onDelete: (template: TemplateDocument) => void;
}

/**
 * Mallar's table: the chosen columns, each sortable, then the actions in a
 * column pinned to the right. The table scrolls sideways inside itself, so the
 * page never does.
 *
 * The frame's `+` sits in that last header cell and chooses the columns. It
 * has to live there rather than in a cell of its own: `sticky right-0` pins to
 * the container's edge, so a sticky cell with anything after it paints over
 * what follows as soon as the table scrolls.
 */
export function TemplatesTable({
	templates,
	columns,
	shownColumns,
	visibleColumns,
	onToggleColumn,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	onView,
	onOpenFile,
	onDelete,
}: TemplatesTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[56rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{shownColumns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						<TableHead className={cn(FORECAST_ACTION_COLUMN, "z-20 w-24")}>
							<div className="flex items-center justify-end">
								<span className="sr-only">
									<Translate text={localizationConstants.actionsAriaLabel} />
								</span>
								{/* The full list, never `shownColumns` — a hidden column has to
								    stay in the menu that brings it back. */}
								<ProjectColumnPicker
									columns={columns}
									visibleColumns={visibleColumns}
									onToggleColumn={onToggleColumn}
									ariaLabelKey={localizationConstants.forecastTemplatesColumnPicker}
								/>
							</div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{templates.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={shownColumns.length + 1}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						templates.map((template) => (
							<TemplatesTableRow
								key={template.id}
								template={template}
								columns={shownColumns}
								onView={() => onView(template)}
								onOpenFile={() => onOpenFile(template)}
								onDelete={() => onDelete(template)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default TemplatesTable;
