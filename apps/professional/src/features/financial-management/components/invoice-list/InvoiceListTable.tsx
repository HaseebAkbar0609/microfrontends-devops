"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	FolderOpen,
	Archive,
	Trash2,
	Plus,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { InvoiceItem, InvoiceSortField, SortOrder } from "../../types/invoice.types";
import { INVOICE_TABLE_COLUMNS } from "../../constants/invoice.constants";
import { InvoiceStatusBadge, InvoiceTypeBadge } from "./InvoiceBadges";

interface InvoiceListTableProps {
	invoices: InvoiceItem[];
	selectedIds: Set<string>;
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: (allIds: string[]) => void;
	sortBy: InvoiceSortField;
	sortOrder: SortOrder;
	onSort: (field: InvoiceSortField) => void;
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onArchive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function InvoiceListTable({
	invoices,
	selectedIds,
	onToggleSelect,
	onToggleSelectAll,
	sortBy,
	sortOrder,
	onSort,
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
	onArchive,
	onDelete,
}: InvoiceListTableProps) {
	const { t } = useTranslation();

	const allIds = invoices.map((i) => i.id);
	const isAllSelected = allIds.length > 0 && selectedIds.size === allIds.length;
	const isSomeSelected = selectedIds.size > 0 && selectedIds.size < allIds.length;

	const renderSortIcon = (field: InvoiceSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3 w-3 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="ml-1 h-3 w-3 text-slate-900 shrink-0" />
		);
	};

	const formatAmount = (val: number, currency: string) => {
		return `${val.toLocaleString("sv-SE")} ${currency}`;
	};

	return (
		<div className="flex flex-col gap-4 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
			<div className="w-full overflow-x-auto relative">
				<Table className="w-full min-w-[1350px] table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{/* Checkbox Column */}
							<TableHead className="w-12 px-4 py-3.5 text-center">
								<Checkbox
									checked={isAllSelected || (isSomeSelected ? "indeterminate" : false)}
									onCheckedChange={() => onToggleSelectAll(allIds)}
									aria-label="Select all"
									className="cursor-pointer"
								/>
							</TableHead>

							{/* Dynamic Data Columns */}
							{INVOICE_TABLE_COLUMNS.map((col) => (
								<TableHead
									key={col.field}
									onClick={() => onSort(col.field)}
									className="py-3 px-3 text-xs font-semibold text-slate-600 select-none whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors"
								>
									<div className="flex items-center gap-1">
										<Translate text={col.labelKey} />
										{renderSortIcon(col.field)}
									</div>
								</TableHead>
							))}

							{/* Customize Column affordance (+) */}
							<TableHead className="w-12 sticky right-0 bg-white text-center py-3 px-2 text-slate-400">
								<Plus className="mx-auto h-3.5 w-3.5" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={INVOICE_TABLE_COLUMNS.length + 2}
									className="py-16 text-center text-sm text-slate-500"
								>
									<Translate text={localizationConstants.invoiceNoResults} />
								</TableCell>
							</TableRow>
						) : (
							invoices.map((inv) => {
								const isSelected = selectedIds.has(inv.id);
								return (
									<TableRow
										key={inv.id}
										className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${isSelected ? "bg-slate-50/90" : ""}`}
									>
										{/* Row checkbox */}
										<TableCell className="px-4 py-3 text-center">
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => onToggleSelect(inv.id)}
												aria-label={`Select invoice ${inv.invoiceNo}`}
												className="cursor-pointer"
											/>
										</TableCell>

										{/* Invoice No */}
										<TableCell className="px-3 py-3 text-xs font-medium text-slate-900 whitespace-nowrap">
											{inv.invoiceNo}
										</TableCell>

										{/* OCR */}
										<TableCell className="px-3 py-3 text-xs font-semibold text-slate-900 whitespace-nowrap">
											{inv.ocr}
										</TableCell>

										{/* Object */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.object}
										</TableCell>

										{/* Type */}
										<TableCell className="px-3 py-3 whitespace-nowrap">
											<InvoiceTypeBadge type={inv.type} />
										</TableCell>

										{/* Customer */}
										<TableCell className="px-3 py-3 text-xs font-medium text-slate-900 whitespace-nowrap">
											{inv.customer}
										</TableCell>

										{/* Invoice Date */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.invoiceDate}
										</TableCell>

										{/* Cost Center */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.costCenter}
										</TableCell>

										{/* Project Leader */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.projectLeader}
										</TableCell>

										{/* Location */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.location}
										</TableCell>

										{/* Contract Form */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.contractType}
										</TableCell>

										{/* Total */}
										<TableCell className="px-3 py-3 text-xs font-medium text-slate-900 whitespace-nowrap">
											{formatAmount(inv.total, inv.currency)}
										</TableCell>

										{/* Balance */}
										<TableCell className="px-3 py-3 text-xs font-medium text-slate-900 whitespace-nowrap">
											{formatAmount(inv.balance, inv.currency)}
										</TableCell>

										{/* Due Date */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.dueDate}
										</TableCell>

										{/* Fully Paid Date */}
										<TableCell className="px-3 py-3 text-xs text-slate-700 whitespace-nowrap">
											{inv.fullyPaidDate || "—"}
										</TableCell>

										{/* Status */}
										<TableCell className="px-3 py-3 whitespace-nowrap">
											<InvoiceStatusBadge status={inv.status} />
										</TableCell>

										{/* Action Menu (Three-dot) */}
										<TableCell className="w-12 sticky right-0 bg-white text-center py-3 px-2 shadow-[inset_1px_0_0_0_#f1f5f9]">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														aria-label={t(localizationConstants.actionsHeader)}
														className="h-7 w-7 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1"
												>
													<Link href={`/module/financial-management/invoice/${inv.id}`}>
														<DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-slate-700 focus:bg-slate-50">
															<FolderOpen className="h-4 w-4 text-slate-500" />
															<span>
																<Translate text={localizationConstants.invoiceActionOpen} />
															</span>
														</DropdownMenuItem>
													</Link>
													<DropdownMenuItem
														onClick={() => onArchive(inv.id)}
														className="flex items-center gap-2 cursor-pointer text-slate-700 focus:bg-slate-50"
													>
														<Archive className="h-4 w-4 text-slate-500" />
														<span>
															<Translate text={localizationConstants.invoiceActionArchive} />
														</span>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => onDelete(inv.id)}
														className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span>
															<Translate text={localizationConstants.invoiceActionDelete} />
														</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Footer matching Figma */}
			<div className="flex items-center justify-center sm:justify-end gap-6 py-3 px-4 text-xs text-slate-600 border-t border-slate-100 flex-wrap">
				<div className="flex items-center gap-2">
					<span className="font-medium text-slate-600">
						<Translate text={localizationConstants.rowsPerPage} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => {
							onPageSizeChange(Number(val));
							onPageChange(1);
						}}
					>
						<SelectTrigger className="h-8 w-16 border-slate-200 bg-transparent text-xs font-medium text-slate-700 hover:bg-slate-50">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{[5, 10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="text-xs font-medium text-slate-700 select-none flex items-center gap-1">
					<span>
						<Translate text={localizationConstants.pageLabel} />
					</span>
					<span>{currentPage}</span>
					<span>
						<Translate text={localizationConstants.ofLabel} />
					</span>
					<span>{totalPages}</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(1)}
					>
						<ChevronsLeft className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					>
						<ChevronRight className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(totalPages)}
					>
						<ChevronsRight className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
