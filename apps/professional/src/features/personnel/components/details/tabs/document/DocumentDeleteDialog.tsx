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
import { PersonalDocumentFileItem } from "@/features/personnel/types/personalDocument.types";

interface DocumentDeleteDialogProps {
	doc: PersonalDocumentFileItem | null;
	onClose: () => void;
	onConfirm: () => void;
}

export function DocumentDeleteDialog({
	doc,
	onClose,
	onConfirm,
}: DocumentDeleteDialogProps) {
	return (
		<AlertDialog open={Boolean(doc)} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.personalDocConfirmDeleteTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500">
						<Translate text={localizationConstants.personalDocConfirmDeleteDesc} />
						{doc && (
							<span className="block mt-1 font-semibold text-slate-700">
								{doc.name}
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
