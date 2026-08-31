import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import type { PurchaseDocument } from "../../types/purchase.types";
import { showToast } from "@/lib/toast";

interface DocumentPreviewModalProps {
	previewDoc: PurchaseDocument | null;
	onClose: () => void;
}

export function DocumentPreviewModal({
	previewDoc,
	onClose,
}: DocumentPreviewModalProps) {
	if (!previewDoc) return null;

	const handleDownload = () => {
		showToast("success", `Laddar ner ${previewDoc.name}...`);
		onClose();
	};

	return (
		<Dialog open={!!previewDoc} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
						<FileText className="h-5 w-5 text-slate-700" />
						{previewDoc.name}
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200/80 rounded-lg text-center gap-3 my-2">
					<PdfFileIcon className="h-16 w-12" />
					<div>
						<p className="text-sm font-semibold text-slate-800">{previewDoc.name}</p>
						<p className="text-xs text-slate-500 mt-0.5">
							Format: {previewDoc.fileType} • Datum: {previewDoc.date}
						</p>
					</div>
					<span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium mt-2">
						<Eye className="h-3 w-3" /> Förhandsgranskning aktiv
					</span>
				</div>

				<DialogFooter className="flex items-center justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="text-xs cursor-pointer"
					>
						Stäng
					</Button>
					<Button
						type="button"
						onClick={handleDownload}
						className="bg-slate-900 text-white text-xs gap-1.5 hover:bg-slate-800 cursor-pointer"
					>
						<Download className="h-3.5 w-3.5" />
						Ladda ner
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
