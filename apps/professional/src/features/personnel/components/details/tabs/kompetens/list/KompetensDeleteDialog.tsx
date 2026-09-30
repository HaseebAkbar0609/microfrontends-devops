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
import { CompetenceItem } from "../../../../../types/competence.types";

interface KompetensDeleteDialogProps {
	deleteConfirmItem: CompetenceItem | null;
	onConfirmDelete: (id: string) => void;
	onCancelDelete: () => void;
}

export function KompetensDeleteDialog({
	deleteConfirmItem,
	onConfirmDelete,
	onCancelDelete,
}: KompetensDeleteDialogProps) {
	return (
		<AlertDialog
			open={Boolean(deleteConfirmItem)}
			onOpenChange={(open) => !open && onCancelDelete()}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.kompetensConfirmDeleteTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={localizationConstants.kompetensConfirmDeleteDesc} />
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
