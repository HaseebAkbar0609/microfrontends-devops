"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { SectionTabs, type SectionTabItem } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_RISK_BASE_ROUTE, riskRoutes } from "../../../../constants/forecastRisk.constants";
import type { RiskClient, RiskClientSettings, RiskClientTotals } from "../../../../types/forecastRisk.types";
import { RiskClientCard } from "./RiskClientCard";
import { RiskOutstandingCard } from "./RiskOutstandingCard";
import { RiskProjectCard } from "./RiskProjectCard";
import { RiskQuickStats } from "./RiskQuickStats";
import { RiskSettingsTab } from "./RiskSettingsTab";

const DETAIL_TABS: SectionTabItem[] = [
	{ id: "objects", labelKey: localizationConstants.forecastRiskTabObjects },
	{ id: "settings", labelKey: localizationConstants.forecastRiskTabSettings },
];

export interface RiskClientDetailPageProps {
	client: RiskClient;
	totals: RiskClientTotals;
	settings: RiskClientSettings;
	onSettingChange: <K extends keyof RiskClientSettings>(key: K, value: RiskClientSettings[K]) => void;
	onSave: () => void;
	basePath?: string;
}

/** One client's screen: what it is building on one tab, what it may owe on the other. */
export function RiskClientDetailPage({
	client,
	totals,
	settings,
	onSettingChange,
	onSave,
	basePath = FORECAST_RISK_BASE_ROUTE,
}: RiskClientDetailPageProps) {
	const router = useRouter();
	const t = useTranslate();
	const routes = riskRoutes(basePath);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<div className="border-b border-slate-200 bg-white px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(routes.list)}
						className="-ml-1.5 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
						aria-label={t(localizationConstants.backAriaLabel)}
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900">
							<Translate text={localizationConstants.forecastRiskDetailTitle} />
						</h1>
						<p className="font-mono text-xs text-slate-500">#{client.clientNo}</p>
					</div>
				</div>
			</div>

			<div className="flex-1 px-6 pb-8">
				<SectionTabs
					items={DETAIL_TABS}
					paramName="tab"
					ariaLabel={t(localizationConstants.forecastRiskTabsLabel)}
				>
					<TabsContent value="objects" className="flex flex-col gap-6 pt-5">
						<RiskClientCard client={client} />

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div className="flex flex-col gap-4 lg:col-span-2">
								<h3 className="text-base font-semibold text-slate-900">
									<Translate text={localizationConstants.forecastRiskActiveProjects} />
								</h3>
								{client.projects.map((project) => (
									<RiskProjectCard key={project.id} project={project} />
								))}
							</div>

							<div className="flex flex-col gap-4">
								<RiskOutstandingCard client={client} totals={totals} />
								<RiskQuickStats totals={totals} />
							</div>
						</div>
					</TabsContent>

					<TabsContent value="settings" className="pt-5">
						<RiskSettingsTab client={client} settings={settings} onChange={onSettingChange} onSave={onSave} />
					</TabsContent>
				</SectionTabs>
			</div>
		</div>
	);
}

export default RiskClientDetailPage;
