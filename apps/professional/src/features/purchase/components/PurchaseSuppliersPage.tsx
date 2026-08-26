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
				{/* Content switcher for the suppliers area itself. */}
				<div className="mb-4 flex items-center gap-6 overflow-x-auto rounded-t-lg border-b border-slate-200 bg-white px-4 pt-2">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`relative cursor-pointer pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
								activeTab === tab.id
									? "-mb-px border-b-2 border-slate-900 font-semibold text-slate-900"
									: "text-slate-500 hover:text-slate-800"
							}`}
						>
							<Translate text={tab.label} />
						</button>
					))}
				</div>

				<div className="flex-1">
					{activeTab === "suppliers" ? (
						<PurchaseSupplierListTab
							onOpenPriceList={() => setActiveTab("priceLists")}
						/>
					) : (
						<ComingSoonPage hideTitle />
					)}
				</div>
			</div>
		</div>
	);
}

export default PurchaseSuppliersPage;
