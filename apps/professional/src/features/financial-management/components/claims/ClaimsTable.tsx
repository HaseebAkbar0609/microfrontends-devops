"use client";

import React from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimItem } from "../../types/claims.types";
import { ClaimsTableRow } from "./ClaimsTableRow";

interface ClaimsTableProps {
	items: ClaimItem[];
	sortColumn: keyof ClaimItem;
	sortDirection: "asc" | "desc";
	onSort: (column: keyof ClaimItem) => void;
	onRowClick: (item: ClaimItem) => void;
	onEdit: (item: ClaimItem) => void;
	onDelete: (item: ClaimItem) => void;
	onCreateClick: () => void;
}

export function ClaimsTable({
	items,
	sortColumn,
	sortDirection,
	onSort,
	onRowClick,
	onEdit,
	onDelete,
	onCreateClick,
}: ClaimsTableProps) {
	const renderSortIcon = (column: keyof ClaimItem) => {
		const isSorted = sortColumn === column;
		return (
			<ArrowUpDown
				className={`w-3.5 h-3.5 transition-transform ${
					isSorted
						? sortDirection === "desc"
							? "text-slate-900 rotate-180"
							: "text-slate-900"
						: "text-slate-400"
				}`}
			/>
		);
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 select-none">
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("id")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColId} />
									{renderSortIcon("id")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("date")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColDate} />
									{renderSortIcon("date")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("object")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColObject} />
									{renderSortIcon("object")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("deficiencyType")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColType} />
									{renderSortIcon("deficiencyType")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("supplier")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColSupplier} />
									{renderSortIcon("supplier")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("responsible")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColResponsible} />
									{renderSortIcon("responsible")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("disputedAmount")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColAmount} />
									{renderSortIcon("disputedAmount")}
								</div>
							</th>
							<th
								className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
								onClick={() => onSort("status")}
							>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.claimsColStatus} />
									{renderSortIcon("status")}
								</div>
							</th>
							<th className="px-3 py-3.5 text-center w-12 border-l border-slate-200">
								<button
									type="button"
									onClick={onCreateClick}
									className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center justify-center"
									title="Skapa nytt"
								>
									<Plus className="w-4 h-4" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{items.length === 0 ? (
							<tr>
								<td colSpan={9} className="px-6 py-12 text-center text-slate-500 text-xs">
									<Translate text={localizationConstants.claimsNoItemsFound} />
								</td>
							</tr>
						) : (
							items.map((item, index) => (
								<ClaimsTableRow
									key={`${item.id}-${index}`}
									item={item}
									onRowClick={onRowClick}
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

export default ClaimsTable;
