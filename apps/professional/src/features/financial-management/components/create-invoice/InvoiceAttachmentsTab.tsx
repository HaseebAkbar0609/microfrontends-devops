"use client";

import React, { useRef } from "react";
import { UploadCloud, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { InvoiceAttachment } from "../../types/createInvoice.types";

interface InvoiceAttachmentsTabProps {
	attachments: InvoiceAttachment[];
	onAddAttachments: (files: FileList | File[]) => void;
	onRemoveAttachment: (id: string) => void;
}

export function InvoiceAttachmentsTab({
	attachments,
	onAddAttachments,
	onRemoveAttachment,
}: InvoiceAttachmentsTabProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onAddAttachments(e.dataTransfer.files);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onAddAttachments(e.target.files);
		}
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
			<div>
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.createInvoiceAttachUploadTitle} />
				</h3>
				<p className="text-xs text-slate-500">
					<Translate text={localizationConstants.createInvoiceAttachUploadDesc} />
				</p>
			</div>

			{/* Hidden file input */}
			<input
				type="file"
				multiple
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>

			{/* Dropzone */}
			<div
				onClick={() => fileInputRef.current?.click()}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-400 transition-colors bg-slate-50/50 cursor-pointer"
			>
				<UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-3" />
				<p className="text-xs font-medium text-slate-700 mb-1">
					<Translate text={localizationConstants.createInvoiceAttachDropzone} />
				</p>
				<p className="text-[11px] text-slate-400">PDF, PNG, JPG eller XLSX upp till 25MB</p>
			</div>

			{/* Attached Files List */}
			{attachments.length > 0 && (
				<div className="space-y-2.5">
					<h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
						<Translate text={localizationConstants.createInvoiceAttachFilesCount} /> ({attachments.length})
					</h4>
					<div className="space-y-2">
						{attachments.map((file) => (
							<div
								key={file.id}
								className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="p-2 rounded bg-white border border-slate-200 text-slate-600">
										<FileText className="h-4 w-4" />
									</div>
									<div>
										<p className="text-xs font-medium text-slate-800">{file.name}</p>
										<p className="text-[11px] text-slate-500">
											{file.size} • Uppladdad {file.uploadDate}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-emerald-500" />
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											onRemoveAttachment(file.id);
										}}
										className="h-7 w-7 text-slate-400 hover:text-red-600 cursor-pointer"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
