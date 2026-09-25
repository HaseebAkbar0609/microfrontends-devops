"use client";

import { MultiTagSelect } from "@/components/ui/MultiTagSelect";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	FORECAST_ANALYSIS_DEPARTMENT_LABELS,
	FORECAST_ANALYSIS_PERIODS,
	FORECAST_ANALYSIS_STATUS_LABELS,
} from "../../../constants/forecastAnalysis.constants";
import type {
	AnalysisDepartment,
	AnalysisFilters,
	AnalysisObject,
	AnalysisPeriod,
	AnalysisStatus,
} from "../../../types/forecastAnalysis.types";
import {
	FilterCardShell,
	FilterField,
	FilterPeriodSelect,
	FilterSelect,
} from "../filters/FilterCardParts";

export interface AnalysisFilterCardProps {
	/** The card's heading; Analys calls it Analys val, Nyckeltal Statistik val. */
	titleKey?: TranslationKeys;
	filters: AnalysisFilters;
	objects: AnalysisObject[];
	onChange: <K extends keyof AnalysisFilters>(key: K, value: AnalysisFilters[K]) => void;
	onToggleObject: (id: string) => void;
	onApply: () => void;
	onReset: () => void;
}

/**
 * Analys val: Objekt lists every object by name; the rest are one choice each,
 * or Alla. The card itself is the shared Prognos shell.
 */
export function AnalysisFilterCard({
	titleKey = localizationConstants.forecastAnalysisFilterTitle,
	filters,
	objects,
	onChange,
	onToggleObject,
	onApply,
	onReset,
}: AnalysisFilterCardProps) {
	const t = useTranslate();
	const selectedNames = objects.filter((object) => filters.objectIds.includes(object.id)).map((object) => object.name);

	return (
		<FilterCardShell titleKey={titleKey} onReset={onReset} onApply={onApply}>
			<FilterPeriodSelect<AnalysisPeriod>
				labelKey={localizationConstants.forecastAnalysisPeriodLabel}
				periods={FORECAST_ANALYSIS_PERIODS}
				value={filters.period}
				onChange={(value) => onChange("period", value)}
			/>

			<FilterSelect<AnalysisDepartment>
				labelKey={localizationConstants.forecastAnalysisDepartmentLabel}
				labels={FORECAST_ANALYSIS_DEPARTMENT_LABELS}
				value={filters.department}
				onChange={(value) => onChange("department", value)}
			/>

			<FilterField labelKey={localizationConstants.forecastColObject}>
				<MultiTagSelect
					placeholder={t(localizationConstants.forecastAnalysisObjectPlaceholder)}
					options={objects.map((object) => object.name)}
					selected={selectedNames}
					onToggle={(name) => {
						const match = objects.find((object) => object.name === name);
						if (match) onToggleObject(match.id);
					}}
				/>
			</FilterField>

			<FilterSelect<AnalysisStatus>
				labelKey={localizationConstants.status}
				labels={FORECAST_ANALYSIS_STATUS_LABELS}
				value={filters.status}
				onChange={(value) => onChange("status", value)}
			/>
		</FilterCardShell>
	);
}

export default AnalysisFilterCard;
