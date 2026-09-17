"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RegisterExpenseCalculations } from "../../types/expense.types";
import { formatNum } from "../../utils/format";

interface RegisterExpenseSummaryCardProps {
	calculations: RegisterExpenseCalculations;
}

export function RegisterExpenseSummaryCard({
	calculations,
}: RegisterExpenseSummaryCardProps) {

	const currency = calculations.currency || "SEK";

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs font-sans">
			<h3 className="text-sm font-semibold text-slate-900 mb-4">
				<Translate text={localizationConstants.registerExpenseSummaryTitle} />
			</h3>

			<div className="space-y-2 max-w-md ml-auto text-xs">
				{/* Subtotal (Delsumma exkl moms) */}
				<div className="flex justify-between text-slate-600">
					<span>
						<Translate text={localizationConstants.registerExpenseSubtotal} />
					</span>
					<span className="text-slate-800 font-medium">
						{formatNum(calculations.subtotal)} {currency}
					</span>
				</div>

				{/* VAT breakdown per rate */}
				{calculations.vatBreakdown.map((b) => (
					<div key={b.rate} className="flex justify-between text-slate-500 pl-3">
						<span>
							<Translate text={localizationConstants.registerExpenseVatBreakdown} /> ({b.rate} %)
						</span>
						<span>{formatNum(b.vatAmount)} {currency}</span>
					</div>
				))}

				{/* Total VAT */}
				<div className="flex justify-between text-slate-700 font-medium pt-1">
					<span>
						<Translate text={localizationConstants.registerExpenseTotalVat} />
					</span>
					<span>{formatNum(calculations.totalVat)} {currency}</span>
				</div>

				<div className="border-t border-slate-200 my-2 pt-2" />

				{/* Grand Total */}
				<div className="flex justify-between items-center text-slate-900 font-bold text-sm pt-0.5">
					<span>
						<Translate text={localizationConstants.registerExpenseGrandTotal} />
					</span>
					<span className="text-base text-emerald-600 font-bold">
						{formatNum(calculations.grandTotal)} {currency}
					</span>
				</div>
			</div>
		</div>
	);
}

export default RegisterExpenseSummaryCard;
