"use client";

import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import type { RecordFileTypes } from "@/features/project/shared/recordFiles";

export interface RecordFileNameCellProps {
	fileName: string;
	/** The register's own extension map; it decides which glyph is drawn. */
	types: RecordFileTypes;
}

/** A file's icon and its name, as a register's File column draws them. */
export function RecordFileNameCell({ fileName, types }: RecordFileNameCellProps) {
	return (
		<div className="flex items-center gap-3">
			<RecordFileIcon fileName={fileName} types={types} />
			<span className="truncate text-sm text-slate-900" title={fileName}>
				{fileName}
			</span>
		</div>
	);
}

export default RecordFileNameCell;
