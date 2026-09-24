import localizationConstants from "@/utils/translation/constants";
import { FORECAST_ANALYSIS_MONTH_COUNT } from "../constants/forecastAnalysis.constants";
import type {
	AnalysisCashFlow,
	AnalysisObject,
	AnalysisOpportunity,
	AnalysisRiskItem,
} from "../types/forecastAnalysis.types";

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
	forecastCost: number;
	budgetRevenue: number;
	budgetCost: number;
	billableHours: number;
	capacityHours: number;
	riskLevel: AnalysisObject["riskLevel"];
	riskExposure: number;
	isNewRisk: boolean;
	forecastRevisions: number;
	forecastRevisionsPrevious: number;
}

/**
 * The objects behind Analys, as year totals; the months are split from them so
 * the figures stay exact. Unfiltered, they give the frame's own six: 4 200 000
 * kr, 42.5 %, 87.5 %, 76.8 %, three high-risk projects and 380 000 kr at stake.
 */
const ANALYSIS_TOTALS: AnalysisObjectTotals[] = [
	{ id: "an-2025-01", name: "Projekt 2025-01", department: "production", status: "active", revenue: 1200000, cost: 700000, forecastRevenue: 1000000, forecastCost: 730000, budgetRevenue: 1100000, budgetCost: 450000, billableHours: 2880, capacityHours: 3600, riskLevel: "high", riskExposure: 150000, isNewRisk: true, forecastRevisions: 1, forecastRevisionsPrevious: 2 },
	{ id: "an-2022-002", name: "Projekt 2022-002", department: "production", status: "active", revenue: 690000, cost: 400000, forecastRevenue: 600000, forecastCost: 415000, budgetRevenue: 650000, budgetCost: 420000, billableHours: 2160, capacityHours: 2700, riskLevel: "high", riskExposure: 120000, isNewRisk: false, forecastRevisions: 0, forecastRevisionsPrevious: 0 },
	{ id: "an-2022-003", name: "Projekt 2022-003", department: "service", status: "active", revenue: 770000, cost: 450000, forecastRevenue: 700000, forecastCost: 470000, budgetRevenue: 700000, budgetCost: 353000, billableHours: 1800, capacityHours: 2250, riskLevel: "moderate", riskExposure: 60000, isNewRisk: false, forecastRevisions: 1, forecastRevisionsPrevious: 1 },
	{ id: "an-kv-solen", name: "Kv Solen", department: "production", status: "paused", revenue: 665000, cost: 380000, forecastRevenue: 700000, forecastCost: 395000, budgetRevenue: 650000, budgetCost: 395000, billableHours: 1400, capacityHours: 1800, riskLevel: "high", riskExposure: 50000, isNewRisk: false, forecastRevisions: 0, forecastRevisionsPrevious: 0 },
	{ id: "an-kv-manen", name: "Kv Månen", department: "service", status: "active", revenue: 450000, cost: 260000, forecastRevenue: 500000, forecastCost: 275000, budgetRevenue: 400000, budgetCost: 270000, billableHours: 1000, capacityHours: 1350, riskLevel: "low", riskExposure: 0, isNewRisk: false, forecastRevisions: 0, forecastRevisionsPrevious: 0 },
	{ id: "an-service-nord", name: "Serviceavtal Nord", department: "service", status: "closed", revenue: 425000, cost: 225000, forecastRevenue: 500000, forecastCost: 235000, budgetRevenue: 400000, budgetCost: 230000, billableHours: 360, capacityHours: 800, riskLevel: "low", riskExposure: 0, isNewRisk: false, forecastRevisions: 0, forecastRevisionsPrevious: 0 },
];

export const INITIAL_ANALYSIS_OBJECTS: AnalysisObject[] = ANALYSIS_TOTALS.map((totals) => {
	const revenue = split(totals.revenue, MONEY_WEIGHTS);
	const cost = split(totals.cost, MONEY_WEIGHTS);
	const forecastRevenue = split(totals.forecastRevenue, MONEY_WEIGHTS);
	const forecastCost = split(totals.forecastCost, MONEY_WEIGHTS);
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
		forecastRevisions: totals.forecastRevisions,
		forecastRevisionsPrevious: totals.forecastRevisionsPrevious,
		months: revenue.map((_, month) => ({
			revenue: revenue[month],
			cost: cost[month],
			forecastRevenue: forecastRevenue[month],
			forecastCost: forecastCost[month],
			budgetRevenue: budgetRevenue[month],
			budgetCost: budgetCost[month],
			billableHours: billableHours[month],
			capacityHours: capacityHours[month],
		})),
	};
});

/**
 * What the exposure on the risk card is made of. The amounts stay on the
 * objects, so the card's total follows the filters while these lines name the
 * drivers behind it.
 */
export const ANALYSIS_RISK_ITEMS: AnalysisRiskItem[] = [
	{ id: "regulation", labelKey: localizationConstants.forecastAnalysisRiskRegulation },
	{ id: "deliveries", labelKey: localizationConstants.forecastAnalysisRiskDeliveries },
];

/** Company-wide upside: what each opportunity is worth, less what chasing it costs. */
export const ANALYSIS_OPPORTUNITIES: AnalysisOpportunity[] = [
	{ id: "newClient", labelKey: localizationConstants.forecastAnalysisOpportunityNewClient, upside: 140000, costToRealise: 25000 },
	{ id: "savings", labelKey: localizationConstants.forecastAnalysisOpportunitySavings, upside: 70000, costToRealise: 15000 },
];

/**
 * Kassaflöde as the frame draws it. These are company-wide figures with no
 * per-object source, so unlike the rest of Analys they do not move with the
 * filters — the same footing as the risk and opportunity lines above.
 */
export const ANALYSIS_CASH_FLOW: AnalysisCashFlow = {
	accountsReceivable: 840000,
	dsoDays: 38,
	dsoPreviousDays: 33,
	workInProgress: 460000,
	uninvoicedHours: 1230,
};
