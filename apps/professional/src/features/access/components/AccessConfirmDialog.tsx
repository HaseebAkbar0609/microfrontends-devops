"use client";

import { useState } from "react";
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
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface AccessConfirmText {
	title: TranslationKeys;
	description: TranslationKeys;
	/** Fills the {{placeholders}} of both texts. */
	values: Record<string, string | number>;
	/** The confirm button's label; defaults to Delete. */
	confirmLabel?: TranslationKeys;
}

interface AccessConfirmDialogProps<T> {
	/** What is waiting for confirmation; null keeps the dialog closed. */
	target: T | null;
	/** The texts for a target. */
	describe: (target: T) => AccessConfirmText;
	onConfirm: (target: T) => void;
	onCancel: () => void;
}

/** Asks before something is lost for good: Cancel, or a red confirm button (Delete unless told otherwise). */
export function AccessConfirmDialog<T>({ target, describe, onConfirm, onCancel }: AccessConfirmDialogProps<T>) {
	// Kept after the dialog closes, so it fades out with its own text instead of an empty one.
	const [shown, setShown] = useState(target);
	if (target && target !== shown) setShown(target);
	const text = shown ? describe(shown) : null;

	return (
		<AlertDialog open={target !== null} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{text && <Translate text={text.title} values={text.values} />}</AlertDialogTitle>
					<AlertDialogDescription>
						{text && <Translate text={text.description} values={text.values} />}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer">
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
						onClick={() => target && onConfirm(target)}
					>
						<Translate text={text?.confirmLabel ?? localizationConstants.accessActionDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
