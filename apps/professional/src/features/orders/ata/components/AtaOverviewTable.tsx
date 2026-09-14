"use client";

import React, { useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Plus,
	ChevronDown,
	MoreVertical,
	PencilLine,
	Trash2,
	Send,
	Printer,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/table/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { type AtaCategory } from "../constants/ata.constants";
import type {
	AtaItem,
	AtaSortField,
	SortOrder,
	AtaSummary,
} from "../types/ata.types";
import { AtaSummaryCard } from "./AtaSummaryCard";
import { DeleteAtaDialog } from "./DeleteAtaDialog";

export interface AtaOverviewTableProps {
	rows: AtaItem[];
	summary: AtaSummary;
	activeCategory: AtaCategory;
	isLoading?: boolean;
	sortField: AtaSortField;
	sortOrder: SortOrder;
	onSort: (field: AtaSortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	onDelete: (id: string) => Promise<boolean>;
	onSend: (id: string) => Promise<boolean>;
	onOpenCreate?: () => void;
	onEdit?: (ata: AtaItem) => void;
	onViewDetail?: (ata: AtaItem) => void;
}

export function AtaOverviewTable({
	rows,
	summary,
	activeCategory,
	isLoading = false,
	sortField,
	sortOrder,
	onSort,
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	onDelete,
	onSend,
	onOpenCreate,
	onEdit,
	onViewDetail,
}: AtaOverviewTableProps) {
	const t = useTranslate();
	const [deletingItem, setDeletingItem] = useState<AtaItem | null>(null);

	const renderSortIcon = (field: AtaSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0 print:hidden ml-1" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		);
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const handleConfirmDelete = async (id: string) => {
		const success = await onDelete(id);
		if (success) {
			showToast("success", t(localizationConstants.ataDeleteSuccess));
		} else {
			showToast("error", t(localizationConstants.genericError));
		}
		setDeletingItem(null);
	};

	const handleSendAta = async (id: string) => {
		const success = await onSend(id);
		if (success) {
			showToast("success", t(localizationConstants.ataSendSuccess));
		} else {
			showToast("error", t(localizationConstants.genericError));
		}
	};

	const formatAmount = (num: number) => {
		return new Intl.NumberFormat("sv-SE").format(Math.round(num));
	};

	const renderStatusBadge = (status: string) => {
		switch (status) {
			case "ok":
			case "approved":
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
						<Translate text={localizationConstants.ataStatusOk} />
					</span>
				);
			case "redovisad":
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
						<Translate text={localizationConstants.ataStatusAccounted} />
					</span>
				);
			case "forhandling":
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
						<Translate text={localizationConstants.ataStatusNegotiation} />
					</span>
				);
			case "pending":
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
						<Translate text={localizationConstants.ataStatusPending} />
					</span>
				);
			case "rejected":
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
						<Translate text={localizationConstants.ataStatusRejected} />
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
						<Translate text={localizationConstants.ataStatusDraft} />
					</span>
				);
		}
	};

	const renderAttested = (attested: string) => {
		if (attested === "ja") {
			return <span className="text-slate-900 font-sans text-sm font-normal">{t(localizationConstants.ataAttestedYes)}</span>;
		}
		if (attested === "nej") {
			return <span className="text-slate-500 font-sans text-sm font-normal">{t(localizationConstants.ataAttestedNo)}</span>;
		}
		return <span className="text-slate-700 font-sans text-sm font-normal">{t(localizationConstants.ataAttestedPending)}</span>;
	};

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Top Action Bar matching Figma design: Sök + Filter dropdown on left, Print + Skapa ÄTA on right */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-auto min-w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer"
							>
								<span>
									{statusFilter === "all" ? (
										<Translate text={localizationConstants.filter} />
									) : (
										<Translate
											text={
												statusFilter === "ok"
													? localizationConstants.ataStatusOk
													: statusFilter === "redovisad"
													? localizationConstants.ataStatusAccounted
													: statusFilter === "forhandling"
													? localizationConstants.ataStatusNegotiation
													: statusFilter === "pending"
													? localizationConstants.ataStatusPending
													: localizationConstants.ataStatusDraft
											}
										/>
									)}
								</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1">
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataFilterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("ok")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataStatusOk} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("redovisad")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataStatusAccounted} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("forhandling")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataStatusNegotiation} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("pending")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataStatusPending} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("draft")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.ataStatusDraft} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handlePrint}
						className="h-10 w-10 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-none cursor-pointer"
						title={t(localizationConstants.ataPrintLabel)}
					>
						<Printer className="h-4 w-4 text-slate-700" />
					</Button>

					<Button
						type="button"
						onClick={onOpenCreate}
						className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium gap-2 shadow-none cursor-pointer"
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.ataCreateButton} />
					</Button>
				</div>
			</div>

			{/* Summary stats widget (Only the first box) */}
			<div className="pt-1">
				<AtaSummaryCard summary={summary} />
			</div>

			{/* ÄTA Table - same style as other tabs, without outer border box */}
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{/* Datum */}
							<TableHead
								onClick={() => onSort("date")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[120px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColDate)}</span>
									{renderSortIcon("date")}
								</div>
							</TableHead>

							{/* Äta - nummer */}
							<TableHead
								onClick={() => onSort("ataNumber")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[130px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColNumber)}</span>
									{renderSortIcon("ataNumber")}
								</div>
							</TableHead>

							{/* Kopplad Lev-äta / Leverantör */}
							<TableHead
								onClick={() => onSort("linkedLevAta")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 min-w-[180px]"
							>
								<div className="flex items-center">
									<span>
										{activeCategory === "kund"
											? t(localizationConstants.ataColLinkedLevAta)
											: t(localizationConstants.ataColSupplier)}
									</span>
									{renderSortIcon("linkedLevAta")}
								</div>
							</TableHead>

							{/* Belopp */}
							<TableHead
								onClick={() => onSort("amount")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[140px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColAmount)}</span>
									{renderSortIcon("amount")}
								</div>
							</TableHead>

							{/* Status */}
							<TableHead
								onClick={() => onSort("status")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[120px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColStatus)}</span>
									{renderSortIcon("status")}
								</div>
							</TableHead>

							{/* Attesterad */}
							<TableHead
								onClick={() => onSort("attested")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[120px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColAttested)}</span>
									{renderSortIcon("attested")}
								</div>
							</TableHead>

							{/* Datum (Attesterat/skapad) */}
							<TableHead
								onClick={() => onSort("attestedDate")}
								className="px-4 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900 w-[120px]"
							>
								<div className="flex items-center">
									<span>{t(localizationConstants.ataColAttestedDate)}</span>
									{renderSortIcon("attestedDate")}
								</div>
							</TableHead>

							{/* Actions / Visa detaljer & 3-dots */}
							<TableHead className="w-[160px] px-4 py-3.5 text-right font-sans text-sm font-medium leading-6 tracking-normal text-slate-500" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, idx) => (
								<TableRow key={`skeleton-${idx}`} className="h-[56px] border-b border-slate-100">
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-32" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
									<TableCell className="px-4 py-3.5 text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
								</TableRow>
							))
						) : rows.length === 0 ? (
							<TableRow className="h-[56px]">
								<TableCell colSpan={8} className="h-[56px] text-center text-xs text-slate-400 py-6">
									{t(localizationConstants.noRecordsFound)}
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow
									key={row.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									{/* Datum */}
									<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
										{row.date}
									</TableCell>

									{/* Äta - nummer */}
									<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
										{row.ataNumber}
									</TableCell>

									{/* Kopplad Lev-äta / Leverantör */}
									<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
										{activeCategory === "kund"
											? row.linkedLevAta || row.title
											: row.supplier || row.title}
									</TableCell>

									{/* Belopp */}
									<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
										{formatAmount(row.amount)}
									</TableCell>

									{/* Status */}
									<TableCell className="px-4 py-3.5">
										{renderStatusBadge(row.status)}
									</TableCell>

									{/* Attesterad */}
									<TableCell className="px-4 py-3.5">
										{renderAttested(row.attested)}
									</TableCell>

									{/* Datum */}
									<TableCell className="px-4 py-3.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-900">
										{row.attestedDate || row.date}
									</TableCell>

									{/* Visa detaljer button & 3 dots */}
									<TableCell className="px-4 py-3.5 text-right">
										<div className="flex items-center justify-end gap-1.5">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onViewDetail?.(row)}
												className="h-8 px-3 rounded bg-slate-100/70 hover:bg-slate-200/80 text-slate-800 font-sans text-xs font-medium cursor-pointer shadow-none"
											>
												<Translate text={localizationConstants.ataViewDetails} />
											</Button>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
													>
														<MoreVertical className="h-4 w-4 text-slate-900" />
														<span className="sr-only">
															<Translate text={localizationConstants.ataColActions} />
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1"
												>
													<DropdownMenuItem
														onClick={() => onEdit?.(row)}
														className="flex items-center gap-2.5 px-2.5 py-2 font-sans text-[14px] font-normal leading-[20px] tracking-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
													>
														<PencilLine className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
														<span>
															<Translate text={localizationConstants.ataActionEdit} />
														</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setDeletingItem(row)}
														className="flex items-center gap-2.5 px-2.5 py-2 font-sans text-[14px] font-normal leading-[20px] tracking-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
													>
														<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
														<span>
															<Translate text={localizationConstants.ataActionDelete} />
														</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleSendAta(row.id)}
														className="flex items-center gap-2.5 px-2.5 py-2 font-sans text-[14px] font-normal leading-[20px] tracking-normal text-slate-900 cursor-pointer rounded-md hover:bg-slate-100 transition-colors"
													>
														<Send className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
														<span>
															<Translate text={localizationConstants.ataActionSend} />
														</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Dedicated Delete Confirmation Dialog */}
			<DeleteAtaDialog
				item={deletingItem}
				isOpen={!!deletingItem}
				onClose={() => setDeletingItem(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}

export default AtaOverviewTable;