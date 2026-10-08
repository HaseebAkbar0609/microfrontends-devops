"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	SystemItem,
	SystemSortField,
} from "@/features/data-it/types/dataItSystem.types";
import { SystemTableRow } from "./SystemTableRow";

interface SystemTableProps {
	items: SystemItem[];
	sortField: SystemSortField;
	sortDir: "asc" | "desc";
	onSort: (field: SystemSortField) => void;
	onViewDetail: (id: string) => void;
	onEdit?: (item: SystemItem) => void;
	onClearFilters?: () => void;
}

export const SystemTable: React.FC<SystemTableProps> = ({
	items,
	sortField,
	sortDir,
	onSort,
	onViewDetail,
	onEdit,
	onClearFilters,
}) => {
	const t = useTranslate();

	const renderSortIcon = (field: SystemSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
		}
		return sortDir === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900" />
		);
	};

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500">
							{/* System-ID */}
							<th className="py-3.5 pl-4 pr-3">
								<button
									type="button"
									onClick={() => onSort("systemId")}
									className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
								>
									<span>{t(localizationConstants.dataItSystemColSystemId)}</span>
									{renderSortIcon("systemId")}
								</button>
							</th>

							{/* Kategori */}
							<th className="px-3 py-3.5">
								<button
									type="button"
									onClick={() => onSort("category")}
									className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
								>
									<span>{t(localizationConstants.dataItSystemColCategory)}</span>
									{renderSortIcon("category")}
								</button>
							</th>

							{/* Program */}
							<th className="px-3 py-3.5">
								<button
									type="button"
									onClick={() => onSort("program")}
									className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
								>
									<span>{t(localizationConstants.dataItSystemColProgram)}</span>
									{renderSortIcon("program")}
								</button>
							</th>

							{/* Status */}
							<th className="px-3 py-3.5">
								<button
									type="button"
									onClick={() => onSort("status")}
									className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
								>
									<span>{t(localizationConstants.dataItSystemColStatus)}</span>
									{renderSortIcon("status")}
								</button>
							</th>

							{/* Pris */}
							<th className="px-3 py-3.5">
								<button
									type="button"
									onClick={() => onSort("price")}
									className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
								>
									<span>{t(localizationConstants.dataItSystemColPrice)}</span>
									{renderSortIcon("price")}
								</button>
							</th>

							{/* Action column header */}
							<th className="py-3.5 pl-3 pr-4 text-right">
								<span className="inline-flex items-center justify-end text-slate-400">
									<Plus className="h-4 w-4" />
								</span>
							</th>
						</tr>
					</thead>

					<tbody>
						{items.length === 0 ? (
							<tr>
								<td colSpan={6} className="py-12 text-center">
									<div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
										<p className="text-sm font-semibold text-slate-900">
											{t(localizationConstants.dataItSystemEmptyTitle)}
										</p>
										<p className="mt-1 text-xs text-slate-500">
											{t(localizationConstants.dataItSystemEmptyDesc)}
										</p>
										{onClearFilters && (
											<button
												type="button"
												onClick={onClearFilters}
												className="mt-3.5 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
											>
												{t(localizationConstants.dataItSystemClearFilters)}
											</button>
										)}
									</div>
								</td>
							</tr>
						) : (
							items.map((item) => (
								<SystemTableRow
									key={item.id}
									item={item}
									onViewDetail={onViewDetail}
									onEdit={onEdit}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SystemTable;
