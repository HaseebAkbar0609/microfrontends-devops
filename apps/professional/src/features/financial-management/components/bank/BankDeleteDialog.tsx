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

interface BankDeleteDialogProps {
	item: {
		id: string;
		title: string;
		type: "loan" | "document";
	} | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string, type: "loan" | "document") => void;
}

export function BankDeleteDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: BankDeleteDialogProps) {
	if (!item) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900 text-lg font-semibold">
						<Translate text={localizationConstants.confirmDeleteBankItemTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-600 text-sm mt-2">
						<Translate text={localizationConstants.confirmDeleteBankItemDesc} />
					</AlertDialogDescription>
					<div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
						<div className="flex justify-between">
							<span className="text-slate-500">
								<Translate text={localizationConstants.colBankDocName} />:
							</span>
							<span className="font-semibold text-slate-800">{item.title}</span>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-4 gap-2">
					<AlertDialogCancel
						onClick={onClose}
						className="border-slate-200 text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.btnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm(item.id, item.type);
							onClose();
						}}
						className="bg-red-600 hover:bg-red-700 text-white font-medium"
					>
						<Translate text={localizationConstants.btnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
