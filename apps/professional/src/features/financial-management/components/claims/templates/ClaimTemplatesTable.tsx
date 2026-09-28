"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	ClaimTemplate,
	ClaimTemplateSortColumn,
} from "../../../types/claims.types";
import { ClaimTemplatesTableRow } from "./ClaimTemplatesTableRow";

interface ClaimTemplatesTableProps {
	items: ClaimTemplate[];
	sortColumn: ClaimTemplateSortColumn;
	sortDirection: "asc" | "desc";
	onSort: (column: ClaimTemplateSortColumn) => void;
	onView: (template: ClaimTemplate) => void;
	onEdit: (template: ClaimTemplate) => void;
	onDelete: (template: ClaimTemplate) => void;
}

export function ClaimTemplatesTable({
	items,
	sortColumn,
	sortDirection,
	onSort,
	onView,
	onEdit,
	onDelete,
}: ClaimTemplatesTableProps) {
	const renderSortIcon = (col: ClaimTemplateSortColumn) => {
		const isCurrent = sortColumn === col;
		return (
			<ArrowUpDown
				className={`w-3.5 h-3.5 transition-transform ${
					isCurrent
						? sortDirection === "desc"
							? "text-slate-900 rotate-180"
							: "text-slate-900"
						: "text-slate-400 group-hover:text-slate-600"
				}`}
			/>
		);
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 select-none">
							{/* ID */}
							<th className="py-3.5 px-6">
								<button
									type="button"
									onClick={() => onSort("id")}
									className="group inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
								>
									<Translate text={localizationConstants.claimTplColId} />
									{renderSortIcon("id")}
								</button>
							</th>

							{/* Mall */}
							<th className="py-3.5 px-6">
								<button
									type="button"
									onClick={() => onSort("name")}
									className="group inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
								>
									<Translate text={localizationConstants.claimTplColMall} />
									{renderSortIcon("name")}
								</button>
							</th>

							{/* Title */}
							<th className="py-3.5 px-6">
								<button
									type="button"
									onClick={() => onSort("title")}
									className="group inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
								>
									<Translate text={localizationConstants.claimTplColTitle} />
									{renderSortIcon("title")}
								</button>
							</th>

							{/* senast uppdaterad */}
							<th className="py-3.5 px-6">
								<button
									type="button"
									onClick={() => onSort("updatedAt")}
									className="group inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-medium"
								>
									<Translate text={localizationConstants.claimTplColSenastUppdaterad} />
									{renderSortIcon("updatedAt")}
								</button>
							</th>

							{/* Eye Icon Header */}
							<th className="py-3.5 px-3 text-center w-12 font-medium text-slate-400">
								+
							</th>

							{/* Actions menu column */}
							<th className="py-3.5 px-3 w-12" />
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100 bg-white">
						{items.length === 0 ? (
							<tr>
								<td colSpan={6} className="py-12 text-center text-xs text-slate-400">
									<Translate text={localizationConstants.claimTplNoTemplatesFound} />
								</td>
							</tr>
						) : (
							items.map((template) => (
								<ClaimTemplatesTableRow
									key={template.id}
									template={template}
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

export default ClaimTemplatesTable;
