"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";
import type { ReportKpiSummary, ReportTabType } from "../../types/financialReports.types";

interface ReportSummaryCardsProps {
	kpiSummary: ReportKpiSummary;
	activeTab: ReportTabType;
}

function formatCurrency(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function ReportSummaryCards({ kpiSummary, activeTab }: ReportSummaryCardsProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const isProfit = kpiSummary.netResultSek >= 0;
	const isVatToPay = kpiSummary.vatBalanceSek >= 0;

	const cards = useMemo(() => {
		if (activeTab === "vat_report") {
			return [
				{
					id: "rev",
					label: localizationConstants.reportKpiTotalRevenue,
					value: formatCurrency(kpiSummary.totalRevenueSek, currency),
					icon: DollarSign,
					color: "text-emerald-600 bg-emerald-50",
				},
				{
					id: "out_vat",
					label: localizationConstants.vatReportSecOutput,
					value: formatCurrency(Math.round(kpiSummary.totalRevenueSek * 0.25), currency),
					icon: TrendingUp,
					color: "text-blue-600 bg-blue-50",
				},
				{
					id: "in_vat",
					label: localizationConstants.vatReportBox48,
					value: formatCurrency(Math.round(kpiSummary.totalRevenueSek * 0.25 * 0.62), currency),
					icon: Receipt,
					color: "text-amber-600 bg-amber-50",
				},
				{
					id: "vat_net",
					label: localizationConstants.vatReportBox49,
					value: formatCurrency(Math.abs(kpiSummary.vatBalanceSek), currency),
					subtext: isVatToPay
						? localizationConstants.vatReportPayableDesc
						: localizationConstants.vatReportRefundDesc,
					icon: isVatToPay ? TrendingDown : TrendingUp,
					color: isVatToPay ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50",
				},
			];
		}

		return [
			{
				id: "rev",
				label: localizationConstants.reportKpiTotalRevenue,
				value: formatCurrency(kpiSummary.totalRevenueSek, currency),
				icon: DollarSign,
				color: "text-emerald-600 bg-emerald-50",
			},
			{
				id: "exp",
				label: localizationConstants.reportKpiTotalExpenses,
				value: formatCurrency(kpiSummary.totalExpensesSek, currency),
				icon: Receipt,
				color: "text-rose-600 bg-rose-50",
			},
			{
				id: "ebit",
				label: localizationConstants.reportKpiOperatingResult,
				value: formatCurrency(kpiSummary.netResultSek + Math.round(kpiSummary.netResultSek * 0.206), currency),
				icon: TrendingUp,
				color: "text-blue-600 bg-blue-50",
			},
			{
				id: "net",
				label: localizationConstants.reportKpiNetResult,
				value: formatCurrency(kpiSummary.netResultSek, currency),
				subtext: `${kpiSummary.operatingMarginPercent}%`,
				icon: isProfit ? TrendingUp : TrendingDown,
				color: isProfit ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
			},
		];
	}, [activeTab, kpiSummary, isProfit, isVatToPay, currency]);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<div
						key={card.id}
						className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
					>
						<div className="space-y-1">
							<p className="text-xs font-medium text-slate-500">
								<Translate text={card.label} />
							</p>
							<p className="text-xl font-bold text-slate-900 tracking-tight">
								{card.value}
							</p>
							{card.subtext && (
								<p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
									{card.subtext.startsWith("%") || !isNaN(Number(card.subtext.replace("%", ""))) ? (
										card.subtext
									) : (
										<Translate text={card.subtext} />
									)}
								</p>
							)}
						</div>
						<div className={`p-3 rounded-lg ${card.color}`}>
							<Icon className="w-5 h-5" />
						</div>
					</div>
				);
			})}
		</div>
	);
}
