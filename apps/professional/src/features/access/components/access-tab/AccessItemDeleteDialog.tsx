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
import type { AccessHolder, AccessItem } from "../../types/accessItems.types";

/** What is waiting for confirmation: one item, or everything a person holds. */
export type AccessDeleteTarget =
	| { kind: "item"; holder: AccessHolder; item: AccessItem }
	| { kind: "holder"; holder: AccessHolder };

interface AccessItemDeleteDialogProps {
	/** Null keeps the dialog closed. */
	target: AccessDeleteTarget | null;
	onConfirm: (target: AccessDeleteTarget) => void;
	onCancel: () => void;
}

/** Deleting cannot be undone, so it always asks first. */
export function AccessItemDeleteDialog({ target, onConfirm, onCancel }: AccessItemDeleteDialogProps) {
	// Kept after the dialog closes, so it fades out with its text instead of an empty one.
	const [shown, setShown] = useState(target);
	if (target && target !== shown) setShown(target);

	const isItem = shown?.kind === "item";
	const values = {
		id: shown?.kind === "item" ? shown.item.nycId : "",
		name: shown?.holder.name ?? "",
		count: shown?.holder.items.length ?? 0,
	};

	return (
		<AlertDialog open={target !== null} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate
							text={isItem ? localizationConstants.accessItemDeleteTitle : localizationConstants.accessHolderDeleteTitle}
							values={values}
						/>
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate
							text={
								isItem
									? localizationConstants.accessItemDeleteDescription
									: localizationConstants.accessHolderDeleteDescription
							}
							values={values}
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
