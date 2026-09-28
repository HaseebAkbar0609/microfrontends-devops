"use client";

import React, { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ArticlesOverviewTable } from "./ArticlesOverviewTable";
import { SupplierArticlesOverviewTable } from "./SupplierArticlesOverviewTable";

import { EconomySubTabs, type EconomySubTabItem } from "../common/EconomySubTabs";

const ARTICLES_SUB_TABS: EconomySubTabItem<string>[] = [
	{ id: "artikel", labelKey: localizationConstants.articleListTab },
	{ id: "leverantorsArtiklar", labelKey: localizationConstants.supplierArticlesTab },
];

export function ArticlesOverviewPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeSubTab = searchParams.get("subtab") ?? "artikel";

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
			{/* Sub Tabs Bar */}
			<EconomySubTabs
				tabs={ARTICLES_SUB_TABS}
				activeTab={activeSubTab}
				onTabChange={handleSubTabChange}
			/>

			{/* Table Content */}
			{activeSubTab === "artikel" ? (
				<Suspense
					fallback={
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.genericLoading} />
						</div>
					}
				>
					<ArticlesOverviewTable />
				</Suspense>
			) : (
				<Suspense
					fallback={
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.genericLoading} />
						</div>
					}
				>
					<SupplierArticlesOverviewTable />
				</Suspense>
			)}
		</div>
	);
}

export default ArticlesOverviewPage;
