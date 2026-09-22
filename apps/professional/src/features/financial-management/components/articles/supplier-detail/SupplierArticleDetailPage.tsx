"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierArticleDetail } from "../../../hooks/useSupplierArticleDetail";
import { SupplierArticleBasicTab } from "./SupplierArticleBasicTab";

interface SupplierArticleDetailPageProps {
	readonly id?: string;
}

export function SupplierArticleDetailPage({ id }: SupplierArticleDetailPageProps) {
	const t = useTranslate();
	const { article, isLoading, handleEdit, handleBack } = useSupplierArticleDetail(id);

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-6 pb-6 px-4">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
					<div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
				</div>
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 opacity-60 my-2" />
				<div className="grid grid-cols-1 gap-4 sm:gap-6 mt-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-16">
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
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 pt-4 pb-4 px-2 sm:px-4">
			<div className="mb-0.5 flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.goBackToRegisterLabel)}
					onClick={handleBack}
					className="h-8 w-8 shrink-0 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</Button>
				<h1 className="text-2xl font-semibold leading-none tracking-[-0.6px] text-zinc-950">
					<Translate text={localizationConstants.detailTitle} />
				</h1>
			</div>

			<p className="mb-2 ml-10 text-sm font-normal leading-5 text-zinc-500">
				#{article.supplierArticleNo} • {article.supplierName}
			</p>

			<Tabs defaultValue="basic" className="ml-0 sm:ml-10">
				<TabsList variant="line" className="mb-2">
					<TabsTrigger
						value="basic"
						className="min-w-fit text-sm font-semibold leading-none tracking-normal text-center cursor-pointer"
					>
						<Translate text={localizationConstants.articleGrundInfoTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic">
					<SupplierArticleBasicTab article={article} onEdit={handleEdit} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default SupplierArticleDetailPage;
