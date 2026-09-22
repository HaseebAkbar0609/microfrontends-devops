"use client";

import React, { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ArticlesOverviewTable } from "./ArticlesOverviewTable";
import { SupplierArticlesOverviewTable } from "./SupplierArticlesOverviewTable";

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
			{/* Sub Tabs Bar matching Figma & Customer/Supplier pattern */}
			<div className="border-b border-slate-200">
				<Tabs value={activeSubTab} onValueChange={handleSubTabChange}>
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="artikel" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.articleListTab} />
						</TabsTrigger>
						<TabsTrigger value="leverantorsArtiklar" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.supplierArticlesTab} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

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
