"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { DeviceCategoryItem } from "../../types/dataIt.types";

interface DevicesByCategoryWidgetProps {
	categories: DeviceCategoryItem[];
}

export function DevicesByCategoryWidget({
	categories,
}: DevicesByCategoryWidgetProps) {
	if (categories.length === 0) {
		return (
			<div className="flex h-32 flex-col items-center justify-center text-center text-slate-500">
				<LayoutGrid className="mb-1 h-6 w-6 text-slate-400" />
				<p className="text-xs font-medium">
					<Translate text={localizationConstants.dataItEmptyCategoriesTitle} />
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2.5 pt-2">
			{categories.map((cat) => (
				<div key={cat.id} className="space-y-1">
					<div className="flex items-center justify-between text-xs font-medium">
						<span className="text-slate-700">
							<Translate text={cat.labelKey} />
						</span>
						<span className="text-slate-500">
							{cat.count}{" "}
							<Translate text={localizationConstants.dataItUnits} /> (
							{cat.percentage}%)
						</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
						<div
							className={`h-full rounded-full ${cat.colorClass}`}
							style={{ width: `${cat.percentage}%` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

export default DevicesByCategoryWidget;

