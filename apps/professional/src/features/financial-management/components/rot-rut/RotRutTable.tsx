"use client";

import React from "react";
import { ArrowUpDown, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotRutItem, RotRutSortColumn, RotRutCustomerLimit } from "../../types/rotRut.types";
import { RotRutTableRow } from "./RotRutTableRow";
import { RotRutTablePagination } from "./RotRutTablePagination";

interface RotRutTableProps {
	items: RotRutItem[];
	totalCount: number;
	selectedIds: Set<string>;
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: () => void;
	sortBy: RotRutSortColumn;
	sortOrder: "asc" | "desc";
	onSort: (col: RotRutSortColumn) => void;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onResubmit: (item: RotRutItem) => void;
	onSubmitSingle: (id: string) => void;
	customerLimits?: RotRutCustomerLimit[];
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
	onResubmit,
	onSubmitSingle,
	customerLimits = [],
}: RotRutTableProps) {
	const { t, i18n } = useTranslation();
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
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-xs text-left">
					<thead className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 select-none">
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
							items.map((item) => (
								<RotRutTableRow
									key={item.id}
									item={item}
									isSelected={selectedIds.has(item.id)}
									onToggleSelect={onToggleSelect}
									currency={currency}
									language={i18n.language}
									customerLimit={customerLimitMap.get(item.customerName)}
									onSubmitSingle={onSubmitSingle}
									onResubmit={onResubmit}
								/>
							))
						)}
					</tbody>
				</table>
			</div>

			<RotRutTablePagination
				currentPage={currentPage}
				pageSize={pageSize}
				totalCount={totalCount}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	);
}
export default RotRutTable;
