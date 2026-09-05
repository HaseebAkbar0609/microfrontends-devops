"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ROT_RUT_ANNUAL_LIMIT } from "../../constants/rotRut.constants";

interface RotRutRulesCardProps {
	className?: string;
}

function formatCurrency(amount: number, currency: string, lang = "sv"): string {
	const locale = lang === "sv" ? "sv-SE" : "en-US";
	return `${new Intl.NumberFormat(locale, {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutRulesCard({ className = "" }: RotRutRulesCardProps = {}) {
	const { t, i18n } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);

	return (
		<div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${className}`}>
			<div className="flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
					<ShieldCheck className="w-4 h-4" />
				</div>
				<div>
					<h3 className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.rotRutRulesTitle} />
					</h3>
					<p className="text-[11px] text-slate-500">
						<Translate text={localizationConstants.rotRutSubtitle} />
					</p>
				</div>
			</div>

			{/* Statutory Rules: Annual Cap & 30% Deduction Rate */}
			<div className="flex items-center gap-3 text-xs">
				<div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
					<span className="text-slate-500 block text-[10px]">
						<Translate text={localizationConstants.rotRutAnnualLimitLabel} />
					</span>
					<span className="font-semibold text-slate-800 text-[11px]">
						{formatCurrency(ROT_RUT_ANNUAL_LIMIT, currency, i18n.language)}
					</span>
				</div>

				<div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
					<span className="text-slate-500 block text-[10px]">
						<Translate text={localizationConstants.rotRutDeductionRateLabel} />
					</span>
					<span className="font-semibold text-slate-800 text-[11px]">
						<Translate text={localizationConstants.rotRutDeductionRateValue} />
					</span>
				</div>
			</div>
		</div>
	);
}
