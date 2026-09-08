"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CancelConfirmationDialogProps {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export function CancelConfirmationDialog({
	isOpen,
	onConfirm,
	onClose,
}: CancelConfirmationDialogProps) {
	const { t } = useTranslation();

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md bg-white p-6 shadow-xl rounded-xl border border-slate-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-semibold text-slate-900">
						{t(localizationConstants.cancelDialogTitle)}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-sm text-slate-600 mt-2">
						{t(localizationConstants.cancelDialogDesc)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-6 flex flex-row items-center justify-end gap-3">
					<AlertDialogCancel
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border-0"
					>
						{t(localizationConstants.cancelDialogKeepEditing)}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
					>
						{t(localizationConstants.cancelDialogConfirm)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
