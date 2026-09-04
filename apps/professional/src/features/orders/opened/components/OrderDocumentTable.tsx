"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, MoreVertical, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderDocumentItem } from "../types/orderOpened.types";

function DocTypeBadge({ type, label }: { type?: string; label?: string }) {
	if (type === "doc" || (!type && label?.endsWith(".doc")) || label?.endsWith(".docx")) {
		return <DocFileIcon className="h-11 w-9 shrink-0" />;
	}
	return <PdfFileIcon className="h-11 w-9 shrink-0" />;
}

export function formatDisplayDate(dateStr?: string): string {
	if (!dateStr) return "—";
	try {
		const parsed = new Date(dateStr);
		if (isNaN(parsed.getTime())) return dateStr;
		return parsed.toISOString().split("T")[0];
	} catch {
		return dateStr;
	}
}

export interface OrderDocumentTableProps {
	initialDocuments?: OrderDocumentItem[];
}

export function OrderDocumentTable({ initialDocuments = [] }: OrderDocumentTableProps) {
	const t = useTranslate();
	const [documents, setDocuments] = useState<OrderDocumentItem[]>(initialDocuments);
	const [documentToDelete, setDocumentToDelete] = useState<OrderDocumentItem | null>(null);
	const [sortField, setSortField] = useState<"datum" | "namn" | "fil" | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	useEffect(() => {
		if (initialDocuments) {
			setDocuments(initialDocuments);
		}
	}, [initialDocuments]);

	const handleSort = (field: "datum" | "namn" | "fil") => {
		if (sortField === field) {
			if (sortOrder === "asc") {
				setSortOrder("desc");
			} else {
				setSortField(null);
				setSortOrder("asc");
			}
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const sortedDocuments = useMemo(() => {
		if (!documents || documents.length === 0) return [];
		if (!sortField || !sortOrder) return documents;
		return [...documents].sort((a, b) => {
			let aVal = "";
			let bVal = "";
			if (sortField === "datum") {
				aVal = a.date || "";
				bVal = b.date || "";
			} else if (sortField === "namn") {
				aVal = a.documentName || "";
				bVal = b.documentName || "";
			} else if (sortField === "fil") {
				aVal = a.fileName || "";
				bVal = b.fileName || "";
			}
			return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
		});
	}, [documents, sortField, sortOrder]);

	return (
		<div className="overflow-x-auto w-full md:w-1/2">
			<table className="w-full min-w-[380px] table-fixed text-sm">
				<thead>
					<tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
						<th className="w-[120px] pb-2.5 font-normal">
							<Button
								type="button"
								variant="ghost"
								onClick={() => handleSort("datum")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
							>
								<span>{t(localizationConstants.b2bAvtalDatum)}</span>
								{sortField === "datum" ? (
									sortOrder === "asc" ? (
										<ArrowUp size={13} className="text-slate-900" />
									) : (
										<ArrowDown size={13} className="text-slate-900" />
									)
								) : (
									<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
								)}
							</Button>
						</th>
						<th className="w-[150px] pb-2.5 font-normal">
							<Button
								type="button"
								variant="ghost"
								onClick={() => handleSort("namn")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
							>
								<span>{t(localizationConstants.b2bAvtalDokumentNamn)}</span>
								{sortField === "namn" ? (
									sortOrder === "asc" ? (
										<ArrowUp size={13} className="text-slate-900" />
									) : (
										<ArrowDown size={13} className="text-slate-900" />
									)
								) : (
									<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
								)}
							</Button>
						</th>
						<th className="pb-2.5 font-normal">
							<Button
								type="button"
								variant="ghost"
								onClick={() => handleSort("fil")}
								className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
							>
								<span>{t(localizationConstants.b2bAvtalFil)}</span>
								{sortField === "fil" ? (
									sortOrder === "asc" ? (
										<ArrowUp size={13} className="text-slate-900" />
									) : (
										<ArrowDown size={13} className="text-slate-900" />
									)
								) : (
									<ArrowUpDown size={13} className="text-slate-400 opacity-60" />
								)}
							</Button>
						</th>
						<th className="w-[48px] pb-2.5 text-right font-normal"></th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-200">
					{sortedDocuments.map((doc) => (
						<tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
							<td className="w-[120px] py-2 text-slate-900 text-xs font-normal truncate">
								{formatDisplayDate(doc.date)}
							</td>
							<td className="w-[150px] py-2 pr-3">
								<span
									title={doc.documentName}
									className="flex h-[34px] w-full max-w-[150px] items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-slate-900 font-normal leading-none truncate"
								>
									{doc.documentName || t(localizationConstants.b2bAvtalDocNamnPlaceholder)}
								</span>
							</td>
							<td className="py-2 pr-2">
								<div className="flex items-center gap-2 min-w-0">
									<DocTypeBadge type={doc.fileType} label={doc.fileName} />
									<span
										title={doc.fileName}
										className="text-xs font-normal text-slate-900 truncate min-w-0 flex-1"
									>
										{doc.fileName}
									</span>
								</div>
							</td>
							<td className="w-[48px] py-2 text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
										>
											<MoreVertical size={16} aria-hidden={true} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-[140px] rounded-xl bg-white p-1.5 shadow-md border border-slate-200">
										<DropdownMenuItem
											className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
										>
											<PenLine className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
											<span>{t(localizationConstants.menuEditDocument)}</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => setDocumentToDelete(doc)}
											className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
										>
											<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
											<span>{t(localizationConstants.menuDeleteDocument)}</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Delete Document Confirmation Dialog */}
			<Dialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
				<DialogContent className="sm:max-w-md bg-white border border-zinc-200 p-6">
					<DialogHeader>
						<DialogTitle className="text-slate-900 font-semibold text-base">
							{t(localizationConstants.deleteDocumentTitle)}
						</DialogTitle>
						<DialogDescription className="text-slate-600 text-sm mt-1">
							{t(localizationConstants.deleteDocumentDesc)}
						</DialogDescription>
						{documentToDelete?.fileName && (
							<p className="mt-2 text-sm font-medium text-slate-900 truncate">
								{documentToDelete.fileName}
							</p>
						)}
					</DialogHeader>
					<DialogFooter className="flex gap-2 sm:justify-end mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setDocumentToDelete(null)}
							className="border-zinc-200 text-slate-700 hover:bg-zinc-100 cursor-pointer"
						>
							{t(localizationConstants.cancelButton)}
						</Button>
						<Button
							type="button"
							onClick={() => {
								if (documentToDelete) {
									setDocuments((prev) => prev.filter((d) => d.id !== documentToDelete.id));
									setDocumentToDelete(null);
								}
							}}
							className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-4 py-2 text-sm font-medium cursor-pointer"
						>
							{t(localizationConstants.actionDelete)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
