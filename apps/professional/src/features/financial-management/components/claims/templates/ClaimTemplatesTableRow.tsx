"use client";

import React from "react";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimTemplate } from "../../../types/claims.types";

interface ClaimTemplatesTableRowProps {
	template: ClaimTemplate;
	onView: (template: ClaimTemplate) => void;
	onEdit: (template: ClaimTemplate) => void;
	onDelete: (template: ClaimTemplate) => void;
}

export function ClaimTemplatesTableRow({
	template,
	onView,
	onEdit,
	onDelete,
}: ClaimTemplatesTableRowProps) {
	return (
		<tr
			onClick={() => onView(template)}
			className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer group"
		>
			{/* ID */}
			<td className="py-4 px-6 text-sm font-medium text-slate-800 whitespace-nowrap">
				{template.id}
			</td>

			{/* Mall (Name) */}
			<td className="py-4 px-6 text-sm text-slate-700 whitespace-nowrap">
				{template.name}
			</td>

			{/* Title */}
			<td className="py-4 px-6 text-sm text-slate-700 whitespace-nowrap">
				{template.title}
			</td>

			{/* senast uppdaterad */}
			<td className="py-4 px-6 text-sm text-slate-500 whitespace-nowrap">
				{template.updatedAt || template.date}
			</td>

			{/* Eye Icon Action */}
			<td className="py-4 px-3 text-center w-12" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					onClick={() => onView(template)}
					className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
					title="Visa detaljer"
				>
					<Eye className="w-4 h-4" />
				</button>
			</td>

			{/* Three dots menu */}
			<td className="py-4 px-3 text-center w-12" onClick={(e) => e.stopPropagation()}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
						>
							<MoreVertical className="w-4 h-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36 bg-white shadow-md border-slate-200">
						<DropdownMenuItem
							onClick={() => onEdit(template)}
							className="text-xs text-slate-700 cursor-pointer flex items-center gap-2"
						>
							<Pencil className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.claimTplActionEdit} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(template)}
							className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-2"
						>
							<Trash2 className="w-3.5 h-3.5 text-rose-500" />
							<Translate text={localizationConstants.claimTplActionDelete} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

export default ClaimTemplatesTableRow;
