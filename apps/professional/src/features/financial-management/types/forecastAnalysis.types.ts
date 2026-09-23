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
