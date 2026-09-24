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
import type { WageTypeItem } from "../../types/wageTypes.types";

interface WageTypeDeleteDialogProps {
	readonly target: WageTypeItem | null;
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onConfirm: () => void;
}

export function WageTypeDeleteDialog({
	target,
	isOpen,
	onClose,
	onConfirm,
}: WageTypeDeleteDialogProps) {
	if (!target) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white border-slate-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900 font-bold">
						<Translate text={localizationConstants.wageTypeDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-600 text-sm">
						<Translate text={localizationConstants.wageTypeDeleteConfirmDesc} />{" "}
						<span className="font-semibold text-slate-900">
							{target.loneartId} - {target.benamning}
						</span>
						?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose} className="cursor-pointer">
						<Translate text={localizationConstants.cancelButton} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.deleteConfirmButton} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
