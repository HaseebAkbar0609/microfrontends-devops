"use client";

import React from "react";
import { X, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimDocument } from "../../types/claims.types";

interface DocumentViewerModalProps {
	isOpen: boolean;
	document: ClaimDocument | null;
	onClose: () => void;
}

export function DocumentViewerModal({
	isOpen,
	document: doc,
	onClose,
}: DocumentViewerModalProps) {
	if (!isOpen || !doc) return null;

	const handleDownload = () => {
		const content = `TFS Financial Management - Reklamationsunderlag\nFil: ${doc.name}\nDatum: ${doc.date}\nFormat: ${doc.fileType}\nStorlek: ${doc.fileSize || "1.2 MB"}\nStatus: Verifierat dokument`;
		const blob = new Blob([content], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);
		const a = window.document.createElement("a");
		a.href = url;
		a.download = doc.name;
		window.document.body.appendChild(a);
		a.click();
		window.document.body.removeChild(a);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
			<div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				{/* Modal Header */}
				<div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<div className="p-2 bg-red-50 text-red-600 rounded-lg">
							<FileText className="w-5 h-5" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
							<p className="text-xs text-slate-500 font-mono">
								{doc.date} • {doc.fileType} • {doc.fileSize || "1.2 MB"}
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Modal Body / Preview Zone */}
				<div className="p-6 bg-slate-50 min-h-[300px] flex flex-col items-center justify-center border-b border-slate-200 text-center">
					<div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-red-500 mb-3">
						<FileText className="w-8 h-8" />
					</div>
					<h4 className="text-sm font-semibold text-slate-800 mb-1">{doc.name}</h4>
					<p className="text-xs text-slate-500 max-w-sm mb-4">
						<Translate text={localizationConstants.claimsDocViewerPreviewDesc} />
					</p>
					<Button
						type="button"
						onClick={handleDownload}
						className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg gap-2 cursor-pointer shadow-2xs"
					>
						<Download className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.claimsBtnDownload} />
					</Button>
				</div>

				{/* Modal Footer */}
				<div className="px-6 py-3.5 bg-white flex items-center justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="h-9 px-5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
					>
						<Translate text={localizationConstants.claimsBtnClose} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default DocumentViewerModal;
