"use client";

import { useMemo } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";
import type { ReportKpiSummary, ReportTabType } from "../../types/financialReports.types";

interface ReportSummaryCardsProps {
	kpiSummary: ReportKpiSummary;
	activeTab: ReportTabType;
}

function formatSek(amount: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount) + " kr";
}

export function ReportSummaryCards({ kpiSummary, activeTab }: ReportSummaryCardsProps) {
	const isProfit = kpiSummary.netResultSek >= 0;
	const isVatToPay = kpiSummary.vatBalanceSek >= 0;

	const cards = useMemo(() => {
		if (activeTab === "vat_report") {
			return [
				{
					id: "rev",
					label: localizationConstants.reportKpiTotalRevenue,
					value: formatSek(kpiSummary.totalRevenueSek),
					icon: DollarSign,
					color: "text-emerald-600 bg-emerald-50",
				},
				{
					id: "out_vat",
					label: localizationConstants.vatReportSecOutput,
					value: formatSek(Math.round(kpiSummary.totalRevenueSek * 0.25)),
					icon: TrendingUp,
					color: "text-blue-600 bg-blue-50",
				},
				{
					id: "in_vat",
					label: localizationConstants.vatReportBox48,
					value: formatSek(Math.round(kpiSummary.totalRevenueSek * 0.25 * 0.62)),
					icon: Receipt,
					color: "text-amber-600 bg-amber-50",
				},
				{
					id: "vat_net",
					label: localizationConstants.vatReportBox49,
					value: formatSek(Math.abs(kpiSummary.vatBalanceSek)),
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
				value: formatSek(kpiSummary.totalRevenueSek),
				icon: DollarSign,
				color: "text-emerald-600 bg-emerald-50",
			},
			{
				id: "exp",
				label: localizationConstants.reportKpiTotalExpenses,
				value: formatSek(kpiSummary.totalExpensesSek),
				icon: Receipt,
				color: "text-rose-600 bg-rose-50",
			},
			{
				id: "ebit",
				label: localizationConstants.reportKpiOperatingResult,
				value: formatSek(kpiSummary.netResultSek + Math.round(kpiSummary.netResultSek * 0.206)),
				icon: TrendingUp,
				color: "text-blue-600 bg-blue-50",
			},
			{
				id: "net",
				label: localizationConstants.reportKpiNetResult,
				value: formatSek(kpiSummary.netResultSek),
				subtext: `${kpiSummary.operatingMarginPercent}% ` + (isProfit ? "marginal" : ""),
				icon: isProfit ? TrendingUp : TrendingDown,
				color: isProfit ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
			},
		];
	}, [activeTab, kpiSummary, isProfit, isVatToPay]);

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
									<Translate text={card.subtext} />
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
