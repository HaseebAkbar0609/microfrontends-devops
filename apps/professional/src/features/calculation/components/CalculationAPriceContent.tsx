"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";
import { APriceRow } from "../types/kalkyl";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
	"whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type SortField = keyof Pick<
	APriceRow,
	"artikel" | "benaming" | "specification" | "kategori" | "antal" | "enhet" | "aPrice"
>;

const KATEGORI_COLORS: Record<string, string> = {
	"Dörra & Fönster": "border-amber-300 bg-amber-50 text-amber-700",
	"Golv": "border-emerald-300 bg-emerald-50 text-emerald-700",
	"Badrum": "border-blue-300 bg-blue-50 text-blue-700",
};

function KategoriBadge({ kategori }: { kategori: string }) {
	const colorClass =
		KATEGORI_COLORS[kategori] ?? "border-slate-200 bg-slate-50 text-slate-700";
	return (
		<span
			className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${colorClass}`}
		>
			{kategori}
		</span>
	);
}

interface Props {
	items: APriceRow[];
}

export function CalculationAPriceContent({ items }: Props) {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;
	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		if (!q) return items;
		return items.filter(
			(item) =>
				item.artikel.toLowerCase().includes(q) ||
				item.benaming.toLowerCase().includes(q) ||
				item.specification.toLowerCase().includes(q) ||
				item.kategori.toLowerCase().includes(q),
		);
	}, [items, search]);

	const sorted = useMemo(
		() =>
			sortItems(
				filtered,
				sortField,
				sortDir,
				(item, field) => item[field as keyof APriceRow] as string | number,
			),
		[filtered, sortField, sortDir],
	);

	useEffect(() => {
		setPage(1);
	}, [items]);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Toolbar */}
			<div className="flex items-center gap-2 px-5 py-3">
				<div className="relative w-72">
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						aria-hidden
					/>
					<Input
						placeholder={t(localizationConstants.search)}
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
						>
							{t(localizationConstants.filter)}
							<ChevronDown size={14} aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44">
						<DropdownMenuItem
							className="cursor-pointer text-sm"
							onClick={() => setSearch("")}
						>
							{t(localizationConstants.adminUsersFilterAll)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="ml-auto">
					<Button
						size="sm"
						className="h-9 cursor-pointer gap-2 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
					>
						<Plus size={14} aria-hidden />
						{t(localizationConstants.calcAPrisCreate)}
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="flex flex-1 flex-col gap-4 px-5 py-2 pb-6">
				<div className="b2b-table-scroll overflow-x-auto">
					<table className="min-w-max w-full text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-white">
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("artikel")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcItemCol)}
										{renderSortIcon("artikel", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("benaming")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcAPrisNaming)}
										{renderSortIcon("benaming", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("specification")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcAPrisSpecification)}
										{renderSortIcon("specification", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("kategori")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.category)}
										{renderSortIcon("kategori", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("antal")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcQuantityCol)}
										{renderSortIcon("antal", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("enhet")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcUnitCol)}
										{renderSortIcon("enhet", sortField, sortDir)}
									</span>
								</th>
								<th
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("aPrice")}
								>
									<span className="flex items-center gap-1">
										{t(localizationConstants.calcAPriceCol)}
										{renderSortIcon("aPrice", sortField, sortDir)}
									</span>
								</th>
								<th scope="col" className={TH_PLAIN} />
							</tr>
						</thead>
						<tbody>
							{paginated.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="px-4 py-12 text-center text-sm text-slate-400"
									>
										{t(localizationConstants.noDataFound)}
									</td>
								</tr>
							) : (
								paginated.map((row) => (
									<tr
										key={row.id}
										className="group border-b border-slate-200 last:border-0 hover:bg-slate-50"
									>
										<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
											{row.artikel}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-800">
											{row.benaming}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{row.specification}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											<KategoriBadge kategori={row.kategori} />
										</td>
										<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
											{row.antal}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-600">
											{row.enhet}
										</td>
										<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-800">
											{formatCurrency(row.aPrice)}
										</td>
										<td
											className="whitespace-nowrap px-2 py-3"
											onClick={(e) => e.stopPropagation()}
										>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														className="cursor-pointer rounded p-1 text-slate-400 opacity-0 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
														aria-label="Row actions"
													>
														<MoreVertical size={16} aria-hidden />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-36">
													<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
														<Eye size={14} aria-hidden />
														{t(localizationConstants.calcAPrisOpen)}
													</DropdownMenuItem>
													<DropdownMenuItem className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
														<Trash2 size={14} aria-hidden />
														{t(localizationConstants.confirmRemove)}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<OfferTablePagination
					page={page}
					totalPages={totalPages}
					rowsPerPage={rowsPerPage}
					onPageChange={setPage}
				/>
			</div>
		</div>
	);
}
