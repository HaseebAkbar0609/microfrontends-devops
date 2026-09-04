"use client";

import React from "react";
import { Hammer, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutKpiSummary } from "../../types/rotRut.types";

interface RotRutSummaryCardsProps {
	summary: RotRutKpiSummary;
}

function formatSEK(amount: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount) + " kr";
}

export function RotRutSummaryCards({ summary }: RotRutSummaryCardsProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
			{/* Card 1: Total ROT Applied */}
			<div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.rotRutKpiTotalRot} />
					</span>
					<div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
						<Hammer className="w-4 h-4" />
					</div>
				</div>
				<div className="text-xl font-bold text-slate-900 tracking-tight">
					{formatSEK(summary.totalRotApplied)}
				</div>
				<p className="text-[11px] text-slate-500 mt-1">
					<Translate text={localizationConstants.rotRutKpiTotalRotDesc} />
				</p>
			</div>

			{/* Card 2: Total RUT Applied */}
			<div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.rotRutKpiTotalRut} />
					</span>
					<div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
						<Sparkles className="w-4 h-4" />
					</div>
				</div>
				<div className="text-xl font-bold text-slate-900 tracking-tight">
					{formatSEK(summary.totalRutApplied)}
				</div>
				<p className="text-[11px] text-slate-500 mt-1">
					<Translate text={localizationConstants.rotRutKpiTotalRutDesc} />
				</p>
			</div>

			{/* Card 3: Pending Skatteverket */}
			<div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.rotRutKpiPending} />
					</span>
					<div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
						<Clock className="w-4 h-4" />
					</div>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-xl font-bold text-slate-900 tracking-tight">
						{formatSEK(summary.totalPending)}
					</span>
					<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-100/70 text-amber-800">
						{summary.totalPendingCount}
					</span>
				</div>
				<p className="text-[11px] text-slate-500 mt-1">
					<Translate text={localizationConstants.rotRutKpiPendingDesc} />
				</p>
			</div>

			{/* Card 4: Approved */}
			<div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.rotRutKpiApproved} />
					</span>
					<div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
						<CheckCircle2 className="w-4 h-4" />
					</div>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-xl font-bold text-slate-900 tracking-tight">
						{formatSEK(summary.totalApproved)}
					</span>
					<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
						{summary.totalApprovedCount}
					</span>
				</div>
				<p className="text-[11px] text-slate-500 mt-1">
					<Translate text={localizationConstants.rotRutKpiApprovedDesc} />
				</p>
			</div>

			{/* Card 5: Rejected */}
			<div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.rotRutKpiRejected} />
					</span>
					<div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
						<AlertCircle className="w-4 h-4" />
					</div>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-xl font-bold text-slate-900 tracking-tight">
						{formatSEK(summary.totalRejected)}
					</span>
					<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800">
						{summary.totalRejectedCount}
					</span>
				</div>
				<p className="text-[11px] text-slate-500 mt-1">
					<Translate text={localizationConstants.rotRutKpiRejectedDesc} />
				</p>
			</div>
		</div>
	);
}
