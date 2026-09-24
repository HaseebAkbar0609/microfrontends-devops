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
import type { PriceListDetail } from "../../types/priceLists.types";

interface PriceListDeleteDialogProps {
	readonly isOpen: boolean;
	readonly target: PriceListDetail | null;
	readonly onClose: () => void;
	readonly onConfirm: () => void;
}

export function PriceListDeleteDialog({
	isOpen,
	target,
	onClose,
	onConfirm,
}: PriceListDeleteDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white border-slate-200">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900">
						<Translate text={localizationConstants.deleteConfirmationTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-500">
						<Translate text={localizationConstants.deleteConfirmationDescription} />
						{target && (
							<span className="block mt-2 font-medium text-slate-700">
								{target.code} - {target.name}
							</span>
						)}
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
