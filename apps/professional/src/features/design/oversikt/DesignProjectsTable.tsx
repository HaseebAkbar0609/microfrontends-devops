"use client";

import { useState } from "react";
import {
	Archive,
	ArrowUpDown,
	MoreVertical,
	Plus,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DesignProjectItem } from "./data/designProjects.mock";
import { DesignProjectSortField } from "./hooks/useDesignProjectFilters";

const DESIGN_COLUMNS: { key: DesignProjectSortField; labelKey: string }[] = [
	{ key: "projectNr", labelKey: localizationConstants.projectListColNr },
	{ key: "name", labelKey: localizationConstants.projectListColName },
	{ key: "category", labelKey: localizationConstants.projectListColCategory },
	{ key: "department", labelKey: localizationConstants.projectListColDepartment },
	{ key: "projectManager", labelKey: localizationConstants.projectListColManager },
	{ key: "customer", labelKey: localizationConstants.projectListColCustomer },
];

interface DesignProjectsTableProps {
	projects: DesignProjectItem[];
	sortField: DesignProjectSortField | null;
	onToggleSort: (field: DesignProjectSortField) => void;
	onOpen: (project: DesignProjectItem) => void;
	onArchive: (project: DesignProjectItem) => void;
	onDelete: (project: DesignProjectItem) => void;
}

const DesignProjectsTable = ({
	projects,
	sortField,
	onToggleSort,
	onOpen,
	onArchive,
	onDelete,
}: DesignProjectsTableProps) => {
	const [visibleColumns, setVisibleColumns] = useState<Set<DesignProjectSortField>>(
		() => new Set(DESIGN_COLUMNS.map((col) => col.key)),
	);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const columns = DESIGN_COLUMNS.filter((col) => visibleColumns.has(col.key));
	const allSelected =
		projects.length > 0 &&
		projects.every((project) => selectedIds.has(project.id));

	const toggleColumn = (key: DesignProjectSortField) => {
		setVisibleColumns((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	};

	const toggleRow = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const toggleAll = () => {
		setSelectedIds(
			allSelected
				? new Set()
				: new Set(projects.map((project) => project.id)),
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			<Table className="w-full min-w-[48rem]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 hover:bg-transparent">
						<TableHead className="w-12 px-4 py-3">
							<Checkbox
								checked={allSelected}
								onCheckedChange={toggleAll}
								aria-label="Select all"
							/>
						</TableHead>
						{columns.map((column) => (
							<TableHead
								key={column.key}
								className="px-4 py-3 text-sm font-medium text-slate-500"
							>
								<button
									type="button"
									onClick={() => onToggleSort(column.key)}
									className="flex cursor-pointer items-center gap-1"
								>
									<Translate text={column.labelKey} />
									<ArrowUpDown
										className={cn(
											"h-3.5 w-3.5",
											sortField === column.key
												? "text-slate-900"
												: "opacity-50",
										)}
									/>
								</button>
							</TableHead>
						))}
						<TableHead className="w-16 px-4 py-3 text-right">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-900"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									className="w-52 rounded-md border border-slate-200 bg-white p-2 shadow-md"
								>
									{DESIGN_COLUMNS.map((column) => (
										<label
											key={column.key}
											className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal text-slate-700 hover:bg-slate-50"
										>
											<Checkbox
												checked={visibleColumns.has(column.key)}
												onCheckedChange={() => toggleColumn(column.key)}
											/>
											<Translate text={column.labelKey} />
										</label>
									))}
								</PopoverContent>
							</Popover>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projects.map((project) => (
						<TableRow
							key={project.id}
							onClick={() => onOpen(project)}
							className="cursor-pointer border-b border-slate-100 hover:bg-slate-50/60"
						>
							<TableCell
								onClick={(event) => event.stopPropagation()}
								className="w-12 px-4 py-3.5"
							>
								<Checkbox
									checked={selectedIds.has(project.id)}
									onCheckedChange={() => toggleRow(project.id)}
									aria-label={project.projectNr}
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
											className="h-8 w-8 rounded-md text-slate-500 hover:text-slate-900"
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
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Translate
												text={localizationConstants.projectListOpen}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onArchive(project)}
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Archive className="h-4 w-4 text-slate-600" />
											<Translate
												text={localizationConstants.projectListArchiveAction}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete(project)}
											className="gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700"
										>
											<Trash2 className="h-4 w-4 text-slate-600" />
											<Translate
												text={localizationConstants.projectListDeleteAction}
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default DesignProjectsTable;
