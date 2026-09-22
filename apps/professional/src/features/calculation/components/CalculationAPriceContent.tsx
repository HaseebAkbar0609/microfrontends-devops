"use client";

import {
	ChevronDown,
	Eye,
	MoreVertical,
	Plus,
	Trash2,
	Check,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { showToast } from "@/lib/toast";
import { useAPriceList } from "../hooks/useAPriceList";
import type { APriceRow } from "../types/kalkyl";

interface Props {
	items?: APriceRow[];
}

export function CalculationAPriceContent({}: Props = {}) {
	const t = useTranslate();
	const {
		items,
		totalCount,
		isLoading,
		search,
		setSearch,
		selectedCategory,
		setSelectedCategory,
		categories,
		page,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		deleteItemTarget,
		setDeleteItemTarget,
		handleDeleteItem,
	} = useAPriceList();

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
				{/* Search Input */}
				<Search
					value={search}
					onChange={setSearch}
					placeholder={localizationConstants.search}
					className="h-9 w-full"
					wrapperClassName="w-64 sm:w-72"
				/>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none"
						>
							{selectedCategory === "all" ? (
								<Translate text={localizationConstants.filter} />
							) : (
								selectedCategory
							)}
							<ChevronDown size={14} className="text-slate-500" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-52 bg-white">
						<DropdownMenuItem
							className="cursor-pointer text-sm flex items-center justify-between"
							onClick={() => setSelectedCategory("all")}
						>
							<Translate text={localizationConstants.adminUsersFilterAll} />
							{selectedCategory === "all" && <Check size={14} className="text-slate-900" />}
						</DropdownMenuItem>
						{categories.map((cat) => (
							<DropdownMenuItem
								key={cat}
								className="cursor-pointer text-sm flex items-center justify-between"
								onClick={() => setSelectedCategory(cat)}
							>
								{cat}
								{selectedCategory === cat && <Check size={14} className="text-slate-900" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Create New Button */}
				<div className="ml-auto">
					<Button
						size="sm"
						onClick={() => showToast("info", t(localizationConstants.comingSoon))}
						className="h-9 cursor-pointer gap-1.5 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white hover:bg-neutral-800 shadow-none"
					>
						<Plus size={14} aria-hidden />
						<Translate text={localizationConstants.calcAPrisCreate} />
					</Button>
				</div>
			</div>

			{/* Data Table */}
			<div className="flex flex-1 flex-col px-5 py-2">
				<Table className="min-w-max w-full text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("artikel")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcItemCol} />
									{renderSortIcon("artikel", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("benaming")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcAPrisNaming} />
									{renderSortIcon("benaming", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("specification")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcAPrisSpecification} />
									{renderSortIcon("specification", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("kategori")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.category} />
									{renderSortIcon("kategori", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("antal")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcQuantityCol} />
									{renderSortIcon("antal", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("enhet")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcUnitCol} />
									{renderSortIcon("enhet", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead
								scope="col"
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
								onClick={() => toggleSort("aPrice")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.calcAPriceCol} />
									{renderSortIcon("aPrice", sortField, sortDir)}
								</span>
							</TableHead>
							<TableHead scope="col" className="whitespace-nowrap px-3 py-3 text-right text-sm font-medium text-slate-500 border-l border-slate-200 w-12" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{isLoading ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.genericLoading} />
								</TableCell>
							</TableRow>
						) : items.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={8}
									className="px-4 py-12 text-center text-sm text-slate-400"
								>
									<Translate text={localizationConstants.noDataFound} />
								</TableCell>
							</TableRow>
						) : (
							items.map((row) => (
								<TableRow
									key={row.id}
									className="group border-b border-slate-200 hover:bg-slate-50/75 transition-colors"
								>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.artikel}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.benaming}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.specification}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5">
										<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-normal text-slate-900">
											{row.kategori}
										</span>
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 tabular-nums text-sm text-slate-900 font-normal">
										{row.antal}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 font-normal">
										{row.enhet}
									</TableCell>
									<TableCell className="whitespace-nowrap px-4 py-3.5 tabular-nums text-sm text-slate-900 font-normal">
										{formatCurrency(row.aPrice)}
									</TableCell>
									<TableCell
										className="whitespace-nowrap px-3 py-3.5 text-right border-l border-slate-200"
										onClick={(e) => e.stopPropagation()}
									>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 cursor-pointer rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
													aria-label={t(localizationConstants.actionsAriaLabel)}
												>
													<MoreVertical size={16} aria-hidden />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 bg-white">
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 focus:bg-slate-100"
													onClick={() => showToast("info", t(localizationConstants.comingSoon))}
												>
													<Eye size={14} className="text-slate-900" aria-hidden />
													<Translate text={localizationConstants.calcAPrisOpen} />
												</DropdownMenuItem>
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 focus:bg-slate-100"
													onClick={() => setDeleteItemTarget(row)}
												>
													<Trash2 size={14} className="text-slate-900" aria-hidden />
													<Translate text={localizationConstants.deleteLabel} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{/* Pagination */}
				{totalCount > 0 && (
					<TablePagination
						currentPage={page}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
				)}
			</div>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog
				open={!!deleteItemTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteItemTarget(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(localizationConstants.deleteConfirmationTitle)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.deleteConfirmationDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							{t(localizationConstants.cancel)}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteItemTarget) {
									void handleDeleteItem(deleteItemTarget.id);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.deleteLabel)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
