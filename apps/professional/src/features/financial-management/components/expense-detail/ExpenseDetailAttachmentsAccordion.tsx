"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Paperclip, FileText, Download, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseItem, ExpenseAttachment } from "../../types/expense.types";

interface ExpenseDetailAttachmentsAccordionProps {
	expense: ExpenseItem;
}

export function ExpenseDetailAttachmentsAccordion({
	expense,
}: ExpenseDetailAttachmentsAccordionProps) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(true);
	const [previewAttachment, setPreviewAttachment] = useState<ExpenseAttachment | null>(null);
	const attachments: ExpenseAttachment[] = expense.attachments || [];

	const formatFileSize = (bytes: number) => {
		if (!bytes) return "0 KB";
		const kb = bytes / 1024;
		if (kb < 1024) return `${Math.round(kb)} KB`;
		return `${(kb / 1024).toFixed(1)} MB`;
	};

	const handleDownload = (att: ExpenseAttachment) => {
		// Create a mock download link
		const blob = new Blob([`TimeFlow Document: ${att.name}`], { type: att.type || "application/pdf" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = att.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-5 overflow-hidden">
			{/* Accordion Toggle Header */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer text-left"
			>
				<div className="flex items-center gap-2.5">
					<Paperclip className="h-4 w-4 text-slate-500" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailAttachmentsTitle} />
					</h3>
					<span className="text-xs text-slate-400 font-normal">
						({attachments.length}{" "}
						{attachments.length === 1 ? (
							<Translate text={localizationConstants.expenseDetailFileSingular} />
						) : (
							<Translate text={localizationConstants.expenseDetailFilePlural} />
						)})
					</span>
				</div>
				<div className="flex items-center gap-2">
					{isOpen ? (
						<ChevronUp className="h-4 w-4 text-slate-400" />
					) : (
						<ChevronDown className="h-4 w-4 text-slate-400" />
					)}
				</div>
			</button>

			{/* Accordion Content */}
			{isOpen && (
				<div className="p-4 border-t border-slate-100 text-xs">
					{attachments.length === 0 ? (
						<div className="py-6 text-center text-slate-400">
							<Translate text={localizationConstants.expenseDetailAttachmentsEmpty} />
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{attachments.map((att) => (
								<div
									key={att.id}
									className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
								>
									<div className="flex items-center gap-2.5 truncate flex-1 mr-3">
										<div className="h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
											<FileText className="h-4 w-4 text-blue-600" />
										</div>
										<div className="truncate">
											<p className="font-semibold text-slate-900 truncate text-xs">
												{att.name}
											</p>
											<p className="text-[11px] text-slate-400">
												{formatFileSize(att.size)} • {att.uploadedAt}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-1 shrink-0">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => setPreviewAttachment(att)}
											aria-label={t(localizationConstants.expenseDetailViewFile)}
											className="h-7 w-7 text-slate-500 hover:text-slate-900 cursor-pointer"
										>
											<Eye className="h-3.5 w-3.5" />
										</Button>

										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => handleDownload(att)}
											aria-label={t(localizationConstants.expenseDetailDownloadFile)}
											className="h-7 w-7 text-slate-500 hover:text-slate-900 cursor-pointer"
										>
											<Download className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* File Preview Modal */}
			<Dialog open={previewAttachment !== null} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
				<DialogContent className="max-w-2xl bg-white p-6 rounded-xl shadow-2xl border-slate-200">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
							<span className="truncate">{previewAttachment?.name}</span>
						</DialogTitle>
					</DialogHeader>

					<div className="min-h-[350px] bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
						<FileText className="h-16 w-16 text-slate-400 mb-3" />
						<p className="font-semibold text-slate-800 text-sm">{previewAttachment?.name}</p>
						<p className="text-xs text-slate-400 mt-1">
							{formatFileSize(previewAttachment?.size || 0)} • {previewAttachment?.type || t(localizationConstants.expenseDetailPdfDocument)}
						</p>

						<Button
							type="button"
							size="sm"
							onClick={() => previewAttachment && handleDownload(previewAttachment)}
							className="mt-6 text-xs bg-zinc-900 hover:bg-slate-800 text-white gap-2 cursor-pointer"
						>
							<Download className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.expenseDetailDownloadFile} />
							</span>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ExpenseDetailAttachmentsAccordion;
