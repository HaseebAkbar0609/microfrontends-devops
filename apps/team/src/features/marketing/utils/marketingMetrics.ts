import { MARKETING_BUDGET_PERIOD } from "../constants/marketing.constants";
import type { MarketingRow } from "../types";

export type BudgetLine = {
	id: string;
	label: string;
	budget: number;
	actual: number;
};

export type MarketingMetrics = {
	budgetTotal: number;
	actualTotal: number;
	utilisation: number;
	activeActivities: number;
	mailRecipients: number;
	budgetLines: BudgetLine[];
};

function numeric(row: MarketingRow, key: string): number {
	const value = Number(row.values[key]);
	return Number.isFinite(value) ? value : 0;
}

/**
 * Every figure on the overview is derived from the registers, so editing a
 * budget row moves the cards and the chart.
 *
 * The budget totals are restricted to `MARKETING_BUDGET_PERIOD`. The prototype
 * labelled the card "Budget 2026 Q1" while summing every budget row whatever
 * its period, so the label and the number could disagree the moment a second
 * quarter was entered.
 */
export function deriveMarketingMetrics(
	budgetRows: MarketingRow[],
	planRows: MarketingRow[],
	mailListRows: MarketingRow[],
): MarketingMetrics {
	const periodRows = budgetRows.filter(
		(row) => String(row.values.period ?? "") === MARKETING_BUDGET_PERIOD,
	);

	const budgetLines: BudgetLine[] = periodRows.map((row) => ({
		id: row.id,
		label: String(row.values.post ?? ""),
		budget: numeric(row, "budget"),
		actual: numeric(row, "utfall"),
	}));

	const budgetTotal = budgetLines.reduce((sum, line) => sum + line.budget, 0);
	const actualTotal = budgetLines.reduce((sum, line) => sum + line.actual, 0);

	return {
		budgetTotal,
		actualTotal,
		utilisation: budgetTotal ? (actualTotal / budgetTotal) * 100 : 0,
		activeActivities: planRows.filter(
			(row) => String(row.values.status ?? "") === "ongoing",
		).length,
		mailRecipients: mailListRows.reduce(
			(sum, row) => sum + numeric(row, "antal"),
			0,
		),
		budgetLines,
	};
}
