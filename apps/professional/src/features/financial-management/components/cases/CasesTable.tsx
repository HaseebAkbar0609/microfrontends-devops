"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem } from "../../types/cases.types";
import { CasesTableRow } from "./CasesTableRow";

interface CasesTableProps {
	items: CaseItem[];
	isLoading?: boolean;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function CasesTable({
	items,
	isLoading,
	onView,
	onEdit,
	onDelete,
}: CasesTableProps) {
	if (isLoading) {
		return (
			<div className="py-16 text-center text-xs text-slate-400">
				<Translate text={localizationConstants.casesLoading} />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="py-16 text-center text-xs text-slate-400 italic">
				<Translate text={localizationConstants.casesNoItemsFound} />
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-xs">
				<thead>
					<tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold tracking-wider uppercase text-[11px]">
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColId} />
						</th>
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColTitle} />
						</th>
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColCategory} />
						</th>
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColCreatedBy} />
						</th>
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColDate} />
						</th>
						<th className="py-3.5 px-4">
							<Translate text={localizationConstants.casesColStatus} />
						</th>
						{/* Empty header matching Figma */}
						<th className="py-3.5 px-4 text-right" />
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
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default CasesTable;
