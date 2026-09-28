"use client";

import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { REPORT_FILE_RULES } from "../../../constants/forecastReports.constants";

export interface ReportFileCellProps {
	fileName: string;
}

/** The file's icon and its name, as the frame draws the File column. */
export function ReportFileCell({ fileName }: ReportFileCellProps) {
	return (
		<div className="flex items-center gap-3">
			<RecordFileIcon fileName={fileName} types={REPORT_FILE_RULES.types} />
			<span className="truncate text-sm text-slate-900" title={fileName}>
				{fileName}
			</span>
		</div>
	);
}

export default ReportFileCell;
