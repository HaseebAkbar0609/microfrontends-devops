"use client";

import { useState } from "react";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "../data/purchaseNav.config";
import { PurchaseGanttTab } from "./PurchaseGanttTab";
import { PurchaseListTab } from "./PurchaseListTab";

type OverviewTab = "list" | "gantt";

export function PurchaseOverviewPage() {
	const [activeTab, setActiveTab] = useState<OverviewTab>("list");

	const tabClass = (tab: OverviewTab) =>
		`relative cursor-pointer pb-3 text-sm font-medium transition-colors ${
			activeTab === tab
				? "-mb-px border-b-2 border-slate-900 font-semibold text-slate-900"
				: "text-slate-500 hover:text-slate-800"
		}`;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabOverview,
				)}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-8">
				{/* Content switcher for the overview itself, matching Order overview. */}
				<div className="mb-4 flex items-center gap-6 rounded-t-lg border-b border-slate-200 bg-white px-4 pt-2">
					<button
						type="button"
						onClick={() => setActiveTab("list")}
						className={tabClass("list")}
					>
						<Translate
							text={
								localizationConstants.purchaseOverviewTabList
							}
						/>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("gantt")}
						className={tabClass("gantt")}
					>
						<Translate
							text={
								localizationConstants.purchaseOverviewTabGantt
							}
						/>
					</button>
				</div>

				<div className="flex-1">
					{activeTab === "list" ? (
						<PurchaseListTab />
					) : (
						<PurchaseGanttTab />
					)}
				</div>
			</div>
		</div>
	);
}

export default PurchaseOverviewPage;
