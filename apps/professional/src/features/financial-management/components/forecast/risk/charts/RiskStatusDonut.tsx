"use client";

import localizationConstants from "@/utils/translation/constants";
import { RISK_LEVEL_META } from "../../../../constants/forecastRisk.constants";
import type { RiskDistributionSlice } from "../../../../types/forecastRisk.types";
import { StatusDonut } from "../../charts/StatusDonut";

export interface RiskStatusDonutProps {
	slices: RiskDistributionSlice[];
}

/** How the clients divide between the three levels, on the shared ring. */
export function RiskStatusDonut({ slices }: RiskStatusDonutProps) {
	return (
		<StatusDonut
			segments={slices.map((slice) => ({
				id: slice.level,
				value: slice.count,
				color: RISK_LEVEL_META[slice.level].color,
				labelKey: RISK_LEVEL_META[slice.level].labelKey,
			}))}
			ariaLabelKey={localizationConstants.forecastRiskDistributionChartLabel}
			emptyKey={localizationConstants.forecastRiskListEmpty}
			legendRowKey={localizationConstants.forecastRiskDistributionRow}
		/>
	);
}

export default RiskStatusDonut;
