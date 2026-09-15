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
import type { YearEndItem } from "../../types/yearEnd.types";

interface YearEndDeleteDialogProps {
	item: YearEndItem | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void;
}

export function YearEndDeleteDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: YearEndDeleteDialogProps) {
	if (!item) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="max-w-md bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.confirmDeleteYearEndTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
						<Translate text={localizationConstants.confirmDeleteYearEndDesc} />
						<span className="block mt-2 font-semibold text-slate-700">
							{item.name} ({item.category})
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel
						onClick={onClose}
						className="text-xs h-8 border-slate-200"
					>
						<Translate text={localizationConstants.actionCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm(item.id);
							onClose();
						}}
						className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
					>
						<Translate text={localizationConstants.btnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default YearEndDeleteDialog;
