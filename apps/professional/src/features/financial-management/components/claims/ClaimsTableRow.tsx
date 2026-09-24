"use client";

import React from "react";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimItem, ClaimStatus } from "../../types/claims.types";

interface ClaimsTableRowProps {
	item: ClaimItem;
	onRowClick: (item: ClaimItem) => void;
	onEdit: (item: ClaimItem) => void;
	onDelete: (item: ClaimItem) => void;
}

export function ClaimsTableRow({
	item,
	onRowClick,
	onEdit,
	onDelete,
}: ClaimsTableRowProps) {
	const { t } = useTranslation();

	const renderStatusBadge = (status: ClaimStatus) => {
		switch (status) {
			case "sent":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#22C55E] text-white">
						<Translate text={localizationConstants.claimsStatusSent} />
					</span>
				);
			case "approved":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
						<Translate text={localizationConstants.claimsStatusApproved} />
					</span>
				);
			case "draft":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
						<Translate text={localizationConstants.claimsStatusDraft} />
					</span>
				);
			case "paid":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
						<Translate text={localizationConstants.claimsStatusPaid} />
					</span>
				);
			case "rejected":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
						<Translate text={localizationConstants.claimsStatusRejected} />
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
						{status}
					</span>
				);
		}
	};

	const formattedAmount = new Intl.NumberFormat("sv-SE", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(item.disputedAmount);

	return (
		<tr
			onClick={() => onRowClick(item)}
			className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group"
		>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.id}
			</td>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.date}
			</td>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.object}
			</td>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.deficiencyType}
			</td>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.supplier}
			</td>
			<td className="px-4 py-3.5 text-xs text-slate-800">
				{item.responsible}
			</td>
			<td className="px-4 py-3.5 text-xs font-normal text-slate-800 whitespace-nowrap">
				{formattedAmount}
			</td>
			<td className="px-4 py-3.5 text-xs">
				{renderStatusBadge(item.status)}
			</td>
			<td
				className="px-3 py-3.5 text-center text-xs border-l border-slate-200"
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer inline-flex items-center justify-center"
							aria-label={t(localizationConstants.claimsColActions)}
						>
							<MoreVertical className="w-3.5 h-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={() => onRowClick(item)}
							className="cursor-pointer text-xs gap-2"
						>
							<Eye className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.claimsTitleDetail} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onEdit(item)}
							className="cursor-pointer text-xs gap-2"
						>
							<Edit2 className="w-3.5 h-3.5 text-slate-500" />
							<Translate text={localizationConstants.claimsBtnEdit} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item)}
							className="cursor-pointer text-xs gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
						>
							<Trash2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.claimsBtnDelete} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

export default ClaimsTableRow;
