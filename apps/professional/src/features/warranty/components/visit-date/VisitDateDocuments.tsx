"use client";

import type React from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WARRANTY_CONSTANTS } from "../../constants/warranty.constants";
import type { AttachedDocumentItem } from "../../types/warranty.types";

export interface VisitDateDocumentsProps {
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	uploadedFileName: string;
	attachedDocuments: AttachedDocumentItem[];
	isUploading: boolean;
	onSelectFile: (file: File | undefined) => void;
	onOpenPicker: () => void;
	onUpload: () => void;
	onRemoveDocument: (index: number) => void;
}

/** Dokument — the picker, the upload action and the attached-file chips. */
export function VisitDateDocuments({
	fileInputRef,
	uploadedFileName,
	attachedDocuments,
	isUploading,
	onSelectFile,
	onOpenPicker,
	onUpload,
	onRemoveDocument,
}: VisitDateDocumentsProps) {
	const t = useTranslate();
	const pickedLabel =
		uploadedFileName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME;

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
				<Translate text={localizationConstants.documentLabel} />
			</Label>

			<input
				type="file"
				ref={fileInputRef}
				onChange={(event) => onSelectFile(event.target.files?.[0])}
				/* Advisory only — the same rules are enforced in the handler. */
				accept={WARRANTY_CONSTANTS.ALLOWED_FILE_TYPES}
				className="hidden"
			/>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
				<Button
					type="button"
					variant="outline"
					onClick={onOpenPicker}
					className="flex-1 min-w-0 h-11 rounded-lg border border-slate-200 bg-white px-4 flex items-center justify-start gap-2 text-left cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:border-slate-900 shadow-none font-normal"
					title={pickedLabel}
				>
					<span className="font-semibold text-sm text-slate-900 shrink-0">
						<Translate text={localizationConstants.uploadButton} />
					</span>
					<span className="text-sm text-slate-900 truncate min-w-0 flex-1">
						{pickedLabel}
					</span>
				</Button>

				<Button
					type="button"
					onClick={onUpload}
					disabled={isUploading}
					className="w-full sm:w-auto h-11 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer shrink-0 shadow-none whitespace-nowrap"
				>
					<Translate text={localizationConstants.uploadButton} />
				</Button>
			</div>

			<p className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500 mt-1">
				<Translate text={localizationConstants.allowedFileTypesHelp} />
			</p>

			{attachedDocuments.length > 0 && (
				<div className="min-h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 flex items-center justify-between gap-2 mt-2">
					<div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
						{attachedDocuments.map((doc, index) => (
							<div
								key={doc.id}
								className="flex items-center gap-1.5 bg-zinc-100 text-slate-900 text-xs sm:text-sm font-normal px-2.5 py-1 rounded-md shrink-0 border-0 max-w-full"
							>
								<span className="truncate max-w-[120px] sm:max-w-[180px]">
									{doc.name}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => onRemoveDocument(index)}
									className="h-5 w-5 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer ml-1 shrink-0"
									aria-label={`${t(localizationConstants.remove)} ${doc.name}`}
								>
									<X className="h-3.5 w-3.5" aria-hidden />
								</Button>
							</div>
						))}
					</div>
					<ChevronDown
						aria-hidden
						className="h-4 w-4 text-slate-400 shrink-0 self-center"
					/>
				</div>
			)}
		</div>
	);
}

export default VisitDateDocuments;
