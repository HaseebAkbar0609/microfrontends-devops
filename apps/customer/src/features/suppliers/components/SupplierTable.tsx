"use client";

import { useCallback, useMemo, useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	Eye,
	Pencil,
	Trash2,
	Circle,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/hooks/useQueryParams";
import { SUPPLIER_COLUMNS } from "../constants";
import type { Supplier, SupplierColumnField } from "../types/types";

interface SupplierTableProps {
	readonly data: Supplier[];
	readonly totalItems: number;
}

const COLUMN_LAYOUT: Record<
	SupplierColumnField,
	{ head: string; cell: string }
> = {
	companyName: {
		head: "min-w-[10rem] w-[22%]",
		cell: "whitespace-nowrap align-top",
	},
	orgNo: {
		head: "w-[9rem] min-w-[8rem]",
		cell: "whitespace-nowrap align-top",
	},
	contactPersonName: {
		head: "min-w-[10rem] w-[20%]",
		cell: "whitespace-nowrap align-top",
	},
	email: {
		head: "min-w-[12rem] w-[24%]",
		cell: "whitespace-nowrap align-top",
	},
	actions: {
		head: "w-32 min-w-[8rem]",
		cell: "whitespace-nowrap align-top",
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

export function SupplierTable({ data, totalItems }: SupplierTableProps) {
	const { query, changeQueries } = useQueryParams();

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalItems / pageSize)),
		[totalItems, pageSize],
	);

	const allSelected =
		data.length > 0 && data.every((s) => selectedIds.has(s.id));
	const someSelected = data.some((s) => selectedIds.has(s.id));

	const toggleAll = () => {
		if (allSelected) {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				data.forEach((s) => next.delete(s.id));
				return next;
			});
		} else {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				data.forEach((s) => next.add(s.id));
				return next;
			});
		}
	};

	const toggleRow = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleSort = useCallback(
		(field: SupplierColumnField) => {
			if (field === "actions") return;
			let nextOrder: string | null = "asc";
			if (sortBy === field) {
				if (sortOrder === "asc") nextOrder = "desc";
				else if (sortOrder === "desc") nextOrder = null;
			}
			changeQueries({
				sort_by: nextOrder ? field : null,
				sort_order: nextOrder,
			});
		},
		[sortBy, sortOrder, changeQueries],
	);

	const renderCell = useCallback((supplier: Supplier, field: SupplierColumnField) => {
		switch (field) {
			case "companyName":
				return (
					<span className="text-slate-950 font-medium">
						{supplier.companyName}
					</span>
				);
			case "orgNo":
				return <span className="text-slate-600">{supplier.orgNo}</span>;
			case "contactPersonName":
				return (
					<span className="text-slate-600">
						{supplier.contactPersonName}
					</span>
				);
			case "email":
				return <span className="text-slate-600">{supplier.email}</span>;
			case "actions":
				return (
					<div className="flex items-center gap-1 justify-end">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-slate-400 hover:text-slate-600"
						>
							<Circle className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-slate-400 hover:text-slate-600"
						>
							<Circle className="h-4 w-4" />
						</Button>
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
							<DropdownMenuContent align="end" className="w-35">
								<DropdownMenuItem className="gap-2 cursor-pointer py-2 group">
									<Eye className="h-4 w-4 text-accent-foreground" />
									<Translate text={localizationConstants.viewLabel} />
								</DropdownMenuItem>
								<DropdownMenuItem className="gap-2 cursor-pointer py-2 group">
									<Pencil className="h-4 w-4 text-accent-foreground" />
									<Translate text={localizationConstants.open} />
								</DropdownMenuItem>
								<DropdownMenuItem className="gap-2 cursor-pointer py-2 text-red-600 focus:text-red-700 group">
									<Trash2 className="h-4 w-4" />
									<Translate text={localizationConstants.delete} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			default:
				return null;
		}
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md border border-slate-200 overflow-hidden">
				<Table className="w-full min-w-3xl table-auto">
					<colgroup>
						<col className="w-12" />
						{SUPPLIER_COLUMNS.map((col) => (
							<col
								key={col.field}
								className={COLUMN_LAYOUT[col.field].head}
							/>
						))}
					</colgroup>
					<TableHeader className="bg-slate-50/50">
						<TableRow className="hover:bg-transparent border-slate-200">
							<TableHead className="w-12 px-4 py-3.5 h-auto">
								<Checkbox
									checked={allSelected}
									data-state={
										someSelected && !allSelected
											? "indeterminate"
											: undefined
									}
									onCheckedChange={toggleAll}
									aria-label="Select all"
								/>
							</TableHead>
							{SUPPLIER_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									className={cn(
										"text-slate-500 font-medium py-3.5 px-4 h-auto text-left whitespace-nowrap",
										col.sortable && "cursor-pointer select-none",
										col.field === "actions" && "cursor-default",
									)}
									onClick={() =>
										col.sortable && handleSort(col.field)
									}
								>
									<div
										className={cn(
											"flex items-center gap-1 min-w-0",
											col.field === "actions" && "justify-end",
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
						{data.map((supplier) => (
							<TableRow
								key={supplier.id}
								className="border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
							>
								<TableCell className="px-4 py-3.5 align-top">
									<Checkbox
										checked={selectedIds.has(supplier.id)}
										onCheckedChange={() => toggleRow(supplier.id)}
										aria-label={`Select ${supplier.companyName}`}
									/>
								</TableCell>
								{SUPPLIER_COLUMNS.map((col) => (
									<TableCell
										key={`${supplier.id}-${col.field}`}
										className={cn(
											"py-3.5 px-4",
											COLUMN_LAYOUT[col.field].cell,
											col.field === "actions" && "text-right",
										)}
									>
										{renderCell(supplier, col.field)}
									</TableCell>
								))}
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={SUPPLIER_COLUMNS.length + 1}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={localizationConstants.noSuppliersFound}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between py-2 px-1">
				<span className="text-sm text-slate-600">
					{selectedIds.size} av {totalItems} rader valda
				</span>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.suppliersRowsPerPage}
							/>
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(value) =>
								changeQueries({
									page: "1",
									page_size: value,
								})
							}
						>
							<SelectTrigger className="h-9 w-17.5 border-slate-200 focus:ring-0">
								<SelectValue placeholder={String(pageSize)} />
							</SelectTrigger>
							<SelectContent>
								{[5, 10, 20, 30, 50].map((size) => (
									<SelectItem key={size} value={String(size)}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<span className="text-sm font-medium text-slate-700">
						Sida {page} av {totalPages}
					</span>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 border-slate-200"
							onClick={() => changeQueries({ page: "1" })}
							disabled={page <= 1}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 border-slate-200"
							onClick={() =>
								changeQueries({ page: String(page - 1) })
							}
							disabled={page <= 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 border-slate-200"
							onClick={() =>
								changeQueries({ page: String(page + 1) })
							}
							disabled={page >= totalPages}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 border-slate-200"
							onClick={() =>
								changeQueries({ page: String(totalPages) })
							}
							disabled={page >= totalPages}
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
