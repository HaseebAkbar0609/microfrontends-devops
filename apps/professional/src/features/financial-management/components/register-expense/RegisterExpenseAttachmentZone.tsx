"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseAttachment } from "../../types/expense.types";

interface RegisterExpenseAttachmentZoneProps {
	attachments: ExpenseAttachment[];
	onAddAttachments: (files: File[]) => void;
	onRemoveAttachment: (id: string) => void;
}

export function RegisterExpenseAttachmentZone({
	attachments,
	onAddAttachments,
	onRemoveAttachment,
}: RegisterExpenseAttachmentZoneProps) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const files = Array.from(e.dataTransfer.files);
			onAddAttachments(files);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files);
			onAddAttachments(files);
			e.target.value = "";
		}
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs">
			<h3 className="text-sm font-semibold text-slate-900 mb-3">
				<Translate text={localizationConstants.registerExpenseAttachmentsTitle} />
			</h3>

			{/* Drag & Drop Dropzone */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
				className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
					isDragOver
						? "border-slate-900 bg-slate-50"
						: "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
				}`}
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept=".pdf,image/png,image/jpeg,image/jpg"
					onChange={handleFileSelect}
					className="hidden"
				/>

				<div className="flex flex-col items-center justify-center gap-2">
					<div className="p-3 bg-slate-100 rounded-full text-slate-600">
						<UploadCloud className="h-6 w-6" />
					</div>
					<div>
						<p className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.registerExpenseDropzoneText} />
						</p>
						<p className="text-[11px] text-slate-400 mt-0.5">
							<Translate text={localizationConstants.registerExpenseDropzoneSubtext} />
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							fileInputRef.current?.click();
						}}
						className="h-8 px-3.5 text-xs font-normal border-slate-200 mt-1 cursor-pointer"
					>
						<Translate text={localizationConstants.registerExpenseUploadBtn} />
					</Button>
				</div>
			</div>

			{/* Uploaded Files List */}
			{attachments.length > 0 && (
				<div className="mt-4 space-y-2">
					{attachments.map((att) => (
						<div
							key={att.id}
							className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs"
						>
							<div className="flex items-center gap-2.5 overflow-hidden">
								{att.type.includes("pdf") ? (
									<FileText className="h-4 w-4 text-rose-600 shrink-0" />
								) : (
									<ImageIcon className="h-4 w-4 text-blue-600 shrink-0" />
								)}
								<span className="font-medium text-slate-800 truncate max-w-xs sm:max-w-md">
									{att.name}
								</span>
								<span className="text-[11px] text-slate-400 shrink-0">
									({formatFileSize(att.size)})
								</span>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onRemoveAttachment(att.id)}
								aria-label={t(localizationConstants.registerExpenseDeleteFile)}
								className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default RegisterExpenseAttachmentZone;
