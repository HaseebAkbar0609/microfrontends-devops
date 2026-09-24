"use client";

import React from "react";
import { Download, ChevronDown, ArrowUpDown, Check } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListArticleItem } from "../../../../types/priceLists.types";

interface Step2ArtikelListaProps {
	readonly articles: PriceListArticleItem[];
	readonly selectedArticleIds: string[];
	readonly searchQuery: string;
	readonly categoryFilter: string;
	readonly onSearchChange: (val: string) => void;
	readonly onCategoryChange: (cat: string) => void;
	readonly onToggleArticle: (id: string) => void;
	readonly onToggleSelectAll: () => void;
	readonly onSortArticles: (field: keyof PriceListArticleItem) => void;
	readonly onImportArticles: () => void;
}

export function Step2ArtikelLista({
	articles,
	selectedArticleIds,
	searchQuery,
	categoryFilter,
	onSearchChange,
	onCategoryChange,
	onToggleArticle,
	onToggleSelectAll,
	onSortArticles,
	onImportArticles,
}: Step2ArtikelListaProps) {
	const allSelected =
		articles.length > 0 &&
		articles.every((a) => selectedArticleIds.includes(a.id) || selectedArticleIds.includes(a.articleNo));

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Toolbar matching Figma Image 5 */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.priceListSearchPlaceholder}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[260px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 px-3 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 text-xs shadow-2xs cursor-pointer"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-3.5 w-3.5 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40 bg-white border-slate-200 shadow-md">
							<DropdownMenuItem
								onClick={() => onCategoryChange("all")}
								className="text-xs cursor-pointer flex items-center justify-between"
							>
								<Translate text={localizationConstants.priceListCategoryFilterAll} />
								{categoryFilter === "all" && <Check className="h-3.5 w-3.5" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onCategoryChange("Service")}
								className="text-xs cursor-pointer flex items-center justify-between"
							>
								<Translate text={localizationConstants.priceListCategoryFilterService} />
								{categoryFilter === "Service" && <Check className="h-3.5 w-3.5" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-3">
					<Button
						type="button"
						onClick={onImportArticles}
						className="h-10 px-4 text-xs font-semibold bg-[#111721] hover:bg-slate-800 text-white gap-2 rounded-lg shadow-2xs cursor-pointer"
					>
						<Download className="h-4 w-4" />
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
								<th
									className="py-3 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("articleNo")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListArticleNoHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="py-3 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("benamning")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListDescriptionHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("outPriceListA")}
								>
									<div className="flex items-center justify-end gap-1">
										<Translate text={localizationConstants.priceListOutPriceListAHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("calculatedCost")}
								>
									<div className="flex items-center justify-end gap-1">
										<Translate text={localizationConstants.priceListCalcCostHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("stock")}
								>
									<div className="flex items-center justify-center gap-1">
										<Translate text={localizationConstants.priceListStockHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100/50 transition-colors"
									onClick={() => onSortArticles("reserved")}
								>
									<div className="flex items-center justify-center gap-1">
										<Translate text={localizationConstants.priceListReservedHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
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
											{article.outPriceListA}
										</td>
										<td className="py-3 px-4 text-right text-slate-600">
											{article.calculatedCost}
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
		</div>
	);
}
