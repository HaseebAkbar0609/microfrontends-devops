"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Import, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListArticleRow } from "../../types";
import { getAvailableArticlesAPIAction } from "../../api/priceListRegister";

interface PriceListArticleStepProps {
	articles: PriceListArticleRow[];
	onArticlesLoaded: (articles: PriceListArticleRow[]) => void;
	onToggleArticle: (id: string) => void;
	onToggleAll: () => void;
	onUpdateCustomPrice?: (id: string, price: string) => void;
}

type SortKey = keyof Pick<PriceListArticleRow, "articleNo" | "benamning" | "outPriceListA" | "calcCost" | "stock" | "reserved">;
type SortOrder = "asc" | "desc" | null;

export function PriceListArticleStep({ articles, onArticlesLoaded, onToggleArticle, onToggleAll, onUpdateCustomPrice }: PriceListArticleStepProps) {
	const t = useTranslate();
	const [searchQuery, setSearchQuery] = useState("");
	const [sortKey, setSortKey] = useState<SortKey | null>(null);
	const [sortOrder, setSortOrder] = useState<SortOrder>(null);
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const fetchArticles = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAvailableArticlesAPIAction({
				page: currentPage,
				limit: pageSize,
				search: searchQuery,
			});
			onArticlesLoaded(res.data);
		} catch {
			// Error handled in API action
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, pageSize, searchQuery, onArticlesLoaded]);

	useEffect(() => {
		void fetchArticles();
	}, [fetchArticles]);

	const filteredArticles = useMemo(() => {
		const result = [...articles];
		if (sortKey && sortOrder) {
			result.sort((a, b) => {
				const aVal = String(a[sortKey] ?? "");
				const bVal = String(b[sortKey] ?? "");
				const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
				return sortOrder === "desc" ? -cmp : cmp;
			});
		}
		return result;
	}, [articles, sortKey, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
	const paginatedArticles = filteredArticles.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const allOnPageSelected = paginatedArticles.length > 0 && paginatedArticles.every((a) => a.selected);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			if (sortOrder === "asc") setSortOrder("desc");
			else if (sortOrder === "desc") {
				setSortKey(null);
				setSortOrder(null);
			}
		} else {
			setSortKey(key);
			setSortOrder("asc");
		}
	};

	const SortIconComponent = ({ field }: { field: SortKey }) => {
		if (sortKey !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-400 shrink-0" />;
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	return (
		<Card className="border-0 rounded-none p-0">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-3 flex-1">
						<Search
							value={searchQuery}
							onChange={(value) => {
								setSearchQuery(value);
								setCurrentPage(1);
							}}
							placeholder={localizationConstants.search}
							className="h-10 flex-1 min-w-0 sm:flex-none sm:w-60 md:w-65 lg:w-75"
							wrapperClassName="flex-1 min-w-0 sm:flex-none sm:w-60 md:w-65 lg:w-75"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="h-10 w-full sm:w-18.75 sm:min-w-18.75 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-2.5 text-xs shadow-2xs justify-between"
								>
									<Translate text={localizationConstants.filter} />
									<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
								<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
									<Translate text={localizationConstants.priceListCategoryFilterAll} />
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
									<Translate text={localizationConstants.priceListCategoryFilterService} />
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
									<Translate text={localizationConstants.priceListCategoryFilterPrivate} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Button type="button" className="h-10 w-full sm:w-auto rounded gap-2 bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center shrink-0">
						<Import className="h-4 w-4" />
						<Translate text={localizationConstants.priceListImportArticlesButton} />
					</Button>
				</div>

				<div className="w-full overflow-x-auto relative bg-white">
					<Table className="w-full min-w-250 table-auto border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								<TableHead className="w-12 py-3.5 px-4 text-center">
									<Checkbox
										checked={allOnPageSelected}
										onCheckedChange={onToggleAll}
										aria-label={t(localizationConstants.priceListSelectAll)}
										className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
									/>
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("articleNo")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListArticleNoHeader} />
										<SortIconComponent field="articleNo" />
									</div>
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("benamning")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListDescriptionHeader} />
										<SortIconComponent field="benamning" />
									</div>
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("outPriceListA")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListOutPriceListAHeader} />
										<SortIconComponent field="outPriceListA" />
									</div>
								</TableHead>
								<TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-600 select-none whitespace-nowrap">
									<Translate text={localizationConstants.priceListCustomPriceHeader} />
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("calcCost")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListCalcCostHeader} />
										<SortIconComponent field="calcCost" />
									</div>
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("stock")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListStockHeader} />
										<SortIconComponent field="stock" />
									</div>
								</TableHead>
								<TableHead
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap"
									onClick={() => handleSort("reserved")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.priceListReservedHeader} />
										<SortIconComponent field="reserved" />
									</div>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={8} className="py-12 text-center">
										<div className="flex items-center justify-center gap-2 text-slate-500">
											<Loader2 className="h-4 w-4 animate-spin" />
											<Translate text={localizationConstants.genericLoading} />
										</div>
									</TableCell>
								</TableRow>
							) : paginatedArticles.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="py-12 text-center text-sm text-slate-500">
										<Translate text={localizationConstants.noDataFound} />
									</TableCell>
								</TableRow>
							) : (
								paginatedArticles.map((article) => (
									<TableRow
										key={article.id}
										className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
									>
										<TableCell className="py-3.5 px-4 text-center">
											<Checkbox
												checked={article.selected}
												onCheckedChange={() => onToggleArticle(article.id)}
												aria-label={`${article.articleNo}`}
												className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
											/>
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.articleNo}
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.benamning}
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.outPriceListA}
										</TableCell>
										<TableCell className="py-2 px-4 text-sm">
											<Input
												type="text"
												value={article.customPrice ?? article.outPriceListA}
												onChange={(e) =>
													onUpdateCustomPrice?.(article.id, e.target.value)
												}
												className="h-8 w-24 text-xs bg-white"
												placeholder={article.outPriceListA}
											/>
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.calcCost}
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.stock}
										</TableCell>
										<TableCell className="py-3.5 px-4 text-sm text-slate-700">
											{article.reserved}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<div className="border-t border-slate-200">
					<div className="flex items-center justify-center sm:justify-end gap-6 py-2 px-1 text-sm text-slate-600 flex-wrap">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.rowsPerPageLabel} />
							</span>
							<Select
								value={String(pageSize)}
								onValueChange={(value) => {
									setPageSize(Number(value));
									setCurrentPage(1);
								}}
							>
								<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
									<SelectValue placeholder={String(pageSize)} />
								</SelectTrigger>
								<SelectContent>
									{[5, 10, 20, 30].map((size) => (
										<SelectItem key={size} value={String(size)}>
											{size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
							<Translate text={localizationConstants.pageLabel} /> {currentPage}{" "}
							<Translate text={localizationConstants.ofLabel} /> {totalPages}
						</div>

						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								onClick={() => setCurrentPage(1)}
								disabled={currentPage <= 1}
							>
								<span className="sr-only">First page</span>
								<span className="text-xs">{"\u00AB"}</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage <= 1}
							>
								<span className="sr-only">Previous page</span>
								<span className="text-xs">{"\u2039"}</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage >= totalPages}
							>
								<span className="sr-only">Next page</span>
								<span className="text-xs">{"\u203A"}</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								onClick={() => setCurrentPage(totalPages)}
								disabled={currentPage >= totalPages}
							>
								<span className="sr-only">Last page</span>
								<span className="text-xs">{"\u00BB"}</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
