import type { ProjectEconomyItem } from "../data/projectEconomy.types";
import type { ProjectListItem } from "../data/projectsOverview.mock";

export function listEconomyRows(projects: ProjectListItem[]): ProjectEconomyItem[] {
	return projects.map((project) => ({
		id: project.id,
		projectNr: project.projectNr,
		name: project.name,
		totalRevenue: "-",
		totalCosts: "-",
		tbContribution: "-",
	}));
}

export function getTotalTbContribution(): string {
	return "-";
}
