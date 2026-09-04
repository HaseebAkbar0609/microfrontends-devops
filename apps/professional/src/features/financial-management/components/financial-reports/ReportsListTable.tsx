"use client";

import { FileText, Download, Eye, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { GeneratedReportListItem } from "../../types/financialReports.types";

interface ReportsListTableProps {
	reports: GeneratedReportListItem[];
	onViewReport?: (report: GeneratedReportListItem) => void;
	onDownload: () => void;
	onPrint: () => void;
}

export function ReportsListTable({
	reports,
	onViewReport,
	onDownload,
	onPrint,
}: ReportsListTableProps) {
	const { t } = useTranslation();

	if (reports.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
				<Translate text={localizationConstants.reportsListEmpty} />
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			<div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
				<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
					<Translate text={localizationConstants.reportsListTitle} />
				</h4>
				<span className="text-xs text-slate-500 font-medium">
					{reports.length}
				</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/40 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
							<th className="py-3 px-4 w-12 text-center">#</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.reportsListColName} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.reportsListColPeriod} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.reportsListColDate} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.reportsListColAuthor} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.reportsListColStatus} />
							</th>
							<th className="py-3 px-4 text-right">
								<Translate text={localizationConstants.reportsListColActions} />
							</th>
						</tr>
					</thead>
					<tbody>
						{reports.map((rep, idx) => (
							<tr
								key={rep.id}
								onClick={() => onViewReport?.(rep)}
								className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs cursor-pointer group"
							>
								<td className="py-3 px-4 text-center text-slate-400 font-mono">
									{idx + 1}
								</td>
								<td className="py-3 px-4">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
											<FileText className="w-4 h-4" />
										</div>
										<span className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
											{rep.title}
										</span>
									</div>
								</td>
								<td className="py-3 px-4 font-medium text-slate-700">
									{rep.periodLabel}
								</td>
								<td className="py-3 px-4 text-slate-500 font-mono">
									{rep.generatedDate}
								</td>
								<td className="py-3 px-4 text-slate-600 font-medium">
									{rep.generatedBy}
								</td>
								<td className="py-3 px-4 text-center">
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
										<Translate text={localizationConstants.reportsListStatusReady} />
									</span>
								</td>
								<td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
									<div className="flex items-center justify-end gap-1">
										<button
											type="button"
											onClick={() => onViewReport?.(rep)}
											aria-label={t(localizationConstants.reportViewDetail)}
											className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
										>
											<Eye className="w-4 h-4" />
										</button>
										<button
											type="button"
											onClick={onDownload}
											aria-label={t(localizationConstants.reportActionExportExcel)}
											className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
										>
											<Download className="w-4 h-4" />
										</button>
										<button
											type="button"
											onClick={onPrint}
											aria-label={t(localizationConstants.reportActionPrint)}
											className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
										>
											<Printer className="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
