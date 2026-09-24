import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_MONTH_KEYS,
	FORECAST_ANALYSIS_OVERRUN_LIMIT,
	FORECAST_ANALYSIS_PERIOD_MONTHS,
	FORECAST_ANALYSIS_RISK_THRESHOLDS,
	FORECAST_ANALYSIS_UTILIZATION_TARGET_PERCENT,
} from "../constants/forecastAnalysis.constants";
import type {
	AnalysisCumulativePoint,
	AnalysisFilters,
	AnalysisForecastQuality,
	AnalysisKpis,
	AnalysisProfitability,
	AnalysisUtilization,
	AnalysisMonth,
	AnalysisObject,
	AnalysisOpportunity,
	AnalysisOpportunitySummary,
	AnalysisPeriod,
	AnalysisProjectPerformance,
	AnalysisRiskLevel,
	AnalysisSummaryRow,
	AnalysisTrendPoint,
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

/** The months a period reads, as indexes into a full year of the mock. */
function windowRange(period: AnalysisPeriod): { from: number; to: number } {
	const count = FORECAST_ANALYSIS_PERIOD_MONTHS[period];
	return { from: Math.max(0, FORECAST_ANALYSIS_MONTH_KEYS.length - count), to: FORECAST_ANALYSIS_MONTH_KEYS.length };
}

/**
 * Financial Summary: intäkter, kostnader and what they leave, each read as
 * budget, utfall and prognos. The variance is utfall against budget — a rise
 * is good news for revenue and for the profit, and bad news for cost.
 */
export function analysisSummaryRows(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisSummaryRow[] {
	const months = objects.flatMap((object) => monthsInPeriod(object, period));
	const revenue = { budget: sumMonths(months, "budgetRevenue"), actual: sumMonths(months, "revenue"), forecast: sumMonths(months, "forecastRevenue") };
	const cost = { budget: sumMonths(months, "budgetCost"), actual: sumMonths(months, "cost"), forecast: sumMonths(months, "forecastCost") };

	return [
		{ labelKey: localizationConstants.forecastAnalysisRowRevenue, ...revenue, variance: revenue.actual - revenue.budget, riseIsGood: true },
		{ labelKey: localizationConstants.forecastAnalysisRowCosts, ...cost, variance: cost.actual - cost.budget, riseIsGood: false },
		{
			labelKey: localizationConstants.forecastAnalysisRowGrossProfit,
			budget: revenue.budget - cost.budget,
			actual: revenue.actual - cost.actual,
			forecast: revenue.forecast - cost.forecast,
			variance: revenue.actual - cost.actual - (revenue.budget - cost.budget),
			riseIsGood: true,
		},
	];
}

/**
 * Project Performance, over the objects still running: how many hold their
 * budget over the period, and which passed it by the most.
 */
export function analysisProjectPerformance(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisProjectPerformance {
	const active = objects.filter((object) => object.status === "active");
	const withCost = active.map((object) => {
		const months = monthsInPeriod(object, period);
		return { id: object.id, name: object.name, amountOver: sumMonths(months, "cost") - sumMonths(months, "budgetCost") };
	});
	const overruns = withCost.filter((object) => object.amountOver > 0).sort((a, b) => b.amountOver - a.amountOver);

	return {
		activeCount: active.length,
		onBudgetCount: withCost.length - overruns.length,
		overBudgetCount: overruns.length,
		overruns: overruns.slice(0, FORECAST_ANALYSIS_OVERRUN_LIMIT),
	};
}

/** The trend chart: budget, utfall and prognos summed for each month the period reads. */
export function analysisTrend(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisTrendPoint[] {
	const { from, to } = windowRange(period);
	return FORECAST_ANALYSIS_MONTH_KEYS.slice(from, to).map((monthKey, index) => {
		const month = from + index;
		const cells = objects.map((object) => object.months[month]).filter((cell): cell is AnalysisMonth => Boolean(cell));
		return {
			monthKey,
			budget: sumMonths(cells, "budgetRevenue"),
			actual: sumMonths(cells, "revenue"),
			forecast: sumMonths(cells, "forecastRevenue"),
		};
	});
}

/** The upside on offer, and what is left of it once it has been chased. */
export function analysisOpportunities(items: AnalysisOpportunity[]): AnalysisOpportunitySummary {
	const upside = items.reduce((sum, item) => sum + item.upside, 0);
	const cost = items.reduce((sum, item) => sum + item.costToRealise, 0);
	return { upside, netImpact: upside - cost, items };
}

/**
 * Prognoskvalitet: how close the forecast came, the average miss it leaves,
 * and how often the forecast was rewritten against the period before.
 */
export function analysisForecastQuality(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisForecastQuality {
	const { accuracyPercent } = analysisKpis(objects, period);
	const revisions = objects.reduce((sum, object) => sum + object.forecastRevisions, 0);
	const revisionsPrevious = objects.reduce((sum, object) => sum + object.forecastRevisionsPrevious, 0);

	return {
		accuracyPercent,
		mapePercent: 100 - accuracyPercent,
		revisions,
		revisionsPrevious,
		revisionChangePercent: revisionsPrevious === 0 ? 0 : ((revisions - revisionsPrevious) / revisionsPrevious) * 100,
	};
}

/** What an object keeps of what it earns, over the months the period reads. */
function marginPercentOf(object: AnalysisObject, period: AnalysisPeriod): number {
	const months = monthsInPeriod(object, period);
	const revenue = sumMonths(months, "revenue");
	return percent(revenue - sumMonths(months, "cost"), revenue);
}

/** Projektlönsamhet: the average project, and the weakest and strongest of them. */
export function analysisProfitability(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisProfitability {
	if (objects.length === 0) return { averageMarginPercent: 0, lowest: null, highest: null };

	const margins = objects.map((object) => {
		const months = monthsInPeriod(object, period);
		return {
			name: object.name,
			amount: sumMonths(months, "revenue") - sumMonths(months, "cost"),
			percent: marginPercentOf(object, period),
		};
	});
	const ranked = [...margins].sort((a, b) => a.percent - b.percent);

	return {
		/* The average project's margin, on the same scale as the two extremes below it. */
		averageMarginPercent: margins.reduce((sum, margin) => sum + margin.percent, 0) / margins.length,
		lowest: { name: ranked[0].name, percent: ranked[0].percent },
		highest: { name: ranked[ranked.length - 1].name, percent: ranked[ranked.length - 1].percent },
	};
}

/** Debiteringsgrad against its target, and what one billable hour brings in. */
export function analysisUtilization(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisUtilization {
	const months = objects.flatMap((object) => monthsInPeriod(object, period));
	const billableHours = sumMonths(months, "billableHours");
	const revenue = sumMonths(months, "revenue");

	return {
		utilizationPercent: percent(billableHours, sumMonths(months, "capacityHours")),
		targetPercent: FORECAST_ANALYSIS_UTILIZATION_TARGET_PERCENT,
		billableHours,
		capacityHours: sumMonths(months, "capacityHours"),
		revenuePerBillableHour: billableHours === 0 ? 0 : revenue / billableHours,
	};
}

/** The cumulative curve: what each month leaves, added to everything before it. */
export function analysisCumulativeProfit(objects: AnalysisObject[], period: AnalysisPeriod): AnalysisCumulativePoint[] {
	const { from, to } = windowRange(period);
	let running = 0;

	return FORECAST_ANALYSIS_MONTH_KEYS.slice(from, to).map((monthKey, index) => {
		const cells = objects
			.map((object) => object.months[from + index])
			.filter((cell): cell is AnalysisMonth => Boolean(cell));
		/* TB-bidrag, not revenue: what each month left after its own costs. */
		running += sumMonths(cells, "revenue") - sumMonths(cells, "cost");
		return { monthKey, cumulative: running };
	});
}
