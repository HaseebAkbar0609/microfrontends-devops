import { ExpenseItem, ExpenseStatus, SupplierInfo } from "../types/expense.types";
import { initialExpensesMock } from "../mock/expenseMockData";
import { DEFAULT_SUPPLIERS_LIST, DEFAULT_SUPPLIERS_METADATA } from "../constants/expense.constants";

/**
 * Expense Repository (Standard #6: Security & Sensitive Data)
 * Financial and PII records are maintained strictly in-memory during client sessions
 * to avoid insecure plain-text or easily reversible storage on client disks.
 * Exposes both async contracts for future backend API alignment and reactive subscription.
 */

type ExpenseListener = (items: ExpenseItem[]) => void;
const listeners = new Set<ExpenseListener>();

// Strict in-memory store for PII and financial records
let inMemoryExpenses: ExpenseItem[] = [...initialExpensesMock];
let inMemorySuppliers: string[] = [...DEFAULT_SUPPLIERS_LIST];
const inMemorySupplierDetails: Record<string, SupplierInfo> = { ...DEFAULT_SUPPLIERS_METADATA };

function notifyListeners(): void {
	const current = [...inMemoryExpenses];
	listeners.forEach((listener) => {
		try {
			listener(current);
		} catch (e) {
			console.error("Error notifying expense listener", e);
		}
	});
}

export const expenseRepository = {
	/**
	 * Subscribe to repository mutations
	 */
	subscribe(listener: ExpenseListener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},

	/**
	 * Synchronous getter for immediate client rendering
	 */
	getAllExpenses(): ExpenseItem[] {
		return [...inMemoryExpenses];
	},

	/**
	 * Async contract for future REST / GraphQL API synchronization
	 */
	async fetchExpenses(): Promise<ExpenseItem[]> {
		return Promise.resolve([...inMemoryExpenses]);
	},

	/**
	 * Get single expense by ID
	 */
	getExpenseById(id: string): ExpenseItem | null {
		return inMemoryExpenses.find((e) => e.id === id) || null;
	},

	/**
	 * Update status of an expense
	 */
	async updateExpenseStatus(id: string, newStatus: ExpenseStatus): Promise<ExpenseItem | null> {
		const index = inMemoryExpenses.findIndex((e) => e.id === id);
		if (index === -1) return null;

		const updated: ExpenseItem = {
			...inMemoryExpenses[index],
			status: newStatus,
		};

		inMemoryExpenses = [
			...inMemoryExpenses.slice(0, index),
			updated,
			...inMemoryExpenses.slice(index + 1),
		];

		notifyListeners();
		return updated;
	},

	/**
	 * Update generic fields of an expense
	 */
	async updateExpense(id: string, updates: Partial<ExpenseItem>): Promise<ExpenseItem | null> {
		const index = inMemoryExpenses.findIndex((e) => e.id === id);
		if (index === -1) return null;

		const updated: ExpenseItem = {
			...inMemoryExpenses[index],
			...updates,
		};

		inMemoryExpenses = [
			...inMemoryExpenses.slice(0, index),
			updated,
			...inMemoryExpenses.slice(index + 1),
		];

		notifyListeners();
		return updated;
	},

	/**
	 * Add a new expense record with async API contract
	 */
	async addExpense(expense: ExpenseItem): Promise<ExpenseItem> {
		inMemoryExpenses = [expense, ...inMemoryExpenses];
		notifyListeners();
		return expense;
	},

	/**
	 * Get current list of suppliers
	 */
	getSuppliers(): string[] {
		return [...inMemorySuppliers];
	},

	/**
	 * Get supplier details by name
	 */
	getSupplierDetails(name: string): SupplierInfo | undefined {
		if (!name) return undefined;
		return inMemorySupplierDetails[name];
	},

	/**
	 * Add a new supplier to the system
	 */
	addSupplier(name: string, details?: Partial<SupplierInfo>): void {
		const trimmed = name.trim();
		if (trimmed) {
			if (!inMemorySuppliers.includes(trimmed)) {
				inMemorySuppliers = [trimmed, ...inMemorySuppliers];
			}
			inMemorySupplierDetails[trimmed] = {
				name: trimmed,
				orgNo: details?.orgNo || "—",
				address: details?.address || "—",
				postalCity: details?.postalCity || "",
				phone: details?.phone || "",
				email: details?.email || "",
				bankgiro: details?.bankgiro || "",
				fTax: details?.fTax ?? true,
			};
		}
	},

	/**
	 * Delete an expense record with async API contract
	 */
	async deleteExpense(id: string): Promise<boolean> {
		const initialLength = inMemoryExpenses.length;
		inMemoryExpenses = inMemoryExpenses.filter((e) => e.id !== id);
		const removed = inMemoryExpenses.length < initialLength;
		if (removed) {
			notifyListeners();
		}
		return removed;
	},

	/**
	 * Reset in-memory state to initial mock data (for testing & development)
	 */
	reset(): void {
		inMemoryExpenses = [...initialExpensesMock];
		inMemorySuppliers = [...DEFAULT_SUPPLIERS_LIST];
		notifyListeners();
	},
};

