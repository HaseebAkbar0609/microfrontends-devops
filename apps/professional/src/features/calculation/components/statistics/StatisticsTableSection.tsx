"use client";

import { ChevronDown, Check } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import type {
	CalculationStatRow,
	CalculationStatSortField,
} from "../../types/statistics";
import type { SortDir } from "@/utils/tableSort";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900";

interface StatisticsTableSectionProps {
	rows: CalculationStatRow[];
	isLoading?: boolean;
	search: string;
	onSearchChange: (val: string) => void;
	sortField: CalculationStatSortField | null;
	sortDir: SortDir;
	onToggleSort: (field: CalculationStatSortField) => void;
	page: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onViewList: (row: CalculationStatRow) => void;
}

export function StatisticsTableSection({
	rows,
	isLoading,
	search,
	onSearchChange,
	sortField,
	sortDir,
	onToggleSort,
	page,
	pageSize,
	totalPages,
	onPageChange,
	onPageSizeChange,
	onViewList,
}: StatisticsTableSectionProps) {
	return (
		<div className="flex flex-col gap-4">
			{/* Section Title */}
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.calcStatInfoTitle} />
			</h2>

			{/* Search & Filter Toolbar */}
			<div className="flex flex-wrap items-center gap-3">
				<Search
					value={search}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-9 w-full"
					wrapperClassName="w-64 sm:w-72"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown size={14} className="text-slate-500" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44 bg-white">
						<DropdownMenuItem
							className="cursor-pointer text-sm flex items-center justify-between"
							onClick={() => onSearchChange("")}
						>
							<Translate text={localizationConstants.adminUsersFilterAll} />
							{!search && <Check size={14} className="text-slate-900" />}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Data Table */}
			<div className="overflow-x-auto">
				<Table className="min-w-max w-full text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("datum")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.date} />
									{renderSortIcon("datum", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("bestellare")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcStatBestellare} />
									{renderSortIcon("bestellare", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("kategori")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.category} />
									{renderSortIcon("kategori", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("typ")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcProType} />
									{renderSortIcon("typ", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("entreprenadform")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcStatEntreprenadform} />
									{renderSortIcon("entreprenadform", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("antalOffert")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcStatAntalOffert} />
									{renderSortIcon("antalOffert", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("vunna")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcStatVunna} />
									{renderSortIcon("vunna", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className={TH_SORTABLE}
								onClick={() => onToggleSort("forlorade")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcStatForlorade} />
									{renderSortIcon("forlorade", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead scope="col" className="whitespace-nowrap px-3 py-3.5 text-right w-24" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{isLoading ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.genericLoading} />
								</TableCell>
							</TableRow>
						) : rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
									<Translate text={localizationConstants.noDataFound} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow
									key={row.id}
									className="group border-b border-slate-200 hover:bg-slate-50/75 transition-colors"
								>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal tabular-nums">
										{row.datum}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal truncate max-w-xs">
										{row.bestellare}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.kategori}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.typ}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.entreprenadform}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal tabular-nums">
										{row.antalOffert}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal tabular-nums">
										{row.vunna}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal tabular-nums">
										{row.forlorade}
									</TableCell>
									<TableCell className="whitespace-nowrap px-3 py-3.5 text-right">
										<Button
											type="button"
											size="sm"
											variant="outline"
											onClick={() => onViewList(row)}
											className="h-8 cursor-pointer border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 hover:bg-slate-50 shadow-none"
										>
											<Translate text={localizationConstants.calcStatSeList} />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="pt-2">
				<TablePagination
					currentPage={page}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				/>
			</div>
		</div>
	);
}
