"use client";

import React, { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierArticleDetail } from "../../../hooks/useSupplierArticleDetail";
import { SupplierArticleBasicTab } from "./SupplierArticleBasicTab";
import { SupplierArticlesOverviewTable } from "../SupplierArticlesOverviewTable";

interface SupplierArticleDetailPageProps {
	readonly id?: string;
}

export function SupplierArticleDetailPage({ id }: SupplierArticleDetailPageProps) {
	const t = useTranslate();
	const { article, isLoading, updateSupplierArticle, handleBack } = useSupplierArticleDetail(id);

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/50 p-6 sm:p-8 max-w-7xl mx-auto w-full">
				<div className="flex items-center gap-3">
					<div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
					<div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-16 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="flex gap-6 border-b border-slate-200 mb-6">
					<div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
					<div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="grid grid-cols-1 gap-5">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center bg-slate-50/50 px-4 py-16">
				<h2 className="mb-2 text-lg font-semibold leading-7 text-zinc-950">
					<Translate text={localizationConstants.noDataFound} />
				</h2>
				<Button onClick={handleBack} className="cursor-pointer">
					<Translate text={localizationConstants.goBackButton} />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/40 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-4">
			{/* Top Header matching Figma Image 1 */}
			<div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						aria-label={t(localizationConstants.goBackToRegisterLabel)}
						onClick={handleBack}
						className="h-8 w-8 shrink-0 -ml-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 cursor-pointer rounded-lg"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-2xl font-bold tracking-tight text-zinc-950 lowercase">
						<Translate text={localizationConstants.detailTitle} />
					</h1>
				</div>

				<p className="mt-0.5 ml-8 text-xs font-normal text-slate-500">
					#{article.supplierArticleNo || "M101"}
				</p>
			</div>

			{/* Tabs matching Figma Image 1 */}
			<Tabs defaultValue="basic" className="w-full">
				<TabsList variant="line" className="gap-6 bg-transparent p-0 border-b border-slate-200 w-full justify-start rounded-none">
					<TabsTrigger
						value="basic"
						className="pb-2.5 pt-1 text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 cursor-pointer rounded-none px-1"
					>
						<Translate text={localizationConstants.supplierArticleDetailTabBasic} />
					</TabsTrigger>
					<TabsTrigger
						value="list"
						className="pb-2.5 pt-1 text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 text-slate-500 cursor-pointer rounded-none px-1"
					>
						<Translate text={localizationConstants.supplierArticleDetailTabList} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic" className="mt-4 outline-none">
					<SupplierArticleBasicTab article={article} onUpdate={updateSupplierArticle} />
				</TabsContent>

				<TabsContent value="list" className="mt-4 outline-none">
					<Suspense
						fallback={
							<div className="py-12 text-center text-xs text-slate-400">
								<Translate text={localizationConstants.genericLoading} />
							</div>
						}
					>
						<SupplierArticlesOverviewTable />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default SupplierArticleDetailPage;

