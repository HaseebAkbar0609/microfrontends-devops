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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmployeeOverviewItem } from "../../../types/personnelOverview.types";

interface DeactivateEmployeeDialogProps {
	employee: EmployeeOverviewItem | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function DeactivateEmployeeDialog({
	employee,
	isOpen,
	onClose,
	onConfirm,
}: DeactivateEmployeeDialogProps) {
	if (!employee) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md bg-white p-6 rounded-xl shadow-xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.deactivateConfirmTitle} />: {employee.name}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-600">
						<Translate text={localizationConstants.deactivateConfirmDesc} />
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-4 gap-2">
					<AlertDialogCancel onClick={onClose} className="h-8 px-3 text-xs">
						<Translate text={localizationConstants.cancelBtn} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="h-8 px-3 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium"
					>
						<Translate text={localizationConstants.deactivateConfirmBtn} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
