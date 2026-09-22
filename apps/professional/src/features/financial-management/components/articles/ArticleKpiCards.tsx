"use client";

import React from "react";
import { Package, CheckCircle2, Layers } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleKpiStats } from "../../types/article.types";

interface ArticleKpiCardsProps {
	readonly stats: ArticleKpiStats;
}

export function ArticleKpiCards({ stats }: ArticleKpiCardsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{/* Card 1: Total Articles */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.totalArticlesKPI} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
						<Package className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-slate-900 tracking-tight">
						{stats.totalArticles}
					</p>
					<p className="text-[11px] text-slate-400 mt-0.5">
						<Translate text={localizationConstants.totalArticlesSubtitle} />
					</p>
				</div>
			</div>

			{/* Card 2: Active Products */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.activeProductsKPI} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
						<CheckCircle2 className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-emerald-600 tracking-tight">
						{stats.activeArticles}
					</p>
					<p className="text-[11px] text-emerald-600/80 font-medium mt-0.5">
						<Translate text={localizationConstants.activeProductsSubtitle} />
					</p>
				</div>
			</div>

			{/* Card 3: Mapped Articles */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.mappedArticlesKPI} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
						<Layers className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-slate-900 tracking-tight">
						{stats.mappedArticles}
					</p>
					<p className="text-[11px] text-slate-400 mt-0.5">
						<Translate text={localizationConstants.mappedArticlesSubtitle} />
					</p>
				</div>
			</div>
		</div>
	);
}
