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
import type { ClaimTemplate } from "../../../types/claims.types";

interface ClaimTemplateDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	template: ClaimTemplate | null;
}

export function ClaimTemplateDeleteDialog({
	isOpen,
	onClose,
	onConfirm,
	template,
}: ClaimTemplateDeleteDialogProps) {
	if (!template) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.claimTplDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 space-y-2">
						<span>
							<Translate text={localizationConstants.claimTplDeleteConfirmDesc} />
						</span>
						<span className="block mt-2 font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
							{template.id} • {template.name} ({template.title})
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2 sm:gap-0">
					<AlertDialogCancel
						onClick={onClose}
						className="h-9 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="h-9 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplBtnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ClaimTemplateDeleteDialog;
