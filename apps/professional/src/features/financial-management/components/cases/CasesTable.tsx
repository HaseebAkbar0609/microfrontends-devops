"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem, CaseStatus } from "../../types/cases.types";
import { CasesTableRow } from "./CasesTableRow";

interface CasesTableProps {
	items: CaseItem[];
	isLoading?: boolean;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onConversation?: (id: string) => void;
	onStatusChange?: (id: string, newStatus: CaseStatus) => void;
}

export function CasesTable({
	items,
	isLoading,
	onView,
	onEdit,
	onDelete,
	onConversation,
	onStatusChange,
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
						<th className="py-3.5 px-6 font-medium">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.casesColCaseNumber} />
								<ArrowUpDown className="w-3 h-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-6 font-medium">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.casesColCategory} />
								<ArrowUpDown className="w-3 h-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-6 font-medium">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.casesColCreatedBy} />
								<ArrowUpDown className="w-3 h-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-6 font-medium">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.casesColDate} />
								<ArrowUpDown className="w-3 h-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-6 font-medium">
							<div className="flex items-center gap-1">
								<Translate text={localizationConstants.casesColStatus} />
								<ArrowUpDown className="w-3 h-3 text-slate-400" />
							</div>
						</th>
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
