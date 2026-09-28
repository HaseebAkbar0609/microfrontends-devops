"use client";

import React, { Suspense } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SuppliersOverviewTable } from "./SuppliersOverviewTable";

import { EconomySubTabs } from "../common/EconomySubTabs";

const SUPPLIER_SUB_TABS = [
	{ id: "supplier-list", labelKey: localizationConstants.supplierListTab },
];

export function SuppliersOverviewPage() {
	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar with Leverantörslista */}
			<EconomySubTabs
				tabs={SUPPLIER_SUB_TABS}
				activeTab="supplier-list"
				onTabChange={() => {}}
			/>

			{/* Supplier Table Content */}
			<Suspense
				fallback={
					<div className="py-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.genericLoading} />
					</div>
				}
			>
				<SuppliersOverviewTable />
			</Suspense>
		</div>
	);
}

export default SuppliersOverviewPage;
