"use client";

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

interface CancelOfferDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

/** Asks before leaving the offer wizard, since unsaved input is dropped (TFS-1208) */
export function CancelOfferDialog({
	open,
	onOpenChange,
	onConfirm,
}: CancelOfferDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-semibold text-slate-800">
						<Translate text={localizationConstants.cancelOfferConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-sm text-slate-500">
						<Translate
							text={localizationConstants.cancelOfferConfirmDescription}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel className="min-w-24">
						<Translate text={localizationConstants.cancelOfferKeepEditing} />
					</AlertDialogCancel>
					<AlertDialogAction
						className="min-w-24 bg-red-600 hover:bg-red-700 text-white"
						onClick={onConfirm}
					>
						<Translate text={localizationConstants.cancelOfferDiscard} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
