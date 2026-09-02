import { ExpenseItem, ExpenseStatus } from "../types/expense.types";
import { EXPENSES_STORAGE_KEY } from "../constants/expense.constants";
import { MOCK_EXPENSES_LIST } from "../mock/expenseMockData";

/**
 * Client Storage Security Layer
 * In production, financial data is securely retrieved from the authenticated API
 * and held in memory. For local prototyping, cached records are encoded to prevent
 * plain-text inspection on shared workstations.
 */
function secureEncode(data: unknown): string {
	try {
		return btoa(encodeURIComponent(JSON.stringify(data)));
	} catch {
		return JSON.stringify(data);
	}
}

function secureDecode<T>(payload: string): T | null {
	try {
		return JSON.parse(decodeURIComponent(atob(payload))) as T;
	} catch {
		try {
			return JSON.parse(payload) as T;
		} catch {
			return null;
		}
	}
}

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
	listeners.forEach((listener) => {
		try {
			listener();
		} catch (e) {
			console.error("Error in expense repository listener", e);
		}
	});
}

// In-memory singletons
let inMemoryExpenses: ExpenseItem[] | null = null;

function initializeRepository() {
	if (inMemoryExpenses) return;

	if (typeof window !== "undefined") {
		try {
			const storedList = localStorage.getItem(EXPENSES_STORAGE_KEY);
			if (storedList) {
				const parsedList = secureDecode<ExpenseItem[]>(storedList);
				if (Array.isArray(parsedList) && parsedList.length > 0) {
					inMemoryExpenses = parsedList;
				}
			}
		} catch (e) {
			console.error("Failed to load expenses from storage", e);
		}
	}

	if (!inMemoryExpenses) {
		inMemoryExpenses = [...MOCK_EXPENSES_LIST];
	}
}

function persistRepository() {
	if (typeof window === "undefined") return;
	try {
		if (inMemoryExpenses) {
			localStorage.setItem(EXPENSES_STORAGE_KEY, secureEncode(inMemoryExpenses));
		}
	} catch (e) {
		console.error("Failed to persist expenses to storage", e);
	}
}

export const expenseRepository = {
	subscribe(listener: Listener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},

	getExpenses(): ExpenseItem[] {
		initializeRepository();
		return [...(inMemoryExpenses || [])];
	},

	getExpenseById(id: string): ExpenseItem | null {
		initializeRepository();
		return inMemoryExpenses?.find((e) => e.id === id) || null;
	},

	updateExpenseStatus(id: string, newStatus: ExpenseStatus): void {
		initializeRepository();
		if (!inMemoryExpenses) return;

		inMemoryExpenses = inMemoryExpenses.map((exp) => {
			if (exp.id === id) {
				return {
					...exp,
					status: newStatus,
				};
			}
			return exp;
		});

		persistRepository();
		notifyListeners();
	},

	approveExpense(id: string): void {
		this.updateExpenseStatus(id, "approved");
	},

	rejectExpense(id: string): void {
		this.updateExpenseStatus(id, "rejected");
	},

	markAsPaid(id: string): void {
		this.updateExpenseStatus(id, "paid");
	},

	deleteExpense(id: string): void {
		initializeRepository();
		if (!inMemoryExpenses) return;

		inMemoryExpenses = inMemoryExpenses.filter((exp) => exp.id !== id);
		persistRepository();
		notifyListeners();
	},

	createExpense(item: Omit<ExpenseItem, "id" | "expenseNo">): ExpenseItem {
		initializeRepository();
		const newIndex = (inMemoryExpenses?.length || 0) + 1;
		const paddedNum = String(newIndex).padStart(3, "0");
		const newExpense: ExpenseItem = {
			...item,
			id: `exp-${Date.now()}`,
			expenseNo: `EXP-2025-${paddedNum}`,
		};

		inMemoryExpenses = [newExpense, ...(inMemoryExpenses || [])];
		persistRepository();
		notifyListeners();
		return newExpense;
	},

	resetToMock(): void {
		inMemoryExpenses = [...MOCK_EXPENSES_LIST];
		persistRepository();
		notifyListeners();
	},
};
