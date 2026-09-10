"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectListItem } from "../data/projectsOverview.mock";
import { ProjectSortField } from "../hooks/useProjectOverviewFilters";
import type { ProjectRowsMode } from "../hooks/useProjectRows";
import { ProjectColumnPicker } from "./ProjectColumnPicker";
import { ProjectListRow } from "./ProjectListRow";
import { PROJECT_COLUMNS } from "./projectColumns";

export interface ProjectListTableProps {
	projects: ProjectListItem[];
	sortField: ProjectSortField | null;
	/** Which way the active column sorts, so the header can show it. */
	sortDir?: "asc" | "desc" | null;
	onToggleSort: (field: ProjectSortField) => void;
	onOpen: (project: ProjectListItem) => void;
	/** Arkivera in `"list"` mode, Avarkivera in `"archive"` mode. */
	onToggleArchived: (project: ProjectListItem) => void;
	onDelete: (project: ProjectListItem) => void;
	/**
	 * Which list this is. Defaults to `"list"`, so a caller that forgets cannot
	 * turn the shipped project list into an archive.
	 */
	mode?: ProjectRowsMode;
}

/**
 * The project table, shared by the active list and Arkiv.
 *
 * The two screens draw the same columns, the same Kategori pill and the same
 * column picker; only the middle item of the row menu differs, which `mode`
 * decides.
 */
const ProjectListTable = ({
	projects,
	sortField,
	sortDir,
	onToggleSort,
	onOpen,
	onToggleArchived,
	onDelete,
	mode = "list",
}: ProjectListTableProps) => {
	const t = useTranslate();
	const [visibleColumns, setVisibleColumns] = useState<Set<ProjectSortField>>(
		() => new Set(PROJECT_COLUMNS.map((column) => column.key)),
	);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const columns = PROJECT_COLUMNS.filter((column) =>
		visibleColumns.has(column.key),
	);
	const allSelected =
		projects.length > 0 &&
		projects.every((project) => selectedIds.has(project.id));

	const toggleIn = <T,>(set: Set<T>, value: T) => {
		const next = new Set(set);
		if (next.has(value)) next.delete(value);
		else next.add(value);
		return next;
	};

	const toggleAll = () =>
		setSelectedIds(
			allSelected
				? new Set()
				: new Set(projects.map((project) => project.id)),
		);

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full min-w-[64rem]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 hover:bg-transparent">
						<TableHead className="w-12 px-4 py-3">
							<Checkbox
								checked={allSelected}
								onCheckedChange={toggleAll}
								aria-label={t(localizationConstants.selectAllLabel)}
							/>
						</TableHead>

						{columns.map((column) => {
							const isSorted = sortField === column.key;

							return (
								<TableHead
									key={column.key}
									aria-sort={
										isSorted && sortDir
											? sortDir === "asc"
												? "ascending"
												: "descending"
											: "none"
									}
									className="px-4 py-3 text-sm font-medium text-slate-500"
								>
									<button
										type="button"
										onClick={() => onToggleSort(column.key)}
										className="flex cursor-pointer items-center gap-1"
									>
										<Translate text={column.labelKey} />
										{isSorted && sortDir ? (
											sortDir === "asc" ? (
												<ArrowUp className="h-3.5 w-3.5 text-slate-900" />
											) : (
												<ArrowDown className="h-3.5 w-3.5 text-slate-900" />
											)
										) : (
											<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
										)}
									</button>
								</TableHead>
							);
						})}

						<TableHead className="w-16 px-4 py-3 text-right">
							<ProjectColumnPicker
								visibleColumns={visibleColumns}
								onToggleColumn={(key) =>
									setVisibleColumns((previous) =>
										toggleIn(previous, key),
									)
								}
							/>
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{projects.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={columns.length + 2}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate
									text={
										mode === "archive"
											? localizationConstants.projectArchiveEmpty
											: localizationConstants.noRecordsFound
									}
								/>
							</TableCell>
						</TableRow>
					) : (
						projects.map((project) => (
							<ProjectListRow
								key={project.id}
								project={project}
								columns={columns}
								selected={selectedIds.has(project.id)}
								onToggleSelected={(id) =>
									setSelectedIds((previous) => toggleIn(previous, id))
								}
								onOpen={onOpen}
								onToggleArchived={onToggleArchived}
								onDelete={onDelete}
								mode={mode}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default ProjectListTable;
