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

interface CustomerDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function CustomerDeleteDialog({
	isOpen,
	onClose,
	onConfirm,
}: CustomerDeleteDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.customerDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={localizationConstants.customerDeleteConfirmDesc} />
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="bg-rose-600 hover:bg-rose-700 text-white"
					>
						<Translate text={localizationConstants.deleteLabel} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
