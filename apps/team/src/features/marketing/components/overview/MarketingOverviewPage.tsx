"use client";

import dynamic from "next/dynamic";
import { Activity, Mail, PieChart, Wallet } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MARKETING_BUDGET_PERIOD } from "../../constants/marketing.constants";
import { findSectionKeyBySlug } from "../../constants/marketingGroups";
import { useMarketingRegisters } from "../../hooks/useMarketingRegisters";
import {
	formatCurrency,
	formatNumber,
	formatPercent,
} from "../../utils/marketingFormatters";
import { deriveMarketingMetrics } from "../../utils/marketingMetrics";
import { MarketingModuleShell } from "../MarketingModuleShell";
import { MarketingKpiCard } from "./MarketingKpiCard";
import { TrafficSourceCard } from "./TrafficSourceCard";

/** recharts measures the DOM, so it must not render on the server. */
const chartLoader = () => (
	<div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
);

const TrafficTrendChart = dynamic(() => import("./TrafficTrendChart"), {
	ssr: false,
	loading: chartLoader,
});

const BudgetPerformanceChart = dynamic(
	() => import("./BudgetPerformanceChart"),
	{ ssr: false, loading: chartLoader },
);

const BUDGET_KEY = findSectionKeyBySlug("budget") ?? "";
const PLAN_KEY = findSectionKeyBySlug("marknadsplan") ?? "";
const MAIL_LIST_KEY = findSectionKeyBySlug("maillistor") ?? "";

export default function MarketingOverviewPage() {
	const { getRows } = useMarketingRegisters();
	const t = useTranslate();

	const metrics = deriveMarketingMetrics(
		getRows(BUDGET_KEY),
		getRows(PLAN_KEY),
		getRows(MAIL_LIST_KEY),
	);

	return (
		<MarketingModuleShell>
			<div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-4">
				<MarketingKpiCard
					label={`${t(localizationConstants.marketingKpiBudget)} ${MARKETING_BUDGET_PERIOD}`}
					value={formatCurrency(metrics.budgetTotal)}
					hint={`${t(localizationConstants.marketingKpiBudgetHint)} ${formatCurrency(
						metrics.actualTotal,
					)}`}
					icon={Wallet}
				/>
				<MarketingKpiCard
					label={t(localizationConstants.marketingKpiUtilisation)}
					value={formatPercent(metrics.utilisation)}
					hint={t(localizationConstants.marketingKpiUtilisationHint)}
					icon={PieChart}
				/>
				<MarketingKpiCard
					label={t(localizationConstants.marketingKpiActiveActivities)}
					value={formatNumber(metrics.activeActivities)}
					hint={t(localizationConstants.marketingKpiActiveActivitiesHint)}
					icon={Activity}
				/>
				<MarketingKpiCard
					label={t(localizationConstants.marketingKpiRecipients)}
					value={formatNumber(metrics.mailRecipients)}
					hint={t(localizationConstants.marketingKpiRecipientsHint)}
					icon={Mail}
				/>
			</div>

			<div className="grid grid-cols-1 gap-5 @5xl:grid-cols-3">
				<div className="@5xl:col-span-2">
					<TrafficTrendChart />
				</div>
				<TrafficSourceCard />
			</div>

			<BudgetPerformanceChart lines={metrics.budgetLines} />
		</MarketingModuleShell>
	);
}
