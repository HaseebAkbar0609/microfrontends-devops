"use client";

import React from "react";
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeApprovalDialogProps {
	action: "approve" | "return" | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function WorktimeApprovalDialog({
	action,
	isOpen,
	onClose,
	onConfirm,
}: WorktimeApprovalDialogProps) {
	const isApprove = action === "approve";

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate
							text={
								isApprove
									? localizationConstants.worktimeConfirmApproveTitle
									: localizationConstants.worktimeConfirmReturnTitle
							}
						/>
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500">
						<Translate
							text={
								isApprove
									? localizationConstants.worktimeConfirmApproveDesc
									: localizationConstants.worktimeConfirmReturnDesc
							}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel onClick={onClose} className="h-9 text-xs">
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={
							isApprove
								? "h-9 text-xs bg-[#107c41] hover:bg-[#0e6b37] text-white"
								: "h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white"
						}
					>
						<Translate
							text={
								isApprove
									? localizationConstants.worktimeBtnApprove
									: localizationConstants.worktimeBtnReturn
							}
						/>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
