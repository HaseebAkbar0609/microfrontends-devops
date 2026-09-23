import { FORECAST_ANALYSIS_MONTH_COUNT } from "../constants/forecastAnalysis.constants";
import type { AnalysisObject } from "../types/forecastAnalysis.types";

/**
 * How a year's figure falls across January to September: money builds towards
 * autumn, hours build faster than capacity does, so utilisation climbs through
 * the period. Each array sums to 1.
 */
const MONEY_WEIGHTS = [0.09, 0.1, 0.1, 0.11, 0.11, 0.12, 0.12, 0.12, 0.13];
const BILLABLE_WEIGHTS = [0.104, 0.106, 0.108, 0.11, 0.112, 0.113, 0.115, 0.116, 0.116];
const FLAT_WEIGHTS = Array.from({ length: FORECAST_ANALYSIS_MONTH_COUNT }, () => 1 / FORECAST_ANALYSIS_MONTH_COUNT);

/** A total split over the months in whole units, the last month taking the remainder. */
function split(total: number, weights: number[]): number[] {
	const months = weights.slice(0, -1).map((weight) => Math.round(total * weight));
	const spent = months.reduce((sum, value) => sum + value, 0);
	return [...months, total - spent];
}

interface AnalysisObjectTotals {
	id: string;
	name: string;
	department: AnalysisObject["department"];
	status: AnalysisObject["status"];
	revenue: number;
	cost: number;
	forecastRevenue: number;
	budgetRevenue: number;
	budgetCost: number;
	billableHours: number;
	capacityHours: number;
	riskLevel: AnalysisObject["riskLevel"];
	riskExposure: number;
	isNewRisk: boolean;
}

/**
 * The objects behind Analys, as year totals; the months are split from them so
 * the figures stay exact. Unfiltered, they give the frame's own six: 4 200 000
 * kr, 42.5 %, 87.5 %, 76.8 %, three high-risk projects and 380 000 kr at stake.
 */
const ANALYSIS_TOTALS: AnalysisObjectTotals[] = [
	{ id: "an-2025-01", name: "Projekt 2025-01", department: "production", status: "active", revenue: 1200000, cost: 700000, forecastRevenue: 1000000, budgetRevenue: 1100000, budgetCost: 620000, billableHours: 2880, capacityHours: 3600, riskLevel: "high", riskExposure: 150000, isNewRisk: true },
	{ id: "an-2022-002", name: "Projekt 2022-002", department: "production", status: "active", revenue: 690000, cost: 400000, forecastRevenue: 600000, budgetRevenue: 650000, budgetCost: 360000, billableHours: 2160, capacityHours: 2700, riskLevel: "high", riskExposure: 120000, isNewRisk: false },
	{ id: "an-2022-003", name: "Projekt 2022-003", department: "service", status: "active", revenue: 770000, cost: 450000, forecastRevenue: 700000, budgetRevenue: 700000, budgetCost: 400000, billableHours: 1800, capacityHours: 2250, riskLevel: "moderate", riskExposure: 60000, isNewRisk: false },
	{ id: "an-kv-solen", name: "Kv Solen", department: "production", status: "paused", revenue: 665000, cost: 380000, forecastRevenue: 700000, budgetRevenue: 650000, budgetCost: 340000, billableHours: 1400, capacityHours: 1800, riskLevel: "high", riskExposure: 50000, isNewRisk: false },
	{ id: "an-kv-manen", name: "Kv Månen", department: "service", status: "active", revenue: 450000, cost: 260000, forecastRevenue: 500000, budgetRevenue: 400000, budgetCost: 200000, billableHours: 1000, capacityHours: 1350, riskLevel: "low", riskExposure: 0, isNewRisk: false },
	{ id: "an-service-nord", name: "Serviceavtal Nord", department: "service", status: "closed", revenue: 425000, cost: 225000, forecastRevenue: 500000, budgetRevenue: 400000, budgetCost: 198000, billableHours: 360, capacityHours: 800, riskLevel: "low", riskExposure: 0, isNewRisk: false },
];

export const INITIAL_ANALYSIS_OBJECTS: AnalysisObject[] = ANALYSIS_TOTALS.map((totals) => {
	const revenue = split(totals.revenue, MONEY_WEIGHTS);
	const cost = split(totals.cost, MONEY_WEIGHTS);
	const forecastRevenue = split(totals.forecastRevenue, MONEY_WEIGHTS);
	const budgetRevenue = split(totals.budgetRevenue, MONEY_WEIGHTS);
	const budgetCost = split(totals.budgetCost, MONEY_WEIGHTS);
	const billableHours = split(totals.billableHours, BILLABLE_WEIGHTS);
	const capacityHours = split(totals.capacityHours, FLAT_WEIGHTS);

	return {
		id: totals.id,
		name: totals.name,
		department: totals.department,
		status: totals.status,
		riskLevel: totals.riskLevel,
		riskExposure: totals.riskExposure,
		isNewRisk: totals.isNewRisk,
		months: revenue.map((_, month) => ({
			revenue: revenue[month],
			cost: cost[month],
			forecastRevenue: forecastRevenue[month],
			budgetRevenue: budgetRevenue[month],
			budgetCost: budgetCost[month],
			billableHours: billableHours[month],
			capacityHours: capacityHours[month],
		})),
	};
});
