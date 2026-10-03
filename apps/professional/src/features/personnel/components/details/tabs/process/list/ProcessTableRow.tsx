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

function getStatusBadgeConfig(status: PersonalProcessItem["status"]) {
	switch (status) {
		case "completed":
			return {
				className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
				labelKey: localizationConstants.processStatusCompleted,
			};
		case "pending":
			return {
				className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
				labelKey: localizationConstants.processStatusPending,
			};
		case "overdue":
			return {
				className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
				labelKey: localizationConstants.processStatusOverdue,
			};
		case "active":
		default:
			return {
				className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
				labelKey: localizationConstants.processStatusActive,
			};
	}
}

export function ProcessTableRow({
	process,
	onView,
	onEdit,
	onDelete,
}: ProcessTableRowProps) {
	const statusConfig = getStatusBadgeConfig(process.status);

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
				<Badge className={`${statusConfig.className} text-[11px] font-semibold px-2 py-0.5 shadow-2xs`}>
					<Translate text={statusConfig.labelKey} />
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
						<span className="sr-only">
							<Translate text={localizationConstants.processActionView} />
						</span>
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
								<span className="sr-only">
									<Translate text={localizationConstants.processActionMenu} />
								</span>
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
