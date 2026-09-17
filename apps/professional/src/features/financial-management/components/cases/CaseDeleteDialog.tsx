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

interface CaseDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function CaseDeleteDialog({
	isOpen,
	onClose,
	onConfirm,
}: CaseDeleteDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.casesDeleteTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
						<Translate text={localizationConstants.casesDeleteDesc} />
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
					<AlertDialogCancel onClick={onClose} className="text-xs h-9 cursor-pointer">
						<Translate text={localizationConstants.casesBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.casesBtnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default CaseDeleteDialog;
