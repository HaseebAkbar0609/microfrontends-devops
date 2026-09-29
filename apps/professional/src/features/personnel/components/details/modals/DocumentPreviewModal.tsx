"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface DocumentPreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	documentName: string | null;
}

export function DocumentPreviewModal({
	isOpen,
	onClose,
	documentName,
}: DocumentPreviewModalProps) {
	if (!documentName) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
					<DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
						<FileText className="w-4 h-4 text-blue-600" />
						{documentName}
					</DialogTitle>
				</DialogHeader>

				<div className="py-8 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/60 text-center space-y-3 my-2">
					<div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
						<FileText className="w-7 h-7" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-900">{documentName}</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							Dokumentgranskning och förhandsvisning är redo
						</p>
					</div>
				</div>

				<DialogFooter className="pt-3 border-t border-slate-100 flex justify-between sm:justify-between items-center w-full">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="h-8 px-4 text-xs"
					>
						<Translate text={localizationConstants.btnCancelCard} />
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={onClose}
						className="h-8 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white shadow-2xs gap-1.5"
					>
						<Download className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.actionDownload} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
