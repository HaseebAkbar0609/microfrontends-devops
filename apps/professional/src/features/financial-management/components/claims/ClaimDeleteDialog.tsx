"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimItem } from "../../types/claims.types";

interface ClaimDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	item: ClaimItem | null;
}

export function ClaimDeleteDialog({
	isOpen,
	onClose,
	onConfirm,
	item,
}: ClaimDeleteDialogProps) {
	if (!item) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.claimsDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 space-y-2">
						<span>
							<Translate text={localizationConstants.claimsDeleteConfirmDesc} />
						</span>
						<span className="block mt-2 font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
							#{item.id} • {item.supplier} • {item.object}
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2 sm:gap-0">
					<AlertDialogCancel
						onClick={onClose}
						className="h-9 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
					>
						<Translate text={localizationConstants.claimsBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="h-9 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
					>
						<Translate text={localizationConstants.claimsBtnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ClaimDeleteDialog;
