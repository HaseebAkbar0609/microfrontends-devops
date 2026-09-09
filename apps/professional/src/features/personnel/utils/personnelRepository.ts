import { EmployeeOverviewItem, EmployeeStatus } from "../types/personnelOverview.types";
import { MOCK_PERSONNEL_OVERVIEW } from "../mock/personnelOverview.mock";

/**
 * Personnel Repository (Standard #6: Security & Sensitive Data)
 * Employee records and PII are maintained strictly in-memory during client sessions
 * to avoid insecure plain-text or easily reversible storage on client disks.
 * Exposes both async contracts for future backend API alignment and reactive subscription.
 */

type PersonnelListener = (items: EmployeeOverviewItem[]) => void;
const listeners = new Set<PersonnelListener>();

// Strict in-memory store for PII and personnel records
let inMemoryEmployees: EmployeeOverviewItem[] = [...MOCK_PERSONNEL_OVERVIEW];

function notifyListeners(): void {
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
