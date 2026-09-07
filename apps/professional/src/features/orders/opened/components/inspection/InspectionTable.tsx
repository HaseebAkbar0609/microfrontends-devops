"use client";

import React from "react";
import { MoreVertical, PenLine, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import type { SortDir } from "@/utils/tableSort";
import { INSPECTION_TYPE_TRANSLATION_MAP } from "../../constants/orderInspection.constants";
import type { OrderInspectionItem, InspectionSortField } from "../../types/orderInspection.types";

interface InspectionTableProps {
	items: OrderInspectionItem[];
	isLoading: boolean;
	sortField: InspectionSortField | null;
	sortDir: SortDir;
	onToggleSort: (field: InspectionSortField) => void;
	onEdit: (item: OrderInspectionItem) => void;
	onDelete: (item: OrderInspectionItem) => void;
	onDownload: (fileName: string, url?: string) => void;
}

export function InspectionTable({
	items,
	isLoading,
	sortField,
	sortDir,
	onToggleSort,
	onEdit,
	onDelete,
	onDownload,
}: InspectionTableProps) {
	const t = useTranslate();

	if (isLoading) {
		return (
			<div className="space-y-2 bg-transparent p-4 w-full md:w-[78%] lg:w-[80%] max-w-[960px]">
				<div className="h-8 bg-slate-100 animate-pulse rounded" />
				<div className="h-12 bg-slate-100 animate-pulse rounded" />
				<div className="h-12 bg-slate-100 animate-pulse rounded" />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-slate-200 text-center w-full md:w-[78%] lg:w-[80%] max-w-[960px]">
				<p className="text-sm font-medium text-slate-800">
					{t(localizationConstants.inspectionEmptyState)}
				</p>
				<p className="text-xs text-slate-500 mt-1">
					{t(localizationConstants.inspectionEmptyStateDesc)}
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto w-full md:w-[78%] lg:w-[80%] max-w-[960px]">
			<Table className="w-full min-w-[600px]">
				<TableHeader>
					<TableRow className="border-b border-slate-200 bg-transparent hover:bg-transparent">
						<TableHead className="py-3 px-4 sm:px-5 w-[140px] font-sans text-xs font-normal text-slate-500">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onToggleSort("date")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 cursor-pointer font-sans text-xs font-normal hover:bg-transparent shadow-none"
							>
								<span>{t(localizationConstants.inspectionColDate)}</span>
								{renderSortIcon("date", sortField, sortDir)}
							</Button>
						</TableHead>

						<TableHead className="py-3 px-4 sm:px-5 w-[160px] font-sans text-xs font-normal text-slate-500">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onToggleSort("type")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 cursor-pointer font-sans text-xs font-normal hover:bg-transparent shadow-none"
							>
								<span>{t(localizationConstants.inspectionColType)}</span>
								{renderSortIcon("type", sortField, sortDir)}
							</Button>
						</TableHead>

						<TableHead className="py-3 px-4 sm:px-5 w-[175px] font-sans text-xs font-normal text-slate-500">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onToggleSort("inspectionDate")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 cursor-pointer font-sans text-xs font-normal hover:bg-transparent shadow-none"
							>
								<span>{t(localizationConstants.inspectionColInspectionDate)}</span>
								{renderSortIcon("inspectionDate", sortField, sortDir)}
							</Button>
						</TableHead>

						<TableHead className="py-3 px-4 sm:px-5 font-sans text-xs font-normal text-slate-500">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onToggleSort("pdf")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 cursor-pointer font-sans text-xs font-normal hover:bg-transparent shadow-none"
							>
								<span>{t(localizationConstants.inspectionColPdf)}</span>
								{renderSortIcon("pdf", sortField, sortDir)}
							</Button>
						</TableHead>

						<TableHead className="py-3 px-3 w-[52px] text-right" />
					</TableRow>
				</TableHeader>

				<TableBody className="divide-y divide-slate-200">
					{items.map((item) => {
						const primaryDoc = item.documents && item.documents.length > 0 ? item.documents[0] : null;
						const fileName = primaryDoc ? primaryDoc.fileName || primaryDoc.name : "";
						const fileUrl = primaryDoc?.url;
						const typeTranslationKey = INSPECTION_TYPE_TRANSLATION_MAP[item.type];
						const typeLabel = typeTranslationKey ? t(typeTranslationKey) : item.type;

						return (
							<TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-200">
								<TableCell className="py-3 px-4 sm:px-5 font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
									{item.date}
								</TableCell>

								<TableCell className="py-3 px-4 sm:px-5 font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
									{typeLabel}
								</TableCell>

								<TableCell className="py-3 px-4 sm:px-5 font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
									{item.inspectionDate}
								</TableCell>

								<TableCell className="py-3 px-4 sm:px-5">
									{fileName ? (
										<div className="flex items-center gap-2 min-w-0">
											<PdfFileIcon className="h-11 w-9 shrink-0" />
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onDownload(fileName, fileUrl)}
												className="h-auto p-0 font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 hover:text-blue-600 hover:underline truncate cursor-pointer text-left hover:bg-transparent shadow-none"
												title={fileName}
											>
												{fileName}
											</Button>
										</div>
									) : (
										<span className="text-slate-400 font-normal text-sm">-</span>
									)}
								</TableCell>

								<TableCell className="py-3 px-3 text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-lg text-slate-900 hover:bg-slate-100 cursor-pointer"
											>
												<MoreVertical size={16} className="text-slate-900" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-36 bg-white p-1 shadow-md border border-slate-200 rounded-lg">
											<DropdownMenuItem
												onClick={() => onEdit(item)}
												className="flex items-center gap-2 px-2.5 py-1.5 font-sans text-xs font-normal text-slate-900 cursor-pointer rounded hover:bg-slate-100"
											>
												<PenLine className="h-3.5 w-3.5 text-slate-900" />
												<span>{t(localizationConstants.menuEditInspection)}</span>
											</DropdownMenuItem>
											{fileName && (
												<DropdownMenuItem
													onClick={() => onDownload(fileName, fileUrl)}
													className="flex items-center gap-2 px-2.5 py-1.5 font-sans text-xs font-normal text-slate-900 cursor-pointer rounded hover:bg-slate-100"
												>
													<Download className="h-3.5 w-3.5 text-slate-900" />
													<span>{t(localizationConstants.menuDownloadInspection)}</span>
												</DropdownMenuItem>
											)}
											<DropdownMenuItem
												onClick={() => onDelete(item)}
												className="flex items-center gap-2 px-2.5 py-1.5 font-sans text-xs font-normal text-slate-900 cursor-pointer rounded hover:bg-slate-100"
											>
												<Trash2 className="h-3.5 w-3.5 text-slate-900" />
												<span>{t(localizationConstants.menuDeleteInspection)}</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default InspectionTable;
