"use client";

import { FileImage } from "lucide-react";

import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { extensionOf, isImageFile } from "../../../../shared/recordFiles";
import { ATA_FILE_RULES } from "../../projectAta.config";

const WORD_EXTENSIONS: ReadonlySet<string> = new Set([".doc", ".docx"]);

/** A document's icon by its extension: a photo, a Word file (suppliers send those), or PDF. */
export function AtaFileIcon({ fileName }: { fileName: string }) {
	if (isImageFile(fileName, ATA_FILE_RULES.types)) {
		return <FileImage className="h-8 w-8 shrink-0 text-slate-500" aria-hidden />;
	}
	if (WORD_EXTENSIONS.has(extensionOf(fileName))) {
		return <DocFileIcon className="h-10 w-8 shrink-0" />;
	}
	return <PdfFileIcon className="h-10 w-8 shrink-0" />;
}

export default AtaFileIcon;
