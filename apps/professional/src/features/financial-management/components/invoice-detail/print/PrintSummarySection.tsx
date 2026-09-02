"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailCalculations } from "../../../types/invoiceDetail.types";

interface PrintSummarySectionProps {
	comments?: string;
	calculations: InvoiceDetailCalculations;
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PrintSummarySection({ comments, calculations }: PrintSummarySectionProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 mb-8 text-xs">
			<div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
				<p className="font-semibold text-slate-800 mb-1">
					<Translate text={localizationConstants.createInvoiceModalNotes} />
				</p>
				<p className="text-slate-600 leading-relaxed whitespace-pre-line">
					{comments || <Translate text={localizationConstants.invoiceDetailNoComment} />}
				</p>
			</div>

			<div className="space-y-1.5 text-right pr-2">
				<div className="flex justify-between text-slate-600">
					<span>
						<Translate text={localizationConstants.createInvoiceCalcSubtotal} />:
					</span>
					<span className="text-slate-900 font-medium">{formatNum(calculations.delsumma)} kr</span>
				</div>
				<div className="flex justify-between text-slate-600">
					<span>
						<Translate text={localizationConstants.invoiceDetailFreightFee} />:
					</span>
					<span className="text-slate-900 font-medium">0.00 kr</span>
				</div>
				<div className="flex justify-between text-slate-600">
					<span>
						<Translate text={localizationConstants.invoiceDetailInvoiceFee} />:
					</span>
					<span className="text-slate-900 font-medium">0.00 kr</span>
				</div>
				<div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200">
					<span>
						<Translate text={localizationConstants.invoiceDetailTotalExclVat} />:
					</span>
					<span className="text-slate-900">{formatNum(calculations.totalExclVat)} kr</span>
				</div>
				<div className="flex justify-between text-slate-700 font-semibold">
					<span>
						<Translate text={localizationConstants.invoiceDetailVat} />:
					</span>
					<span className="text-slate-900">{formatNum(calculations.vatAmount)} kr</span>
				</div>
				<div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
					<span className="text-slate-900 font-bold text-sm">
						<Translate text={localizationConstants.invoiceDetailAmountToPay} />:
					</span>
					<span className="text-emerald-600 font-black text-base">{formatNum(calculations.attErhalla)} kr</span>
				</div>
			</div>
		</div>
	);
}

export default PrintSummarySection;
