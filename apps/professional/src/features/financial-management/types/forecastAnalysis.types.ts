import type { TranslationKeys } from "@/utils/translation/constants";

/** How far back Analys reads: the year so far, the last quarter, or the last month. */
export type AnalysisPeriod = "yearToDate" | "quarter" | "month";

export type AnalysisDepartment = "production" | "service";

export type AnalysisStatus = "active" | "paused" | "closed";

/** How much an object could still cost the company, and how sure that is. */
export type AnalysisRiskLevel = "low" | "moderate" | "high";

/** One month of an object: what it earned and cost, against budget and forecast. */
export interface AnalysisMonth {
	revenue: number;
	cost: number;
	forecastRevenue: number;
	forecastCost: number;
	budgetRevenue: number;
	budgetCost: number;
	billableHours: number;
	capacityHours: number;
}

/** A project or order as Analys reads it, month by month from January. */
export interface AnalysisObject {
	id: string;
	name: string;
	department: AnalysisDepartment;
	status: AnalysisStatus;
	months: AnalysisMonth[];
	riskLevel: AnalysisRiskLevel;
	/** What is at stake if the risk lands, in SEK. */
	riskExposure: number;
	/** A risk raised this period, which the card counts separately. */
	isNewRisk: boolean;
}

/** What drives the exposure the risk card totals; company-wide, so filters leave it alone. */
export interface AnalysisRiskItem {
	id: string;
	labelKey: TranslationKeys;
}

/** An upside worth chasing, and what chasing it costs. */
export interface AnalysisOpportunity {
	id: string;
	labelKey: TranslationKeys;
	upside: number;
	costToRealise: number;
}

/** The Analys val card; `null` and an empty list mean everything. */
export interface AnalysisFilters {
	period: AnalysisPeriod;
	department: AnalysisDepartment | null;
	objectIds: string[];
	status: AnalysisStatus | null;
}

/** A figure's footnote: its text, and whether it reads as good, poor or plain. */
export type AnalysisTone = "positive" | "negative" | "neutral";

export interface AnalysisKpiNote {
	labelKey: TranslationKeys;
	values?: Record<string, string | number>;
	tone: AnalysisTone;
}

/** Everything the six KPI cards show, derived from the objects the filters leave. */
export interface AnalysisKpis {
	revenue: number;
	revenueVsForecastPercent: number;
	marginPercent: number;
	marginVsBudgetPoints: number;
	accuracyPercent: number;
	utilizationPercent: number;
	previousUtilizationPercent: number;
	highRiskCount: number;
	newRiskCount: number;
	riskExposure: number;
	riskLevel: AnalysisRiskLevel;
	/** How many objects the filters left, which the filter card reports. */
	objectCount: number;
}

/** Financial Summary: one metric read three ways, and how the outcome sits against budget. */
export interface AnalysisSummaryRow {
	labelKey: TranslationKeys;
	budget: number;
	actual: number;
	forecast: number;
	/** Actual less budget; `true` when a rise is the good news. */
	variance: number;
	riseIsGood: boolean;
}

/** Project Performance, over the active objects the filters leave. */
export interface AnalysisProjectPerformance {
	activeCount: number;
	onBudgetCount: number;
	overBudgetCount: number;
	/** The worst overruns first, each by how far its cost passed its budget. */
	overruns: { id: string; name: string; amountOver: number }[];
}

/** One month on the trend chart. */
export interface AnalysisTrendPoint {
	/** The month key, so the axis follows the language. */
	monthKey: TranslationKeys;
	budget: number;
	actual: number;
	forecast: number;
}

/** The Möjligheter card: what is on offer, and what is left after chasing it. */
export interface AnalysisOpportunitySummary {
	upside: number;
	netImpact: number;
	items: AnalysisOpportunity[];
}
