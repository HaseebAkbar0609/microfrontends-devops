"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityFinancialSummary } from "../../types/authorities.types";

interface AuthorityDetailTotalsCardProps {
	totals?: AuthorityFinancialSummary;
}

export function AuthorityDetailTotalsCard({
	totals,
}: AuthorityDetailTotalsCardProps) {
	const defaultTotals: AuthorityFinancialSummary = {
		subtotal: 20700,
		freightFee: 0,
		invoiceFee: 0,
		totalExclVat: 20700,
		vatRate: 25,
		vatAmount: 5175,
		note: "Tack för ert förtroende! Vid frågor gällande denna faktura eller ärende, vänligen kontakta vår ekonomiavdelning.",
	};

	const data = totals || defaultTotals;
	const totalIncVat = data.totalExclVat + data.vatAmount;

	return (
		<div className="p-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/20">
			{/* Left Notes */}
			<div className="md:col-span-7 space-y-2">
				<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
					<Translate text={localizationConstants.authorityNotes} />
				</span>
				<div className="rounded-lg border border-slate-200/80 bg-white p-3.5 text-xs text-slate-600 leading-relaxed">
					{data.note || "Betalning oss tillhanda senast förfallodatum."}
				</div>
			</div>

			{/* Right Financial Summary */}
			<div className="md:col-span-5 space-y-2 text-xs">
				<div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
					<span>
						<Translate text={localizationConstants.authoritySubtotal} />
					</span>
					<span className="font-semibold text-slate-900">
						{data.totalExclVat.toLocaleString("sv-SE", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}{" "}
						kr
					</span>
				</div>

				<div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
					<span>
						<Translate text={localizationConstants.authorityVat} /> ({data.vatRate}%)
					</span>
					<span className="font-semibold text-slate-900">
						{data.vatAmount.toLocaleString("sv-SE", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}{" "}
						kr
					</span>
				</div>

				<div className="flex justify-between py-2 border-t border-slate-300 text-sm font-bold text-slate-900">
					<span>
						<Translate text={localizationConstants.authorityTotal} />
					</span>
					<span className="text-base text-slate-900">
						{totalIncVat.toLocaleString("sv-SE", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}{" "}
						SEK
					</span>
				</div>
			</div>
		</div>
	);
}

export default AuthorityDetailTotalsCard;
