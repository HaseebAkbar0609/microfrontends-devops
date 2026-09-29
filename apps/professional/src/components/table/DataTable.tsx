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
import { Fragment, ReactNode } from "react";

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
	DropdownMenuSeparator,
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

// ─── Column definition ────────────────────────────────────────────────────────

export interface DataTableColumn<TData> {
	/** Unique key matching a key in TData (or "actions" for the action column). */
	key: string;
	/** Translation key used for the column header label. */
	label: string;
	/** Custom header renderer for complex headers like checkboxes. */
	headerRender?: (column: DataTableColumn<TData>) => ReactNode;
	/** Custom render function for the column header. Overrides label translation. */
	renderHeader?: () => ReactNode;
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
	/** Draws a divider above this item, to start a new group in the menu. */
	separatorBefore?: boolean;
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
	/** Custom direct cell renderer for primary action icon (e.g. Eye icon). */
	primaryAction?: (row: TData) => ReactNode;
	/**
	 * Accessible name for a row's ⋮ trigger. Without it every row exposes an
	 * unnamed button, so a screen reader cannot tell them apart. Return a
	 * translated string including the row's identifier.
	 */
	actionsLabel?: (row: TData) => string;
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
	/** Current sort field key. */
	sortBy?: string;
	/** Current sort direction ("asc" | "desc"). */
	sortOrder?: string;
	/** Called when a sortable column header is clicked. */
	onSort?: (field: string, nextOrder: "asc" | "desc" | null) => void;
	/** Number of skeleton rows to render while loading. Defaults to 5. */
	skeletonRows?: number;
	/** Optional border wrapper. Defaults to false. */
	bordered?: boolean;

	variant?: "default" | "striped";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({
	field,
	sortBy,
	sortOrder,
}: {
	field: string;
	sortBy?: string;
	sortOrder?: string;
}) {
	if (sortBy !== field)
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
	);
}

const ACTIONS_COLUMN_CLASS = {
	head: "w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center",
	cell: "w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3.5 px-2",
};

export function DataTable<TData>({
	data,
	columns,
	rowKey,
	actions,
	primaryAction,
	actionsLabel,
	loading = false,
	emptyMessageKey,
	pagination,
	onPageChange,
	onPageSizeChange,
	sortBy,
	sortOrder,
	onSort,
	skeletonRows = 5,
	bordered = false,
	variant = "default",
}: DataTableProps<TData>) {
	const hasActions = Boolean(
		(actions && actions.length > 0) || primaryAction,
	);
	const striped = variant === "striped";
	const totalItems = pagination?.totalItems ?? data.length;
	const pageSize = pagination?.pageSize ?? 10;
	const page = pagination?.page ?? 1;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const handleHeaderClick = (col: DataTableColumn<TData>) => {
		if (!col.sortable || !onSort) return;
		let nextOrder: "asc" | "desc" | null = "asc";
		if (sortBy === col.key) {
			if (sortOrder === "asc") nextOrder = "desc";
			else if (sortOrder === "desc") nextOrder = null;
		}
		onSort(col.key, nextOrder);
	};

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Main Table Container (No outside border by default, matching Customer Dashboard) */}
			<div
				className={cn(
					"w-full overflow-x-auto relative bg-white",
					bordered &&
						(striped
							? "rounded-md border border-slate-200"
							: "rounded-lg border border-slate-200 shadow-2xs"),
				)}
			>
				<Table className="w-full min-w-250 table-auto border-collapse">
					<TableHeader className={cn(striped && "bg-slate-50/50")}>
						<TableRow
							className={cn(
								"border-b border-slate-200",
								striped
									? "hover:bg-transparent"
									: "bg-white hover:bg-white",
							)}
						>
							{columns.map((col) => (
								<TableHead
									key={col.key}
									className={cn(
										"py-3.5 px-4 transition-colors select-none whitespace-nowrap",
										striped
											? "h-auto text-left text-sm font-medium text-slate-500"
											: "text-xs font-semibold text-slate-600",
										col.sortable &&
											"cursor-pointer hover:text-slate-900",
										col.headerClassName,
									)}
									onClick={() => handleHeaderClick(col)}
								>
									<div className={cn("flex items-center gap-1", col.headerClassName?.includes("text-center") && "justify-center")}>
										{col.renderHeader
											? col.renderHeader()
											: col.headerRender
												? col.headerRender(col)
												: <Translate text={col.label} />}
										{col.sortable && (
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
									className={ACTIONS_COLUMN_CLASS.head}
									aria-label="Actions"
								/>
							)}
						</TableRow>
					</TableHeader>

					<TableBody>
						{loading ? (
							Array.from({ length: skeletonRows }).map(
								(_, idx) => (
									<TableRow key={`skeleton-${idx}`}>
										{columns.map((col) => (
											<TableCell
												key={col.key}
												className="px-4 py-3.5"
											>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										))}
										{hasActions && (
											<TableCell
												className={
													ACTIONS_COLUMN_CLASS.cell
												}
											>
												<Skeleton className="h-4 w-8 ml-auto" />
											</TableCell>
										)}
									</TableRow>
								),
							)
						) : data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={
										columns.length + (hasActions ? 1 : 0)
									}
									className="py-12 text-center text-sm text-slate-500"
								>
									<Translate
										text={emptyMessageKey || "noDataFound"}
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((row) => (
								<TableRow
									key={rowKey(row)}
									className={cn(
										"group border-b border-slate-100 transition-colors",
										striped
											? "odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
											: "hover:bg-slate-50/60",
									)}
								>
									{columns.map((col) => (
										<TableCell
											key={col.key}
											className={cn(
												"px-4 py-3.5 text-sm font-normal whitespace-nowrap",
												striped
													? "text-slate-600"
													: "text-slate-700",
												col.cellClassName,
											)}
										>
											{col.render
												? col.render(row)
												: String(
														(
															row as Record<
																string,
																unknown
															>
														)[col.key] ?? "",
													)}
										</TableCell>
									))}

									{hasActions && (
										<TableCell
											className={
												ACTIONS_COLUMN_CLASS.cell
											}
										>
											<div className="flex items-center justify-end gap-1">
												{primaryAction?.(row)}
												{actions &&
													actions.length > 0 && (
														<DropdownMenu>
															<DropdownMenuTrigger
																asChild
															>
																<Button
																	variant="ghost"
																	size="icon"
																	aria-label={
																		actionsLabel
																			? actionsLabel(row)
																			: "Actions"
																	}
																	className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md"
																>
																	<MoreVertical className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent
																align="end"
																className="min-w-40 border border-slate-200 bg-white shadow-md rounded-md p-1"
															>
																{actions.map(
																	(act) => (
																		<Fragment key={act.label}>
																			{act.separatorBefore && (
																				<DropdownMenuSeparator className="my-1 bg-slate-200" />
																			)}
																			<DropdownMenuItem
																				onClick={() =>
																					act.onClick(
																						row,
																					)
																				}
																				className={cn(
																					"gap-2 text-sm cursor-pointer px-3 py-2 rounded-md transition-colors",
																					act.destructive
																						? "text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
																						: "text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900",
																				)}
																			>
																				{
																					act.icon
																				}
																				<Translate
																					text={
																						act.label
																					}
																				/>
																			</DropdownMenuItem>
																		</Fragment>
																	),
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													)}
											</div>
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls Bar matching Customer Dashboard */}
			{pagination && (
				<div
					className={cn(
						"flex items-center gap-6 text-sm text-slate-600 flex-wrap",
						striped
							? "justify-center py-4"
							: "justify-center sm:justify-end py-2 px-1",
					)}
				>
					{/* Rows per page selector */}
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.rowsPerPageLabel}
							/>
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(val) =>
								onPageSizeChange?.(Number(val))
							}
						>
							<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
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

					{/* Page 1 of X indicator */}
					<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
						<Translate text={localizationConstants.pageLabel} />
						<span>{page}</span>
						<Translate text={localizationConstants.ofLabel} />
						<span>{totalPages}</span>
					</div>

					{/* Chevrons Pagination Buttons */}
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={page <= 1}
							onClick={() => onPageChange?.(1)}
						>
							<ChevronsLeft className="h-4 w-4" />
							<span className="sr-only">First page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={page <= 1}
							onClick={() => onPageChange?.(page - 1)}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={page >= totalPages}
							onClick={() => onPageChange?.(page + 1)}
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next page</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={page >= totalPages}
							onClick={() => onPageChange?.(totalPages)}
						>
							<ChevronsRight className="h-4 w-4" />
							<span className="sr-only">Last page</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
