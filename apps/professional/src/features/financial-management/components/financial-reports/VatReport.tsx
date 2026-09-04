"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { VatReportBox, VatReportData } from "../../types/financialReports.types";

interface VatReportProps {
	data: VatReportData;
}

function formatSek(val: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val) + " kr";
}

export function VatReport({ data }: VatReportProps) {
	const isPayable = data.netVatPayable >= 0;

	const renderBoxRow = (box: VatReportBox) => {
		const rateText = box.vatRate ? `${Math.round(box.vatRate * 100)}%` : "-";
		const isResult = box.isResultBox;

		return (
			<tr
				key={box.boxNumber}
				className={`border-b border-slate-100 text-xs transition-colors ${
					isResult
						? "bg-amber-50/70 border-t-2 border-amber-300 font-bold"
						: "hover:bg-slate-50/70"
				}`}
			>
				<td className="py-3 px-4 w-20">
					<span
						className={`inline-flex items-center justify-center font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
							isResult
								? "bg-amber-200 text-amber-950 shadow-sm"
								: "bg-slate-100 text-slate-800"
						}`}
					>
						Ruta {box.boxNumber}
					</span>
				</td>
				<td className="py-3 px-4">
					<p className={`font-semibold ${isResult ? "text-amber-950 text-sm" : "text-slate-800"}`}>
						<Translate text={box.boxNameKey} />
					</p>
					<p className="text-[11px] text-slate-500 mt-0.5">
						<Translate text={box.descriptionKey} />
					</p>
				</td>
				<td className="py-3 px-4 text-right font-medium text-slate-700">
					{box.baseAmount !== undefined ? formatSek(box.baseAmount) : "-"}
				</td>
				<td className="py-3 px-4 text-center font-medium text-slate-600">
					{rateText}
				</td>
				<td className={`py-3 px-4 text-right font-bold ${isResult ? (isPayable ? "text-amber-900 text-base" : "text-emerald-700 text-base") : "text-slate-900"}`}>
					{formatSek(box.vatAmount)}
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
							<Translate text={localizationConstants.vatReportBox49} /> ({data.periodLabel})
						</p>
						<p className="text-xs text-slate-600 mt-0.5">
							<Translate
								text={
									isPayable
										? localizationConstants.vatReportPayableDesc
										: localizationConstants.vatReportRefundDesc
								}
							/>
						</p>
					</div>
				</div>
				<div className="text-right">
					<span className="text-lg font-black tracking-tight">
						{formatSek(Math.abs(data.netVatPayable))}
					</span>
				</div>
			</div>

			{/* Main Skatteverket table */}
			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
					<div>
						<h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
							<Translate text={localizationConstants.vatReportTitle} />
						</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							<Translate text={localizationConstants.vatReportSubtitle} />
						</p>
					</div>
					<span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 shadow-sm">
						Skatteverket Standard (SKV 4700)
					</span>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/40 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
								<th className="py-2.5 px-4 w-24">
									<Translate text={localizationConstants.vatReportColBox} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.vatReportColSpecification} />
								</th>
								<th className="py-2.5 px-4 text-right w-36">
									<Translate text={localizationConstants.vatReportColBaseAmount} />
								</th>
								<th className="py-2.5 px-4 text-center w-24">
									<Translate text={localizationConstants.vatReportColRate} />
								</th>
								<th className="py-2.5 px-4 text-right w-36">
									<Translate text={localizationConstants.vatReportColVatAmount} />
								</th>
							</tr>
						</thead>
						<tbody>{data.boxes.map(renderBoxRow)}</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
