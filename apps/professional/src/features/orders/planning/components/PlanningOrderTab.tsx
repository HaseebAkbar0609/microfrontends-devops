"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningOrder } from "../types/planning.types";

interface PlanningOrderTabProps {
	orders?: PlanningOrder[];
}

export function PlanningOrderTab({ orders: _orders }: PlanningOrderTabProps) {
	return (
		<div className="flex flex-col w-full bg-white font-sans p-6 rounded-lg border border-slate-200 shadow-2xs">
			<h2 className="text-sm font-semibold text-slate-900 mb-2">
				<Translate text={localizationConstants.planningOrderOverviewTitle} />
			</h2>
			<p className="text-xs text-slate-500">
				<Translate text={localizationConstants.planningOrderOverviewSubtitle} />
			</p>
		</div>
	);
}

export default PlanningOrderTab;
