"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
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
	onEdit?: (loan: BankLoanItem) => void;
	onDelete?: (id: string, title: string) => void;
	onCreateClick: () => void;
}

export function BankLoansTable({
	loans,
	sortBy,
	sortOrder,
	onSort,
	onView,
	onEdit,
	onDelete,
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
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/75 font-semibold text-slate-600 select-none">
							{/* ID */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("loanNr")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.fieldLoanNrOrId} />
									{renderSortIcon("loanNr")}
								</button>
							</th>

							{/* Villkorsnamn */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("title")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colVillkorsnamn} />
									{renderSortIcon("title")}
								</button>
							</th>

							{/* Leverantör / Bank */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("bank")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colLeverantor} />
									{renderSortIcon("bank")}
								</button>
							</th>

							{/* Betalningstid */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("startDate")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBetalningstid} />
									{renderSortIcon("startDate")}
								</button>
							</th>

							{/* Rabatt */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("endDate")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colRabatt} />
									{renderSortIcon("endDate")}
								</button>
							</th>

							{/* Dröjsmål */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("status")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colDrojsmal} />
									{renderSortIcon("status")}
								</button>
							</th>

							{/* Actions & Plus */}
							<th className="w-16 px-4 py-3.5 text-right">
								<button
									type="button"
									onClick={onCreateClick}
									className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
									aria-label="Add"
								>
									<Plus className="w-4 h-4" />
								</button>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100 bg-white">
						{loans.length === 0 ? (
							<tr>
								<td colSpan={7} className="py-12 text-center text-slate-500">
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
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default BankLoansTable;
