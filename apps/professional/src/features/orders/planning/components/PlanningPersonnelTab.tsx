"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningResource } from "../types/planning.types";

interface PlanningPersonnelTabProps {
	resources?: PlanningResource[];
}

export function PlanningPersonnelTab({ resources: _resources }: PlanningPersonnelTabProps) {
	return (
		<div className="flex flex-col w-full bg-white font-sans p-6 rounded-lg border border-slate-200 shadow-2xs">
			<h2 className="text-sm font-semibold text-slate-900 mb-2">
				<Translate text={localizationConstants.planningPersonnelOverviewTitle} />
			</h2>
			<p className="text-xs text-slate-500">
				<Translate text={localizationConstants.planningPersonnelOverviewSubtitle} />
			</p>
		</div>
	);
}

export default PlanningPersonnelTab;
