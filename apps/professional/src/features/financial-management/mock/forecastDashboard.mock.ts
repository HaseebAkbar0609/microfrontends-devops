import localizationConstants from "@/utils/translation/constants";
import type { ForecastDashboardData } from "../types/forecastDashboard.types";

/**
 * The Prognos dashboard's figures, taken from the TFS-1051 frame's examples
 * until a forecast API exists. Project 412 and 1043 forecast more hours than
 * planned, so they are its risk projects.
 */
export const INITIAL_FORECAST_DASHBOARD_DATA: ForecastDashboardData = {
	companyOccupancy: 87,
	departments: [
		{ id: "production", labelKey: localizationConstants.forecastDeptProduction, percent: 102 },
		{ id: "service", labelKey: localizationConstants.forecastDeptService, percent: 76 },
	],
	weeks: [
		{ week: 37, hours: 162 },
		{ week: 38, hours: -52 },
		{ week: 39, hours: 118 },
		{ week: 40, hours: 206 },
		{ week: 41, hours: 40 },
		{ week: 42, hours: 12 },
	],
	months: [
		{ id: "september", labelKey: localizationConstants.monthSeptember, hours: 228 },
		{ id: "october", labelKey: localizationConstants.monthOctober, hours: -36 },
	],
	totals: {
		plannedHours: 1240,
		forecastHours: 1318,
		actualHours: 764,
		forecastCost: 1186000,
	},
	projects: [
		{ projectNo: "412", plannedHours: 120, workedHours: 67, forecastHours: 132, costOverrun: 18400 },
		{ projectNo: "415", plannedHours: 80, workedHours: 52, forecastHours: 78, costOverrun: 0 },
		{ projectNo: "1043", plannedHours: 40, workedHours: 38, forecastHours: 46, costOverrun: 7200 },
		{ projectNo: "418", plannedHours: 200, workedHours: 64, forecastHours: 196, costOverrun: 0 },
	],
	warnings: [
		{ id: "noResources", labelKey: localizationConstants.forecastWarnNoResources, count: 3, tone: "warning" },
		{ id: "overloaded", labelKey: localizationConstants.forecastWarnOverloaded, count: 4, tone: "critical" },
		{ id: "missingSkills", labelKey: localizationConstants.forecastWarnMissingSkills, count: 2, tone: "warning" },
		{ id: "blockingCertificates", labelKey: localizationConstants.forecastWarnBlockingCertificates, count: 1, tone: "critical" },
		{ id: "onboarding", labelKey: localizationConstants.forecastWarnOnboarding, count: 2, tone: "info" },
	],
};
