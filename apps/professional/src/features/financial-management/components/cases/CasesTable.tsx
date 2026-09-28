"use client";

import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { SortDir } from "@/utils/tableSort";
import type { CaseItem, CaseStatus } from "../../types/cases.types";
import type { CaseSortField } from "../../utils/cases";
import { CasesTableRow } from "./CasesTableRow";

/** The register's sortable columns, in the frame's order. */
const COLUMNS: { key: CaseSortField; labelKey: TranslationKeys }[] = [
	{ key: "caseNumber", labelKey: localizationConstants.casesColCaseNumber },
	{ key: "category", labelKey: localizationConstants.casesColCategory },
	{ key: "createdBy", labelKey: localizationConstants.casesColCreatedBy },
	{ key: "date", labelKey: localizationConstants.casesColDate },
	{ key: "status", labelKey: localizationConstants.casesColStatus },
];

interface CasesTableProps {
	items: CaseItem[];
	isLoading?: boolean;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onConversation?: (id: string) => void;
	onStatusChange?: (id: string, newStatus: CaseStatus) => void;
	sortField?: CaseSortField | null;
	sortDir?: SortDir;
	onSort?: (field: CaseSortField) => void;
}

/**
 * One column heading. The frame draws a sort arrow on every column, so each is
 * a real button that announces which way it is sorting — the arrow stopped
 * being decoration.
 */
function SortableHeading({
	column,
	active,
	dir,
	onSort,
}: {
	column: { key: CaseSortField; labelKey: TranslationKeys };
	active: boolean;
	dir: SortDir;
	onSort?: (field: CaseSortField) => void;
}) {
	const Icon = active && dir === "asc" ? ArrowUp : active && dir === "desc" ? ArrowDown : ArrowUpDown;

	return (
		<th
			className="py-3.5 px-6 font-medium"
			aria-sort={active && dir === "asc" ? "ascending" : active && dir === "desc" ? "descending" : "none"}
		>
			<button
				type="button"
				onClick={onSort ? () => onSort(column.key) : undefined}
				disabled={!onSort}
				className="flex cursor-pointer items-center gap-1 font-medium text-slate-500 hover:text-slate-900 disabled:cursor-default disabled:hover:text-slate-500"
			>
				<Translate text={column.labelKey} />
				<Icon className={`w-3 h-3 ${active ? "text-slate-900" : "text-slate-400"}`} aria-hidden />
			</button>
		</th>
	);
}

export function CasesTable({
	items,
	isLoading,
	onView,
	onEdit,
	onDelete,
	onConversation,
	onStatusChange,
	sortField = null,
	sortDir = null,
	onSort,
}: CasesTableProps) {
	if (isLoading) {
		return (
			<div className="py-20 text-center text-xs text-slate-400">
				<Translate text={localizationConstants.casesLoading} />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="py-20 text-center text-xs text-slate-400 italic">
				<Translate text={localizationConstants.casesNoItemsFound} />
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-xs">
				<thead>
					<tr className="border-b border-slate-200 text-slate-500 font-medium text-xs">
						{COLUMNS.map((column) => (
							<SortableHeading
								key={column.key}
								column={column}
								active={sortField === column.key}
								dir={sortDir}
								onSort={onSort}
							/>
						))}
						{/* Action column matching Figma Image 1 */}
						<th className="py-3.5 px-6 text-right w-24" />
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 bg-white">
					{items.map((item) => (
						<CasesTableRow
							key={item.id}
							item={item}
							onView={onView}
							onEdit={onEdit}
							onDelete={onDelete}
							onConversation={onConversation}
							onStatusChange={onStatusChange}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default CasesTable;
