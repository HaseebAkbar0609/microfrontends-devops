"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
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
	onDelete: (item: AuthorityItem) => void;
	onCreateClick: () => void;
}

export function AuthoritiesTable({
	items,
	sortBy,
	sortOrder,
	onSort,
	onDelete,
	onCreateClick,
}: AuthoritiesTableProps) {
	const { t } = useTranslation();

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
		<div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/50 font-semibold text-slate-500 uppercase tracking-wider text-[11px] select-none">
							{/* ID */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("caseNr")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colAuthorityId} />
									{renderSortIcon("caseNr")}
								</button>
							</th>

							{/* Authority */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("authorityName")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.fieldAuthorityName} />
									{renderSortIcon("authorityName")}
								</button>
							</th>

							{/* Category */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("category")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colAuthorityCategory} />
									{renderSortIcon("category")}
								</button>
							</th>

							{/* Date */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("date")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colAuthorityDate} />
									{renderSortIcon("date")}
								</button>
							</th>

							{/* Document Name */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("documentName")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colAuthorityDocName} />
									{renderSortIcon("documentName")}
								</button>
							</th>

							{/* File */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("fileName")}
									className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Translate text={localizationConstants.colAuthorityFile} />
									{renderSortIcon("fileName")}
								</button>
							</th>

							{/* Header Actions & Plus Button */}
							<th className="w-16 px-4 py-3 text-right">
								<button
									type="button"
									onClick={onCreateClick}
									title={t(localizationConstants.btnAddAuthority)}
									aria-label={t(localizationConstants.btnAddAuthority)}
									className="p-1 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
								>
									<Plus className="w-4 h-4" />
								</button>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100 bg-white">
						{items.length === 0 ? (
							<tr>
								<td colSpan={7} className="py-12 text-center text-slate-400">
									<Translate text={localizationConstants.emptyAuthoritiesTitle} />
								</td>
							</tr>
						) : (
							items.map((item) => (
								<AuthoritiesTableRow
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

export default AuthoritiesTable;
