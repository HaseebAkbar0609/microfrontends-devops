"use client";

import React, { useMemo } from "react";
import { Eye, ArrowUpDown, MoreVertical } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccountPlanOverview } from "@/features/financial-management/hooks/useAccountPlanOverview";
import type { AccountPlanItem } from "@/features/financial-management/types/accountPlan.types";
import { AccountPlanOverviewToolbar } from "./AccountPlanOverviewToolbar";
import { AccountDeleteDialog } from "./AccountDeleteDialog";

export function AccountPlanOverviewTable() {
	const {
		accounts,
		totalItems,
		isLoading,
		searchQuery,
		statusParam,
		page,
		pageSize,
		selectedIds,
		deletingItem,
		setDeletingItem,
		handleSearchChange,
		handleStatusFilterChange,
		handleSort,
		handlePageChange,
		handleToggleSelectRow,
		handleToggleSelectAll,
		handleBulkUpdateStatus,
		handleDelete,
		navigateToDetail,
	} = useAccountPlanOverview();

	const isAllSelected = useMemo(
		() => accounts.length > 0 && selectedIds.length === accounts.length,
		[accounts.length, selectedIds.length],
	);

	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	return (
		<div className="flex flex-col gap-6">
			{/* Toolbar with Subtabs, Heading, Search & Actions */}
			<AccountPlanOverviewToolbar
				searchQuery={searchQuery}
				statusParam={statusParam}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
			/>

			{/* Custom Responsive Table matching Figma Exactly */}
			<div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm border-collapse min-w-[800px]">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
								<th className="w-12 px-4 py-3.5 text-center">
									<input
										type="checkbox"
										checked={isAllSelected}
										onChange={handleToggleSelectAll}
										className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
										aria-label="Select all"
									/>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("kontoNr")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.accountNumberHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("benamning")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.accountNameHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("momskod")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.vatCodeHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("sru")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.sruHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("automatkont")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.autoAccountHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("ingaendeBalans")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.openingBalanceHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th
									className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => handleSort("budget")}
								>
									<div className="flex items-center gap-1.5">
										<Translate text={localizationConstants.budgetHeader} />
										<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
									</div>
								</th>
								<th className="w-20 px-4 py-3.5 text-center">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{isLoading ? (
								<tr>
									<td colSpan={9} className="py-12 text-center text-slate-500">
										<Translate text={localizationConstants.loading} />...
									</td>
								</tr>
							) : accounts.length === 0 ? (
								<tr>
									<td colSpan={9} className="py-12 text-center text-slate-500">
										<Translate text={localizationConstants.noResults} />
									</td>
								</tr>
							) : (
								accounts.map((row: AccountPlanItem) => {
									const isChecked = selectedIds.includes(row.id);
									return (
										<tr
											key={row.id}
											className={`hover:bg-slate-50/80 transition-colors ${
												isChecked ? "bg-slate-50" : ""
											}`}
										>
											<td className="px-4 py-3 text-center">
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() => handleToggleSelectRow(row.id)}
													className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
													aria-label={`Select ${row.kontoNr}`}
												/>
											</td>
											<td className="px-4 py-3 font-semibold text-slate-900">
												<button
													type="button"
													onClick={() => navigateToDetail(row.id)}
													className="hover:underline text-left cursor-pointer"
												>
													{row.kontoNr}
												</button>
											</td>
											<td className="px-4 py-3 text-slate-700 font-medium">
												<button
													type="button"
													onClick={() => navigateToDetail(row.id)}
													className="hover:underline text-left cursor-pointer"
												>
													{row.benamning}
												</button>
											</td>
											<td className="px-4 py-3 text-slate-600">{row.momskod}</td>
											<td className="px-4 py-3 text-slate-600">{row.sru}</td>
											<td className="px-4 py-3 text-slate-600">{row.automatkont}</td>
											<td className="px-4 py-3 text-slate-600">{row.ingaendeBalans}</td>
											<td className="px-4 py-3 text-slate-600">{row.budget}</td>
											<td className="px-4 py-3 text-center">
												<div className="flex items-center justify-center gap-1">
													<button
														type="button"
														onClick={() => navigateToDetail(row.id)}
														className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
														title="Visa detaljer"
													>
														<Eye className="h-4 w-4" />
													</button>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-36 bg-white border-slate-200">
															<DropdownMenuItem
																onClick={() => navigateToDetail(row.id)}
																className="cursor-pointer text-xs"
															>
																<Translate text={localizationConstants.viewLabel} />
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => setDeletingItem(row)}
																className="cursor-pointer text-xs text-red-600 focus:text-red-600"
															>
																<Translate text={localizationConstants.deleteLabel} />
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Table Footer with Batch Selection & Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 bg-white">
					{/* Batch selection status & actions */}
					<div className="flex items-center gap-3">
						<span className="text-xs text-slate-500 font-medium">
							({selectedIds.length} <Translate text={localizationConstants.selectedCountLabel} />)
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={selectedIds.length === 0}
							onClick={() => handleBulkUpdateStatus("inactive")}
							className="h-8 border-slate-200 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
						>
							<Translate text={localizationConstants.deactivateButton} />
						</Button>
						<Button
							size="sm"
							disabled={selectedIds.length === 0}
							onClick={() => handleBulkUpdateStatus("active")}
							className="h-8 bg-[#111721] hover:bg-slate-800 text-xs text-white disabled:opacity-40 cursor-pointer"
						>
							<Translate text={localizationConstants.activateButton} />
						</Button>
					</div>

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => handlePageChange(page - 1)}
								className="h-8 px-3 text-xs border-slate-200"
							>
								<Translate text={localizationConstants.previous} />
							</Button>
							<span className="text-xs text-slate-600">
								{page} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages}
								onClick={() => handlePageChange(page + 1)}
								className="h-8 px-3 text-xs border-slate-200"
							>
								<Translate text={localizationConstants.next} />
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Delete Modal */}
			<AccountDeleteDialog
				deletingItem={deletingItem}
				onClose={() => setDeletingItem(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
