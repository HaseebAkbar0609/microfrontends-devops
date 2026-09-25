"use client";

import { CalendarRange, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { PersonnelSummary } from "../../../../types/forecastPersonnel.types";
import { formatPercent, formatSek } from "../../../../utils/economyFormatters";
import { changeTone, TONE_CLASS } from "../../analysis/widgets/AnalysisCardParts";
import {
	SUMMARY_CAPTION,
	SUMMARY_CAPTION_DARK,
	SUMMARY_CARD,
	SUMMARY_CARD_DARK,
	SUMMARY_CARD_GRID,
	SUMMARY_VALUE,
	SummaryCardHeading,
} from "../../SummaryCardParts";

export interface PersonnelKpiCardsProps {
	summary: PersonnelSummary;
	isLoading: boolean;
}

/** Four cards while the figures are still being read. */
function CardsSkeleton() {
	return (
		<div className={SUMMARY_CARD_GRID} aria-busy>
			{[0, 1, 2, 3].map((card) => (
				<div key={card} className={SUMMARY_CARD}>
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-7 w-40" />
					<Skeleton className="h-3 w-24" />
				</div>
			))}
		</div>
	);
}

/** What the payroll costs, what it costs a year, who is on it, and its ceiling. */
export function PersonnelKpiCards({ summary, isLoading }: PersonnelKpiCardsProps) {
	const t = useTranslate();

	if (isLoading) return <CardsSkeleton />;

	const rising = summary.monthlyChangePercent > 0;
	/* More payroll than last month is not by itself good news, but it is what
	   the arrow points at; the tone follows the direction. */
	const ChangeIcon = rising ? TrendingUp : TrendingDown;

	return (
		<div className={SUMMARY_CARD_GRID}>
			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<Wallet className="h-4 w-4 text-slate-500" aria-hidden />}
					labelKey={localizationConstants.forecastPersonnelMonthlyCostTitle}
				/>
				<p className={cn(SUMMARY_VALUE, "text-slate-900")}>{formatSek(summary.monthlyCost)}</p>
				<p
					className={cn(
						"flex items-center gap-1.5 text-xs font-medium",
						TONE_CLASS[changeTone(summary.monthlyChangePercent)],
					)}
				>
					{summary.monthlyChangePercent !== 0 && <ChangeIcon className="h-3.5 w-3.5" aria-hidden />}
					{t(localizationConstants.forecastPersonnelMonthlyCostCaption, {
						percent: formatPercent(Math.abs(summary.monthlyChangePercent), 0),
					})}
				</p>
			</div>

			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<CalendarRange className="h-4 w-4 text-slate-500" aria-hidden />}
					labelKey={localizationConstants.forecastPersonnelAnnualBudgetTitle}
				/>
				<p className={cn(SUMMARY_VALUE, "text-slate-900")}>{formatSek(summary.annualBudget)}</p>
				<p className={SUMMARY_CAPTION}>
					<Translate text={localizationConstants.forecastPersonnelAnnualBudgetCaption} />
				</p>
			</div>

			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<Users className="h-4 w-4 text-slate-500" aria-hidden />}
					labelKey={localizationConstants.forecastPersonnelHeadcountTitle}
				/>
				<p className={cn(SUMMARY_VALUE, "text-slate-900")}>
					{t(localizationConstants.forecastPersonnelHeadcountValue, { count: summary.headcount })}
				</p>
				<p className={SUMMARY_CAPTION}>
					{t(localizationConstants.forecastPersonnelHeadcountCaption, {
						managers: summary.managerCount,
						staff: summary.staffCount,
					})}
				</p>
			</div>

			<div className={SUMMARY_CARD_DARK}>
				<SummaryCardHeading
					icon={<Wallet className="h-4 w-4" aria-hidden />}
					labelKey={localizationConstants.forecastPersonnelCapTitle}
					tone="dark"
				/>
				<p className={SUMMARY_VALUE}>{formatSek(summary.cap)}</p>
				<p className={cn(SUMMARY_CAPTION_DARK, "flex items-center gap-1.5")}>
					<span className="size-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
					{t(localizationConstants.forecastPersonnelCapCaption, {
						percent: formatPercent(summary.capUsedPercent, 0),
					})}
				</p>
			</div>
		</div>
	);
}

export default PersonnelKpiCards;
