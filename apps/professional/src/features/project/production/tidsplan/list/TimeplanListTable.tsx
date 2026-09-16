"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectColumnPicker } from "../../../components/ProjectColumnPicker";
import { authorName, kindLabelKey } from "../timeplan.config";
import { formatStartDate } from "../timeline";
import type { Timeplan } from "../types";
import { TimeplanRowMenu } from "./TimeplanRowMenu";
import {
	TIMEPLAN_LIST_COLUMNS,
	type TimeplanColumnKey,
} from "./timeplanListColumns";

export interface TimeplanListTableProps {
	plans: Timeplan[];
	visibleColumns: ReadonlySet<TimeplanColumnKey>;
	onToggleColumn: (key: TimeplanColumnKey) => void;
	sortField: TimeplanColumnKey | null;
	sortDir: SortDir;
	onSort: (key: TimeplanColumnKey) => void;
	onView: (plan: Timeplan) => void;
	onEdit: (plan: Timeplan) => void;
	onDelete: (plan: Timeplan) => void;
}

function ariaSort(active: boolean, dir: SortDir) {
	if (!active || !dir) return "none" as const;
	return dir === "asc" ? ("ascending" as const) : ("descending" as const);
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
	if (active && dir === "asc") return <ArrowUp className="h-3.5 w-3.5" aria-hidden />;
	if (active && dir === "desc") return <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
	return <ArrowUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden />;
}

/**
 * The project's timeplans.
 *
 * Hand-rolled on the table primitives rather than `DataTable`, which has no slot
 * for the frame's header `+` and squeezes a row button and its ⋮ into one 50px
 * sticky cell. Sortable headers are real buttons with `aria-sort` — the
 * keyboard path `DataTable` lacks.
 */
export function TimeplanListTable({
	plans,
	visibleColumns,
	onToggleColumn,
	sortField,
	sortDir,
	onSort,
	onView,
	onEdit,
	onDelete,
}: TimeplanListTableProps) {
	const t = useTranslate();
	const columns = TIMEPLAN_LIST_COLUMNS.filter((column) =>
		visibleColumns.has(column.key),
	);

	const cell = (plan: Timeplan, key: TimeplanColumnKey) => {
		if (key === "createdDate") return formatStartDate(plan.createdDate);
		if (key === "createdById") return authorName(plan.createdById);
		return <Translate text={kindLabelKey(plan.kind)} />;
	};

	/* Kind alone is ambiguous when a project has two main plans; the date isn't. */
	const planLabel = (plan: Timeplan) =>
		`${t(kindLabelKey(plan.kind))} ${formatStartDate(plan.createdDate)}`;

	return (
		<Table className="min-w-[36rem]">
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					{columns.map((column) => (
						<TableHead
							key={column.key}
							aria-sort={
								column.sortable
									? ariaSort(sortField === column.key, sortDir)
									: undefined
							}
							className="h-12 px-4 text-sm font-medium text-slate-500"
						>
							{column.sortable ? (
								<button
									type="button"
									onClick={() => onSort(column.key)}
									className="inline-flex cursor-pointer items-center gap-2 rounded hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
								>
									<Translate text={column.labelKey} />
									<SortIcon active={sortField === column.key} dir={sortDir} />
								</button>
							) : (
								<Translate text={column.labelKey} />
							)}
						</TableHead>
					))}
					<TableHead className="w-40" />
					<TableHead className="w-16 border-l border-slate-200 px-2 text-center">
						<ProjectColumnPicker
							columns={TIMEPLAN_LIST_COLUMNS}
							visibleColumns={visibleColumns}
							onToggleColumn={onToggleColumn}
							ariaLabelKey={localizationConstants.projectTimeplanColumnPicker}
						/>
					</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{plans.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={columns.length + 2}
							className="py-12 text-center text-sm text-slate-500"
						>
							<Translate text={localizationConstants.projectTimeplanEmpty} />
						</TableCell>
					</TableRow>
				) : (
					plans.map((plan) => (
						<TableRow key={plan.id}>
							{columns.map((column) => (
								<TableCell
									key={column.key}
									className={
										column.key === "kind"
											? "h-14 px-4 text-sm font-semibold text-slate-900"
											: "h-14 px-4 text-sm text-slate-700"
									}
								>
									{cell(plan, column.key)}
								</TableCell>
							))}
							<TableCell className="px-4 text-right">
								<Button
									type="button"
									variant="outline"
									onClick={() => onView(plan)}
									className="h-9 cursor-pointer rounded-md border-slate-200 px-3 text-sm font-medium text-slate-900"
								>
									<Translate text={localizationConstants.projectTimeplanViewTitle} />
								</Button>
							</TableCell>
							<TableCell className="border-l border-slate-200 px-2 text-center">
								<TimeplanRowMenu
									ariaLabel={`${t(localizationConstants.actions)} ${planLabel(plan)}`}
									onEdit={() => onEdit(plan)}
									onDelete={() => onDelete(plan)}
								/>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}

export default TimeplanListTable;
