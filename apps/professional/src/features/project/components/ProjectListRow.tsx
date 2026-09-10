"use client";

import { Archive, MoreVertical, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectListItem } from "../data/projectsOverview.mock";
import type { ProjectSortField } from "../hooks/useProjectOverviewFilters";
import type { ProjectRowsMode } from "../hooks/useProjectRows";

const MENU_ITEM_CLASS =
	"gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700";

const ICON_CLASS = "h-4 w-4 text-slate-600";

/** The frames print dates with slashes; the rows store them with dashes. */
const formatDate = (value: string) => value.replaceAll("-", "/");

export interface ProjectListRowProps {
	project: ProjectListItem;
	columns: { key: ProjectSortField; labelKey: string }[];
	selected: boolean;
	onToggleSelected: (id: string) => void;
	onOpen: (project: ProjectListItem) => void;
	onToggleArchived: (project: ProjectListItem) => void;
	onDelete: (project: ProjectListItem) => void;
	mode: ProjectRowsMode;
}

/** One project row: the checkbox, the visible cells and the Öppna/…/Radera menu. */
export function ProjectListRow({
	project,
	columns,
	selected,
	onToggleSelected,
	onOpen,
	onToggleArchived,
	onDelete,
	mode,
}: ProjectListRowProps) {
	const t = useTranslate();
	const isArchive = mode === "archive";

	return (
		<TableRow
			onClick={() => onOpen(project)}
			className="cursor-pointer border-b border-slate-100 hover:bg-slate-50/60"
		>
			<TableCell
				onClick={(event) => event.stopPropagation()}
				className="w-12 px-4 py-3.5"
			>
				<Checkbox
					checked={selected}
					onCheckedChange={() => onToggleSelected(project.id)}
					aria-label={`${t(localizationConstants.selectRowLabel)} ${project.projectNr}`}
				/>
			</TableCell>

			{columns.map((column) => (
				<TableCell
					key={column.key}
					className="px-4 py-3.5 text-sm text-slate-700"
				>
					{column.key === "category" ? (
						<span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
							{project.category}
						</span>
					) : column.key === "startDate" || column.key === "endDate" ? (
						formatDate(project[column.key])
					) : (
						project[column.key]
					)}
				</TableCell>
			))}

			<TableCell
				onClick={(event) => event.stopPropagation()}
				className="px-4 py-3.5 text-right"
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							/* Named per row — an unlabelled trigger leaves a
							   screen reader unable to tell the rows apart. */
							aria-label={`${t(localizationConstants.actions)} ${project.projectNr}`}
							className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						<DropdownMenuItem
							onClick={() => onOpen(project)}
							className={MENU_ITEM_CLASS}
						>
							<Pencil className={ICON_CLASS} />
							<Translate text={localizationConstants.projectListOpen} />
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => onToggleArchived(project)}
							className={MENU_ITEM_CLASS}
						>
							{isArchive ? (
								<RotateCcw className={ICON_CLASS} />
							) : (
								<Archive className={ICON_CLASS} />
							)}
							<Translate
								text={
									isArchive
										? localizationConstants.projectListUnarchiveAction
										: localizationConstants.projectListArchiveAction
								}
							/>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => onDelete(project)}
							className={MENU_ITEM_CLASS}
						>
							<Trash2 className={ICON_CLASS} />
							<Translate
								text={localizationConstants.projectListDeleteAction}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export default ProjectListRow;
