"use client";

import React from "react";
import { Eye, MoreVertical, Edit2, Trash2, CheckCircle2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem, CaseStatus } from "../../types/cases.types";
import { CaseStatusBadge, getCategoryLabelKey } from "./shared";

interface CasesTableRowProps {
	item: CaseItem;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onConversation?: (id: string) => void;
	onStatusChange?: (id: string, newStatus: CaseStatus) => void;
}

export function CasesTableRow({
	item,
	onView,
	onEdit,
	onDelete,
	onConversation,
	onStatusChange,
}: CasesTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr
			onClick={() => onView(item.id)}
			className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 cursor-pointer group"
		>
			{/* Ärende nr */}
			<td className="py-4 px-6 font-medium text-slate-800 text-xs whitespace-nowrap">
				#{item.caseNumber || item.id}
			</td>

			{/* Kategori pill matching Figma */}
			<td className="py-4 px-6 whitespace-nowrap">
				<span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-normal text-slate-700 bg-slate-100 border border-slate-200/80">
					<Translate text={getCategoryLabelKey(item.category)} />
				</span>
			</td>

			{/* Skapat av (bold matching Figma Image 1) */}
			<td className="py-4 px-6 font-bold text-slate-900 text-xs whitespace-nowrap">
				{item.createdBy}
			</td>

			{/* Datum */}
			<td className="py-4 px-6 text-slate-700 font-normal text-xs whitespace-nowrap">
				{item.date}
			</td>

			{/* Status */}
			<td className="py-4 px-6 whitespace-nowrap">
				<CaseStatusBadge status={item.status} />
			</td>

			{/* Action column with Eye icon and 3-dots kebab menu matching Figma Image 1 */}
			<td
				className="py-4 px-6 text-right whitespace-nowrap"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-end gap-3 text-slate-500">
					{/* Eye icon view button */}
					<button
						type="button"
						onClick={() => onView(item.id)}
						className="p-1 hover:text-slate-900 transition-colors cursor-pointer rounded"
						title={t(localizationConstants.casesActionView)}
						aria-label={t(localizationConstants.casesActionView)}
					>
						<Eye className="w-4 h-4" />
					</button>

					{/* 3-dots kebab dropdown menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="p-1 hover:text-slate-900 transition-colors cursor-pointer rounded outline-none"
								aria-label="Actions menu"
							>
								<MoreVertical className="w-4 h-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-44 bg-white border border-slate-200 shadow-md text-xs">
							<DropdownMenuItem
								onClick={() => onView(item.id)}
								className="cursor-pointer gap-2 py-2"
							>
								<Eye className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.casesActionView} />
							</DropdownMenuItem>

							{onConversation && (
								<DropdownMenuItem
									onClick={() => onConversation(item.id)}
									className="cursor-pointer gap-2 py-2"
								>
									<MessageSquare className="w-3.5 h-3.5 text-slate-500" />
									<Translate text={localizationConstants.casesTabConversation} />
								</DropdownMenuItem>
							)}

							<DropdownMenuItem
								onClick={() => onEdit(item.id)}
								className="cursor-pointer gap-2 py-2"
							>
								<Edit2 className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.casesActionEdit} />
							</DropdownMenuItem>

							{onStatusChange && (
								<DropdownMenuSub>
									<DropdownMenuSubTrigger className="cursor-pointer gap-2 py-2 text-xs">
										<CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
										<Translate text={localizationConstants.casesDetailChangeStatus} />
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent className="bg-white border border-slate-200 shadow-md text-xs">
										<DropdownMenuItem
											onClick={() => onStatusChange(item.id, "ongoing")}
											className="cursor-pointer py-1.5"
										>
											<Translate text={localizationConstants.casesStatusOngoing} />
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onStatusChange(item.id, "not_started")}
											className="cursor-pointer py-1.5"
										>
											<Translate text={localizationConstants.casesStatusNotStarted} />
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onStatusChange(item.id, "completed")}
											className="cursor-pointer py-1.5"
										>
											<Translate text={localizationConstants.casesStatusCompleted} />
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							)}

							<DropdownMenuSeparator />

							<DropdownMenuItem
								onClick={() => onDelete(item.id)}
								className="cursor-pointer gap-2 py-2 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
							>
								<Trash2 className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.casesActionDelete} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}

export default CasesTableRow;
