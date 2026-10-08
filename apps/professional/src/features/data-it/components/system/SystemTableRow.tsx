"use client";

import React from "react";
import { Eye, MoreVertical } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_CATEGORY_TRANSLATION_MAP,
	SYSTEM_STATUS_BADGE_CONFIG,
} from "@/features/data-it/constants/dataItSystem.constants";
import type { SystemItem } from "@/features/data-it/types/dataItSystem.types";

interface SystemTableRowProps {
	item: SystemItem;
	onViewDetail: (id: string) => void;
	onEdit?: (item: SystemItem) => void;
}

export const SystemTableRow: React.FC<SystemTableRowProps> = ({
	item,
	onViewDetail,
	onEdit,
}) => {
	const t = useTranslate();
	const statusConfig = SYSTEM_STATUS_BADGE_CONFIG[item.status];
	const categoryLabel =
		SYSTEM_CATEGORY_TRANSLATION_MAP[item.category]
			? t(SYSTEM_CATEGORY_TRANSLATION_MAP[item.category])
			: item.categoryLabel;

	return (
		<tr className="border-b border-slate-100 text-sm transition-colors hover:bg-slate-50/70">
			{/* System-ID */}
			<td className="py-4 pl-4 pr-3 font-medium text-slate-900">
				<button
					type="button"
					onClick={() => onViewDetail(item.id)}
					className="text-slate-800 hover:text-slate-600 hover:underline"
				>
					{item.systemId}
				</button>
			</td>

			{/* Category badge */}
			<td className="px-3 py-4">
				<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100/80 px-2.5 py-0.5 text-xs font-medium text-slate-700">
					{categoryLabel}
				</span>
			</td>

			{/* Program name */}
			<td className="px-3 py-4 font-semibold text-slate-900">
				{item.program}
			</td>

			{/* Status badge */}
			<td className="px-3 py-4">
				<span
					className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
				>
					{t(statusConfig.labelKey)}
				</span>
			</td>

			{/* Price */}
			<td className="px-3 py-4 text-slate-600">
				{item.pricePerMonth} {t(localizationConstants.dataItSystemPricePerMonthUnit)}
			</td>

			{/* Actions */}
			<td className="py-4 pl-3 pr-4 text-right">
				<div className="flex items-center justify-end gap-1">
					<button
						type="button"
						onClick={() => onViewDetail(item.id)}
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
						title={t(localizationConstants.dataItSystemActionView)}
						aria-label={t(localizationConstants.dataItSystemActionView)}
					>
						<Eye className="h-4 w-4" />
					</button>

					{onEdit && (
						<button
							type="button"
							onClick={() => onEdit(item)}
							className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
							aria-label={t(localizationConstants.dataItSystemAriaActions)}
						>
							<MoreVertical className="h-4 w-4" />
						</button>
					)}
				</div>
			</td>
		</tr>
	);
};

export default SystemTableRow;
