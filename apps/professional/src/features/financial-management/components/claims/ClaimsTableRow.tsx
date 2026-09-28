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

import { EconomyStatusBadge } from "../common/EconomyStatusBadge";

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
					<EconomyStatusBadge
						status="sent"
						label={localizationConstants.claimsStatusSent}
					/>
				);
			case "approved":
				return (
					<EconomyStatusBadge
						status="approved"
						label={localizationConstants.claimsStatusApproved}
					/>
				);
			case "draft":
				return (
					<EconomyStatusBadge
						status="draft"
						label={localizationConstants.claimsStatusDraft}
					/>
				);
			case "paid":
				return (
					<EconomyStatusBadge
						status="paid"
						label={localizationConstants.claimsStatusPaid}
					/>
				);
			case "rejected":
				return (
					<EconomyStatusBadge
						status="rejected"
						label={localizationConstants.claimsStatusRejected}
					/>
				);
			default:
				return <EconomyStatusBadge status={status} />;
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
