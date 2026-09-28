"use client";

import React, { Suspense } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CustomerOverviewTable } from "./CustomerOverviewTable";

import { EconomySubTabs } from "../common/EconomySubTabs";

const CUSTOMER_SUB_TABS = [
	{ id: "customer-list", labelKey: localizationConstants.customerListTab },
];

export function CustomerOverviewPage() {
	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar with Kundlista */}
			<EconomySubTabs
				tabs={CUSTOMER_SUB_TABS}
				activeTab="customer-list"
				onTabChange={() => {}}
			/>

			{/* Customer Table Content */}
			<Suspense
				fallback={
					<div className="py-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.genericLoading} />
					</div>
				}
			>
				<CustomerOverviewTable />
			</Suspense>
		</div>
	);
}

export default CustomerOverviewPage;
