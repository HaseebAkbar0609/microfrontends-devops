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

interface AuthorityDeleteDialogProps {
	item: { id: string; title: string } | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void;
}

export function AuthorityDeleteDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: AuthorityDeleteDialogProps) {
	if (!item) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white rounded-2xl max-w-md p-6">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-bold text-slate-900">
						<Translate text={localizationConstants.confirmDeleteAuthorityTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 mt-2">
						<Translate text={localizationConstants.confirmDeleteAuthorityDesc} />
						<span className="block mt-2 font-medium text-slate-700">
							{item.title} ({item.id})
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-6 flex items-center justify-end gap-3">
					<AlertDialogCancel
						onClick={onClose}
						className="h-10 px-4 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium cursor-pointer"
					>
						<Translate text={localizationConstants.btnCancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm(item.id);
							onClose();
						}}
						className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium cursor-pointer"
					>
						<Translate text={localizationConstants.btnDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default AuthorityDeleteDialog;
