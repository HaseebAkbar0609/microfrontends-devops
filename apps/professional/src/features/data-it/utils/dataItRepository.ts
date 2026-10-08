import type { DataItEmployeeOverview } from "../types/dataItOverview.types";
import { initialDataItEmployees } from "../constants/dataItOverview.mock";

/**
 * Data IT In-Memory Repository
 * Employee mock records are maintained in-memory across client navigation.
 * No personal data (PII) is written to browser storage.
 */

type DataItListener = (items: DataItEmployeeOverview[]) => void;
const listeners = new Set<DataItListener>();

function loadInitialEmployees(): DataItEmployeeOverview[] {
	return [...initialDataItEmployees];
}

// Global reference prevents instance mismatch between webpack dynamic chunks
const globalStore = globalThis as unknown as {
	__TFS_DATA_IT_RECORDS__?: DataItEmployeeOverview[];
};

let inMemoryEmployees: DataItEmployeeOverview[] =
	globalStore.__TFS_DATA_IT_RECORDS__ || loadInitialEmployees();
globalStore.__TFS_DATA_IT_RECORDS__ = inMemoryEmployees;

function notifyListeners(): void {
	globalStore.__TFS_DATA_IT_RECORDS__ = inMemoryEmployees;
	const current = [...inMemoryEmployees];
	listeners.forEach((listener) => {
		try {
			listener(current);
		} catch (e) {
			console.error("Error notifying data-it listener", e);
		}
	});
}

export const dataItRepository = {
	getAll(): DataItEmployeeOverview[] {
		return [...inMemoryEmployees];
	},

	getById(id: string): DataItEmployeeOverview | undefined {
		const cleanId = decodeURIComponent(id).trim();
		return inMemoryEmployees.find(
			(e) =>
				e.id === cleanId ||
				e.personCode === cleanId ||
				e.id.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "") ||
				`#${e.id}` === cleanId,
		);
	},

	update(updated: DataItEmployeeOverview): void {
		inMemoryEmployees = inMemoryEmployees.map((e) =>
			e.id === updated.id ? updated : e,
		);
		notifyListeners();
	},

	delete(id: string): void {
		inMemoryEmployees = inMemoryEmployees.filter((e) => e.id !== id);
		notifyListeners();
	},

	subscribe(listener: DataItListener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
};
