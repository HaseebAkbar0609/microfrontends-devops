"use client";

import { Search, Plus, FileText, Scale, FileSpreadsheet, LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	REPORT_TAB_ACTIVE_CLASS,
	REPORT_TAB_INACTIVE_CLASS,
} from "../../constants/financialReports.constants";
import type {
	GeneratedReportListItem,
	ReportKpiSummary,
	ReportMainTab,
	ReportTabType,
} from "../../types/financialReports.types";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportsListTable } from "./ReportsListTable";

interface FinancialReportsHubViewProps {
	activeMainTab: ReportMainTab;
	searchQuery: string;
	reportList: GeneratedReportListItem[];
	kpiSummary: ReportKpiSummary;
	onMainTabChange: (tab: ReportMainTab) => void;
	onSearchChange: (query: string) => void;
	onOpenCreateModal: () => void;
	onViewReport: (report: GeneratedReportListItem) => void;
	onDownload: () => void;
	onPrint: () => void;
}

export function FinancialReportsHubView({
	activeMainTab,
	searchQuery,
	reportList,
	kpiSummary,
	onMainTabChange,
	onSearchChange,
	onOpenCreateModal,
	onViewReport,
	onDownload,
	onPrint,
}: FinancialReportsHubViewProps) {
	const { t } = useTranslation();

	const activeTabType: ReportTabType =
		activeMainTab === "all" ? "income_statement" : activeMainTab;

	return (
		<div className="space-y-6">
			{/* Top Hub Bar: Tabs & Create Report Action */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-0">
				{/* Category Tabs: Alla | Resultaträkning | Balansräkning | Momsrapport */}
				<div className="flex items-center gap-6 overflow-x-auto">
					<button
						type="button"
						onClick={() => onMainTabChange("all")}
						className={activeMainTab === "all" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<LayoutGrid className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabAll} />
					</button>

					<button
						type="button"
						onClick={() => onMainTabChange("income_statement")}
						className={activeMainTab === "income_statement" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<FileText className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabIncomeStatement} />
					</button>

					<button
						type="button"
						onClick={() => onMainTabChange("balance_sheet")}
						className={activeMainTab === "balance_sheet" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<Scale className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabBalanceSheet} />
					</button>

					<button
						type="button"
						onClick={() => onMainTabChange("vat_report")}
						className={activeMainTab === "vat_report" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<FileSpreadsheet className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabVatReport} />
					</button>
				</div>

				{/* Primary Create Report CTA */}
				<button
					type="button"
					onClick={onOpenCreateModal}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto mb-2 shrink-0"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.reportActionCreateReport} />
				</button>
			</div>

			{/* Search Filter Bar */}
			<div className="flex items-center justify-between gap-4">
				<div className="relative w-full max-w-sm">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.search)}
						className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
					/>
				</div>
			</div>

			{/* KPI Summary Overview */}
			<ReportSummaryCards kpiSummary={kpiSummary} activeTab={activeTabType} />

			{/* Reports Document Table */}
			<ReportsListTable
				reports={reportList}
				onViewReport={onViewReport}
				onDownload={onDownload}
				onPrint={onPrint}
			/>
		</div>
	);
}
