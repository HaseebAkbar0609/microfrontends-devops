"use client";

import React from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
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
	onDelete: (item: YearEndItem) => void;
	onCreateClick: () => void;
}

export function YearEndTable({
	items,
	totalCount: _totalCount,
	sortBy: _sortBy,
	sortOrder: _sortOrder,
	onSort,
	onDelete,
	onCreateClick,
}: YearEndTableProps) {
	const { t } = useTranslation();

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
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colSrNr} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Category */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("category")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colCategory} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* Description / Period */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("name")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colNameOrPeriod} />
									<ArrowUpDown className="h-3 w-3" />
								</button>
							</th>

							{/* File */}
							<th className="py-3 px-4">
								<button
									type="button"
									onClick={() => onSort("fileName")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
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
									title={t(localizationConstants.btnAddYearEnd)}
									aria-label={t(localizationConstants.btnAddYearEnd)}
									className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
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
