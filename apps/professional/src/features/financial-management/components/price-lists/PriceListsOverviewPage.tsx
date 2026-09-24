"use client";

import React, { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar matching Figma */}
			<div className="border-b border-slate-200">
				<Tabs value={activeSubTab} onValueChange={handleSubTabChange}>
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="prislista" className="pb-3 pt-1 text-sm font-semibold cursor-pointer">
							<Translate text={localizationConstants.priceListTab} />
						</TabsTrigger>
						<TabsTrigger value="uppdatera" className="pb-3 pt-1 text-sm font-semibold cursor-pointer">
							<Translate text={localizationConstants.updatePriceListTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

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
