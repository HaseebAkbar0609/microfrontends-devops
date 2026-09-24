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
import type { CostCenterItem } from "../../types/costCenters.types";

interface CostCenterDeleteDialogProps {
	readonly target: CostCenterItem | null;
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onConfirm: () => void;
}

export function CostCenterDeleteDialog({
	target,
	isOpen,
	onClose,
	onConfirm,
}: CostCenterDeleteDialogProps) {
	if (!target) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white border-slate-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900 font-bold">
						<Translate text={localizationConstants.deleteConfirmationTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-600 text-sm">
						<Translate text={localizationConstants.deleteConfirmationDescription} />{" "}
						<span className="font-semibold text-slate-900">
							{target.kod} - {target.benamning}
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
