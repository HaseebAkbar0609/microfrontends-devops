"use client";

import React from "react";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PersonalProcessItem } from "@/features/personnel/types/personalProcess.types";

interface ProcessTableRowProps {
	process: PersonalProcessItem;
	onView: (proc: PersonalProcessItem) => void;
	onEdit: (proc: PersonalProcessItem) => void;
	onDelete: (proc: PersonalProcessItem) => void;
}

export function ProcessTableRow({
	process,
	onView,
	onEdit,
	onDelete,
}: ProcessTableRowProps) {
	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700">
			{/* ID */}
			<td className="py-3.5 px-4 font-mono font-medium text-slate-600">
				{process.id}
			</td>

			{/* Title */}
			<td
				className="py-3.5 px-4 font-medium text-slate-900 cursor-pointer hover:underline"
				onClick={() => onView(process)}
			>
				{process.title}
			</td>

			{/* Date */}
			<td className="py-3.5 px-4 font-mono text-slate-600">
				{process.date}
			</td>

			{/* Status */}
			<td className="py-3.5 px-4">
				<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[11px] font-semibold px-2 py-0.5 shadow-2xs">
					<Translate text={localizationConstants.processStatusActive} />
				</Badge>
			</td>

			{/* Actions */}
			<td className="py-3.5 px-4 text-right">
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onView(process)}
						className="h-7 w-7 text-slate-400 hover:text-slate-800 cursor-pointer"
					>
						<Eye className="w-4 h-4" />
						<span className="sr-only">View</span>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-slate-400 hover:text-slate-800 cursor-pointer"
							>
								<MoreVertical className="w-4 h-4" />
								<span className="sr-only">Menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => onEdit(process)}
								className="text-xs cursor-pointer gap-2"
							>
								<Pencil className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.btnEdit} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDelete(process)}
								className="text-xs cursor-pointer text-rose-600 focus:text-rose-600 gap-2"
							>
								<Trash2 className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.btnDelete} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}
