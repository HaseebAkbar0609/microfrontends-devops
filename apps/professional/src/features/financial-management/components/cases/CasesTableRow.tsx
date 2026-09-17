"use client";

import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem } from "../../types/cases.types";
import { CaseStatusBadge, getCategoryLabelKey } from "./shared";

interface CasesTableRowProps {
	item: CaseItem;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function CasesTableRow({
	item,
	onView,
	onEdit,
	onDelete,
}: CasesTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr
			onClick={() => onView(item.id)}
			className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 cursor-pointer group"
		>
			<td className="py-3.5 px-4 font-semibold text-slate-900 text-xs whitespace-nowrap">
				#{item.caseNumber || item.id}
			</td>

			<td className="py-3.5 px-4 text-slate-800 text-xs font-medium max-w-xs truncate">
				{item.title}
			</td>

			<td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
				<Translate text={getCategoryLabelKey(item.category)} />
			</td>

			<td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
				{item.createdBy}
			</td>

			<td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
				{item.date}
			</td>

			<td className="py-3.5 px-4 whitespace-nowrap">
				<CaseStatusBadge status={item.status} />
			</td>

			<td
				className="py-3.5 px-4 text-right whitespace-nowrap"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
					<button
						type="button"
						onClick={() => onView(item.id)}
						className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
						title={t(localizationConstants.casesActionView)}
						aria-label={t(localizationConstants.casesActionView)}
					>
						<Eye className="w-3.5 h-3.5" />
					</button>

					<button
						type="button"
						onClick={() => onEdit(item.id)}
						className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
						title={t(localizationConstants.casesBtnEdit)}
						aria-label={t(localizationConstants.casesBtnEdit)}
					>
						<Edit2 className="w-3.5 h-3.5" />
					</button>

					<button
						type="button"
						onClick={() => onDelete(item.id)}
						className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
						title={t(localizationConstants.casesBtnDelete)}
						aria-label={t(localizationConstants.casesBtnDelete)}
					>
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</td>
		</tr>
	);
}

export default CasesTableRow;
