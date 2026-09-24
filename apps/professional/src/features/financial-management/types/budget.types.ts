import type { SortOrder } from "./invoice.types";

export type BudgetStatus = "active" | "inactive";

export interface BudgetLineItem {
	id: string;
	konto: string;
	kontoName?: string;
	kostnadsstalle: string;
	arsbudget: number;
	fordelning: number | string;
	procent: number;
	months: Record<number, number>; // index 0 to 11 (Jan to Dec)
}

export interface EconomyBudgetItem {
	id: string;
	budgetnr: string;
	budgetName: string;
	description?: string;
	comment?: string;
	tags?: string;
	datum: string;
	totalKostnad: number;
	totalInkomst: number;
	status: BudgetStatus;
	isFavorite: boolean;
	isOverhead: boolean;
	distributionType: string;
	rows: BudgetLineItem[];
	createdAt: string;
	updatedAt: string;
}

export interface BudgetFormData {
	id?: string;
	budgetnr: string;
	budgetName: string;
	description?: string;
	comment?: string;
	tags?: string;
	status: BudgetStatus;
	isOverhead: boolean;
	distributionType: string;
	rows: BudgetLineItem[];
}

export interface BudgetFilterState {
	searchQuery: string;
	statusFilter: "all" | "active" | "inactive" | "overhead";
	dateFilter?: string;
}

export type BudgetSortField =
	| "budgetnr"
	| "budgetName"
	| "datum"
	| "totalKostnad"
	| "totalInkomst";

export type { SortOrder };

