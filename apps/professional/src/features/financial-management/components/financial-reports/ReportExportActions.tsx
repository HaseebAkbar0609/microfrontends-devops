"use client";

import { FileSpreadsheet, FileDown, Printer } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ReportExportActionsProps {
	onExportExcel: () => void;
	onPrint: () => void;
	isExporting?: boolean;
}

export function ReportExportActions({
	onExportExcel,
	onPrint,
	isExporting,
}: ReportExportActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{/* Excel / CSV Export Button */}
			<button
				type="button"
				onClick={onExportExcel}
				disabled={isExporting}
				className="h-10 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
			>
				<FileSpreadsheet className="w-4 h-4 text-emerald-600" />
				<Translate text={localizationConstants.reportActionExportExcel} />
			</button>

			{/* Download PDF Button */}
			<button
				type="button"
				onClick={onPrint}
				className="h-10 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all"
			>
				<FileDown className="w-4 h-4 text-blue-600" />
				<Translate text={localizationConstants.reportActionDownloadPdf} />
			</button>

			{/* Print Button */}
			<button
				type="button"
				onClick={onPrint}
				className="h-10 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all"
			>
				<Printer className="w-4 h-4 text-slate-200" />
				<Translate text={localizationConstants.reportActionPrint} />
			</button>
		</div>
	);
}
