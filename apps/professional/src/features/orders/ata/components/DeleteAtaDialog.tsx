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
import type { AtaItem } from "../types/ata.types";

export interface DeleteAtaDialogProps {
	item: AtaItem | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void | Promise<void>;
}

export function DeleteAtaDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: DeleteAtaDialogProps) {
	if (!item) return null;

	const formatAmount = (num: number) => {
		return new Intl.NumberFormat("sv-SE").format(Math.round(num));
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.ataDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="font-sans text-sm text-slate-500 mt-1">
						<Translate text={localizationConstants.ataDeleteConfirmDesc} />
					</AlertDialogDescription>
					<div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5 font-sans">
						<div className="flex justify-between items-center">
							<span className="text-slate-500">
								<Translate text={localizationConstants.ataColNumber} />:
							</span>
							<span className="font-semibold text-slate-900">{item.ataNumber}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-slate-500">
								<Translate text={localizationConstants.ataColDate} />:
							</span>
							<span className="font-medium text-slate-800">{item.date}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-slate-500">
								<Translate text={localizationConstants.ataColAmount} />:
							</span>
							<span className="font-semibold text-slate-900">
								{formatAmount(item.amount)} SEK
							</span>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 mt-2">
					<AlertDialogCancel
						onClick={onClose}
						className="w-full sm:w-auto rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 text-sm cursor-pointer shadow-none"
					>
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onConfirm(item.id)}
						className="w-full sm:w-auto !bg-red-600 hover:!bg-red-700 !text-white rounded-lg text-sm border-0 cursor-pointer shadow-none font-medium"
					>
						<Translate text={localizationConstants.ataActionDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteAtaDialog;
