"use client";

import React from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { YearEndTableRow } from "./YearEndTableRow";
import type {
	YearEndItem,
	YearEndSortField,
	YearEndSortOrder,
} from "../../types/yearEnd.types";

interface YearEndTableProps {
	items: YearEndItem[];
	totalCount: number;
	sortBy: YearEndSortField;
	sortOrder: YearEndSortOrder;
	onSort: (field: YearEndSortField) => void;
	onView: (item: YearEndItem) => void;
	onEdit: (item: YearEndItem) => void;
	onDelete: (item: YearEndItem) => void;
	onCreateClick: () => void;
}

export function YearEndTable({
	items,
	totalCount: _totalCount,
	sortBy: _sortBy,
	sortOrder: _sortOrder,
	onSort,
	onView,
	onEdit,
	onDelete,
	onCreateClick,
}: YearEndTableProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-xs border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
							{/* Sr. Nr */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("srNr")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors"
								>
									<Translate text={localizationConstants.colSrNr} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Kategori */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("category")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors"
								>
									<Translate text={localizationConstants.colCategory} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Benämning */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("name")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors"
								>
									<Translate text={localizationConstants.colNameOrPeriod} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Fil */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("fileName")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors"
								>
									<Translate text={localizationConstants.colFile} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Header + Action */}
							<th className="py-3 px-4 text-right">
								<button
									type="button"
									onClick={onCreateClick}
									title="Lägg till nytt"
									className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
								>
									<Plus className="h-4 w-4" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{items.length === 0 ? (
							<tr>
								<td colSpan={5} className="py-12 text-center text-slate-400">
									<Translate text={localizationConstants.emptyYearEndTitle} />
								</td>
							</tr>
						) : (
							items.map((item) => (
								<YearEndTableRow
									key={item.id}
									item={item}
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

export default YearEndTable;
