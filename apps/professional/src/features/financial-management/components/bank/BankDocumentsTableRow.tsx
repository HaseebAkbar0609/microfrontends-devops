"use client";

import React from "react";
import { Eye, MoreVertical, Trash2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankDocumentItem } from "../../types/bank.types";

interface BankDocumentsTableRowProps {
	document: BankDocumentItem;
	onView: (doc: BankDocumentItem) => void;
	onDelete?: (id: string, name: string) => void;
}

export function BankDocumentsTableRow({
	document: doc,
	onView,
	onDelete,
}: BankDocumentsTableRowProps) {
	const { t } = useTranslation();

	const handleDownload = () => {
		const url =
			doc.fileUrl ||
			"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
		const link = window.document.createElement("a");
		link.href = url;
		link.download = doc.name;
		window.document.body.appendChild(link);
		link.click();
		window.document.body.removeChild(link);
	};

	const ext = (doc.fileType || doc.name.split(".").pop() || "PDF").toUpperCase();

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700">
			{/* Datum */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap font-mono">
				{doc.date}
			</td>

			{/* Dokumentnamn */}
			<td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
				<div className="flex items-center gap-2.5">
					<div
						className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
							ext === "PDF"
								? "bg-rose-50 border border-rose-200 text-rose-600"
								: ext === "PNG" || ext === "JPG" || ext === "JPEG"
									? "bg-emerald-50 border border-emerald-200 text-emerald-600"
									: "bg-blue-50 border border-blue-200 text-blue-600"
						}`}
					>
						{ext.slice(0, 4)}
					</div>
					<button
						type="button"
						onClick={() => onView(doc)}
						className="hover:underline text-left cursor-pointer hover:text-slate-900 font-medium"
					>
						{doc.name}
					</button>
				</div>
			</td>

			{/* Filtyp */}
			<td className="px-4 py-3.5 text-slate-600 uppercase font-mono whitespace-nowrap">
				{ext}
			</td>

			{/* Åtgärder */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				<div className="flex items-center justify-end gap-1.5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onView(doc)}
						className="h-7 px-2.5 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs font-medium"
					>
						<Translate text={localizationConstants.btnViewFile} />
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onView(doc)}
						className="h-7 w-7 text-slate-500 hover:text-slate-900 cursor-pointer"
						aria-label={t(localizationConstants.btnPreview)}
					>
						<Eye className="w-3.5 h-3.5" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-slate-500 hover:text-slate-900 cursor-pointer"
								aria-label="Actions"
							>
								<MoreVertical className="w-3.5 h-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => onView(doc)}
								className="gap-2 cursor-pointer text-xs"
							>
								<ExternalLink className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.btnPreview} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleDownload}
								className="gap-2 cursor-pointer text-xs"
							>
								<Download className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.btnDownload} />
							</DropdownMenuItem>
							{onDelete && (
								<DropdownMenuItem
									onClick={() => onDelete(doc.id, doc.name)}
									className="gap-2 cursor-pointer text-xs text-rose-600 hover:text-rose-700"
								>
									<Trash2 className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.btnDelete} />
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}

export default BankDocumentsTableRow;
