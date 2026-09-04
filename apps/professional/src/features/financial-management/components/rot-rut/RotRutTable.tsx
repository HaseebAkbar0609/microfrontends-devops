"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowUpDown,
	Eye,
	RotateCcw,
	Send,
	FileText,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutItem, RotRutSortColumn, RotRutCustomerLimit } from "../../types/rotRut.types";
import { PAGE_SIZE_OPTIONS } from "../../constants/rotRut.constants";

interface RotRutTableProps {
	items: RotRutItem[];
	totalCount: number;
	selectedIds: Set<string>;
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: () => void;
	sortBy: keyof RotRutItem;
	sortOrder: "asc" | "desc";
	onSort: (field: keyof RotRutItem) => void;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onViewDetails: (item: RotRutItem) => void;
	onSubmitSingle: (id: string) => void;
	customerLimits?: RotRutCustomerLimit[];
}

function formatCurrency(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}

export function RotRutTable({
	items,
	totalCount,
	selectedIds,
	onToggleSelect,
	onToggleSelectAll,
	sortBy,
	sortOrder,
	onSort,
	currentPage,
	pageSize,
	totalPages,
	onPageChange,
	onPageSizeChange,
	onViewDetails,
	onSubmitSingle,
	customerLimits = [],
}: RotRutTableProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);

	const customerLimitMap = React.useMemo(() => {
		const map = new Map<string, number>();
		customerLimits.forEach((c) => {
			map.set(c.customerName, c.remainingLimit);
		});
		return map;
	}, [customerLimits]);
	const allSelected = items.length > 0 && selectedIds.size === items.length;

	const renderSortIcon = (col: RotRutSortColumn) => {
		if (sortBy !== col) {
			return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
		}
		return (
			<ArrowUpDown
				className={`w-3 h-3 text-blue-600 transition-transform ${
					sortOrder === "asc" ? "rotate-180" : ""
				}`}
			/>
		);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
			{/* Table Structure */}
			<div className="overflow-x-auto">
				<table className="w-full text-xs text-left">
					<thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-medium">
						<tr>
							<th className="py-3 px-4 w-10">
								<Checkbox
									checked={allSelected}
									onCheckedChange={onToggleSelectAll}
									aria-label="Select all"
								/>
							</th>
							<th className="py-3 px-4 cursor-pointer" onClick={() => onSort("invoiceNo")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.rotRutColInvoiceNo} />
									{renderSortIcon("invoiceNo")}
								</div>
							</th>
							<th className="py-3 px-4 cursor-pointer" onClick={() => onSort("customerName")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.rotRutColCustomer} />
									{renderSortIcon("customerName")}
								</div>
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.rotRutColPropertyId} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.rotRutColType} />
							</th>
							<th className="py-3 px-4 text-right cursor-pointer" onClick={() => onSort("laborCost")}>
								<div className="flex items-center justify-end gap-1">
									<Translate text={localizationConstants.rotRutColLaborAmount} />
									{renderSortIcon("laborCost")}
								</div>
							</th>
							<th className="py-3 px-4 text-right cursor-pointer" onClick={() => onSort("deductionAmount")}>
								<div className="flex items-center justify-end gap-1">
									<Translate text={localizationConstants.rotRutColDeduction} />
									{renderSortIcon("deductionAmount")}
								</div>
							</th>
							<th className="py-3 px-4 text-center cursor-pointer" onClick={() => onSort("status")}>
								<div className="flex items-center justify-center gap-1">
									<Translate text={localizationConstants.rotRutColStatus} />
									{renderSortIcon("status")}
								</div>
							</th>
							<th className="py-3 px-4 text-right">
								<Translate text={localizationConstants.rotRutColActions} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-slate-700">
						{items.length === 0 ? (
							<tr>
								<td colSpan={9} className="py-12 text-center text-slate-500">
									<FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
									<p className="font-semibold text-sm text-slate-800">
										<Translate text={localizationConstants.rotRutNoRecords} />
									</p>
									<p className="text-xs text-slate-400 mt-1">
										<Translate text={localizationConstants.rotRutNoRecordsDesc} />
									</p>
								</td>
							</tr>
						) : (
							items.map((item) => {
								const isSelected = selectedIds.has(item.id);
								return (
									<tr
										key={item.id}
										className={`hover:bg-slate-50/70 transition-colors ${
											isSelected ? "bg-blue-50/30" : ""
										}`}
									>
										<td className="py-3 px-4">
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => onToggleSelect(item.id)}
												aria-label={`Select ${item.invoiceNo}`}
											/>
										</td>
										<td className="py-3 px-4 font-mono font-semibold text-blue-600 hover:underline">
											<Link href={`/module/financial-management/invoice/${item.invoiceId}`}>
												{item.invoiceNo}
											</Link>
										</td>
										<td className="py-3 px-4">
											<div className="font-semibold text-slate-900">{item.customerName}</div>
											<div className="text-[11px] text-slate-400 font-mono">
												{item.customerPersonalIdMasked}
											</div>
											{customerLimitMap.has(item.customerName) && (
												<div className="text-[10px] text-emerald-600 font-medium mt-0.5">
													{formatCurrency(customerLimitMap.get(item.customerName)!, currency)}{" "}
													<Translate text={localizationConstants.rotRutRemaining} />
												</div>
											)}
										</td>
										<td className="py-3 px-4 text-slate-600 font-medium">
											<span className="truncate max-w-[180px] block" title={item.propertyId}>
												{item.propertyId}
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider ${
													item.type === "rot"
														? "bg-indigo-50 text-indigo-700 border border-indigo-200"
														: "bg-violet-50 text-violet-700 border border-violet-200"
												}`}
											>
												{item.type.toUpperCase()}
											</span>
										</td>
										<td className="py-3 px-4 text-right font-medium text-slate-800 font-mono">
											{formatCurrency(item.laborCost, currency)}
										</td>
										<td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
											{formatCurrency(item.deductionAmount, currency)}
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
													item.status === "approved"
														? "bg-emerald-50 text-emerald-700 border-emerald-200"
														: item.status === "submitted"
															? "bg-blue-50 text-blue-700 border-blue-200"
															: item.status === "rejected"
																? "bg-rose-50 text-rose-700 border-rose-200"
																: "bg-amber-50 text-amber-700 border-amber-200"
												}`}
											>
												<Translate
													text={
														item.status === "approved"
															? localizationConstants.rotRutFilterStatusApproved
															: item.status === "submitted"
																? localizationConstants.rotRutFilterStatusSubmitted
																: item.status === "rejected"
																	? localizationConstants.rotRutFilterStatusRejected
																	: localizationConstants.rotRutFilterStatusPending
													}
												/>
											</span>
										</td>
										<td className="py-3 px-4 text-right">
											<div className="inline-flex items-center gap-1">
												{item.status === "rejected" && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => onViewDetails(item)}
														className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
														title={t(localizationConstants.rotRutActionResubmit)}
													>
														<RotateCcw className="w-3.5 h-3.5" />
													</Button>
												)}
												{item.status === "pending" && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => onSubmitSingle(item.id)}
														className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
														title={t(localizationConstants.rotRutActionSubmit)}
													>
														<Send className="w-3.5 h-3.5" />
													</Button>
												)}
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => onViewDetails(item)}
													className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
													title={t(localizationConstants.rotRutActionView)}
												>
													<Eye className="w-3.5 h-3.5" />
												</Button>
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Table Footer with Pagination */}
			<div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-600">
				<div className="flex items-center gap-2">
					<span>Visar</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => onPageSizeChange(Number(val))}
					>
						<SelectTrigger className="w-[70px] h-7 text-xs bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span>av {totalCount} rader</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
						className="h-7 w-7 border-slate-200"
					>
						<ChevronLeft className="w-3.5 h-3.5" />
					</Button>
					<span className="px-2 font-medium">
						Sida {currentPage} av {totalPages}
					</span>
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						className="h-7 w-7 border-slate-200"
					>
						<ChevronRight className="w-3.5 h-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
