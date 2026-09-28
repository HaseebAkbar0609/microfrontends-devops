"use client";

import React, { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { EconomySubTabs } from "../common/EconomySubTabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PriceListsOverviewTable } from "./PriceListsOverviewTable";
import { UpdatePriceListTab } from "./update-tab/UpdatePriceListTab";

export function PriceListsOverviewPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeSubTab = searchParams.get("subtab") ?? "prislista";

	const handleSubTabChange = useCallback(
		(newTab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("subtab", newTab);
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const subTabs = [
		{ value: "prislista", label: localizationConstants.priceListTab },
		{ value: "uppdatera", label: localizationConstants.updatePriceListTab },
	];

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar */}
			<EconomySubTabs value={activeSubTab} onValueChange={handleSubTabChange} tabs={subTabs} />

			{/* Subtab Content */}
			{activeSubTab === "prislista" ? (
				<Suspense
					fallback={
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.genericLoading} />
						</div>
					}
				>
					<PriceListsOverviewTable />
				</Suspense>
			) : (
				<Suspense
					fallback={
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.genericLoading} />
						</div>
					}
				>
					<UpdatePriceListTab />
				</Suspense>
			)}
		</div>
	);
}

export default PriceListsOverviewPage;
