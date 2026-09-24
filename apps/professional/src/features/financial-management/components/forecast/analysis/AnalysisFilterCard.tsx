"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MultiTagSelect } from "@/components/ui/MultiTagSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
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

/** The value a Select carries for "no choice made"; the filter itself is null then. */
const ALL = "all";
const TRIGGER = "h-10 w-full border-slate-200 bg-white text-sm";

function Field({ labelKey, children }: { labelKey: TranslationKeys; children: React.ReactNode }) {
	return (
		<div className="flex w-full flex-col gap-1.5">
			<label className="text-xs font-medium text-slate-500">
				<Translate text={labelKey} />
			</label>
			{children}
		</div>
	);
}

/** One Select whose options are a value → label map, plus Alla. */
function FilterSelect<T extends string>({
	labelKey,
	labels,
	value,
	onChange,
}: {
	labelKey: TranslationKeys;
	labels: Record<T, TranslationKeys>;
	value: T | null;
	onChange: (value: T | null) => void;
}) {
	const t = useTranslate();

	return (
		<Field labelKey={labelKey}>
			<Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? null : (next as T))}>
				<SelectTrigger className={TRIGGER} aria-label={t(labelKey)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>
						<Translate text={localizationConstants.forecastFilterAll} />
					</SelectItem>
					{(Object.keys(labels) as T[]).map((option) => (
						<SelectItem key={option} value={option}>
							<Translate text={labels[option]} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>
	);
}

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
 * Analys val: the selection is edited here and only Välj hands it to the cards,
 * so the page does not redraw halfway through choosing. Objekt lists every
 * object by name; the rest are one choice each, or Alla.
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
		<Card className="gap-3 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-base font-bold text-slate-900">
					<Translate text={titleKey} />
				</h2>
				<button
					type="button"
					onClick={onReset}
					className="flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
				>
					<Translate text={localizationConstants.forecastAnalysisFilterReset} />
					<X className="h-3.5 w-3.5" aria-hidden />
				</button>
			</div>

			<div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr_1fr_auto]">
				<Field labelKey={localizationConstants.forecastAnalysisPeriodLabel}>
					<Select
						value={filters.period}
						onValueChange={(next) => onChange("period", next as AnalysisPeriod)}
					>
						<SelectTrigger className={TRIGGER} aria-label={t(localizationConstants.forecastAnalysisPeriodLabel)}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FORECAST_ANALYSIS_PERIODS.map((period) => (
								<SelectItem key={period.id} value={period.id}>
									<Translate text={period.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<FilterSelect<AnalysisDepartment>
					labelKey={localizationConstants.forecastAnalysisDepartmentLabel}
					labels={FORECAST_ANALYSIS_DEPARTMENT_LABELS}
					value={filters.department}
					onChange={(value) => onChange("department", value)}
				/>

				<Field labelKey={localizationConstants.forecastColObject}>
					<MultiTagSelect
						placeholder={t(localizationConstants.forecastAnalysisObjectPlaceholder)}
						options={objects.map((object) => object.name)}
						selected={selectedNames}
						onToggle={(name) => {
							const match = objects.find((object) => object.name === name);
							if (match) onToggleObject(match.id);
						}}
					/>
				</Field>

				<FilterSelect<AnalysisStatus>
					labelKey={localizationConstants.status}
					labels={FORECAST_ANALYSIS_STATUS_LABELS}
					value={filters.status}
					onChange={(value) => onChange("status", value)}
				/>

				<Button
					type="button"
					onClick={onApply}
					className="h-10 w-full cursor-pointer rounded-md bg-[#111827] px-6 text-sm font-medium text-white hover:bg-black sm:w-auto"
				>
					<Translate text={localizationConstants.forecastAnalysisFilterApply} />
				</Button>
			</div>
		</Card>
	);
}

export default AnalysisFilterCard;
