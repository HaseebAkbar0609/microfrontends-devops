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
import type { CaseStatus } from "../../../types/cases.types";
import { CaseStatusBadge } from "./CaseStatusBadge";

interface CaseStatusConfirmDialogProps {
	isOpen: boolean;
	newStatus: CaseStatus | null;
	onClose: () => void;
	onConfirm: () => void;
}

export function CaseStatusConfirmDialog({
	isOpen,
	newStatus,
	onClose,
	onConfirm,
}: CaseStatusConfirmDialogProps) {
	if (!newStatus) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.casesStatusConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="text-xs text-slate-500 pt-2 space-y-2">
							<p>
								<Translate text={localizationConstants.casesStatusConfirmDesc} />
							</p>
							<div className="pt-2">
								<CaseStatusBadge status={newStatus} />
							</div>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="pt-4">
					<AlertDialogCancel
						type="button"
						onClick={onClose}
						className="h-8 text-xs cursor-pointer"
					>
						<Translate text={localizationConstants.casesBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						type="button"
						onClick={onConfirm}
						className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.casesBtnSave} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default CaseStatusConfirmDialog;
