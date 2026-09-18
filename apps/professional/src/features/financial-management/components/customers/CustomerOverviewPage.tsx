"use client";

import React, { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CustomerOverviewTable } from "./CustomerOverviewTable";

export function CustomerOverviewPage() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50/50 min-h-screen">

			{/* Sub Tabs Bar with Kundlista */}
			<div className="border-b border-slate-200">
				<Tabs value="kundlista">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="kundlista" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.customerListTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

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
