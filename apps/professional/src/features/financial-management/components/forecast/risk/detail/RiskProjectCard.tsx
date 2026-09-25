"use client";

import { CircleAlert, CircleCheck, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RISK_PAYMENT_META } from "../../../../constants/forecastRisk.constants";
import type { RiskClientProject, RiskProjectPayment } from "../../../../types/forecastRisk.types";
import { formatPercent, formatSek } from "../../../../utils/economyFormatters";
import { riskProjectProgress } from "../../../../utils/forecastRisk";

/** The tag's own icon: settled, part-settled, or still waiting. */
const PAYMENT_ICON: Record<RiskProjectPayment, typeof CircleCheck> = {
	fullyPaid: CircleCheck,
	partiallyPaid: Clock,
	pending: CircleAlert,
};

const ICON_CLASS: Record<RiskProjectPayment, string> = {
	fullyPaid: "text-emerald-500",
	partiallyPaid: "text-amber-500",
	pending: "text-red-500",
};

export interface RiskProjectCardProps {
	project: RiskClientProject;
}

/** One project: what it may cost, what it has cost, and how far along that is. */
export function RiskProjectCard({ project }: RiskProjectCardProps) {
	const t = useTranslate();
	const payment = RISK_PAYMENT_META[project.payment];
	const Icon = PAYMENT_ICON[project.payment];
	const progress = riskProjectProgress(project);

	return (
		<article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col">
					<h4 className="truncate text-sm font-semibold text-slate-900">{project.name}</h4>
					<span className="font-mono text-xs text-slate-500">{project.projectNo}</span>
				</div>
				<div className="flex items-center gap-2">
					<Icon className={`h-4 w-4 ${ICON_CLASS[project.payment]}`} aria-hidden />
					<Badge variant={payment.variant}>{t(payment.labelKey)}</Badge>
				</div>
			</div>

			<dl className="flex flex-wrap gap-6">
				<div className="min-w-0 flex-1 basis-32">
					<dt className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.forecastRiskProjectBudget} />
					</dt>
					<dd className="text-sm font-bold text-slate-900 tabular-nums">{formatSek(project.budget)}</dd>
				</div>
				<div className="min-w-0 flex-1 basis-32">
					<dt className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.forecastRiskProjectSpending} />
					</dt>
					<dd className="text-sm font-bold text-slate-900 tabular-nums">{formatSek(project.spentToDate)}</dd>
				</div>
			</dl>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between text-xs">
					<span className="font-medium text-slate-500">
						<Translate text={localizationConstants.forecastRiskProjectProgress} />
					</span>
					<span className="font-semibold text-slate-900 tabular-nums">{formatPercent(progress)}</span>
				</div>
				<div
					className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
					role="progressbar"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(Math.min(progress, 100))}
					aria-label={t(localizationConstants.forecastRiskProjectProgressLabel, { project: project.name })}
				>
					<div
						className="h-full rounded-full bg-slate-900"
						style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
					/>
				</div>
			</div>
		</article>
	);
}

export default RiskProjectCard;
