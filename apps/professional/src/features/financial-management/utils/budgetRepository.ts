import type { EconomyBudgetItem, BudgetFormData, BudgetStatus } from "../types/budget.types";
import { BUDGET_STORAGE_KEY } from "../constants/budget.constants";

const SEED_BUDGETS: EconomyBudgetItem[] = [
	{
		id: "1",
		budgetnr: "1",
		budgetName: "Overhead",
		description: "Overhead kostnader och gemensamma budgetar",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 300000,
		totalInkomst: 50000,
		status: "active",
		isFavorite: true,
		isOverhead: true,
		distributionType: "KR",
		rows: [
			{
				id: "r1",
				konto: "3011",
				kontoName: "3011 - Försäljning inom Sverige",
				kostnadsstalle: "10 - Stockholm",
				arsbudget: 500000,
				fordelning: 0,
				procent: 0,
				months: {
					0: 100000,
					1: 100000,
					2: 0,
					3: 0,
					4: 0,
					5: 42,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
				},
			},
			{
				id: "r2",
				konto: "4010",
				kontoName: "4010 - Inköp av material",
				kostnadsstalle: "10 - Stockholm",
				arsbudget: 300000,
				fordelning: 12,
				procent: 0,
				months: {
					0: -50000,
					1: -50000,
					2: 0,
					3: 0,
					4: 0,
					5: 60,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
				},
			},
		],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "2",
		budgetnr: "2",
		budgetName: "Lagerbudget",
		description: "Lagerhållning och förbrukningsmaterial",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 200000,
		totalInkomst: 50000,
		status: "active",
		isFavorite: false,
		isOverhead: false,
		distributionType: "KR",
		rows: [
			{
				id: "r2-1",
				konto: "4010",
				kontoName: "4010 - Inköp av material",
				kostnadsstalle: "20 - Göteborg",
				arsbudget: 200000,
				fordelning: 12,
				procent: 0,
				months: {
					0: 16667,
					1: 16667,
					2: 16667,
					3: 16667,
					4: 16667,
					5: 16667,
					6: 16667,
					7: 16667,
					8: 16667,
					9: 16667,
					10: 16667,
					11: 16667,
				},
			},
		],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "3",
		budgetnr: "3",
		budgetName: "Event budget",
		description: "Kundevent och marknadsföringstillfällen",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 150000,
		totalInkomst: 25000,
		status: "active",
		isFavorite: false,
		isOverhead: false,
		distributionType: "KR",
		rows: [
			{
				id: "r3-1",
				konto: "6071",
				kontoName: "6071 - Representation",
				kostnadsstalle: "10 - Stockholm",
				arsbudget: 150000,
				fordelning: 0,
				procent: 0,
				months: {
					0: 0,
					1: 0,
					2: 50000,
					3: 0,
					4: 0,
					5: 100000,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
				},
			},
		],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "4",
		budgetnr: "4",
		budgetName: "Marknadsbudget",
		description: "Digital marknadsföring och annonsering",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 180000,
		totalInkomst: 0,
		status: "active",
		isFavorite: false,
		isOverhead: false,
		distributionType: "KR",
		rows: [],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "5",
		budgetnr: "5",
		budgetName: "IT & System",
		description: "Programvarulicenser och molntjänster",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 95000,
		totalInkomst: 0,
		status: "inactive",
		isFavorite: false,
		isOverhead: false,
		distributionType: "KR",
		rows: [],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
	{
		id: "6",
		budgetnr: "6",
		budgetName: "Administration",
		description: "Kontorsmaterial och administrativa tjänster",
		comment: "info",
		tags: "info",
		datum: "2026-01-01",
		totalKostnad: 120000,
		totalInkomst: 0,
		status: "active",
		isFavorite: false,
		isOverhead: true,
		distributionType: "KR",
		rows: [],
		createdAt: "2026-01-01T08:00:00Z",
		updatedAt: "2026-01-01T08:00:00Z",
	},
];

class BudgetRepository {
	private items: EconomyBudgetItem[] = [];
	private initialized = false;

	private init() {
		if (this.initialized) return;

		if (typeof window !== "undefined") {
			try {
				const stored = window.sessionStorage.getItem(BUDGET_STORAGE_KEY);
				if (stored) {
					this.items = JSON.parse(stored);
					this.initialized = true;
					return;
				}
			} catch {
				// Fallback to in-memory
			}
		}

		this.items = [...SEED_BUDGETS];
		this.saveToStorage();
		this.initialized = true;
	}

	private saveToStorage() {
		if (typeof window !== "undefined") {
			try {
				window.sessionStorage.setItem(
					BUDGET_STORAGE_KEY,
					JSON.stringify(this.items),
				);
			} catch {
				// Storage full or unavailable
			}
		}
	}

	getAll(): EconomyBudgetItem[] {
		this.init();
		return [...this.items];
	}

	getById(id: string): EconomyBudgetItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id || item.budgetnr === id);
	}

	/**
	 * The number the next budget will get, so the form can show it while it is
	 * still disabled rather than leaving the field blank.
	 */
	nextBudgetNr(): string {
		this.init();
		const highest = this.items.reduce((max, item) => {
			const parsed = Number(item.budgetnr);
			return Number.isFinite(parsed) && parsed > max ? parsed : max;
		}, 0);
		return String(highest + 1);
	}

	create(data: BudgetFormData): EconomyBudgetItem {
		this.init();
		const newId = String(Date.now());
		const nextBudgetNr = data.budgetnr.trim() ? data.budgetnr : this.nextBudgetNr();

		// Calculate totalKostnad & totalInkomst from rows
		let totalKostnad = 0;
		let totalInkomst = 0;
		for (const row of data.rows || []) {
			const isRevenue = row.konto.startsWith("3");
			const rowSum = Object.values(row.months || {}).reduce(
				(acc, val) => acc + (Number(val) || 0),
				0,
			);
			if (isRevenue) {
				totalInkomst += rowSum > 0 ? rowSum : row.arsbudget;
			} else {
				totalKostnad += Math.abs(rowSum > 0 ? rowSum : row.arsbudget);
			}
		}

		const newItem: EconomyBudgetItem = {
			id: newId,
			budgetnr: nextBudgetNr,
			budgetName: data.budgetName,
			description: data.description || "",
			comment: data.comment || "",
			tags: data.tags || "",
			datum: new Date().toISOString().slice(0, 10),
			/* A budget with no rows totals nothing; it must not invent figures. */
			totalKostnad,
			totalInkomst,
			status: data.status || "active",
			isFavorite: false,
			isOverhead: data.isOverhead || false,
			distributionType: data.distributionType || "KR",
			rows: data.rows || [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.items.unshift(newItem);
		this.saveToStorage();
		return newItem;
	}

	update(id: string, data: Partial<BudgetFormData>): EconomyBudgetItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const existing = this.items[index];
		const updatedRows = data.rows !== undefined ? data.rows : existing.rows;

		let totalKostnad = 0;
		let totalInkomst = 0;
		for (const row of updatedRows) {
			const isRevenue = row.konto.startsWith("3");
			const rowSum = Object.values(row.months || {}).reduce(
				(acc, val) => acc + (Number(val) || 0),
				0,
			);
			if (isRevenue) {
				totalInkomst += rowSum > 0 ? rowSum : row.arsbudget;
			} else {
				totalKostnad += Math.abs(rowSum > 0 ? rowSum : row.arsbudget);
			}
		}

		const updated: EconomyBudgetItem = {
			...existing,
			...data,
			rows: updatedRows,
			totalKostnad: totalKostnad || existing.totalKostnad,
			totalInkomst: totalInkomst || existing.totalInkomst,
			updatedAt: new Date().toISOString(),
		};

		this.items[index] = updated;
		this.saveToStorage();
		return updated;
	}

	delete(id: string): boolean {
		this.init();
		const beforeLength = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== beforeLength) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	toggleFavorite(id: string): boolean {
		this.init();
		const item = this.items.find((i) => i.id === id);
		if (item) {
			item.isFavorite = !item.isFavorite;
			item.updatedAt = new Date().toISOString();
			this.saveToStorage();
			return item.isFavorite;
		}
		return false;
	}

	toggleStatus(id: string): BudgetStatus | undefined {
		this.init();
		const item = this.items.find((i) => i.id === id);
		if (item) {
			item.status = item.status === "active" ? "inactive" : "active";
			item.updatedAt = new Date().toISOString();
			this.saveToStorage();
			return item.status;
		}
		return undefined;
	}

	bulkSetStatus(ids: string[], status: BudgetStatus): void {
		this.init();
		for (const item of this.items) {
			if (ids.includes(item.id)) {
				item.status = status;
				item.updatedAt = new Date().toISOString();
			}
		}
		this.saveToStorage();
	}

	resetSeedData(): void {
		this.items = [...SEED_BUDGETS];
		this.saveToStorage();
	}
}

export const budgetRepository = new BudgetRepository();
