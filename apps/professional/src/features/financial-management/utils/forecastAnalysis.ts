import {
	FORECAST_ANALYSIS_PERIOD_MONTHS,
	FORECAST_ANALYSIS_RISK_THRESHOLDS,
} from "../constants/forecastAnalysis.constants";
import type {
	AnalysisFilters,
	AnalysisKpis,
	AnalysisMonth,
	AnalysisObject,
	AnalysisPeriod,
	AnalysisRiskLevel,
} from "../types/forecastAnalysis.types";

/** The months a period reads: the last three, the last one, or all of them. */
export function monthsInPeriod(object: AnalysisObject, period: AnalysisPeriod): AnalysisMonth[] {
	const count = FORECAST_ANALYSIS_PERIOD_MONTHS[period];
	return object.months.slice(Math.max(0, object.months.length - count));
}

/** Whether an object belongs in the selection the Analys val card describes. */
export function matchesAnalysisFilters(object: AnalysisObject, filters: AnalysisFilters): boolean {
	if (filters.department && object.department !== filters.department) return false;
	if (filters.status && object.status !== filters.status) return false;
	if (filters.objectIds.length > 0 && !filters.objectIds.includes(object.id)) return false;
	return true;
}

export function filterAnalysisObjects(objects: AnalysisObject[], filters: AnalysisFilters): AnalysisObject[] {
	return objects.filter((object) => matchesAnalysisFilters(object, filters));
}

function sumMonths(months: AnalysisMonth[], field: keyof AnalysisMonth): number {
	return months.reduce((sum, month) => sum + month[field], 0);
}

function percent(part: number, whole: number): number {
	return whole === 0 ? 0 : (part / whole) * 100;
}

/** How far a figure sits from what was forecast, as percent of the forecast. */
function deviationPercent(actual: number, forecast: number): number {
	return forecast === 0 ? 0 : Math.abs(actual - forecast) / forecast * 100;
}

function riskLevelOf(exposure: number): AnalysisRiskLevel {
	if (exposure >= FORECAST_ANALYSIS_RISK_THRESHOLDS.high) return "high";
	if (exposure >= FORECAST_ANALYSIS_RISK_THRESHOLDS.moderate) return "moderate";
	return "low";
}

/**
 * The six figures, over the objects the filters leave and the months the period
 * reads. Revenue, cost and hours are summed; the margin is what revenue leaves
 * after cost, and it is set against the budgeted margin in percentage points;
 * accuracy averages how close each object came to its own forecast, so a small
 * object counts as much as a large one; utilisation is billable hours over
 * capacity, set against the period's first month.
 */
export function analysisKpis(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisKpis {
	const windows = objects.map((object) => monthsInPeriod(object, period));
	const all = windows.flat();

	const revenue = sumMonths(all, "revenue");
	const cost = sumMonths(all, "cost");
	const forecastRevenue = sumMonths(all, "forecastRevenue");
	const budgetRevenue = sumMonths(all, "budgetRevenue");
	const budgetCost = sumMonths(all, "budgetCost");
	const billableHours = sumMonths(all, "billableHours");
	const capacityHours = sumMonths(all, "capacityHours");

	const marginPercent = percent(revenue - cost, revenue);
	const budgetMarginPercent = percent(budgetRevenue - budgetCost, budgetRevenue);

	const accuracies = windows.map((months) =>
		Math.max(0, 100 - deviationPercent(sumMonths(months, "revenue"), sumMonths(months, "forecastRevenue"))),
	);

	const firstMonths = windows.map((months) => months[0]).filter((month): month is AnalysisMonth => Boolean(month));
	const riskExposure = objects.reduce((sum, object) => sum + object.riskExposure, 0);

	return {
		revenue,
		revenueVsForecastPercent: forecastRevenue === 0 ? 0 : ((revenue - forecastRevenue) / forecastRevenue) * 100,
		marginPercent,
		marginVsBudgetPoints: marginPercent - budgetMarginPercent,
		accuracyPercent: accuracies.length === 0 ? 0 : accuracies.reduce((sum, value) => sum + value, 0) / accuracies.length,
		utilizationPercent: percent(billableHours, capacityHours),
		previousUtilizationPercent: percent(sumMonths(firstMonths, "billableHours"), sumMonths(firstMonths, "capacityHours")),
		highRiskCount: objects.filter((object) => object.riskLevel === "high").length,
		newRiskCount: objects.filter((object) => object.isNewRisk).length,
		riskExposure,
		riskLevel: riskLevelOf(riskExposure),
		objectCount: objects.length,
	};
}
