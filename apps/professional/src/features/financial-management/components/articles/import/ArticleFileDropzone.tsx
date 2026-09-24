"use client";

import type React from "react";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ArticleFileDropzoneProps {
	readonly isDragging: boolean;
	readonly selectedFile: File | null;
	readonly fileInputRef: React.RefObject<HTMLInputElement | null>;
	readonly onDragOver: (e: React.DragEvent) => void;
	readonly onDragLeave: (e: React.DragEvent) => void;
	readonly onDrop: (e: React.DragEvent) => void;
	readonly onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	readonly onDownloadTemplate: () => void;
}

export function ArticleFileDropzone({
	isDragging,
	selectedFile,
	fileInputRef,
	onDragOver,
	onDragLeave,
	onDrop,
	onInputChange,
	onDownloadTemplate,
}: ArticleFileDropzoneProps) {
	return (
		<div className="flex flex-col gap-4">
			<div
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				onClick={() => fileInputRef.current?.click()}
				className={`flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
					isDragging
						? "border-slate-900 bg-slate-50"
						: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
				}`}
			>
				<input
					type="file"
					ref={fileInputRef}
					onChange={onInputChange}
					accept=".csv,.xlsx,.xls"
					className="hidden"
				/>

				<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
					<UploadCloud className="h-6 w-6" />
				</div>

				<p className="text-sm font-semibold text-slate-900 text-center">
					<Translate text={localizationConstants.dropzoneText} />
				</p>
				<p className="text-xs text-slate-500 text-center mt-1">
					<Translate text={localizationConstants.dropzoneSubtext} />
				</p>

				{selectedFile && (
					<div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200">
						<FileSpreadsheet className="h-4 w-4" />
						<span>{selectedFile.name}</span>
					</div>
				)}
			</div>

			<div className="flex justify-end">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onDownloadTemplate}
					className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
				>
					<Translate text={localizationConstants.downloadTemplateLabel} />
				</Button>
			</div>
		</div>
	);
}
