"use client";

import React, { useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	ALLOWED_INSPECTION_FILE_EXTENSIONS,
	ALLOWED_INSPECTION_MIME_TYPES,
	MAX_INSPECTION_FILE_SIZE_BYTES,
} from "../../constants/orderInspection.constants";
import type { InspectionDocument } from "../../types/orderInspection.types";

interface InspectionDocumentUploadProps {
	documents: InspectionDocument[];
	onAddDocument: (doc: InspectionDocument) => void;
	onRemoveDocument: (id: string) => void;
	onUpload: (file: File) => Promise<InspectionDocument | null>;
	isSubmitting?: boolean;
	isEdit?: boolean;
}

export function InspectionDocumentUpload({
	documents,
	onAddDocument,
	onRemoveDocument,
	onUpload,
	isSubmitting = false,
	isEdit = false,
}: InspectionDocumentUploadProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFileName, setSelectedFileName] = useState<string>("");
	const [fileError, setFileError] = useState<string | null>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setFileError(null);
		const file = files[0];
		const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;

		const isExtensionAllowed = ALLOWED_INSPECTION_FILE_EXTENSIONS.includes(ext);
		const isMimeAllowed = !file.type || ALLOWED_INSPECTION_MIME_TYPES.includes(file.type);

		if (!isExtensionAllowed || !isMimeAllowed) {
			setFileError(t(localizationConstants.inspectionFileTypeError));
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		if (file.size > MAX_INSPECTION_FILE_SIZE_BYTES) {
			setFileError(t(localizationConstants.inspectionFileSizeError));
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		setSelectedFileName(file.name);
		const doc = await onUpload(file);
		if (doc) {
			onAddDocument(doc);
			setSelectedFileName("");
		}
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="flex flex-col gap-1.5 justify-start w-full">
			<Label className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{t(localizationConstants.inspectionDocumentFieldLabel)}
			</Label>

			{/* Upload row */}
			<div className="flex items-center gap-3 w-full">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className={`flex-1 flex items-center h-11 rounded-md bg-white px-3 text-sm cursor-pointer select-none truncate text-left focus:outline-none focus:ring-2 focus:ring-slate-950 ${
						fileError ? "border border-red-500" : "border border-zinc-200"
					}`}
					aria-label={t(localizationConstants.inspectionDocumentFieldLabel)}
				>
					<span className="font-medium text-slate-900 mr-2 shrink-0">
						{t(localizationConstants.inspectionUploadButton)}
					</span>
					<span className="text-slate-700 truncate">
						{selectedFileName || t(localizationConstants.inspectionUploadNoFile)}
					</span>
				</button>

				<Button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={isSubmitting}
					className={
						isEdit
							? "h-11 rounded-md bg-slate-500 text-white hover:bg-slate-600 px-6 text-sm font-medium cursor-pointer shrink-0"
							: "h-11 rounded-md bg-slate-900 text-white hover:bg-slate-800 px-6 text-sm font-medium cursor-pointer shrink-0"
					}
				>
					{t(localizationConstants.inspectionUploadButton)}
				</Button>

				<Input
					ref={fileInputRef}
					type="file"
					accept={ALLOWED_INSPECTION_FILE_EXTENSIONS.join(",")}
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			{/* Allowed file types helper text */}
			<div className="flex items-center justify-between">
				<span className="text-sm text-slate-500 font-normal">
					{t(localizationConstants.inspectionAllowedFileTypes)}
				</span>
				{fileError && <span className="text-xs text-red-500 font-normal">{fileError}</span>}
			</div>

			{/* Document chips container */}
			{documents.length > 0 && (
				<div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 min-h-[44px] mt-1">
					<div className="flex flex-wrap items-center gap-2">
						{documents.map((doc) => (
							<div
								key={doc.id}
								className="inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-slate-900 border border-zinc-200"
							>
								<span className="max-w-[200px] truncate" title={doc.fileName || doc.name}>
									{doc.fileName || doc.name}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => onRemoveDocument(doc.id)}
									aria-label={`Remove ${doc.fileName || doc.name}`}
									className="h-3.5 w-3.5 rounded-full p-0 text-slate-600 hover:text-slate-900 hover:bg-zinc-200 cursor-pointer shrink-0"
								>
									<X className="h-3 w-3" />
								</Button>
							</div>
						))}
					</div>
					<ChevronDown className="h-4 w-4 text-slate-500 shrink-0 ml-2 pointer-events-none" />
				</div>
			)}
		</div>
	);
}

export default InspectionDocumentUpload;
