import {
	PROJECT_ECONOMY_ROWS,
	PROJECT_ECONOMY_TOTAL_TB,
	ProjectEconomyItem,
} from "../data/projectEconomy.mock";

export function listEconomyRows(): ProjectEconomyItem[] {
	return PROJECT_ECONOMY_ROWS;
}

export function getTotalTbContribution(): number {
	return PROJECT_ECONOMY_TOTAL_TB;
}
