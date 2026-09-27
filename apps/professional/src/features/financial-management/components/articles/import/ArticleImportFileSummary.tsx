"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ParsedFileData } from "../../../hooks/useArticleImport";

interface ArticleImportFileSummaryProps {
	readonly file: File;
	readonly parsedData: ParsedFileData;
}

export function ArticleImportFileSummary({
	file,
	parsedData,
}: ArticleImportFileSummaryProps) {
	return (
		<div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
					<FileSpreadsheet className="h-5 w-5" />
				</div>
				<div>
					<p className="text-sm font-semibold text-slate-900">{file.name}</p>
					<p className="text-xs text-slate-500">
						{(file.size / 1024).toFixed(1)} KB • {parsedData.totalRows}{" "}
						<Translate text={localizationConstants.rowsFound} />
					</p>
				</div>
			</div>
		</div>
	);
}
