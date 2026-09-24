"use client";

import React from "react";
import { Download, Check } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListArticleItem } from "../../../../types/priceLists.types";

interface Step2ArtikelListaProps {
	readonly articles: PriceListArticleItem[];
	readonly selectedArticleIds: string[];
	readonly searchQuery: string;
	readonly onSearchChange: (val: string) => void;
	readonly onToggleArticle: (id: string) => void;
	readonly onToggleSelectAll: () => void;
}

export function Step2ArtikelLista({
	articles,
	selectedArticleIds,
	searchQuery,
	onSearchChange,
	onToggleArticle,
	onToggleSelectAll,
}: Step2ArtikelListaProps) {
	const allSelected =
		articles.length > 0 &&
		articles.every((a) => selectedArticleIds.includes(a.id) || selectedArticleIds.includes(a.articleNo));

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.priceListSearchPlaceholder}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[280px]"
				/>

				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						className="h-10 px-4 text-xs font-medium border-slate-200 gap-2 hover:bg-slate-50 cursor-pointer"
					>
						<Download className="h-4 w-4 text-slate-600" />
						<Translate text={localizationConstants.priceListImportArticlesButton} />
					</Button>
				</div>
			</div>

			{/* Articles Selection Table */}
			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600">
								<th className="py-3 px-4 w-12 text-center">
									<Checkbox
										checked={allSelected}
										onCheckedChange={() => onToggleSelectAll()}
										aria-label="Select all articles"
									/>
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.priceListArticleNoHeader} />
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.priceListDescriptionHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListOutPriceListAHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListCustomPriceHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListCalcCostHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListStockHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListReservedHeader} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-xs">
							{articles.map((article) => {
								const isSelected =
									selectedArticleIds.includes(article.id) ||
									selectedArticleIds.includes(article.articleNo);
								return (
									<tr
										key={article.id}
										onClick={() => onToggleArticle(article.id)}
										className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
											isSelected ? "bg-slate-50/40" : ""
										}`}
									>
										<td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => onToggleArticle(article.id)}
												aria-label={`Select article ${article.articleNo}`}
											/>
										</td>
										<td className="py-3 px-4 font-semibold text-slate-900">
											{article.articleNo}
										</td>
										<td className="py-3 px-4 text-slate-700">
											{article.benamning}
										</td>
										<td className="py-3 px-4 text-right font-bold text-slate-900">
											{article.outPriceListA} kr
										</td>
										<td className="py-3 px-4 text-right text-blue-600 font-medium">
											{article.customPrice || article.outPriceListA} kr
										</td>
										<td className="py-3 px-4 text-right text-slate-600">
											{article.calculatedCost} kr
										</td>
										<td className="py-3 px-4 text-center text-slate-700">
											{article.stock}
										</td>
										<td className="py-3 px-4 text-center text-slate-500">
											{article.reserved}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Selected Articles Summary Count */}
			<div className="flex items-center justify-between text-xs text-slate-500 pt-2">
				<div className="flex items-center gap-1.5 font-medium text-slate-700">
					<Check className="h-4 w-4 text-emerald-600" />
					<span>
						{selectedArticleIds.length} <Translate text={localizationConstants.priceListReviewSelected} /> (
						{articles.length} <Translate text={localizationConstants.priceListReviewArticlesCount} />)
					</span>
				</div>
			</div>
		</div>
	);
}
