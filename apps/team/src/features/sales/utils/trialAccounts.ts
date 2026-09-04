import type { SalesCompany, TrialAccount } from "../types";
import { daysUntil } from "./salesFormatters";

/** The most recently started trial, regardless of whether it has expired. */
export function getLatestTrial(accounts: TrialAccount[]): TrialAccount | null {
	if (accounts.length === 0) return null;
	return [...accounts].sort(
		(a, b) =>
			new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
	)[0];
}

/**
 * The trial worth showing in a summary: the first one still running, falling
 * back to the most recent expired one so the cell is never blank when a company
 * has history.
 */
export function getActiveTrial(accounts: TrialAccount[]): TrialAccount | null {
	return (
		accounts.find((account) => daysUntil(account.expiresAt) > 0) ??
		getLatestTrial(accounts)
	);
}

export function hasActiveTrial(accounts: TrialAccount[]): boolean {
	return accounts.some((account) => daysUntil(account.expiresAt) > 0);
}

export function hasActiveDemoAccount(company: SalesCompany): boolean {
	return hasActiveTrial(company.demoAccounts);
}

export function hasActiveTestAccount(company: SalesCompany): boolean {
	return hasActiveTrial(company.testAccounts);
}
