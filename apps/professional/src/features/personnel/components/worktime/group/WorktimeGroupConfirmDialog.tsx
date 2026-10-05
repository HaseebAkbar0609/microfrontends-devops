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

interface WorktimeGroupConfirmDialogProps {
	action: "approve" | "reject" | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function WorktimeGroupConfirmDialog({
	action,
	isOpen,
	onClose,
	onConfirm,
}: WorktimeGroupConfirmDialogProps) {
	if (!action) return null;

	const isApprove = action === "approve";

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{isApprove ? (
							<Translate text={localizationConstants.worktimeGroupConfirmApproveTitle} />
						) : (
							<Translate text={localizationConstants.worktimeGroupConfirmRejectTitle} />
						)}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{isApprove ? (
							<Translate text={localizationConstants.worktimeGroupConfirmApproveDesc} />
						) : (
							<Translate text={localizationConstants.worktimeGroupConfirmRejectDesc} />
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose} className="cursor-pointer">
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={
							isApprove
								? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
								: "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						}
					>
						{isApprove ? (
							<Translate text={localizationConstants.worktimeGroupBtnGodkann} />
						) : (
							<Translate text={localizationConstants.worktimeGroupBtnAvboj} />
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
