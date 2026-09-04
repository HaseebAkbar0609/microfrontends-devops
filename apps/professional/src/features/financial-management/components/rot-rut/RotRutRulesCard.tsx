"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutCustomerLimit } from "../../types/rotRut.types";

interface RotRutRulesCardProps {
	customerLimits: RotRutCustomerLimit[];
}

function formatSEK(amount: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount) + " kr";
}

export function RotRutRulesCard({ customerLimits }: RotRutRulesCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 mb-6">
			{/* Top Header & Core Tax Rules */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
						<ShieldCheck className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.rotRutRulesTitle} />
						</h3>
						<p className="text-xs text-slate-500">
							<Translate text={localizationConstants.rotRutSubtitle} />
						</p>
					</div>
				</div>

				{/* 3 Key Statutory Metrics */}
				<div className="flex items-center gap-6 text-xs">
					<div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
						<span className="text-slate-500 block text-[10px]">
							<Translate text={localizationConstants.rotRutAnnualLimitLabel} />
						</span>
						<span className="font-semibold text-slate-800">
							<Translate text={localizationConstants.rotRutAnnualLimitValue} />
						</span>
					</div>

					<div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
						<span className="text-slate-500 block text-[10px]">
							<Translate text={localizationConstants.rotRutDeductionRateLabel} />
						</span>
						<span className="font-semibold text-slate-800">
							<Translate text={localizationConstants.rotRutDeductionRateValue} />
						</span>
					</div>

					<div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
						<span className="text-slate-500 block text-[10px]">
							<Translate text={localizationConstants.rotRutSubLimitLabel} />
						</span>
						<span className="font-semibold text-slate-800">
							<Translate text={localizationConstants.rotRutSubLimitValue} />
						</span>
					</div>
				</div>
			</div>

			{/* Customer Remaining Limit Header & Toggle */}
			<div className="pt-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<UserCheck className="w-4 h-4 text-slate-400" />
						<span className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.rotRutCustomerRemainingLimit} />
						</span>
						<span className="text-[11px] text-slate-400">
							(<Translate text={localizationConstants.rotRutCustomerRemainingDesc} />)
						</span>
					</div>
					<button
						type="button"
						onClick={() => setIsExpanded(!isExpanded)}
						className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
					>
						<span>{isExpanded ? "Dölj" : `Visa alla (${customerLimits.length})`}</span>
						{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
					</button>
				</div>

				{/* Progress Bars for Customers */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
					{(isExpanded ? customerLimits : customerLimits.slice(0, 3)).map((cust) => (
						<div
							key={cust.customerId}
							className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60 text-xs"
						>
							<div className="flex items-center justify-between mb-1.5">
								<span className="font-semibold text-slate-800 truncate max-w-[140px]">
									{cust.customerName}
								</span>
								<span className="text-[11px] text-slate-500 font-mono">
									{cust.customerPersonalIdMasked}
								</span>
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
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

							<div className="flex items-center justify-between text-[11px] text-slate-500">
								<span>
									{formatSEK(cust.totalUsed)}{" "}
									<Translate text={localizationConstants.rotRutUsedOf} /> 75k
								</span>
								<span className="font-medium text-slate-700">
									{formatSEK(cust.remainingLimit)}{" "}
									<Translate text={localizationConstants.rotRutRemaining} />
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
