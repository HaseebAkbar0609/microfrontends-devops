"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	Pencil,
	Archive,
	Trash2,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ActiveProject } from "../types";
import {
	ACTIVE_PROJECT_COLUMNS,
	ACTIVE_PROJECT_STATUS_LABEL_KEY,
	ACTIVE_PROJECT_STATUS_VARIANT,
} from "../constants";

type ActiveProjectColumnField =
	(typeof ACTIVE_PROJECT_COLUMNS)[number]["field"];

interface ActiveProjectsTableProps {
	data: ActiveProject[];
	totalItems: number;
	onArchive: (project: ActiveProject) => void;
	onDelete: (project: ActiveProject) => void;
}

const COLUMN_LAYOUT: Record<
	ActiveProjectColumnField,
	{ head: string; cell: string }
> = {
	referenceNo: {
		head: "w-[7rem] min-w-[6rem]",
		cell: "whitespace-nowrap align-middle",
	},
	name: {
		head: "min-w-[12rem] w-[22%]",
		cell: "min-w-[12rem] max-w-[18rem] whitespace-normal break-words align-middle leading-snug",
	},
	orderNo: {
		head: "w-[8rem] min-w-[7rem]",
		cell: "whitespace-nowrap align-middle tabular-nums",
	},
	quoteReferenceNo: {
		head: "w-[11rem] min-w-[9rem]",
		cell: "whitespace-nowrap align-middle tabular-nums",
	},
	companyName: {
		head: "min-w-[11rem] w-[20%]",
		cell: "min-w-[11rem] whitespace-normal break-words align-middle",
	},
	status: {
		head: "w-[8.5rem] min-w-[7.5rem]",
		cell: "whitespace-nowrap align-middle",
	},
	actions: {
		head: "w-20 min-w-[5rem]",
		cell: "whitespace-nowrap align-middle",
	},
};

const SortIcon = ({
	field,
	sortBy,
	sortOrder,
}: {
	field: string;
	sortBy: string;
	sortOrder: string;
}) => {
	if (sortBy !== field)
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
	);
};

const ActiveProjectActions = ({
	project,
	onArchive,
	onDeleteRequest,
}: {
	project: ActiveProject;
	onArchive: (project: ActiveProject) => void;
	onDeleteRequest: (project: ActiveProject) => void;
}) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9 text-accent-foreground hover:text-accent-foreground bg-muted rounded-md"
			>
				<MoreVertical className="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" className="w-[150px]">
			<DropdownMenuItem asChild className="gap-2 cursor-pointer py-2">
				<Link
					href={`/projectmanagement/${project.id}`}
					className="flex w-full items-center"
				>
					<Pencil className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.edit} />
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem
				className="gap-2 cursor-pointer py-2"
				onClick={() => onArchive(project)}
			>
				<Archive className="h-4 w-4 text-accent-foreground" />
				<Translate text={localizationConstants.archive} />
			</DropdownMenuItem>
			<DropdownMenuItem
				className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
				onClick={() => onDeleteRequest(project)}
			>
				<Trash2 className="h-4 w-4 text-accent-foreground" />
				<Translate text={localizationConstants.delete} />
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

export function ActiveProjectsTable({
	data,
	totalItems,
	onArchive,
	onDelete,
}: ActiveProjectsTableProps) {
	const { query, changeQueries } = useQueryParams();
	const [deleteTarget, setDeleteTarget] = useState<ActiveProject | null>(
		null,
	);

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");

	const handleSort = useCallback(
		(field: string, sortable: boolean) => {
			if (!sortable) return;

			let nextOrder: string | null = "asc";
			if (sortBy === field) {
				if (sortOrder === "asc") nextOrder = "desc";
				else if (sortOrder === "desc") nextOrder = null;
			}

			changeQueries({
				sort_by: nextOrder ? field : null,
				sort_order: nextOrder,
				page: "1",
			});
		},
		[sortBy, sortOrder, changeQueries],
	);

	const renderCell = useCallback(
		(project: ActiveProject, columnKey: ActiveProjectColumnField) => {
			switch (columnKey) {
				case "referenceNo":
					return (
						<Link
							href={`/projectmanagement/${project.id}`}
							className="font-medium text-slate-950 hover:underline"
						>
							{project.referenceNo}
						</Link>
					);
				case "name":
					return (
						<Link
							href={`/projectmanagement/${project.id}`}
							className="text-slate-600 hover:underline"
						>
							{project.name}
						</Link>
					);
				case "orderNo":
					return (
						<span className="text-slate-600">
							{project.orderNo && project.orderNo !== "-"
								? project.orderNo
								: "2024-01"}
						</span>
					);
				case "quoteReferenceNo":
					return (
						<span className="text-slate-600">
							{project.quoteReferenceNo ?? "—"}
						</span>
					);
				case "companyName":
					return (
						<span className="text-slate-600">
							{project.companyName}
						</span>
					);
				case "status":
					return (
						<Badge
							variant={
								ACTIVE_PROJECT_STATUS_VARIANT[project.status]
							}
							className="rounded-[6px] px-2.5 py-0.5 whitespace-nowrap"
						>
							<Translate
								text={
									ACTIVE_PROJECT_STATUS_LABEL_KEY[
										project.status
									]
								}
							/>
						</Badge>
					);
				case "actions":
					return (
						<ActiveProjectActions
							project={project}
							onArchive={onArchive}
							onDeleteRequest={setDeleteTarget}
						/>
					);
				default:
					return null;
			}
		},
		[onArchive],
	);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / pageSize),
		[totalItems, pageSize],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md border border-slate-200 overflow-x-auto">
				<Table className="w-full min-w-[56rem] table-auto">
					<colgroup>
						{ACTIVE_PROJECT_COLUMNS.map((col) => (
							<col
								key={col.field}
								className={COLUMN_LAYOUT[col.field].head}
							/>
						))}
					</colgroup>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{ACTIVE_PROJECT_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									scope="col"
									aria-sort={
										col.sortable && sortBy === col.field
											? sortOrder === "asc"
												? "ascending"
												: "descending"
											: undefined
									}
									className={cn(
										"select-none text-slate-500 font-medium py-3.5 px-4 h-auto text-left whitespace-nowrap",
										COLUMN_LAYOUT[col.field].head,
										col.sortable
											? "cursor-pointer"
											: "cursor-default",
									)}
									onClick={() =>
										handleSort(col.field, col.sortable)
									}
								>
									<div
										className={cn(
											"flex items-center gap-1 min-w-0",
											col.field === "actions" &&
												"justify-end",
										)}
									>
										<Translate text={col.label} />
										{col.sortable && (
											<SortIcon
												field={col.field}
												sortBy={sortBy}
												sortOrder={sortOrder}
											/>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((project) => (
							<TableRow
								key={project.id}
								className="border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
							>
								{ACTIVE_PROJECT_COLUMNS.map((col) => (
									<TableCell
										key={`${project.id}-${col.field}`}
										className={cn(
											"py-3.5 px-4",
											COLUMN_LAYOUT[col.field].cell,
											col.field === "actions" &&
												"text-right",
										)}
									>
										{renderCell(project, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={ACTIVE_PROJECT_COLUMNS.length}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={
											localizationConstants.projectNoProjectsFound
										}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={(newPage) =>
					changeQueries({ page: String(newPage) })
				}
				onPageSizeChange={(newSize) =>
					changeQueries({ page: "1", page_size: String(newSize) })
				}
			/>

			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-800">
							<Translate
								text={
									localizationConstants.deleteProjectConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={
									localizationConstants.deleteProjectConfirmDescription
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel
							className="min-w-24"
							onClick={() => setDeleteTarget(null)}
						>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							className="min-w-24 bg-red-600 hover:bg-red-700 text-white"
							onClick={() => {
								if (deleteTarget) onDelete(deleteTarget);
								setDeleteTarget(null);
							}}
						>
							<Translate text={localizationConstants.delete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
