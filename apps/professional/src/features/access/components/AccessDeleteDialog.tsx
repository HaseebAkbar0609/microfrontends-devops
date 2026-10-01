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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { AccessPoint } from "../types/access.types";

interface AccessDeleteDialogProps {
	/** The row waiting for confirmation; null keeps the dialog closed. */
	target: AccessPoint | null;
	onConfirm: (row: AccessPoint) => void;
	onCancel: () => void;
}

/** Deleting cannot be undone, so it always asks first. */
export function AccessDeleteDialog({ target, onConfirm, onCancel }: AccessDeleteDialogProps) {
	// Kept after the dialog closes, so it fades out with the row's name instead of an empty one.
	const [shown, setShown] = useState(target);
	if (target && target !== shown) setShown(target);

	return (
		<AlertDialog open={target !== null} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.accessDeleteTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate
							text={localizationConstants.accessDeleteDescription}
							values={{ name: shown?.name ?? "" }}
						/>
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
						<Translate text={localizationConstants.accessActionDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
