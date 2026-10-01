"use client";

import React from "react";
import { MoreVertical, Eye, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface MedarbetarsamtalTableRowProps {
	item: MedarbetarsamtalItem;
	onOpenDetail: (item: MedarbetarsamtalItem) => void;
	onPreviewDoc?: (name: string) => void;
	onArchiveClick?: (id: string) => void;
	onDeleteClick: (item: MedarbetarsamtalItem) => void;
}

export function MedarbetarsamtalTableRow({
	item,
	onOpenDetail,
	onPreviewDoc,
	onArchiveClick,
	onDeleteClick,
}: MedarbetarsamtalTableRowProps) {
	return (
		<tr
			onClick={() => onOpenDetail(item)}
			className="hover:bg-slate-50/60 cursor-pointer transition-colors"
		>
			<td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
				{item.date}
			</td>
			<td className="py-3 px-4 font-bold text-slate-900">
				{item.protocolTitle}
			</td>
			<td className="py-3 px-4 text-slate-700">{item.person}</td>
			<td className="py-3 px-4">
				{item.feeling === "positiv" && (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-700 text-white">
						<Translate text={localizationConstants.medarbetarsamtalFeelingPos} />
					</span>
				)}
				{item.feeling === "neutral" && (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500 text-white">
						<Translate text={localizationConstants.medarbetarsamtalFeelingNeut} />
					</span>
				)}
				{item.feeling === "behover_uppmarksamhet" && (
					<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-600 text-white">
						<Translate text={localizationConstants.medarbetarsamtalFeelingWarn} />
					</span>
				)}
			</td>
			<td
				className="py-3 px-4 text-center"
				onClick={(e) => {
					e.stopPropagation();
					if (item.documents[0]) {
						onPreviewDoc?.(item.documents[0].name);
					}
				}}
			>
				<div className="flex justify-center">
					<PdfFileIcon className="h-6 w-5" />
				</div>
			</td>
			<td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36 text-xs">
						<DropdownMenuItem
							onClick={() => onOpenDetail(item)}
							className="cursor-pointer gap-2"
						>
							<Eye className="h-3.5 w-3.5 text-slate-500" />
							<Translate text={localizationConstants.kompetensActionOpen} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onArchiveClick?.(item.id)}
							className="cursor-pointer gap-2"
						>
							<Archive className="h-3.5 w-3.5 text-slate-500" />
							<Translate text={localizationConstants.kompetensActionArchive} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDeleteClick(item)}
							className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600"
						>
							<Trash2 className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.kompetensActionDelete} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}
