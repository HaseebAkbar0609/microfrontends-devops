"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
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
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SystemCreateCancelDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const SystemCreateCancelDialog: React.FC<
	SystemCreateCancelDialogProps
> = ({ isOpen, onClose, onConfirm }) => {
	const t = useTranslate();

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<div className="flex items-start gap-3.5">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
						<AlertCircle className="h-5 w-5" />
					</div>
					<div>
						<AlertDialogHeader className="text-left">
							<AlertDialogTitle className="text-base font-semibold text-slate-900">
								{t(localizationConstants.dataItSystemCreateConfirmCancelTitle)}
							</AlertDialogTitle>
							<AlertDialogDescription className="mt-1.5 text-xs text-slate-500">
								{t(localizationConstants.dataItSystemCreateConfirmCancelDesc)}
							</AlertDialogDescription>
						</AlertDialogHeader>
					</div>
				</div>

				<AlertDialogFooter className="mt-6 flex items-center justify-end gap-3 sm:space-x-0">
					<AlertDialogCancel
						onClick={onClose}
						className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnCancel)}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
					>
						{t(localizationConstants.dataItSystemBtnDiscardConfirm)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default SystemCreateCancelDialog;
