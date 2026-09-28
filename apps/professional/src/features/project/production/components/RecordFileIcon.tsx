"use client";

import { FileImage, FileSpreadsheet } from "lucide-react";

import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { extensionOf, isImageFile, type RecordFileTypes } from "../../shared/recordFiles";

const WORD_EXTENSIONS: ReadonlySet<string> = new Set([".doc", ".docx"]);
const SHEET_EXTENSIONS: ReadonlySet<string> = new Set([".xls", ".xlsx"]);

export interface RecordFileIconProps {
	fileName: string;
	/** The section's allowed types, which decide what counts as a photo. */
	types: RecordFileTypes;
}

/**
 * A record file's icon by its extension: a photo, a Word file (suppliers send
 * those), a spreadsheet, or PDF.
 */
export function RecordFileIcon({ fileName, types }: RecordFileIconProps) {
	if (isImageFile(fileName, types)) {
		return <FileImage className="h-8 w-8 shrink-0 text-slate-500" aria-hidden />;
	}
	if (WORD_EXTENSIONS.has(extensionOf(fileName))) {
		return <DocFileIcon className="h-10 w-8 shrink-0" />;
	}
	if (SHEET_EXTENSIONS.has(extensionOf(fileName))) {
		return <FileSpreadsheet className="h-8 w-8 shrink-0 text-slate-500" aria-hidden />;
	}
	return <PdfFileIcon className="h-10 w-8 shrink-0" />;
}

export default RecordFileIcon;
