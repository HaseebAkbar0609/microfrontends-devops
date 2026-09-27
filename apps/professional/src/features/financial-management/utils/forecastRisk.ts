import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import {
	RISK_CLIENT_STATUS_LABELS,
	RISK_LEVEL_META,
	RISK_LEVEL_ORDER,
} from "../constants/forecastRisk.constants";
import type {
	RiskClient,
	RiskClientProject,
	RiskClientTotals,
	RiskLevel,
	RiskListFilters,
	RiskListSortField,
	RiskSummary,
} from "../types/forecastRisk.types";

/** Turns a translation key into the reader's text. */
export type RiskLabel = (key: TranslationKeys) => string;

function percentOf(part: number, whole: number): number {
	if (whole <= 0) return 0;
	return (part / whole) * 100;
}

/** What a client still owes: invoiced less paid, never below zero. */
export function riskPendingAmount(client: RiskClient): number {
	return Math.max(0, client.invoiced - client.paid);
}

/**
 * Where a client sits: over its threshold it is high risk, from the alert
 * share up to it it is watched, below that it is low. A client that has turned
 * off automatic red status is never raised past watching by its threshold
 * alone — the point of that switch.
 */
export function riskLevelOf(client: RiskClient): RiskLevel {
	const pending = riskPendingAmount(client);
	const { spendingThreshold, alertPercent, autoRedStatus } = client.settings;
	if (spendingThreshold <= 0) return "low";

	const share = percentOf(pending, spendingThreshold);
	if (share > 100) return autoRedStatus ? "high" : "watch";
	if (share >= alertPercent) return "watch";
	return "low";
}

/** A project's spending against its budget, as a percentage. */
export function riskProjectProgress(project: RiskClientProject): number {
	return percentOf(project.spentToDate, project.budget);
}

/** Every figure a client's row and cards read. */
export function riskClientTotals(client: RiskClient): RiskClientTotals {
	const totalCost = client.projects.reduce((sum, project) => sum + project.budget, 0);
	const spentToDate = client.projects.reduce((sum, project) => sum + project.spentToDate, 0);
	const pendingAmount = riskPendingAmount(client);

	return {
		activeObjects: client.projects.length,
		totalCost,
		spentToDate,
		spentPercent: percentOf(spentToDate, totalCost),
		totalPaid: client.paid,
		pendingAmount,
		thresholdPercent: percentOf(pendingAmount, client.settings.spendingThreshold),
		level: riskLevelOf(client),
	};
}

/**
 * The four cards and the ring. Exposure counts only the clients being watched
 * or over their limit, which is what is actually at risk; the pending total
 * counts everyone, so the two cards say different things.
 */
export function riskSummary(clients: RiskClient[]): RiskSummary {
	const totals = clients.map(riskClientTotals);
	const pendingTotal = totals.reduce((sum, row) => sum + row.pendingAmount, 0);
	const exposure = totals
		.filter((row) => row.level !== "low")
		.reduce((sum, row) => sum + row.pendingAmount, 0);
	const limitTotal = clients.reduce((sum, client) => sum + client.settings.spendingThreshold, 0);

	return {
		exposure,
		highRiskCount: totals.filter((row) => row.level === "high").length,
		limitTotal,
		limitUsedPercent: percentOf(pendingTotal, limitTotal),
		pendingTotal,
		clientCount: clients.length,
		distribution: RISK_LEVEL_ORDER.map((level) => ({
			level,
			count: totals.filter((row) => row.level === level).length,
		})),
	};
}

/**
 * Whether a client belongs in the register as filtered and searched. Search
 * reads what the reader sees: the name, the client number and the level and
 * status labels.
 */
export function matchesRiskClient(
	client: RiskClient,
	filters: RiskListFilters,
	query: string,
	label: RiskLabel,
): boolean {
	const level = riskLevelOf(client);
	if (filters.level && level !== filters.level) return false;
	if (filters.status && client.status !== filters.status) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [client.name, client.clientNo, label(RISK_LEVEL_META[level].labelKey), label(RISK_CLIENT_STATUS_LABELS[client.status])]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

/** Amounts sort as numbers; the name and the level sort as the reader reads them. */
function sortValue(client: RiskClient, field: RiskListSortField, label: RiskLabel): string | number {
	const totals = riskClientTotals(client);
	switch (field) {
		case "name":
			return client.name;
		case "activeObjects":
			return totals.activeObjects;
		case "totalCost":
			return totals.totalCost;
		case "creditLimit":
			return client.settings.creditLimit;
		case "totalPaid":
			return totals.totalPaid;
		case "pendingAmount":
			return totals.pendingAmount;
		case "level":
			return label(RISK_LEVEL_META[totals.level].labelKey);
	}
}

/**
 * Clients in header order. Amounts compare as numbers; text compares in the
 * app's language, so Swedish å, ä and ö sort after z. With no sort the
 * register's own order stands.
 */
export function sortRiskClients(
	clients: RiskClient[],
	field: RiskListSortField | null,
	dir: SortDir,
	label: RiskLabel,
	locale: string,
): RiskClient[] {
	if (!field || !dir) return clients;

	const factor = dir === "asc" ? 1 : -1;
	return [...clients].sort((a, b) => {
		const left = sortValue(a, field, label);
		const right = sortValue(b, field, label);
		if (typeof left === "number" && typeof right === "number") return factor * (left - right);
		return factor * String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true });
	});
}
