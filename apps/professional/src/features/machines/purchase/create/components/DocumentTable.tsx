import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PurchaseDocument } from "../../types/purchase.types";

export type DocSortField = "date" | "name" | "fileType";

interface DocumentTableProps {
	documents: PurchaseDocument[];
	docSortBy: DocSortField;
	docSortOrder: "asc" | "desc";
	onSort: (field: DocSortField) => void;
	onPreview: (doc: PurchaseDocument) => void;
	onDelete: (docId: string) => void;
}

export function DocumentTable({
	documents,
	docSortBy,
	docSortOrder,
	onSort,
	onPreview,
	onDelete,
}: DocumentTableProps) {
	return (
		<div className="rounded-lg border border-slate-200/80 overflow-hidden">
			<Table>
				<TableHeader className="bg-slate-50/70 border-b border-slate-200">
					<TableRow>
						<TableHead
							onClick={() => onSort("date")}
							className="text-xs font-semibold text-slate-600 py-3 w-40 cursor-pointer select-none hover:text-slate-900"
						>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.machinePurchaseColDocDate} />
								{docSortBy === "date" ? (
									docSortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3 text-slate-900" />
									) : (
										<ArrowDown className="h-3 w-3 text-slate-900" />
									)
								) : (
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								)}
							</div>
						</TableHead>
						<TableHead
							onClick={() => onSort("name")}
							className="text-xs font-semibold text-slate-600 py-3 cursor-pointer select-none hover:text-slate-900"
						>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.machinePurchaseColDocName} />
								{docSortBy === "name" ? (
									docSortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3 text-slate-900" />
									) : (
										<ArrowDown className="h-3 w-3 text-slate-900" />
									)
								) : (
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								)}
							</div>
						</TableHead>
						<TableHead
							onClick={() => onSort("fileType")}
							className="text-xs font-semibold text-slate-600 py-3 w-28 cursor-pointer select-none hover:text-slate-900"
						>
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.machinePurchaseColDocFile} />
								{docSortBy === "fileType" ? (
									docSortOrder === "asc" ? (
										<ArrowUp className="h-3 w-3 text-slate-900" />
									) : (
										<ArrowDown className="h-3 w-3 text-slate-900" />
									)
								) : (
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								)}
							</div>
						</TableHead>
						<TableHead className="text-xs font-semibold text-slate-600 py-3 text-right pr-6 w-36">
							<Translate text={localizationConstants.orderActionsHeader} />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{documents.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className="h-24 text-center text-xs text-slate-400"
							>
								Inga dokument uppladdade ännu.
							</TableCell>
						</TableRow>
					) : (
						documents.map((doc) => (
							<TableRow
								key={doc.id}
								className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
							>
								<TableCell className="text-xs text-slate-600 py-3">
									{doc.date}
								</TableCell>
								<TableCell className="text-xs font-medium text-slate-800 py-3">
									<div className="flex items-center gap-2.5">
										<PdfFileIcon className="h-7 w-[22px] shrink-0" />
										<span>{doc.name}</span>
									</div>
								</TableCell>
								<TableCell className="text-xs text-slate-600 py-3">
									<span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
										{doc.fileType}
									</span>
								</TableCell>
								<TableCell className="text-xs py-3 text-right pr-6">
									<div className="flex items-center justify-end gap-3">
										<button
											type="button"
											onClick={() => onPreview(doc)}
											className="rounded border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
										>
											<Translate text={localizationConstants.machinePurchaseActionViewFile} />
										</button>
										<button
											type="button"
											onClick={() => onDelete(doc.id)}
											className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
											title="Ta bort dokument"
											aria-label={`Ta bort ${doc.name}`}
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
