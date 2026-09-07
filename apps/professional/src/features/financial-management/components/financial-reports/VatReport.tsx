"use client";

import { AlertCircle, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatPeriodLabel } from "../../services/financialReports.service";
import type { VatReportBox, VatReportData } from "../../types/financialReports.types";

interface VatReportProps {
	data: VatReportData;
	onVatBoxClick?: (boxNumber: string, boxNameKey: string, amount: number) => void;
}

function formatCurrency(val: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val)} ${currency}`;
}

export function VatReport({ data, onVatBoxClick }: VatReportProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const periodStr = formatPeriodLabel(data.filter, t);
	const isPayable = data.netVatPayable >= 0;

	const renderBoxRow = (box: VatReportBox) => {
		const rateText = box.vatRate ? `${Math.round(box.vatRate * 100)}%` : "-";
		const isResult = box.isResultBox;
		const isClickable = Boolean(onVatBoxClick && box.boxNumber);

		return (
			<tr
				key={box.boxNumber}
				onClick={() => {
					if (isClickable && box.boxNumber) {
						onVatBoxClick?.(box.boxNumber, box.boxNameKey, box.vatAmount || box.baseAmount || 0);
					}
				}}
				className={`border-b border-slate-100 text-xs transition-colors ${
					isResult
						? "bg-amber-50/70 border-t-2 border-amber-300 font-bold"
						: isClickable
							? "cursor-pointer hover:bg-primary/5 group"
							: "hover:bg-slate-50/70"
				}`}
				title={isClickable ? t(localizationConstants.reportClickToDrilldown) : undefined}
			>
				<td className="py-3 px-4 w-32">
					<span
						className={`inline-flex items-center justify-center font-mono font-bold px-2.5 py-1 rounded-md text-xs gap-1 ${
							isResult
								? "bg-amber-200 text-amber-950 shadow-sm"
								: "bg-slate-100 text-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
						}`}
					>
						<Translate text={localizationConstants.boxNumberPrefix} /> {box.boxNumber}
						{isClickable && !isResult && (
							<ArrowUpRight className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
						)}
					</span>
				</td>
				<td className="py-3 px-4">
					<p className={`font-semibold ${isResult ? "text-amber-950 text-sm" : "text-slate-800 group-hover:text-primary transition-colors"}`}>
						<Translate text={box.boxNameKey} />
					</p>
					<p className="text-[11px] text-slate-500 mt-0.5">
						<Translate text={box.descriptionKey} />
					</p>
				</td>
				<td className="py-3 px-4 text-right font-medium text-slate-700">
					{box.baseAmount !== undefined ? formatCurrency(box.baseAmount, currency) : "-"}
				</td>
				<td className="py-3 px-4 text-center font-medium text-slate-600">
					{rateText}
				</td>
				<td
					className={`py-3 px-4 text-right font-bold ${
						isResult
							? isPayable
								? "text-amber-900 text-base"
								: "text-emerald-700 text-base"
							: "text-slate-900"
					}`}
				>
					{formatCurrency(box.vatAmount, currency)}
				</td>
			</tr>
		);
	};

	return (
		<div className="space-y-6">
			{/* Result summary callout */}
			<div
				className={`p-4 rounded-xl border flex items-center justify-between ${
					isPayable
						? "bg-amber-50/80 border-amber-200 text-amber-950"
						: "bg-emerald-50/80 border-emerald-200 text-emerald-950"
				}`}
			>
				<div className="flex items-center gap-3">
					{isPayable ? (
						<AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
					) : (
						<CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
					)}
					<div>
						<p className="text-sm font-bold">
							<Translate text={localizationConstants.vatReportBox49} /> ({periodStr})
						</p>
						<p className="text-xs text-slate-600 mt-0.5">
							<Translate
								text={
									isPayable
										? localizationConstants.vatPayableNotice
										: localizationConstants.vatRefundNotice
								}
							/>
						</p>
					</div>
				</div>
				<div className="text-right">
					<span
						className={`text-lg font-black px-4 py-1.5 rounded-lg border shadow-xs ${
							isPayable
								? "bg-white border-amber-300 text-amber-950"
								: "bg-white border-emerald-300 text-emerald-950"
						}`}
					>
						{formatCurrency(Math.abs(data.netVatPayable), currency)}
					</span>
				</div>
			</div>

			{/* Skatteverket Official Format Table */}
			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-lg font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.vatReportTitle} />
						</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							<Translate text={localizationConstants.vatReportSubtitle} />
						</p>
					</div>
					<div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-md">
						{periodStr}
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[640px]">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
								<th className="py-3 px-4 w-32">
									<Translate text={localizationConstants.vatReportColBox} />
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.vatReportColSpecification} />
								</th>
								<th className="py-3 px-4 text-right w-40">
									<Translate text={localizationConstants.vatReportColBaseAmount} />
								</th>
								<th className="py-3 px-4 text-center w-28">
									<Translate text={localizationConstants.vatReportColRate} />
								</th>
								<th className="py-3 px-4 text-right w-40">
									<Translate text={localizationConstants.vatReportColVatAmount} />
								</th>
							</tr>
						</thead>
						<tbody>
							{data.boxes.map(renderBoxRow)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default VatReport;
