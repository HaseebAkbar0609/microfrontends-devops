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

interface ArticleDeleteDialogProps {
	readonly deletingId: string | null;
	readonly onClose: () => void;
	readonly onConfirm: () => void;
}

export function ArticleDeleteDialog({
	deletingId,
	onClose,
	onConfirm,
}: ArticleDeleteDialogProps) {
	return (
		<AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white border-slate-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900">
						<Translate text={localizationConstants.deleteConfirmationTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-500">
						<Translate text={localizationConstants.deleteConfirmationDescription} />
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
						<Translate text={localizationConstants.deleteLabel} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
