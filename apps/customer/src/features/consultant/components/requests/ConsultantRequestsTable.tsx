"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	ConsultantRequest,
	ConsultantRequestColumnField,
} from "../../types/consultantRequest";
import { CONSULTANT_REQUEST_COLUMNS } from "../../constants/directory";

interface ConsultantRequestsTableProps {
	data: ConsultantRequest[];
	totalItems: number;
}

const COLUMN_LAYOUT: Record<
	ConsultantRequestColumnField,
	{ head: string; cell: string }
> = {
	project: {
		head: "min-w-[12rem] w-[28%]",
		cell: "min-w-[12rem] align-middle whitespace-normal break-words",
	},
	applications: {
		head: "w-[9rem] min-w-[8rem]",
		cell: "whitespace-nowrap align-middle tabular-nums",
	},
	date: {
		head: "w-[9rem] min-w-[8rem]",
		cell: "whitespace-nowrap align-middle tabular-nums",
	},
	consultant: {
		head: "min-w-[12rem] w-[24%]",
		cell: "min-w-[12rem] align-middle whitespace-normal break-words",
	},
	actions: {
		head: "w-16 min-w-[4rem]",
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

const RequestActions = () => {
	const t = useTranslate();
	const notify = () => showToast("info", t(localizationConstants.comingSoon));

	return (
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
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2"
					onClick={notify}
				>
					<Pencil className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.edit} />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2"
					onClick={notify}
				>
					<Archive className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.archive} />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700"
					onClick={notify}
				>
					<Trash2 className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.delete} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export function ConsultantRequestsTable({
	data,
	totalItems,
}: ConsultantRequestsTableProps) {
	const router = useRouter();
	const { query, changeQueries } = useQueryParams();

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
		(
			request: ConsultantRequest,
			columnKey: ConsultantRequestColumnField,
		) => {
			switch (columnKey) {
				case "project":
					return (
						<span className="font-medium text-slate-950">
							{request.project}
						</span>
					);
				case "applications":
					return (
						<span className="text-slate-600">
							{request.applications}
						</span>
					);
				case "date":
					return (
						<span className="text-slate-600">{request.date}</span>
					);
				case "consultant":
					return (
						<span className="text-slate-600">
							{request.consultant}
						</span>
					);
				case "actions":
					return <RequestActions />;
				default:
					return null;
			}
		},
		[],
	);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / pageSize),
		[totalItems, pageSize],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md border border-slate-200 overflow-x-auto">
				<Table className="w-full min-w-[48rem] table-auto">
					<colgroup>
						{CONSULTANT_REQUEST_COLUMNS.map((col) => (
							<col
								key={col.field}
								className={COLUMN_LAYOUT[col.field].head}
							/>
						))}
					</colgroup>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{CONSULTANT_REQUEST_COLUMNS.map((col) => (
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
						{data.map((request) => (
							<TableRow
								key={request.id}
								onClick={() =>
									router.push(
										`/business/consultant/list?type=${request.consultantType}`,
									)
								}
								className="cursor-pointer border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
							>
								{CONSULTANT_REQUEST_COLUMNS.map((col) => (
									<TableCell
										key={`${request.id}-${col.field}`}
										onClick={
											col.field === "actions"
												? (e) => e.stopPropagation()
												: undefined
										}
										className={cn(
											"py-3.5 px-4",
											COLUMN_LAYOUT[col.field].cell,
											col.field === "actions" &&
												"text-right",
										)}
									>
										{renderCell(request, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={CONSULTANT_REQUEST_COLUMNS.length}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={
											localizationConstants.noRequestsFound
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
		</div>
	);
}
