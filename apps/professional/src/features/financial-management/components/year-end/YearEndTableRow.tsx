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
import type { YearEndItem } from "../../types/yearEnd.types";
import { getYearEndCategoryLabel } from "../../utils/yearEndLocalization";

interface YearEndTableRowProps {
	item: YearEndItem;
	onDelete: (item: YearEndItem) => void;
}

export function YearEndTableRow({
	item,
	onDelete,
}: YearEndTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0 text-xs">
			{/* Sr. Nr */}
			<td className="py-3.5 px-4 font-medium text-slate-700">
				{item.srNr}
			</td>

			{/* Category (Localized) */}
			<td className="py-3.5 px-4 font-medium text-slate-900 truncate max-w-[160px]">
				{getYearEndCategoryLabel(item.category, t)}
			</td>

			{/* Description / Period */}
			<td className="py-3.5 px-4 text-slate-700 truncate max-w-[200px]">
				{item.name}
			</td>

			{/* File */}
			<td className="py-3.5 px-4">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5">
						<span
							className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
								item.fileType === "PDF"
									? "bg-rose-50 text-rose-600 border border-rose-200"
									: "bg-blue-50 text-blue-600 border border-blue-200"
							}`}
						>
							{item.fileType}
						</span>
						<span className="font-medium text-slate-800 truncate max-w-[140px]">
							{item.fileName}
						</span>
					</div>
				</div>
			</td>

			{/* Actions 3-dots Menu */}
			<td className="py-3.5 px-4 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
							aria-label="Actions"
						>
							<MoreVertical className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36">
						{item.fileUrl && (
							<DropdownMenuItem
								asChild
								className="cursor-pointer text-xs gap-2"
							>
								<a href={item.fileUrl} download={item.fileName}>
									<Download className="h-3.5 w-3.5 text-slate-500" />
									<span>
										<Translate text={localizationConstants.actionDownloadYearEnd} />
									</span>
								</a>
							</DropdownMenuItem>
						)}
						<DropdownMenuItem
							onClick={() => onDelete(item)}
							className="cursor-pointer text-xs gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
						>
							<Trash2 className="h-3.5 w-3.5 text-rose-600" />
							<span>
								<Translate text={localizationConstants.actionDeleteYearEnd} />
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

export default YearEndTableRow;
