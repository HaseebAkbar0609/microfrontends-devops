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
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface ConfirmActionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: TranslationKeys;
	description: TranslationKeys;
	confirmLabel: TranslationKeys;
	/** Named record, appended to the description so the user sees what is affected. */
	subject?: string;
	destructive?: boolean;
	onConfirm: () => void;
}

/**
 * Confirmation step for a destructive or archiving action.
 *
 * Controlled rather than trigger-based: these open from a `DropdownMenuItem`,
 * and a nested Radix trigger fights the menu's own focus and dismiss handling.
 * `ConfirmDialog.tsx` alongside is the trigger-based variant, which is why it
 * has only one importer.
 *
 * It started in the purchase module and moved here when the warranty feature
 * needed the same dialog — copying it would have been the fourth confirm
 * dialog in the app.
 */
export function ConfirmActionDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	subject,
	destructive = false,
	onConfirm,
}: ConfirmActionDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900">
						<Translate text={title} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={description} />
						{subject ? ` (${subject})` : null}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={
							destructive
								? "cursor-pointer bg-red-600 text-white hover:bg-red-700"
								: "cursor-pointer bg-[#111721] text-white hover:bg-slate-800"
						}
					>
						<Translate text={confirmLabel} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ConfirmActionDialog;
