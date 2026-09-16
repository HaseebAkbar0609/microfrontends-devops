"use client";

import { baseNameOf } from "../../../shared/recordFiles";
import { RecordFileIcon } from "../../components/RecordFileIcon";
import { DOCUMENT_FILE_RULES } from "../projectDocuments.config";

/**
 * The Handlingar column: the file's icon and its name. The frame drops the
 * extension, which the icon already shows; a screen reader hears it in full.
 */
export function DocumentFileCell({ fileName }: { fileName: string }) {
	return (
		<span className="flex min-w-0 items-center gap-3" title={fileName}>
			<RecordFileIcon fileName={fileName} types={DOCUMENT_FILE_RULES.types} />
			<span aria-hidden className="truncate">
				{baseNameOf(fileName)}
			</span>
			<span className="sr-only">{fileName}</span>
		</span>
	);
}

export default DocumentFileCell;
