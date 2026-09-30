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
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface MedarbetarsamtalDeleteDialogProps {
	deleteConfirmItem: MedarbetarsamtalItem | null;
	onConfirmDelete: (id: string) => void;
	onCancelDelete: () => void;
}

export function MedarbetarsamtalDeleteDialog({
	deleteConfirmItem,
	onConfirmDelete,
	onCancelDelete,
}: MedarbetarsamtalDeleteDialogProps) {
	return (
		<AlertDialog
			open={Boolean(deleteConfirmItem)}
			onOpenChange={(open) => !open && onCancelDelete()}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate
							text={localizationConstants.medarbetarsamtalConfirmDeleteTitle}
						/>
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate
							text={localizationConstants.medarbetarsamtalConfirmDeleteDesc}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancelDelete}>
						<Translate text={localizationConstants.nyIncheckningBtnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							if (deleteConfirmItem) {
								onConfirmDelete(deleteConfirmItem.id);
							}
						}}
						className="bg-rose-600 hover:bg-rose-700 text-white"
					>
						<Translate text={localizationConstants.btnConfirmDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
