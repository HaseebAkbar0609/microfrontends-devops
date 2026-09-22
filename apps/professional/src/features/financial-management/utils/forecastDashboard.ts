import { FORECAST_OVERLOAD_THRESHOLD_PERCENT } from "../constants/forecastDashboard.constants";
import type {
	ForecastDashboardData,
	ForecastDashboardState,
	ForecastLoadSummary,
	ForecastProject,
	ForecastProjectRow,
	ForecastWeekBalance,
} from "../types/forecastDashboard.types";

export function isOverloaded(percent: number): boolean {
	return percent > FORECAST_OVERLOAD_THRESHOLD_PERCENT;
}

/** The weeks' free hours and overload, each summed, and what is left of the one after the other. */
export function summarizeLoad(weeks: ForecastWeekBalance[]): ForecastLoadSummary {
	let freeHours = 0;
	let overloadHours = 0;
	for (const { hours } of weeks) {
		if (hours >= 0) freeHours += hours;
		else overloadHours -= hours;
	}
	return { availableHours: freeHours - overloadHours, freeHours, overloadHours };
}

/** A project is at risk when its forecast runs over the hours planned for it. */
export function toProjectRow(project: ForecastProject): ForecastProjectRow {
	const hoursVariance = project.plannedHours - project.forecastHours;
	return { ...project, hoursVariance, status: hoursVariance < 0 ? "risk" : "onTrack" };
}

export function buildForecastDashboardState(data: ForecastDashboardData): ForecastDashboardState {
	const projects = data.projects.map(toProjectRow);
	return {
		...data,
		load: summarizeLoad(data.weeks),
		projects,
		riskProjects: projects.filter((project) => project.status === "risk"),
	};
}
