"use client";

import React from "react";
import { ArrowUpDown, Plus, FileText, MoreVertical, Trash2, Archive, RotateCcw } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DOCUMENTS_CONSTANTS, type DocumentsSubTab } from "../constants/documents.constants";
import type { OrderDocumentItem } from "../types/documents.types";

interface DocumentsTableProps {
	items: OrderDocumentItem[];
	totalCount: number;
	subtab: DocumentsSubTab;
	sortField: string;
	sortOrder: "asc" | "desc";
	onSort: (field: "date" | "name" | "fileName" | "drawingNumber" | "category" | "createdBy") => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	onArchive: (id: string) => void;
	onRestore: (id: string) => void;
	onDelete: (item: OrderDocumentItem) => void;
	onOpenUploadModal: () => void;
}

export function DocumentsTable({
	items,
	totalCount,
	subtab,
	onSort,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	onArchive,
	onRestore,
	onDelete,
	onOpenUploadModal,
}: DocumentsTableProps) {
	const t = useTranslate();
	const isDrawings = subtab === DOCUMENTS_CONSTANTS.SUBTABS.DRAWINGS;

	if (totalCount === 0) {
		return (
			<div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-lg border border-slate-200 mt-4 shadow-2xs">
				<div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
					<FileText className="w-6 h-6" />
				</div>
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.orderHandlingarEmptyStateTitle} />
				</h3>
				<p className="text-xs text-slate-500 max-w-sm mb-4">
					<Translate text={localizationConstants.orderHandlingarEmptyStateDesc} />
				</p>
				<Button
					onClick={onOpenUploadModal}
					size="sm"
					className="gap-1.5"
				>
					<Plus className="w-4 h-4" />
					<span>
						<Translate text={localizationConstants.orderHandlingarBtnUpload} />
					</span>
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col mt-2">
			<div className="w-full overflow-x-auto">
				<Table className="w-full border-collapse text-left border-b border-slate-200">
					<TableHeader>
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{/* Column 1: Date */}
							<TableHead className="px-4 py-3.5 text-xs font-semibold text-slate-500 whitespace-nowrap w-[140px]">
								<button
									type="button"
									onClick={() => onSort("date")}
									className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors font-semibold text-xs text-slate-500"
								>
									<span>{t(localizationConstants.orderHandlingarColDate)}</span>
									<ArrowUpDown className="w-3.5 h-3.5" />
								</button>
							</TableHead>

							{/* Column 2: Name / Drawing Number */}
							<TableHead className="px-4 py-3.5 text-xs font-semibold text-slate-500 min-w-[220px]">
								<button
									type="button"
									onClick={() => onSort(isDrawings ? "drawingNumber" : "name")}
									className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors font-semibold text-xs text-slate-500"
								>
									<span>
										{isDrawings
											? t(localizationConstants.orderHandlingarColDrawingNumber)
											: t(localizationConstants.orderHandlingarColName)}
									</span>
									<ArrowUpDown className="w-3.5 h-3.5" />
								</button>
							</TableHead>

							{/* Column 3: Document (PDF) or Category */}
							<TableHead className="px-4 py-3.5 text-xs font-semibold text-slate-500 min-w-[240px]">
								<button
									type="button"
									onClick={() => onSort(isDrawings ? "category" : "fileName")}
									className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors font-semibold text-xs text-slate-500"
								>
									<span>
										{isDrawings
											? t(localizationConstants.orderHandlingarColCategory)
											: t(localizationConstants.orderHandlingarColDocument)}
									</span>
									<ArrowUpDown className="w-3.5 h-3.5" />
								</button>
							</TableHead>

							{/* Column 4: Created By */}
							<TableHead className="px-4 py-3.5 text-xs font-semibold text-slate-500 min-w-[180px]">
								<span>{t(localizationConstants.orderHandlingarColCreatedBy)}</span>
							</TableHead>

							{/* Column 5: Action Column */}
							<TableHead className="w-12 px-2 py-3.5 text-center whitespace-nowrap border-l border-slate-200" />
						</TableRow>
					</TableHeader>

					<TableBody className="bg-white">
						{items.map((item) => (
							<TableRow
								key={item.id}
								className="group border-b border-slate-200 transition-colors hover:bg-slate-50/60"
							>
								{/* Date */}
								<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
									{item.date}
								</TableCell>

								{/* Name / Drawing Number */}
								<TableCell className="px-4 py-3.5 text-sm font-semibold text-slate-900">
									{isDrawings ? item.drawingNumber || item.name : item.name}
								</TableCell>

								{/* Document file or Category */}
								<TableCell className="px-4 py-2.5">
									{isDrawings ? (
										<span className="text-sm font-normal text-slate-900">
											{item.category || DOCUMENTS_CONSTANTS.FALLBACK_DASH}
										</span>
									) : (
										<div className="flex items-center gap-3 min-w-0">
											<PdfFileIcon className="h-10 w-8 shrink-0" />
											<span className="text-sm font-normal text-slate-900 truncate min-w-0">
												{item.fileName}
											</span>
										</div>
									)}
								</TableCell>

								{/* Created By */}
								<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
									{item.createdBy}
								</TableCell>

								{/* Row Action Menu */}
								<TableCell className="w-12 px-2 py-3.5 whitespace-nowrap text-center border-l border-slate-200">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-slate-700 hover:text-slate-900 mx-auto"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-50">
											<DropdownMenuItem
												onClick={() => onDelete(item)}
												className="flex items-center gap-2 text-xs font-normal text-slate-800 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
											>
												<Trash2 className="w-3.5 h-3.5 text-slate-800" />
												<span>{t(localizationConstants.orderHandlingarActionDelete)}</span>
											</DropdownMenuItem>
											{item.isArchived ? (
												<DropdownMenuItem
													onClick={() => onRestore(item.id)}
													className="flex items-center gap-2 text-xs font-normal text-slate-800 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
												>
													<RotateCcw className="w-3.5 h-3.5 text-slate-800" />
													<span>{t(localizationConstants.orderHandlingarActionRestore)}</span>
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem
													onClick={() => onArchive(item.id)}
													className="flex items-center gap-2 text-xs font-normal text-slate-800 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
												>
													<Archive className="w-3.5 h-3.5 text-slate-800" />
													<span>{t(localizationConstants.orderHandlingarActionArchive)}</span>
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Reusable Project-Standard TablePagination */}
			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
}

export default DocumentsTable;
