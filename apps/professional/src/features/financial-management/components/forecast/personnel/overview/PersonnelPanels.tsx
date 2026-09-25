"use client";

import dynamic from "next/dynamic";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_LEVEL_META,
	PERSONNEL_LEVEL_ORDER,
} from "../../../../constants/forecastPersonnel.constants";
import type {
	PersonnelDistributionSlice,
	PersonnelTrendPoint,
} from "../../../../types/forecastPersonnel.types";
import { StatusDonut } from "../../charts/StatusDonut";

/* Recharts measures the DOM, so neither figure may render on the server. */
const PersonnelSalaryTrendChart = dynamic(() => import("./charts/PersonnelSalaryTrendChart"), {
	ssr: false,
	loading: () => <div className="h-64 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50" />,
});

const PANEL = "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs";
const PANEL_TITLE = "text-base font-semibold text-slate-900";

export function PersonnelTrendPanel({ points }: { points: PersonnelTrendPoint[] }) {
	return (
		<section className={PANEL}>
			<h3 className={PANEL_TITLE}>
				<Translate text={localizationConstants.forecastPersonnelTrendTitle} />
			</h3>
			<PersonnelSalaryTrendChart points={points} />
		</section>
	);
}

/** Who leads and who is led, on the shared ring with its legend beneath. */
export function PersonnelDistributionPanel({ slices }: { slices: PersonnelDistributionSlice[] }) {
	const ordered = PERSONNEL_LEVEL_ORDER.map(
		(level) => slices.find((slice) => slice.level === level) ?? { level, count: 0 },
	);

	return (
		<section className={PANEL}>
			<h3 className={PANEL_TITLE}>
				<Translate text={localizationConstants.forecastPersonnelDistributionTitle} />
			</h3>
			<div className="flex flex-1 items-center justify-center py-2">
				<StatusDonut
					segments={ordered.map((slice) => ({
						id: slice.level,
						value: slice.count,
						color: PERSONNEL_LEVEL_META[slice.level].color,
						labelKey: PERSONNEL_LEVEL_META[slice.level].labelKey,
					}))}
					ariaLabelKey={localizationConstants.forecastPersonnelDistributionChartLabel}
					emptyKey={localizationConstants.forecastPersonnelEmpty}
					legendRowKey={localizationConstants.forecastPersonnelDistributionRow}
					legendPlacement="below"
					size="h-40 w-40"
				/>
			</div>
		</section>
	);
}
