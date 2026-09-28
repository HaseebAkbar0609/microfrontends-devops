"use client";

import React from "react";
import { FileText } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDocItem } from "../types/kalkyl";
import { KalkylDocIcon } from "./KalkylDocIcon";

interface KalkylDocumentPreviewDialogProps {
	doc?: KalkylDocItem | null;
	document?: KalkylDocItem | null;
	isOpen: boolean;
	onClose: () => void;
}

export function KalkylDocumentPreviewDialog({
	doc,
	document: docProp,
	isOpen,
	onClose,
}: KalkylDocumentPreviewDialogProps) {
	const activeDoc = doc || docProp;

	if (!activeDoc) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden rounded-lg">
				<DialogHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-6 py-4">
					<div className="flex items-center gap-3">
						<KalkylDocIcon fileType={activeDoc.fileType} className="h-6 w-6" />
						<DialogTitle className="text-base font-semibold text-slate-900 truncate max-w-md">
							{activeDoc.namn}
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className="flex flex-col items-center justify-center p-8 bg-slate-50 min-h-[260px] text-center">
					<div className="rounded-full bg-white p-4 shadow-sm border border-slate-200 mb-3">
						<FileText className="h-10 w-10 text-slate-400" />
					</div>
					<h3 className="text-sm font-semibold text-slate-900 mb-1">{activeDoc.namn}</h3>
					<p className="text-xs text-slate-500 mb-4">
						{activeDoc.typ} • {activeDoc.datum}
					</p>
					<div className="rounded border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
						<Translate text={localizationConstants.calcInquiryWizPreviewPlaceholder} />
					</div>
				</div>

				<DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-3">
					<Button
						type="button"
						variant="ghost"
						onClick={onClose}
						className="h-9 cursor-pointer rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.closeButton} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
