"use client";

import React, { useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Plus,
	ChevronDown,
	MoreVertical,
	FolderOpen,
	Archive,
	Printer,
	Trash2,
	FilePlus,
	Upload,
	Download,
	Loader2,
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
import { TablePagination } from "@/components/table/TablePagination";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "../constants/protocol.constants";
import type { ProtocolItem, ProtocolSortField, SortOrder } from "../types/protocol.types";
import { downloadProtocolPdf, downloadAllProtocolsPdf } from "../utils/generateProtocolPdf";

export interface ProtocolOverviewTableProps {
	rows: ProtocolItem[];
	orderId?: string;
	sortField: ProtocolSortField;
	sortOrder: SortOrder;
	onSort: (field: ProtocolSortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	typeFilter: string;
	onTypeFilterChange: (type: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	onOpenCreate: (templateType: ProtocolTemplateType) => void;
	onOpenUpload: () => void;
	onArchive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ProtocolOverviewTable({
	rows,
	orderId = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	sortField,
	sortOrder,
	onSort,
	searchQuery,
	onSearchChange,
	typeFilter,
	onTypeFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	onOpenCreate,
	onOpenUpload,
	onArchive,
	onDelete,
}: ProtocolOverviewTableProps) {
	const t = useTranslate();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const [isDownloadingAll, setIsDownloadingAll] = useState(false);

	const renderSortIcon = (field: ProtocolSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0 print:hidden" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		);
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const handleConfirmDelete = () => {
		if (deletingId) {
			onDelete(deletingId);
			showToast("success", t(localizationConstants.toastProtocolDeleted));
			setDeletingId(null);
		}
	};

	const handleDownload = async (row: ProtocolItem) => {
		try {
			setDownloadingId(row.id);
			const success = await downloadProtocolPdf(row, orderId);
			if (success) {
				showToast("success", t(localizationConstants.toastProtocolDownloaded));
			} else {
				showToast("error", t(localizationConstants.toastProtocolDownloadFailed));
			}
		} catch (error) {
			console.error("[ProtocolOverviewTable] Failed to download protocol:", error);
			showToast("error", t(localizationConstants.toastProtocolDownloadFailed));
		} finally {
			setDownloadingId(null);
		}
	};

	const handleDownloadAll = async () => {
		if (rows.length === 0) return;
		try {
			setIsDownloadingAll(true);
			const success = await downloadAllProtocolsPdf(rows, orderId);
			if (success) {
				showToast("success", t(localizationConstants.toastAllProtocolsDownloaded));
			} else {
				showToast("error", t(localizationConstants.toastProtocolDownloadFailed));
			}
		} catch (error) {
			console.error("[ProtocolOverviewTable] Failed to download all protocols:", error);
			showToast("error", t(localizationConstants.toastProtocolDownloadFailed));
		} finally {
			setIsDownloadingAll(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Top Action Bar: Search + Filter on Left, Download All + Print + Skapa protokoll on Right */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
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
									{typeFilter === "all" ? (
										<Translate text={localizationConstants.filter} />
									) : (
										typeFilter
									)}
								</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1">
							<DropdownMenuItem
								onClick={() => onTypeFilterChange("all")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.protocolFilterAllTypes} />
							</DropdownMenuItem>
							{PROTOCOL_CONSTANTS.PROTOCOL_TYPES.map((pt) => (
								<DropdownMenuItem
									key={pt}
									onClick={() => onTypeFilterChange(pt)}
									className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
								>
									{pt}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
					{/* Download All Button */}
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handleDownloadAll}
						disabled={isDownloadingAll || rows.length === 0}
						className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none shrink-0"
						title={t(localizationConstants.protocolExportAll)}
						aria-label={t(localizationConstants.protocolExportAll)}
					>
						{isDownloadingAll ? (
							<Loader2 className="h-4 w-4 text-slate-700 animate-spin" />
						) : (
							<Download className="h-4 w-4 text-slate-700" />
						)}
					</Button>

					{/* Print Button */}
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handlePrint}
						className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none shrink-0"
						title={t(localizationConstants.print)}
						aria-label={t(localizationConstants.print)}
					>
						<Printer className="h-4 w-4 text-slate-700" />
					</Button>

					{/* + Skapa protokoll Dropdown Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								className="h-10 px-4 sm:px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-2 cursor-pointer flex items-center justify-center whitespace-nowrap"
							>
								<Plus className="h-4 w-4 shrink-0" />
								<span><Translate text={localizationConstants.createProtocolButton} /></span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-52 border border-slate-200 bg-white shadow-lg rounded-xl p-1.5 z-50">
							<DropdownMenuItem
								onClick={() => onOpenCreate(PROTOCOL_CONSTANTS.TEMPLATE_TYPES.STANDARD)}
								className="flex items-center gap-2.5 py-2 px-2.5 cursor-pointer text-sm text-slate-900 hover:bg-slate-50 rounded-lg"
							>
								<FilePlus className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="font-medium text-slate-900"><Translate text={localizationConstants.protocolStandard} /></span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onOpenCreate(PROTOCOL_CONSTANTS.TEMPLATE_TYPES.ACTION)}
								className="flex items-center gap-2.5 py-2 px-2.5 cursor-pointer text-sm text-slate-900 hover:bg-slate-50 rounded-lg"
							>
								<FilePlus className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="font-medium text-slate-900"><Translate text={localizationConstants.protocolAction} /></span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={onOpenUpload}
								className="flex items-center gap-2.5 py-2 px-2.5 cursor-pointer text-sm text-slate-900 hover:bg-slate-50 rounded-lg"
							>
								<Upload className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="font-medium text-slate-900"><Translate text={localizationConstants.protocolUpload} /></span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Datatable Container */}
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full min-w-[750px] border-collapse text-left print:min-w-full">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("date")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.protocolColDate} />
									{renderSortIcon("date")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("type")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.protocolColType} />
									{renderSortIcon("type")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("documentName")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.protocolColPdf} />
									{renderSortIcon("documentName")}
								</span>
							</TableHead>
							<TableHead className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-500">
								<Translate text={localizationConstants.protocolColHandling} />
							</TableHead>
							<TableHead className="w-12 px-4 py-3.5 text-center print:hidden" />
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-slate-100 bg-white">
						{rows.length === 0 ? (
							<TableRow className="h-[56px]">
								<TableCell colSpan={5} className="h-[56px] text-center text-sm text-slate-400 py-6">
									{t(localizationConstants.noRecordsFound)}
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow
									key={row.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
										{row.date}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
										{row.type}
									</TableCell>
									<TableCell className="px-4 py-2.5">
										<div className="flex items-center gap-3 min-w-0">
											<PdfFileIcon className="h-12 w-10 shrink-0" />
											<span className="text-sm font-normal text-slate-900 truncate min-w-0">
												{row.documentName}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-8 border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer shadow-none"
										>
											<Translate text={localizationConstants.viewDetailsButton} />
										</Button>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-center whitespace-nowrap print:hidden">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
													aria-label={t(localizationConstants.actions)}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-36 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-50"
											>
												<DropdownMenuItem
													onClick={() => (row.fileUrl ? window.open(row.fileUrl, "_blank") : handleDownload(row))}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs font-normal"
												>
													<FolderOpen className="h-4 w-4 text-slate-900" />
													<span className="text-slate-900"><Translate text={localizationConstants.protocolActionOpen} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDownload(row)}
													disabled={downloadingId === row.id}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs font-normal"
												>
													{downloadingId === row.id ? (
														<Loader2 className="h-4 w-4 text-slate-900 animate-spin" />
													) : (
														<Download className="h-4 w-4 text-slate-900" />
													)}
													<span className="text-slate-900"><Translate text={localizationConstants.protocolActionDownload} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														onArchive(row.id);
														showToast("success", t(localizationConstants.toastProtocolArchived));
													}}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs font-normal"
												>
													<Archive className="h-4 w-4 text-slate-900" />
													<span className="text-slate-900"><Translate text={localizationConstants.protocolActionArchive} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={handlePrint}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs font-normal"
												>
													<Printer className="h-4 w-4 text-slate-900" />
													<span className="text-slate-900"><Translate text={localizationConstants.print} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setDeletingId(row.id)}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 text-xs font-normal"
												>
													<Trash2 className="h-4 w-4 text-slate-900" />
													<span className="text-slate-900"><Translate text={localizationConstants.protocolActionDelete} /></span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="print:hidden">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			</div>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
				<AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.deleteProtocolConfirmTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="font-sans text-sm text-slate-500">
							<Translate text={localizationConstants.deleteProtocolConfirmDesc} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
						<AlertDialogCancel className="w-full sm:w-auto rounded-lg border-slate-200 hover:bg-slate-50 text-slate-900 text-sm cursor-pointer shadow-none">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="w-full sm:w-auto !bg-slate-900 hover:!bg-slate-800 !text-white rounded-lg text-sm border-0 cursor-pointer shadow-none font-medium"
						>
							<Translate text={localizationConstants.protocolActionDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default ProtocolOverviewTable;
