"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderEconomyTab } from "../types/orderEconomy.types";

export interface OrderEconomyTabsProps {
	activeTab: OrderEconomyTab;
	onTabChange: (tab: OrderEconomyTab) => void;
}

export function OrderEconomyTabs({ activeTab, onTabChange }: OrderEconomyTabsProps) {
	const tabs: { id: OrderEconomyTab; labelKey: string }[] = [
		{ id: "contributionMargin", labelKey: localizationConstants.economicOverviewTabTB },
		{ id: "result", labelKey: localizationConstants.economicOverviewTabResult },
		{ id: "cost", labelKey: localizationConstants.economicOverviewTabCost },
		{ id: "revenue", labelKey: localizationConstants.economicOverviewTabRevenue },
	];

	return (
		<div className="border-b border-slate-200 bg-white">
			<nav className="flex gap-8 px-6" aria-label="Tabs">
				{tabs.map((t) => {
					const isActive = activeTab === t.id;
					return (
						<button
							key={t.id}
							type="button"
							onClick={() => onTabChange(t.id)}
							className={`py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-[1px] ${
								isActive
									? "border-slate-900 text-slate-900 font-bold"
									: "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
							}`}
						>
							<Translate text={t.labelKey} />
						</button>
					);
				})}
			</nav>
		</div>
	);
}
