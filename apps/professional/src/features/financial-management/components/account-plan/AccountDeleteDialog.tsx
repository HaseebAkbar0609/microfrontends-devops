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
import type { AccountPlanItem } from "@/features/financial-management/types/accountPlan.types";

interface AccountDeleteDialogProps {
	readonly deletingItem: AccountPlanItem | null;
	readonly onClose: () => void;
	readonly onConfirm: () => void;
}

export function AccountDeleteDialog({
	deletingItem,
	onClose,
	onConfirm,
}: AccountDeleteDialogProps) {
	return (
		<AlertDialog open={Boolean(deletingItem)} onOpenChange={onClose}>
			<AlertDialogContent className="bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.deleteAccountConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={localizationConstants.deleteAccountConfirmDesc} />
						{deletingItem && (
							<span className="block mt-2 font-medium text-slate-900">
								{deletingItem.kontoNr} - {deletingItem.benamning}
							</span>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose} className="cursor-pointer">
						<Translate text={localizationConstants.cancel} />
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
