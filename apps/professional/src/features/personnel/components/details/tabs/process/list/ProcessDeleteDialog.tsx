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
import { PersonalProcessItem } from "@/features/personnel/types/personalProcess.types";

interface ProcessDeleteDialogProps {
	process: PersonalProcessItem | null;
	onClose: () => void;
	onConfirm: () => void;
}

export function ProcessDeleteDialog({
	process,
	onClose,
	onConfirm,
}: ProcessDeleteDialogProps) {
	return (
		<AlertDialog open={Boolean(process)} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.processConfirmDeleteTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500">
						<Translate text={localizationConstants.processConfirmDeleteDesc} />
						{process && (
							<span className="block mt-1 font-semibold text-slate-700">
								{process.title} ({process.id})
							</span>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel onClick={onClose} className="h-8 text-xs cursor-pointer">
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.btnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
