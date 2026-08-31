"use client";

import { Archive, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { PurchaseComplaintRow } from "../types/purchase.types";

export interface PurchaseComplaintActionsProps {
	complaint: PurchaseComplaintRow;
	onEdit: (complaint: PurchaseComplaintRow) => void;
	onArchive: (complaint: PurchaseComplaintRow) => void;
	onDelete: (complaint: PurchaseComplaintRow) => void;
}

/**
 * Row action menu for the complaints list: Redigera, Arkiv, Ta bort.
 *
 * Split out of the table so the row markup stays readable; the page owns the
 * behaviour and passes it in.
 */
export function PurchaseComplaintActions({
	complaint,
	onEdit,
	onArchive,
	onDelete,
}: PurchaseComplaintActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
					aria-label={`${t(localizationConstants.actionsHeader)} ${complaint.complaintNo}`}
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
			>
				<PermissionGate permission="EDIT_PURCHASE">
					<DropdownMenuItem
						onClick={() => onEdit(complaint)}
						className="flex cursor-pointer items-center gap-2 text-slate-700 hover:bg-slate-50"
					>
						<Pencil className="h-4 w-4 text-slate-500" />
						<span>
							<Translate
								text={localizationConstants.actionEdit}
							/>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onArchive(complaint)}
						className="flex cursor-pointer items-center gap-2 text-slate-700 hover:bg-slate-50"
					>
						<Archive className="h-4 w-4 text-slate-500" />
						<span>
							<Translate text={localizationConstants.archive} />
						</span>
					</DropdownMenuItem>
				</PermissionGate>
				<PermissionGate permission="DELETE_PURCHASE">
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => onDelete(complaint)}
						className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
					>
						<Trash2 className="h-4 w-4 text-red-500" />
						<span>
							<Translate
								text={localizationConstants.actionDelete}
							/>
						</span>
					</DropdownMenuItem>
				</PermissionGate>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default PurchaseComplaintActions;
