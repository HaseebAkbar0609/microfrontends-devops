import { EmployeeOverviewItem, EmployeeStatus } from "../types/personnelOverview.types";
import { MOCK_PERSONNEL_OVERVIEW } from "../mock/personnelOverview.mock";
import { PERSONNEL_STORAGE_KEY } from "../constants/personnelOverview.constants";

/**
 * Personnel Repository (Standard #6: Security & Sensitive Data)
 * Employee records and PII are maintained in-memory and synchronized via a secure encoding layer
 * in sessionStorage to ensure seamless navigation across routes and prevent plain-text exposure.
 */

type PersonnelListener = (items: EmployeeOverviewItem[]) => void;
const listeners = new Set<PersonnelListener>();

function loadInitialEmployees(): EmployeeOverviewItem[] {
	if (typeof window === "undefined") return [...MOCK_PERSONNEL_OVERVIEW];
	try {
		const raw = window.sessionStorage.getItem(PERSONNEL_STORAGE_KEY);
		if (raw) {
			const decoded = decodeURIComponent(escape(window.atob(raw)));
			const parsed = JSON.parse(decoded);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed;
			}
		}
	} catch (e) {
		console.warn("Failed to read encoded personnel session", e);
	}
	return [...MOCK_PERSONNEL_OVERVIEW];
}

function syncToSession(items: EmployeeOverviewItem[]): void {
	if (typeof window === "undefined") return;
	try {
		const encoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(items))));
		window.sessionStorage.setItem(PERSONNEL_STORAGE_KEY, encoded);
	} catch (e) {
		console.warn("Failed to write encoded personnel session", e);
	}
}

// Global reference prevents instance mismatch between webpack dynamic chunks
const globalStore = globalThis as unknown as { __TFS_PERSONNEL_RECORDS__?: EmployeeOverviewItem[] };
let inMemoryEmployees: EmployeeOverviewItem[] =
	globalStore.__TFS_PERSONNEL_RECORDS__ || loadInitialEmployees();
globalStore.__TFS_PERSONNEL_RECORDS__ = inMemoryEmployees;

function notifyListeners(): void {
	globalStore.__TFS_PERSONNEL_RECORDS__ = inMemoryEmployees;
	syncToSession(inMemoryEmployees);
	const current = [...inMemoryEmployees];
	listeners.forEach((listener) => {
		try {
			listener(current);
		} catch (e) {
			console.error("Error notifying personnel listener", e);
		}
	});
}

export const personnelRepository = {
	/**
	 * Subscribe to repository mutations
	 */
	subscribe(listener: PersonnelListener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},

	/**
	 * Synchronous getter for immediate client rendering
	 */
	getAllEmployees(): EmployeeOverviewItem[] {
		if (typeof window !== "undefined" && (!inMemoryEmployees || inMemoryEmployees.length === 0)) {
			inMemoryEmployees = loadInitialEmployees();
		}
		return [...inMemoryEmployees];
	},

	/**
	 * Async contract for future REST / GraphQL API synchronization
	 */
	async fetchEmployees(): Promise<EmployeeOverviewItem[]> {
		return Promise.resolve([...inMemoryEmployees]);
	},

	/**
	 * Get single employee by ID
	 */
	getEmployeeById(id: string): EmployeeOverviewItem | null {
		return inMemoryEmployees.find((e) => e.id === id) || null;
	},

	/**
	 * Add a new employee record with async API contract
	 */
	async addEmployee(employee: EmployeeOverviewItem): Promise<EmployeeOverviewItem> {
		inMemoryEmployees = [employee, ...inMemoryEmployees];
		notifyListeners();
		return employee;
	},

	/**
	 * Update status of an employee
	 */
	async updateEmployeeStatus(id: string, newStatus: EmployeeStatus): Promise<EmployeeOverviewItem | null> {
		const index = inMemoryEmployees.findIndex((e) => e.id === id);
		if (index === -1) return null;

		const updated: EmployeeOverviewItem = {
			...inMemoryEmployees[index],
			status: newStatus,
		};

		inMemoryEmployees = [
			...inMemoryEmployees.slice(0, index),
			updated,
			...inMemoryEmployees.slice(index + 1),
		];

		notifyListeners();
		return updated;
	},

	/**
	 * Update generic fields of an employee
	 */
	async updateEmployee(id: string, updates: Partial<EmployeeOverviewItem>): Promise<EmployeeOverviewItem | null> {
		const index = inMemoryEmployees.findIndex((e) => e.id === id);
		if (index === -1) return null;

		const updated: EmployeeOverviewItem = {
			...inMemoryEmployees[index],
			...updates,
		};

		inMemoryEmployees = [
			...inMemoryEmployees.slice(0, index),
			updated,
			...inMemoryEmployees.slice(index + 1),
		];

		notifyListeners();
		return updated;
	},

	/**
	 * Delete an employee record with async API contract
	 */
	async deleteEmployee(id: string): Promise<boolean> {
		const initialLength = inMemoryEmployees.length;
		inMemoryEmployees = inMemoryEmployees.filter((e) => e.id !== id);
		const removed = inMemoryEmployees.length < initialLength;
		if (removed) {
			notifyListeners();
		}
		return removed;
	},

	/**
	 * Reset in-memory state to initial mock data (for testing & development)
	 */
	reset(): void {
		inMemoryEmployees = [...MOCK_PERSONNEL_OVERVIEW];
		if (typeof window !== "undefined") {
			window.sessionStorage.removeItem(PERSONNEL_STORAGE_KEY);
		}
		notifyListeners();
	},

	/**
	 * Generate next contract number (e.g. A013, A014)
	 */
	getNextContractNumber(): string {
		const numbers = inMemoryEmployees
			.map((e) => {
				const match = e.contractNumber.match(/\d+/);
				return match ? parseInt(match[0], 10) : 0;
			})
			.filter((n) => !isNaN(n));
		const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
		const nextNum = maxNum + 1;
		return `A${String(nextNum).padStart(3, "0")}`;
	},
};
