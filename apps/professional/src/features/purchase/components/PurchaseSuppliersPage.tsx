"use client";

import { useState } from "react";

import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "../data/purchaseNav.config";
import { PurchaseAgreementsTab } from "./PurchaseAgreementsTab";
import { PurchaseSupplierListTab } from "./PurchaseSupplierListTab";

type SuppliersTab = "suppliers" | "agreements" | "priceLists" | "api";

const TABS: { id: SuppliersTab; label: TranslationKeys }[] = [
	{ id: "suppliers", label: localizationConstants.purchaseTabSuppliers },
	{
		id: "agreements",
		label: localizationConstants.purchaseSuppliersTabAgreements,
	},
	{
		id: "priceLists",
		label: localizationConstants.purchaseSuppliersTabPriceLists,
	},
	{ id: "api", label: localizationConstants.purchaseSuppliersTabApi },
];

export function PurchaseSuppliersPage() {
	const [activeTab, setActiveTab] = useState<SuppliersTab>("suppliers");

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabSuppliers,
				)}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-8">
				{/*
					Content switcher for the suppliers area itself. Four labels
					need horizontal scrolling on narrow screens, which makes this
					a scroll container — hence two details the sibling overview
					switcher does not need: `shrink-0`, so the flex parent cannot
					squeeze the row until the labels clip, and an inset underline
					on the active tab rather than a negative margin, which would
					overflow by a pixel and render a stray vertical scrollbar.
				*/}
				<div className="no-scrollbar mb-4 flex shrink-0 items-center gap-6 overflow-x-auto rounded-t-lg border-b border-slate-200 bg-white px-4 pt-3">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`relative cursor-pointer pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
								activeTab === tab.id
									? "font-semibold text-slate-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-slate-900"
									: "text-slate-500 hover:text-slate-800"
							}`}
						>
							<Translate text={tab.label} />
						</button>
					))}
				</div>

				<div className="flex-1">
					{activeTab === "suppliers" && (
						<PurchaseSupplierListTab
							onOpenPriceList={() => setActiveTab("priceLists")}
						/>
					)}
					{activeTab === "agreements" && <PurchaseAgreementsTab />}
					{(activeTab === "priceLists" || activeTab === "api") && (
						<ComingSoonPage hideTitle />
					)}
				</div>
			</div>
		</div>
	);
}

export default PurchaseSuppliersPage;
