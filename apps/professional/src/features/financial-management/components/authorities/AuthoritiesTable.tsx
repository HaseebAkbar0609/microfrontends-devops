"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	AuthorityItem,
	AuthoritySortField,
	AuthoritySortOrder,
} from "../../types/authorities.types";
import { AuthoritiesTableRow } from "./AuthoritiesTableRow";

interface AuthoritiesTableProps {
	items: AuthorityItem[];
	sortBy: AuthoritySortField;
	sortOrder: AuthoritySortOrder;
	onSort: (field: AuthoritySortField) => void;
	onView: (item: AuthorityItem) => void;
	onEdit: (item: AuthorityItem) => void;
	onDelete: (id: string, title: string) => void;
	onCreateClick: () => void;
}

export function AuthoritiesTable({
	items,
	sortBy,
	sortOrder,
	onSort,
	onView,
	onEdit,
	onDelete,
	onCreateClick,
}: AuthoritiesTableProps) {
	const renderSortIcon = (field: AuthoritySortField) => {
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
									onClick={() => onSort("caseNr")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colAuthorityId} />
									{renderSortIcon("caseNr")}
								</button>
							</th>

							{/* Kategori */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("category")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colAuthorityCategory} />
									{renderSortIcon("category")}
								</button>
							</th>

							{/* Datum */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("date")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colAuthorityDate} />
									{renderSortIcon("date")}
								</button>
							</th>

							{/* Dockumentets namn */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("documentName")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colAuthorityDocName} />
									{renderSortIcon("documentName")}
								</button>
							</th>

							{/* Fil */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("fileName")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colAuthorityFile} />
									{renderSortIcon("fileName")}
								</button>
							</th>

							{/* Header Actions & Plus Button */}
							<th className="w-16 px-4 py-3.5 text-right">
								<button
									type="button"
									onClick={onCreateClick}
									className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
									aria-label="Add"
								>
									<Plus className="w-4 h-4" />
								</button>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100 bg-white">
						{items.length === 0 ? (
							<tr>
								<td colSpan={6} className="py-12 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center gap-2">
										<p className="font-semibold text-sm text-slate-700">
											<Translate text={localizationConstants.emptyAuthoritiesTitle} />
										</p>
										<p className="text-xs text-slate-500 max-w-sm">
											<Translate text={localizationConstants.emptyAuthoritiesDesc} />
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
							items.map((item) => (
								<AuthoritiesTableRow
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

export default AuthoritiesTable;
