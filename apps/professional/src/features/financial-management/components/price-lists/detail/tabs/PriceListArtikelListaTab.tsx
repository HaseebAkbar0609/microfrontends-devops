"use client";

import React from "react";
import { Star } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListArticleItem } from "../../../../types/priceLists.types";

interface PriceListArtikelListaTabProps {
	readonly articles: PriceListArticleItem[];
	readonly searchQuery: string;
	readonly onSearchChange: (val: string) => void;
}

export function PriceListArtikelListaTab({
	articles,
	searchQuery,
	onSearchChange,
}: PriceListArtikelListaTabProps) {
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
			</div>

			{/* Detail Articles Table */}
			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600">
								<th className="py-3 px-4 w-10 text-center">#</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.priceListDetailArticleNoHeader} />
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.priceListDetailBenamningHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListDetailUtprislistaAHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListDetailKalkylKostnadHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListDetailStockHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListDetailReservedHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListDetailAvailableHeader} />
								</th>
								<th className="py-3 px-4 text-right">
									<Translate text={localizationConstants.priceListDetailStockValueHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListDetailLandHeader} />
								</th>
								<th className="py-3 px-4 text-center">
									<Translate text={localizationConstants.priceListStatusHeader} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-xs">
							{articles.length > 0 ? (
								articles.map((article) => (
									<tr key={article.id} className="hover:bg-slate-50/70 transition-colors">
										<td className="py-3 px-4 text-center">
											<Star
												className={`h-3.5 w-3.5 mx-auto ${
													article.isFavorite
														? "fill-[#111721] text-[#111721]"
														: "text-slate-300"
												}`}
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
										<td className="py-3 px-4 text-right text-slate-600">
											{article.calculatedCost} kr
										</td>
										<td className="py-3 px-4 text-center text-slate-700">
											{article.stock}
										</td>
										<td className="py-3 px-4 text-center text-slate-500">
											{article.reserved}
										</td>
										<td className="py-3 px-4 text-center text-slate-700 font-medium">
											{article.available || article.stock}
										</td>
										<td className="py-3 px-4 text-right text-slate-700">
											{article.stockValue || `${article.calculatedCost} kr`}
										</td>
										<td className="py-3 px-4 text-center text-slate-600">
											{article.country || "Sverige"}
										</td>
										<td className="py-3 px-4 text-center">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
												<Translate text={localizationConstants.activeStatus} />
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={11} className="py-8 text-center text-slate-400">
										<Translate text={localizationConstants.priceListReviewNoArticles} />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
