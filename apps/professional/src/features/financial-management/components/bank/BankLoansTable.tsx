"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	BankLoanItem,
	BankSortField,
	SortOrder,
} from "../../types/bank.types";
import { BankLoansTableRow } from "./BankLoansTableRow";

interface BankLoansTableProps {
	loans: BankLoanItem[];
	sortBy: BankSortField;
	sortOrder: SortOrder;
	onSort: (field: BankSortField) => void;
	onView: (loan: BankLoanItem) => void;
	onCreateClick: () => void;
}

export function BankLoansTable({
	loans,
	sortBy,
	sortOrder,
	onSort,
	onView,
	onCreateClick,
}: BankLoansTableProps) {
	const renderSortIcon = (field: BankSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="w-3.5 h-3.5 text-slate-700" />
		) : (
			<ArrowDown className="w-3.5 h-3.5 text-slate-700" />
		);
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none">
							{/* Lån id */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("loanNr")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colLoanId} />
									{renderSortIcon("loanNr")}
								</button>
							</th>

							{/* Titel */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("title")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colLoanTitle} />
									{renderSortIcon("title")}
								</button>
							</th>

							{/* Lånetyp */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("loanType")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colLoanType} />
									{renderSortIcon("loanType")}
								</button>
							</th>

							{/* Bank */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("bank")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBank} />
									{renderSortIcon("bank")}
								</button>
							</th>

							{/* Start Datum */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("startDate")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colStartDate} />
									{renderSortIcon("startDate")}
								</button>
							</th>

							{/* Slut Datum */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("endDate")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colEndDate} />
									{renderSortIcon("endDate")}
								</button>
							</th>

							{/* Status */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("status")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colLoanStatus} />
									{renderSortIcon("status")}
								</button>
							</th>

							{/* Actions (Eye) */}
							<th className="w-12 px-4 py-3 text-right">
								<span className="sr-only">
									<Translate text={localizationConstants.titleLoanDetails} />
								</span>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{loans.length === 0 ? (
							<tr>
								<td colSpan={8} className="py-12 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center gap-2">
										<p className="font-semibold text-sm text-slate-700">
											<Translate text={localizationConstants.emptyLoansTitle} />
										</p>
										<p className="text-xs text-slate-500 max-w-sm">
											<Translate text={localizationConstants.emptyLoansDesc} />
										</p>
										<button
											type="button"
											onClick={onCreateClick}
											className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
										>
											<Translate text={localizationConstants.btnCreateNew} />
										</button>
									</div>
								</td>
							</tr>
						) : (
							loans.map((loan) => (
								<BankLoansTableRow
									key={loan.id}
									loan={loan}
									onView={onView}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
