"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutCustomerLimit } from "../../types/rotRut.types";

interface RotRutRulesCardProps {
	customerLimits: RotRutCustomerLimit[];
}

function formatCurrency(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutRulesCard({ customerLimits }: RotRutRulesCardProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const [isExpanded, setIsExpanded] = useState(false);

	const visibleCustomers = isExpanded ? customerLimits : customerLimits.slice(0, 3);

	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 mb-5">
			{/* Top Bar: Compact Statutory Rules */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-100">
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

				{/* 2 Statutory Rules: Annual Cap & 30% Deduction Rate */}
				<div className="flex items-center gap-3 text-xs">
					<div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
						<span className="text-slate-500 block text-[10px]">
							<Translate text={localizationConstants.rotRutAnnualLimitLabel} />
						</span>
						<span className="font-semibold text-slate-800 text-[11px]">
							{formatCurrency(75000, currency)}
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

			{/* Customer Remaining Limit Tracker */}
			{customerLimits.length > 0 && (
				<div className="pt-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs">
							<UserCheck className="w-3.5 h-3.5 text-slate-400" />
							<span className="font-medium text-slate-700 text-xs">
								<Translate text={localizationConstants.rotRutCustomerRemainingLimit} />
							</span>
						</div>

						{customerLimits.length > 3 && (
							<button
								type="button"
								onClick={() => setIsExpanded(!isExpanded)}
								className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
							>
								<span>
									{isExpanded
										? t(localizationConstants.rotRutHide)
										: `${t(localizationConstants.rotRutShowAll)} (${customerLimits.length})`}
								</span>
								{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
							</button>
						)}
					</div>

					{/* Customer Quota Progress Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2.5">
						{visibleCustomers.map((cust) => (
							<div
								key={cust.customerId}
								className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 text-xs"
							>
								<div className="flex items-center justify-between mb-1">
									<span className="font-semibold text-slate-800 truncate max-w-[130px] text-[11px]">
										{cust.customerName}
									</span>
									<span className="text-[10px] text-slate-500 font-mono">
										{cust.customerPersonalIdMasked}
									</span>
								</div>

								{/* Progress Bar */}
								<div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
									<div
										className={`h-full rounded-full transition-all ${
											cust.percentUsed >= 95
												? "bg-rose-500"
												: cust.percentUsed >= 70
													? "bg-amber-500"
													: "bg-emerald-500"
										}`}
										style={{ width: `${cust.percentUsed}%` }}
									/>
								</div>

								<div className="flex items-center justify-between text-[10px] text-slate-500">
									<span>
										{formatCurrency(cust.totalUsed, currency)}{" "}
										<Translate text={localizationConstants.rotRutUsedOf} /> {formatCurrency(75000, currency)}
									</span>
									<span className="font-semibold text-slate-700">
										{formatCurrency(cust.remainingLimit, currency)}{" "}
										<Translate text={localizationConstants.rotRutRemaining} />
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
