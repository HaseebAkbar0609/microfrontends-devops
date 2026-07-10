"use client";

import { useCallback, useMemo } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	UserRound,
	MessageSquare,
	Briefcase,
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
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { cn, getInitials } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	Consultant,
	ConsultantColumnField,
} from "../types/consultant";
import {
	CONSULTANT_COLUMNS,
	CONSULTANT_STATUS_LABEL_KEY,
	CONSULTANT_TYPE_LABEL_KEY,
} from "../constants";
import { getConsultantStatusVariant } from "../utils/statusVariant";

interface ConsultantTableProps {
	data: Consultant[];
	totalItems: number;
}

const COLUMN_LAYOUT: Record<
	ConsultantColumnField,
	{ head: string; cell: string }
> = {
	name: {
		head: "min-w-[14rem] w-[24%]",
		cell: "min-w-[14rem] align-middle",
	},
	specialty: {
		head: "min-w-[10rem] w-[16%]",
		cell: "min-w-[10rem] align-middle whitespace-nowrap",
	},
	project: {
		head: "min-w-[12rem] w-[20%]",
		cell: "min-w-[12rem] max-w-[18rem] whitespace-normal break-words align-middle leading-snug",
	},
	status: {
		head: "w-[8.5rem] min-w-[7.5rem]",
		cell: "whitespace-nowrap align-middle",
	},
	contact: {
		head: "min-w-[13rem] w-[18%]",
		cell: "min-w-[13rem] align-middle",
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

const ConsultantActions = () => {
	const t = useTranslate();
	// Detail / message / engagement views do not exist yet — placeholder toast.
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
			<DropdownMenuContent align="end" className="w-[190px]">
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2"
					onClick={notify}
				>
					<UserRound className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.consultantViewProfile} />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2"
					onClick={notify}
				>
					<MessageSquare className="h-4 w-4 text-accent-foreground" />
					<Translate text={localizationConstants.consultantMessage} />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2 cursor-pointer py-2"
					onClick={notify}
				>
					<Briefcase className="h-4 w-4 text-accent-foreground" />
					<Translate
						text={localizationConstants.consultantManageEngagement}
					/>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export function ConsultantTable({ data, totalItems }: ConsultantTableProps) {
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
		(consultant: Consultant, columnKey: ConsultantColumnField) => {
			switch (columnKey) {
				case "name":
					return (
						<div className="flex items-center gap-3">
							<span
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-semibold text-white"
								aria-hidden
							>
								{getInitials(consultant.name)}
							</span>
							<span className="font-medium text-slate-950">
								{consultant.name}
							</span>
						</div>
					);
				case "specialty":
					return (
						<span className="text-slate-600">
							<Translate
								text={CONSULTANT_TYPE_LABEL_KEY[consultant.type]}
							/>
						</span>
					);
				case "project":
					return (
						<span className="text-slate-600 block">
							{consultant.project}
						</span>
					);
				case "status":
					return (
						<Badge
							variant={getConsultantStatusVariant(
								consultant.status,
							)}
							className="rounded-[6px] px-2.5 py-0.5 whitespace-nowrap capitalize"
						>
							<Translate
								text={
									CONSULTANT_STATUS_LABEL_KEY[
										consultant.status
									]
								}
							/>
						</Badge>
					);
				case "contact":
					return (
						<div className="flex flex-col leading-tight">
							<a
								href={`mailto:${consultant.email}`}
								className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
							>
								{consultant.email}
							</a>
							<a
								href={`tel:${consultant.phone.replace(/\s/g, "")}`}
								className="text-xs text-slate-400 hover:text-slate-700"
							>
								{consultant.phone}
							</a>
						</div>
					);
				case "actions":
					return <ConsultantActions />;
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
				<Table className="w-full min-w-[56rem] table-auto">
					<colgroup>
						{CONSULTANT_COLUMNS.map((col) => (
							<col
								key={col.field}
								className={COLUMN_LAYOUT[col.field].head}
							/>
						))}
					</colgroup>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							{CONSULTANT_COLUMNS.map((col) => (
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
						{data.map((consultant) => (
							<TableRow
								key={consultant.id}
								className="border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
							>
								{CONSULTANT_COLUMNS.map((col) => (
									<TableCell
										key={`${consultant.id}-${col.field}`}
										className={cn(
											"py-3.5 px-4",
											COLUMN_LAYOUT[col.field].cell,
											col.field === "actions" &&
												"text-right",
										)}
									>
										{renderCell(consultant, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={CONSULTANT_COLUMNS.length}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={
											localizationConstants.noConsultantsFound
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
