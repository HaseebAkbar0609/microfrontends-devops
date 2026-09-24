"use client";

import { useCallback, useMemo, useState } from "react";

import { INITIAL_ANALYSIS_FILTERS } from "../constants/forecastAnalysis.constants";
import {
	ANALYSIS_OPPORTUNITIES,
	ANALYSIS_RISK_ITEMS,
	INITIAL_ANALYSIS_OBJECTS,
} from "../mock/forecastAnalysis.mock";
import type { AnalysisFilters } from "../types/forecastAnalysis.types";
import {
	analysisKpis,
	analysisOpportunities,
	analysisProjectPerformance,
	analysisSummaryRows,
	analysisTrend,
	filterAnalysisObjects,
} from "../utils/forecastAnalysis";

/**
 * Analys's selection and what it leaves. The card is edited as a draft and
 * only Välj hands it to the figures, so half-made selections never redraw the
 * page; Återställ puts both back. Objects come from mock data until a forecast
 * API exists.
 */
export function useForecastAnalysis() {
	const [draft, setDraft] = useState<AnalysisFilters>(INITIAL_ANALYSIS_FILTERS);
	const [applied, setApplied] = useState<AnalysisFilters>(INITIAL_ANALYSIS_FILTERS);
	const [isRearranging, setIsRearranging] = useState(false);

	const objects = useMemo(() => filterAnalysisObjects(INITIAL_ANALYSIS_OBJECTS, applied), [applied]);
	const kpis = useMemo(() => analysisKpis(objects, applied.period), [objects, applied.period]);
	const summaryRows = useMemo(() => analysisSummaryRows(objects, applied.period), [objects, applied.period]);
	const performance = useMemo(() => analysisProjectPerformance(objects, applied.period), [objects, applied.period]);
	const trend = useMemo(() => analysisTrend(objects, applied.period), [objects, applied.period]);
	const opportunities = useMemo(() => analysisOpportunities(ANALYSIS_OPPORTUNITIES), []);

	const setFilter = useCallback(<K extends keyof AnalysisFilters>(key: K, value: AnalysisFilters[K]) => {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}, []);

	/** Objekt's chips: choosing one adds it, choosing it again takes it away. */
	const toggleObject = useCallback((id: string) => {
		setDraft((prev) => ({
			...prev,
			objectIds: prev.objectIds.includes(id)
				? prev.objectIds.filter((current) => current !== id)
				: [...prev.objectIds, id],
		}));
	}, []);

	const apply = useCallback(() => setApplied(draft), [draft]);

	const reset = useCallback(() => {
		setDraft(INITIAL_ANALYSIS_FILTERS);
		setApplied(INITIAL_ANALYSIS_FILTERS);
	}, []);

	return {
		/** Every object, which the Objekt filter lists whatever is selected. */
		allObjects: INITIAL_ANALYSIS_OBJECTS,
		draft,
		applied,
		setFilter,
		toggleObject,
		apply,
		reset,
		objects,
		kpis,
		summaryRows,
		performance,
		trend,
		opportunities,
		/** What drives the exposure; named here so no component reads the mock. */
		risks: ANALYSIS_RISK_ITEMS,
		isRearranging,
		setIsRearranging,
	};
}

export type ForecastAnalysisState = ReturnType<typeof useForecastAnalysis>;
