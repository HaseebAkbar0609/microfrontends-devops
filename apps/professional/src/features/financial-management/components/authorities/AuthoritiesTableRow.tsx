"use client";

import React from "react";
import { MoreVertical, Eye, Edit2, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityItem } from "../../types/authorities.types";

interface AuthoritiesTableRowProps {
	item: AuthorityItem;
	onView: (item: AuthorityItem) => void;
	onEdit: (item: AuthorityItem) => void;
	onDelete: (id: string, title: string) => void;
}

export function AuthoritiesTableRow({
	item,
	onView,
	onEdit,
	onDelete,
}: AuthoritiesTableRowProps) {
	const handleDownload = () => {
		const sampleUrl =
			item.fileUrl ||
			"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
		const link = window.document.createElement("a");
		link.href = sampleUrl;
		link.download = item.fileName || "Kontrakt.pdf";
		window.document.body.appendChild(link);
		link.click();
		window.document.body.removeChild(link);
	};

	const ext = (item.fileType || "PDF").toUpperCase();

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700">
			{/* ID */}
			<td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
				{item.caseNr || item.id}
			</td>

			{/* Kategori Badge */}
			<td className="px-4 py-3.5 whitespace-nowrap">
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
					{item.category}
				</span>
			</td>

			{/* Datum */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap font-mono">
				{item.date}
			</td>

			{/* Dockumentets namn */}
			<td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
				<button
					type="button"
					onClick={() => onView(item)}
					className="hover:underline text-left cursor-pointer hover:text-slate-900"
				>
					{item.documentName || item.subject}
				</button>
			</td>

			{/* Fil */}
			<td className="px-4 py-3.5 whitespace-nowrap">
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
					<span className="text-slate-700 font-medium">{item.fileName || "Kontrakt.pdf"}</span>
				</div>
			</td>

			{/* 3 Dots Actions Menu */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
							aria-label="Actions"
						>
							<MoreVertical className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-38">
						<DropdownMenuItem
							onClick={() => onView(item)}
							className="gap-2 cursor-pointer text-xs"
						>
							<Eye className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.titleAuthorityDetails} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onEdit(item)}
							className="gap-2 cursor-pointer text-xs"
						>
							<Edit2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnEdit} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={handleDownload}
							className="gap-2 cursor-pointer text-xs"
						>
							<Download className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnDownload} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id, item.documentName || item.subject)}
							className="gap-2 cursor-pointer text-xs text-rose-600 hover:text-rose-700"
						>
							<Trash2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnDelete} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

export default AuthoritiesTableRow;
