"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderInspectionItem } from "../../types/orderInspection.types";

interface DeleteInspectionDialogProps {
	inspection: OrderInspectionItem | null;
	onClose: () => void;
	onConfirmDelete: (id: string) => Promise<void>;
}

export function DeleteInspectionDialog({
	inspection,
	onClose,
	onConfirmDelete,
}: DeleteInspectionDialogProps) {
	const t = useTranslate();

	if (!inspection) return null;

	return (
		<Dialog open={!!inspection} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white border border-zinc-200 p-6 rounded-lg shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-900 font-semibold text-base">
						{t(localizationConstants.deleteInspectionTitle)}
					</DialogTitle>
					<DialogDescription className="text-slate-600 text-sm mt-1">
						{t(localizationConstants.deleteInspectionDesc)}
					</DialogDescription>
					<div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100 text-xs text-slate-700 space-y-1">
						<p>
							<span className="font-semibold">{t(localizationConstants.inspectionColType)}:</span>{" "}
							{inspection.type}
						</p>
						<p>
							<span className="font-semibold">{t(localizationConstants.inspectionColDate)}:</span>{" "}
							{inspection.date}
						</p>
						<p>
							<span className="font-semibold">{t(localizationConstants.inspectionColInspectionDate)}:</span>{" "}
							{inspection.inspectionDate}
						</p>
					</div>
				</DialogHeader>
				<DialogFooter className="flex gap-2 sm:justify-end mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="border-zinc-200 text-slate-700 hover:bg-zinc-100 cursor-pointer text-sm"
					>
						{t(localizationConstants.inspectionDeleteCancel)}
					</Button>
					<Button
						type="button"
						onClick={() => onConfirmDelete(inspection.id)}
						className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-4 py-2 text-sm font-medium cursor-pointer shadow-sm"
					>
						{t(localizationConstants.inspectionDeleteConfirm)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DeleteInspectionDialog;
