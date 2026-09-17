"use client";

import React from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type {
	BankDocumentItem,
	BankDocSortField,
	SortOrder,
} from "../../types/bank.types";
import { BankDocumentsTable } from "./BankDocumentsTable";
import { BankPagination } from "./BankPagination";

export interface BankDocumentsTabViewProps {
	documents: BankDocumentItem[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	searchQuery: string;
	onSearchChange: (val: string) => void;
	fileTypeFilter: string;
	onFileTypeFilterChange: (val: string) => void;
	sortBy: BankDocSortField;
	sortOrder: SortOrder;
	onSort: (field: BankDocSortField) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onUploadClick: () => void;
	onViewFile?: (doc: BankDocumentItem) => void;
	onDeleteDocument?: (id: string, name: string) => void;
}

export function BankDocumentsTabView({
	documents,
	totalCount,
	currentPage,
	pageSize,
	totalPages,
	searchQuery,
	onSearchChange,
	fileTypeFilter,
	onFileTypeFilterChange,
	sortBy,
	sortOrder,
	onSort,
	onPageChange,
	onPageSizeChange,
	onUploadClick,
	onViewFile,
	onDeleteDocument,
}: BankDocumentsTabViewProps) {
	const { t } = useTranslation();

	const handleView = (doc: BankDocumentItem) => {
		if (onViewFile) {
			onViewFile(doc);
		} else {
			const samplePdf =
				doc.fileUrl ||
				"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
			window.open(samplePdf, "_blank");
		}
	};

	return (
		<div className="space-y-4">
			{/* Top Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2.5 flex-1 max-w-xl">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.searchBankPlaceholder)}
							className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
							>
								<Filter className="w-4 h-4 text-slate-500" />
								<Translate
									text={
										fileTypeFilter === "PDF"
											? localizationConstants.filterPdf
											: fileTypeFilter === "PNG" || fileTypeFilter === "JPG"
												? localizationConstants.filterImage
												: fileTypeFilter === "DOCX" || fileTypeFilter === "XLSX"
													? localizationConstants.filterOffice
													: localizationConstants.filterBankPlaceholder
									}
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							<DropdownMenuItem
								onClick={() => onFileTypeFilterChange("all")}
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.filterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFileTypeFilterChange("PDF")}
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.filterPdf} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFileTypeFilterChange("PNG")}
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.filterImage} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFileTypeFilterChange("DOCX")}
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.filterOffice} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Button
						type="button"
						onClick={onUploadClick}
						className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer transition-colors"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.btnCreateNew} />
					</Button>
				</div>
			</div>

			{/* Documents Table */}
			<BankDocumentsTable
				documents={documents}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={onSort}
				onView={handleView}
				onDelete={onDeleteDocument}
				onUploadClick={onUploadClick}
			/>

			{/* Pagination */}
			<BankPagination
				totalCount={totalCount}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	);
}

export default BankDocumentsTabView;
