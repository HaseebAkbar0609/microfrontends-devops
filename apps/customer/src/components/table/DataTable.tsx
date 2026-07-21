"use client";

import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
} from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { tableStyles } from "./tableStyles";

// ─── Column definition ────────────────────────────────────────────────────────

export interface DataTableColumn<TData> {
	/** Unique key matching a key in TData (or "actions" for the action column). */
	key: string;
	/** Translation key used for the column header label. */
	label: string;
	/** Whether the column is sortable. Defaults to false. */
	sortable?: boolean;
	/** Tailwind classes applied to the <th> element. */
	headerClassName?: string;
	/** Tailwind classes applied to every <td> in this column. */
	cellClassName?: string;
	/** Custom render function for the cell content. */
	render?: (row: TData) => ReactNode;
}

// ─── Row action definition ─────────────────────────────────────────────────────

export interface DataTableAction<TData> {
	/** Translation key for the menu item label. */
	label: string;
	/** Icon element rendered left of the label. */
	icon?: ReactNode;
	/** Called when the user clicks this item. */
	onClick: (row: TData) => void;
	/** Whether the item should render in a destructive (red) style. */
	destructive?: boolean;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface DataTablePaginationState {
	page: number;
	pageSize: number;
	totalItems: number;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DataTableProps<TData> {
	/** Row data to render. */
	data: TData[];
	/** Column definitions. */
	columns: DataTableColumn<TData>[];
	/** Function that returns a unique key per row. */
	rowKey: (row: TData) => string;
	/** Row action items rendered in the ⋮ menu (omit to hide actions column). */
	actions?: DataTableAction<TData>[];
	/** Whether the table is in a loading state (shows skeleton rows). */
	loading?: boolean;
	/** Translation key for the empty-state message. Defaults to generic text. */
	emptyMessageKey?: string;
	/** Pagination state (controlled externally via URL params or local state). */
	pagination?: DataTablePaginationState;
	/** Called when the page changes. */
	onPageChange?: (page: number) => void;
	/** Called when the page size changes. */
	onPageSizeChange?: (size: number) => void;
	/** Current sort field key (from URL params or state). */
	sortBy?: string;
	/** Current sort direction ("asc" | "desc"). */
	sortOrder?: string;
	/** Called when a sortable column header is clicked. */
	onSort?: (field: string, nextOrder: "asc" | "desc" | null) => void;
	/** Number of skeleton rows to render while loading. Defaults to 5. */
	skeletonRows?: number;
	/** Custom translation key for the "Rows per page" label. */
	rowsPerPageKey?: string;
	bordered?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({
	field,
	sortBy,
	sortOrder,
}: {
	field: string;
	sortBy: string;
	sortOrder: string;
}) {
	if (sortBy !== field)
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
	);
}

function ActionsCell<TData>({
	row,
	actions,
	bordered = false,
}: {
	row: TData;
	actions: DataTableAction<TData>[];
	bordered?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center",
				bordered ? "justify-end" : "justify-center",
			)}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"rounded-md focus-visible:ring-0 focus-visible:ring-offset-0",
							bordered
								? "h-9 w-9 text-accent-foreground hover:text-accent-foreground bg-muted"
								: "h-8 w-8 text-slate-500 hover:text-slate-900 bg-transparent hover:bg-slate-100",
						)}
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-[140px] border border-slate-200 bg-white shadow-md rounded-md p-1"
				>
					{actions.map((action) => (
						<DropdownMenuItem
							key={action.label}
							onClick={() => action.onClick(row)}
							className={cn(
								"gap-2 cursor-pointer px-3 py-2 text-sm rounded group transition-colors",
								action.destructive
									? "text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
									: "text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900",
							)}
						>
							{action.icon && (
								<span
									className={cn(
										"h-4 w-4 transition-colors",
										action.destructive
											? "text-red-500 group-hover:text-red-600"
											: "text-slate-500 group-hover:text-slate-700",
									)}
								>
									{action.icon}
								</span>
							)}
							<Translate text={action.label} />
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function TableSkeletonRows({
	columns,
	rows,
	hasActions,
}: {
	columns: number;
	rows: number;
	hasActions: boolean;
}) {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<TableRow
					key={rowIndex}
					className="border-b border-slate-200 hover:bg-transparent"
				>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<TableCell key={colIndex} className="py-3.5 px-4">
							<Skeleton className="h-4 w-full" />
						</TableCell>
					))}
					{hasActions && (
						<TableCell className="py-3.5 px-4 w-[50px]">
							<Skeleton className="h-4 w-6 mx-auto" />
						</TableCell>
					)}
				</TableRow>
			))}
		</>
	);
}

function DataTablePagination({
	page,
	pageSize,
	totalPages,
	onPageChange,
	onPageSizeChange,
	rowsPerPageKey = localizationConstants.suppliersRowsPerPage,
	bordered = false,
}: {
	page: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	rowsPerPageKey?: string;
	bordered?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center py-2 px-1",
				bordered ? "justify-center" : "justify-end",
			)}
		>
			<div className="flex items-center gap-6">
				{/* Rows per page */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-slate-700">
						<Translate text={rowsPerPageKey} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(value) =>
							onPageSizeChange(Number(value))
						}
					>
						<SelectTrigger className="h-9 w-17.5 border-slate-200 focus:ring-0 bg-transparent hover:bg-slate-50">
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

				{/* Page info */}
				<span className="text-sm font-medium text-slate-700 flex items-center gap-1 select-none">
					<Translate text={localizationConstants.pageLabel} />
					<span>{page}</span>
					<Translate text={localizationConstants.ofLabel} />
					<span>{totalPages}</span>
				</span>

				{/* Nav buttons */}
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 border-slate-200 bg-transparent hover:bg-slate-50"
						onClick={() => onPageChange(1)}
						disabled={page <= 1}
					>
						<ChevronsLeft className="h-4 w-4" />
						<span className="sr-only">First page</span>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 border-slate-200 bg-transparent hover:bg-slate-50"
						onClick={() => onPageChange(page - 1)}
						disabled={page <= 1}
					>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous page</span>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 border-slate-200 bg-transparent hover:bg-slate-50"
						onClick={() => onPageChange(page + 1)}
						disabled={page >= totalPages}
					>
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next page</span>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 border-slate-200 bg-transparent hover:bg-slate-50"
						onClick={() => onPageChange(totalPages)}
						disabled={page >= totalPages}
					>
						<ChevronsRight className="h-4 w-4" />
						<span className="sr-only">Last page</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

// ─── Main DataTable component ─────────────────────────────────────────────────

const ACTIONS_COLUMN_CLASS = {
	head: "w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20",
	cell: "w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10",
};

const BORDERED_ACTIONS_COLUMN_CLASS = {
	head: "w-20 min-w-[5rem]",
	cell: "w-20 min-w-[5rem] whitespace-nowrap align-middle text-right",
};

export function DataTable<TData>({
	data,
	columns,
	rowKey,
	actions,
	loading = false,
	emptyMessageKey,
	pagination,
	onPageChange,
	onPageSizeChange,
	sortBy = "",
	sortOrder = "",
	onSort,
	skeletonRows = 5,
	rowsPerPageKey,
	bordered = false,
}: DataTableProps<TData>) {
	const hasActions = Boolean(actions && actions.length > 0);
	const actionsColumnClass = bordered
		? BORDERED_ACTIONS_COLUMN_CLASS
		: ACTIONS_COLUMN_CLASS;

	const totalPages = useMemo(
		() =>
			pagination
				? Math.max(
					1,
					Math.ceil(pagination.totalItems / pagination.pageSize),
				)
				: 1,
		[pagination?.totalItems, pagination?.pageSize],
	);

	const handleSort = useCallback(
		(field: string) => {
			if (!onSort) return;
			let nextOrder: "asc" | "desc" | null = "asc";
			if (sortBy === field) {
				if (sortOrder === "asc") nextOrder = "desc";
				else if (sortOrder === "desc") nextOrder = null;
			}
			onSort(field, nextOrder);
		},
		[sortBy, sortOrder, onSort],
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Table */}
			<div
				className={cn(
					"w-full overflow-x-auto relative bg-white",
					bordered && "rounded-md border border-slate-200",
				)}
			>
				<Table className="w-full min-w-3xl table-auto">
					<TableHeader
						className={cn(
							"border-b border-slate-200",
							bordered && "bg-slate-50/50",
						)}
					>
						<TableRow className="hover:bg-transparent border-slate-200">
							{columns.map((col) => (
								<TableHead
									key={col.key}
									className={cn(
										tableStyles.headerCell,
										"py-3.5 px-4 h-auto text-left whitespace-nowrap",
										col.sortable &&
										onSort &&
										"cursor-pointer select-none",
										col.headerClassName,
									)}
									onClick={() =>
										col.sortable &&
										onSort &&
										handleSort(col.key)
									}
								>
									<div className="flex items-center gap-1 min-w-0">
										<Translate text={col.label} />
										{col.sortable && onSort && (
											<SortIcon
												field={col.key}
												sortBy={sortBy}
												sortOrder={sortOrder}
											/>
										)}
									</div>
								</TableHead>
							))}
							{hasActions && (
								<TableHead
									className={cn(
										tableStyles.headerCell,
										"py-3.5 px-4 h-auto text-center whitespace-nowrap",
										actionsColumnClass.head,
									)}
								/>
							)}
						</TableRow>
					</TableHeader>

					<TableBody>
						{loading ? (
							<TableSkeletonRows
								columns={columns.length}
								rows={skeletonRows}
								hasActions={hasActions}
							/>
						) : data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={
										columns.length + (hasActions ? 1 : 0)
									}
									className="h-32 text-center text-slate-500"
								>
									<Translate
										text={
											emptyMessageKey ??
											localizationConstants.noSuppliersFound
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((row) => (
								<TableRow
									key={rowKey(row)}
									className={cn(
										"group",
										bordered
											? "border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
											: "border-b border-slate-200 bg-white hover:bg-slate-50",
									)}
								>
									{columns.map((col) => (
										<TableCell
											key={col.key}
											className={cn(
												tableStyles.bodyCell,
												"py-3.5 px-4",
												col.cellClassName,
											)}
										>
											{col.render ? (
												col.render(row)
											) : (
												<span>
													{String(
														(
															row as Record<
																string,
																unknown
															>
														)[col.key] ?? "",
													)}
												</span>
											)}
										</TableCell>
									))}
									{hasActions && actions && (
										<TableCell
											className={cn(
												"py-3.5 px-4",
												actionsColumnClass.cell,
											)}
										>
											<ActionsCell
												row={row}
												actions={actions}
												bordered={bordered}
											/>
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{pagination && onPageChange && onPageSizeChange && (
				<DataTablePagination
					page={pagination.page}
					pageSize={pagination.pageSize}
					totalPages={totalPages}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					rowsPerPageKey={rowsPerPageKey}
					bordered={bordered}
				/>
			)}
		</div>
	);
}
