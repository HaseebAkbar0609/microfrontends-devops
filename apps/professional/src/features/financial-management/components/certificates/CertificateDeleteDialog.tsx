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
import type { CertificateItem } from "../../types/certificates.types";

interface CertificateDeleteDialogProps {
	item: CertificateItem | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void;
}

export function CertificateDeleteDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: CertificateDeleteDialogProps) {
	if (!item) return null;

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-900 text-lg font-semibold">
						<Translate text={localizationConstants.confirmDeleteCertTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-600 text-sm mt-2">
						<Translate text={localizationConstants.confirmDeleteCertDesc} />
					</AlertDialogDescription>
					<div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
						<div className="flex justify-between">
							<span className="text-slate-500">
								<Translate text={localizationConstants.colCertId} />:
							</span>
							<span className="font-semibold text-slate-800">{item.id}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500">
								<Translate text={localizationConstants.colCertObject} />:
							</span>
							<span className="font-semibold text-slate-800">
								{item.objectId || item.objectType}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500">
								<Translate text={localizationConstants.colCertName} />:
							</span>
							<span className="font-semibold text-slate-800">{item.name}</span>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-4 gap-2">
					<AlertDialogCancel
						onClick={onClose}
						className="border-slate-200 text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.btnCancelCertificate} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm(item.id);
							onClose();
						}}
						className="bg-red-600 hover:bg-red-700 text-white font-medium"
					>
						<Translate text={localizationConstants.confirmDeleteCertBtn} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
