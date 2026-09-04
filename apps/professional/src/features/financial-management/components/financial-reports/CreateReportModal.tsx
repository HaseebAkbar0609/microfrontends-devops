"use client";

import { useState } from "react";
import { X, FileText, Scale, FileSpreadsheet } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	AVAILABLE_REPORT_YEARS,
	MONTH_TRANSLATION_KEYS,
	QUARTER_TRANSLATION_KEYS,
} from "../../constants/financialReports.constants";
import type { ReportPeriodType, ReportTabType } from "../../types/financialReports.types";
import { useTranslation } from "react-i18next";

interface CreateReportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (
		reportType: ReportTabType,
		periodType: ReportPeriodType,
		year: number,
		month?: number,
		quarter?: number,
	) => void;
}

export function CreateReportModal({ isOpen, onClose, onCreate }: CreateReportModalProps) {
	const { t } = useTranslation();
	const [reportType, setReportType] = useState<ReportTabType>("income_statement");
	const [periodType, setPeriodType] = useState<ReportPeriodType>("yearly");
	const [year, setYear] = useState<number>(2026);
	const [month, setMonth] = useState<number>(1);
	const [quarter, setQuarter] = useState<number>(1);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onCreate(
			reportType,
			periodType,
			year,
			periodType === "monthly" ? month : undefined,
			periodType === "quarterly" ? quarter : undefined,
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
				{/* Header */}
				<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
					<h3 className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.reportActionCreateReport} />
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Report Type Selector */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-2">
							<Translate text={localizationConstants.reportsListColType} />
						</label>
						<div className="grid grid-cols-3 gap-2">
							<button
								type="button"
								onClick={() => setReportType("income_statement")}
								className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
									reportType === "income_statement"
										? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
										: "border-slate-200 text-slate-600 hover:border-slate-300"
								}`}
							>
								<FileText className="w-5 h-5" />
								<span className="text-center line-clamp-1">
									<Translate text={localizationConstants.reportTabIncomeStatement} />
								</span>
							</button>

							<button
								type="button"
								onClick={() => setReportType("balance_sheet")}
								className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
									reportType === "balance_sheet"
										? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
										: "border-slate-200 text-slate-600 hover:border-slate-300"
								}`}
							>
								<Scale className="w-5 h-5" />
								<span className="text-center line-clamp-1">
									<Translate text={localizationConstants.reportTabBalanceSheet} />
								</span>
							</button>

							<button
								type="button"
								onClick={() => setReportType("vat_report")}
								className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
									reportType === "vat_report"
										? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary"
										: "border-slate-200 text-slate-600 hover:border-slate-300"
								}`}
							>
								<FileSpreadsheet className="w-5 h-5" />
								<span className="text-center line-clamp-1">
									<Translate text={localizationConstants.reportTabVatReport} />
								</span>
							</button>
						</div>
					</div>

					{/* Period Type Selector */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							<Translate text={localizationConstants.reportFilterPeriod} />
						</label>
						<div className="grid grid-cols-3 gap-2">
							{(["yearly", "quarterly", "monthly"] as const).map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => setPeriodType(p)}
									className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
										periodType === p
											? "border-slate-900 bg-slate-900 text-white"
											: "border-slate-200 text-slate-700 hover:bg-slate-50"
									}`}
								>
									{p === "yearly" && <Translate text={localizationConstants.reportPeriodTypeYearly} />}
									{p === "quarterly" && <Translate text={localizationConstants.reportPeriodTypeQuarterly} />}
									{p === "monthly" && <Translate text={localizationConstants.reportPeriodTypeMonthly} />}
								</button>
							))}
						</div>
					</div>

					{/* Year Selector */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							<Translate text={localizationConstants.reportFilterYear} />
						</label>
						<select
							value={year}
							onChange={(e) => setYear(Number(e.target.value))}
							className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
						>
							{AVAILABLE_REPORT_YEARS.map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>

					{/* Month / Quarter Selector */}
					{periodType === "monthly" && (
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1.5">
								<Translate text={localizationConstants.reportFilterMonth} />
							</label>
							<select
								value={month}
								onChange={(e) => setMonth(Number(e.target.value))}
								className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
							>
								{MONTH_TRANSLATION_KEYS.map((m) => (
									<option key={m.value} value={m.value}>
										{t(m.key)}
									</option>
								))}
							</select>
						</div>
					)}

					{periodType === "quarterly" && (
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1.5">
								<Translate text={localizationConstants.reportFilterQuarter} />
							</label>
							<select
								value={quarter}
								onChange={(e) => setQuarter(Number(e.target.value))}
								className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
							>
								{QUARTER_TRANSLATION_KEYS.map((q) => (
									<option key={q.value} value={q.value}>
										{t(q.key)}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Action Buttons */}
					<div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
						>
							<Translate text={localizationConstants.cancel} />
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-colors"
						>
							<Translate text={localizationConstants.reportActionCreateReport} />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
