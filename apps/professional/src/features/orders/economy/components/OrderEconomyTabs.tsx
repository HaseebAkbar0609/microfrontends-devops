"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
			<div className="px-6 h-[36px] -mb-[1px]">
				<Tabs
					value={activeTab}
					onValueChange={(val) => onTabChange(val as OrderEconomyTab)}
				>
					<TabsList variant="line" className="h-[36px]">
						{tabs.map((t) => (
							<TabsTrigger key={t.id} value={t.id} className="cursor-pointer">
								<Translate text={t.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
		</div>
	);
}
