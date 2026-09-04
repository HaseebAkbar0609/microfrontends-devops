"use client";

import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	AVAILABLE_REPORT_YEARS,
	MONTH_TRANSLATION_KEYS,
	QUARTER_TRANSLATION_KEYS,
	REPORT_PERIOD_BTN_ACTIVE,
	REPORT_PERIOD_BTN_INACTIVE,
} from "../../constants/financialReports.constants";
import type { ReportPeriodFilter, ReportPeriodType } from "../../types/financialReports.types";

interface ReportPeriodSelectorProps {
	periodFilter: ReportPeriodFilter;
	onPeriodTypeChange: (periodType: ReportPeriodType) => void;
	onYearChange: (year: number) => void;
	onMonthChange: (month: number) => void;
	onQuarterChange: (quarter: number) => void;
}

export function ReportPeriodSelector({
	periodFilter,
	onPeriodTypeChange,
	onYearChange,
	onMonthChange,
	onQuarterChange,
}: ReportPeriodSelectorProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
			{/* Period Type Segmented Switcher */}
			<div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
				<button
					type="button"
					onClick={() => onPeriodTypeChange("monthly")}
					className={
						periodFilter.periodType === "monthly"
							? REPORT_PERIOD_BTN_ACTIVE
							: REPORT_PERIOD_BTN_INACTIVE
					}
				>
					<Translate text={localizationConstants.reportPeriodTypeMonthly} />
				</button>
				<button
					type="button"
					onClick={() => onPeriodTypeChange("quarterly")}
					className={
						periodFilter.periodType === "quarterly"
							? REPORT_PERIOD_BTN_ACTIVE
							: REPORT_PERIOD_BTN_INACTIVE
					}
				>
					<Translate text={localizationConstants.reportPeriodTypeQuarterly} />
				</button>
				<button
					type="button"
					onClick={() => onPeriodTypeChange("yearly")}
					className={
						periodFilter.periodType === "yearly"
							? REPORT_PERIOD_BTN_ACTIVE
							: REPORT_PERIOD_BTN_INACTIVE
					}
				>
					<Translate text={localizationConstants.reportPeriodTypeYearly} />
				</button>
			</div>

			<div className="h-6 w-px bg-slate-200 hidden sm:block" />

			{/* Year Selector */}
			<div className="flex items-center gap-2">
				<Calendar className="w-4 h-4 text-slate-400" />
				<select
					aria-label={t(localizationConstants.reportFilterYear)}
					value={periodFilter.year}
					onChange={(e) => onYearChange(Number(e.target.value))}
					className="h-9 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
				>
					{AVAILABLE_REPORT_YEARS.map((yr) => (
						<option key={yr} value={yr}>
							{yr}
						</option>
					))}
				</select>
			</div>

			{/* Month Selector if Monthly */}
			{periodFilter.periodType === "monthly" && (
				<select
					aria-label={t(localizationConstants.reportFilterMonth)}
					value={periodFilter.month ?? 1}
					onChange={(e) => onMonthChange(Number(e.target.value))}
					className="h-9 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
				>
					{MONTH_TRANSLATION_KEYS.map((m) => (
						<option key={m.value} value={m.value}>
							{t(m.key)}
						</option>
					))}
				</select>
			)}

			{/* Quarter Selector if Quarterly */}
			{periodFilter.periodType === "quarterly" && (
				<select
					aria-label={t(localizationConstants.reportFilterQuarter)}
					value={periodFilter.quarter ?? 1}
					onChange={(e) => onQuarterChange(Number(e.target.value))}
					className="h-9 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
				>
					{QUARTER_TRANSLATION_KEYS.map((q) => (
						<option key={q.value} value={q.value}>
							{t(q.key)}
						</option>
					))}
				</select>
			)}
		</div>
	);
}
