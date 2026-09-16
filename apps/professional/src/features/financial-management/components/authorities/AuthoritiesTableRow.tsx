"use client";

import React from "react";
import { MoreVertical, Trash2, Download } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityItem } from "../../types/authorities.types";
import { getAuthorityCategoryLabel } from "../../utils/authoritiesLocalization";

interface AuthoritiesTableRowProps {
	item: AuthorityItem;
	onDelete: (item: AuthorityItem) => void;
}

export function AuthoritiesTableRow({
	item,
	onDelete,
}: AuthoritiesTableRowProps) {
	const { t } = useTranslation();

	const handleDownload = () => {
		const sampleUrl = item.fileUrl || "#";
		const link = window.document.createElement("a");
		link.href = sampleUrl;
		link.download = item.fileName || "Dokument.pdf";
		window.document.body.appendChild(link);
		link.click();
		window.document.body.removeChild(link);
	};

	const ext = (item.fileType || "PDF").toUpperCase();

	return (
		<tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0 text-xs">
			{/* ID */}
			<td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
				{item.caseNr || item.id}
			</td>

			{/* Authority */}
			<td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
				{item.authorityName}
			</td>

			{/* Category (Localized Badge) */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<span
					className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${
						item.category === "Govt Docs"
							? "bg-slate-900 text-white"
							: item.category === "Financial"
								? "bg-slate-100 text-slate-700 border border-slate-200"
								: item.category === "Tax"
									? "bg-amber-50 text-amber-700 border border-amber-200"
									: "bg-blue-50 text-blue-700 border border-blue-200"
					}`}
				>
					{getAuthorityCategoryLabel(item.category, t)}
				</span>
			</td>

			{/* Date */}
			<td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono">
				{item.date}
			</td>

			{/* Document Name */}
			<td className="py-3.5 px-4 font-medium text-slate-800 truncate max-w-[220px]">
				{item.documentName || item.subject}
			</td>

			{/* File */}
			<td className="py-3.5 px-4 whitespace-nowrap">
				<div className="flex items-center gap-2">
					<div
						className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
							ext === "PDF"
								? "bg-rose-50 border border-rose-200 text-rose-600"
								: "bg-blue-50 border border-blue-200 text-blue-600"
						}`}
					>
						{ext.slice(0, 3)}
					</div>
					<span className="text-slate-700 font-medium truncate max-w-[140px]">
						{item.fileName || "Dokument.pdf"}
					</span>
				</div>
			</td>

			{/* 3 Dots Actions Menu */}
			<td className="py-3.5 px-4 text-right whitespace-nowrap">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
							aria-label="Actions"
						>
							<MoreVertical className="w-4 h-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36">
						<DropdownMenuItem
							onClick={handleDownload}
							className="gap-2 cursor-pointer text-xs"
						>
							<Download className="w-3.5 h-3.5 text-slate-500" />
							<span>
								<Translate text={localizationConstants.actionDownloadPdf} />
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item)}
							className="gap-2 cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50"
						>
							<Trash2 className="w-3.5 h-3.5 text-rose-600" />
							<span>
								<Translate text={localizationConstants.btnDelete} />
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

export default AuthoritiesTableRow;
