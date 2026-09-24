"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Eye, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WageTypeItem, WageTypeStatus } from "../../types/wageTypes.types";
import {
	WAGE_TYPES_BASE_ROUTE,
	PERSONAL_TYPE_OPTIONS,
	WAGE_FORM_OPTIONS,
	TRANSACTION_TYPE_OPTIONS,
	UNIT_OPTIONS,
} from "../../constants/wageTypes.constants";

interface WageTypesOverviewTableProps {
	readonly data: WageTypeItem[];
	readonly isLoading: boolean;
	readonly totalItems: number;
	readonly page: number;
	readonly pageSize: number;
	readonly sortByParam?: string;
	readonly sortOrderParam?: "asc" | "desc";
	readonly selectedIds: string[];
	readonly isAllSelected: boolean;
	readonly onSort: (field: string) => void;
	readonly onPageChange: (page: number) => void;
	readonly onSelectAll: (checked: boolean) => void;
	readonly onSelectRow: (id: string, checked: boolean) => void;
	readonly onOpenDeleteDialog: (item: WageTypeItem) => void;
	readonly onBatchToggleStatus: (status: WageTypeStatus) => void;
	readonly onSingleToggleStatus: (item: WageTypeItem) => void;
}

export function WageTypesOverviewTable({
	data,
	isLoading,
	totalItems,
	page,
	pageSize,
	selectedIds,
	isAllSelected,
	onSort,
	onPageChange,
	onSelectAll,
	onSelectRow,
	onOpenDeleteDialog,
	onBatchToggleStatus,
	onSingleToggleStatus,
}: WageTypesOverviewTableProps) {
	const router = useRouter();

	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const personalTypeMap = useMemo(() => {
		const map: Record<string, string> = {};
		PERSONAL_TYPE_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const wageFormMap = useMemo(() => {
		const map: Record<string, string> = {};
		WAGE_FORM_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const transactionTypeMap = useMemo(() => {
		const map: Record<string, string> = {};
		TRANSACTION_TYPE_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const unitMap = useMemo(() => {
		const map: Record<string, string> = {};
		UNIT_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.displayShort;
		});
		return map;
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{/* Table Container */}
			<div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse min-w-[1100px]">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold text-slate-600 tracking-tight">
								<th className="w-10 px-3 py-3.5 text-center">
									<input
										type="checkbox"
										checked={isAllSelected}
										onChange={(e) => onSelectAll(e.target.checked)}
										className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
										aria-label="Select all"
									/>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("loneartId")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeIdHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("benamning")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeNameHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("personalTyp")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("enhet")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeUnitHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("loneform")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeWageFormHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("transaktionstyp")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("preliminarskatt")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypePreliminaryTaxHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("arbetsgivaravgift")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeEmployerContributionHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("skapad")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeCreatedAtHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("andrad")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeUpdatedAtHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("konto")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.wageTypeAccountHeader} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th
									className="px-3 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
									onClick={() => onSort("status")}
								>
									<div className="flex items-center gap-1">
										<Translate text={localizationConstants.statusLabel} />
										<ArrowUpDown className="h-3 w-3 text-slate-400" />
									</div>
								</th>
								<th className="w-20 px-3 py-3.5 text-right font-medium text-slate-500">
									<Translate text={localizationConstants.actions} />
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100 bg-white">
							{isLoading ? (
								<tr>
									<td colSpan={14} className="py-12 text-center text-slate-400">
										<div className="flex items-center justify-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin text-slate-400" />
											<Translate text={localizationConstants.loadingLabel} />
										</div>
									</td>
								</tr>
							) : data.length === 0 ? (
								<tr>
									<td colSpan={14} className="py-12 text-center text-slate-400">
										<Translate text={localizationConstants.noRecordsFound} />
									</td>
								</tr>
							) : (
								data.map((item) => {
									const isSelected = selectedIds.includes(item.id);
									return (
										<tr
											key={item.id}
											className={`hover:bg-slate-50/75 transition-colors ${
												isSelected ? "bg-slate-50/80" : ""
											}`}
										>
											<td className="px-3 py-3 text-center">
												<input
													type="checkbox"
													checked={isSelected}
													onChange={(e) => onSelectRow(item.id, e.target.checked)}
													className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
													aria-label={`Select ${item.benamning}`}
												/>
											</td>
											<td className="px-3 py-3 font-medium text-slate-900">
												{item.loneartId}
											</td>
											<td className="px-3 py-3 font-semibold text-slate-900">
												{item.benamning}
											</td>
											<td className="px-3 py-3 text-slate-700">
												{personalTypeMap[item.personalTyp] ? (
													<Translate text={personalTypeMap[item.personalTyp]} />
												) : (
													item.personalTyp
												)}
											</td>
											<td className="px-3 py-3 text-slate-700">
												{unitMap[item.enhet] || item.enhet}
											</td>
											<td className="px-3 py-3 text-slate-700">
												{wageFormMap[item.loneform] ? (
													<Translate text={wageFormMap[item.loneform]} />
												) : (
													item.loneform
												)}
											</td>
											<td className="px-3 py-3 text-slate-700">
												{transactionTypeMap[item.transaktionstyp] ? (
													<Translate text={transactionTypeMap[item.transaktionstyp]} />
												) : (
													item.transaktionstyp
												)}
											</td>
											<td className="px-3 py-3 text-slate-700 whitespace-nowrap">
												{item.preliminarskatt}
											</td>
											<td className="px-3 py-3 text-slate-700 whitespace-nowrap">
												{item.arbetsgivaravgift}
											</td>
											<td className="px-3 py-3 text-slate-500 whitespace-nowrap">
												{item.skapad}
											</td>
											<td className="px-3 py-3 text-slate-500 whitespace-nowrap">
												{item.andrad}
											</td>
											<td className="px-3 py-3 font-medium text-slate-900">
												{item.konto}
											</td>
											<td className="px-3 py-3">
												{item.status === "active" ? (
													<span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
														<Translate text={localizationConstants.activeStatus} />
													</span>
												) : (
													<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
														<Translate text={localizationConstants.inactiveStatus} />
													</span>
												)}
											</td>
											<td className="px-3 py-3 text-right">
												<div className="flex items-center justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => router.push(`${WAGE_TYPES_BASE_ROUTE}/${item.id}`)}
														className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
														aria-label={localizationConstants.ariaViewWageTypeDetails}
													>
														<Eye className="h-4 w-4" />
													</Button>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-40 bg-white border-slate-200 shadow-md">
															<DropdownMenuItem
																onClick={() => router.push(`${WAGE_TYPES_BASE_ROUTE}/${item.id}`)}
																className="text-xs cursor-pointer focus:bg-slate-100"
															>
																<Translate text={localizationConstants.editButtonText} />
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => onSingleToggleStatus(item)}
																className="text-xs cursor-pointer focus:bg-slate-100"
															>
																{item.status === "active" ? (
																	<Translate text={localizationConstants.deactivateButton} />
																) : (
																	<Translate text={localizationConstants.activateButton} />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => onOpenDeleteDialog(item)}
																className="text-xs text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
															>
																<Translate text={localizationConstants.deleteConfirmButton} />
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
			</div>

			{/* Bulk Actions (Bottom Left) & Pagination (Bottom Right) */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
				{/* Bulk Action Bar matching Figma Image 1 */}
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<span className="text-xs text-slate-500 font-medium">
						({selectedIds.length} <Translate text={localizationConstants.markedCountText} />)
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={selectedIds.length === 0}
						onClick={() => onBatchToggleStatus("inactive")}
						className="h-8 px-3 text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
					>
						<Translate text={localizationConstants.deactivateButton} />
					</Button>
					<Button
						variant="default"
						size="sm"
						disabled={selectedIds.length === 0}
						onClick={() => onBatchToggleStatus("active")}
						className="h-8 px-3 text-xs bg-[#111721] text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer shadow-2xs"
					>
						<Translate text={localizationConstants.activateButton} />
					</Button>
				</div>

				{/* Pagination Controls */}
				<div className="flex items-center gap-2">
					<span className="text-xs text-slate-500">
						{totalItems > 0
							? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalItems)} of ${totalItems}`
							: "0 of 0"}
					</span>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => onPageChange(page - 1)}
							className="h-8 w-8 p-0 text-xs border-slate-200 cursor-pointer"
							aria-label={localizationConstants.previousPageLabel}
						>
							&lt;
						</Button>
						<span className="text-xs font-semibold px-2 text-slate-700">
							{page} / {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => onPageChange(page + 1)}
							className="h-8 w-8 p-0 text-xs border-slate-200 cursor-pointer"
							aria-label={localizationConstants.nextPageLabel}
						>
							&gt;
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
