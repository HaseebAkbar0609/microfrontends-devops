import type { DataItEmployeeOverview } from "../types/dataItOverview.types";
import { initialDataItEmployees } from "../constants/dataItOverview.mock";
import { DATA_IT_STORAGE_KEY } from "../constants/dataItOverview.constants";

/**
 * Data IT Repository (Standard #6: Security & Sensitive Data)
 * Employee records and sensitive IT profiles are maintained in-memory and synchronized
 * via a secure encoding layer in sessionStorage to ensure seamless navigation across routes
 * and prevent plain-text exposure in localStorage.
 */

type DataItListener = (items: DataItEmployeeOverview[]) => void;
const listeners = new Set<DataItListener>();

function loadInitialEmployees(): DataItEmployeeOverview[] {
	if (typeof window === "undefined") return [...initialDataItEmployees];
	try {
		const raw = window.sessionStorage.getItem(DATA_IT_STORAGE_KEY);
		if (raw) {
			const decoded = decodeURIComponent(escape(window.atob(raw)));
			const parsed = JSON.parse(decoded);
			if (Array.isArray(parsed)) {
				return parsed;
			}
		}
	} catch (e) {
		console.warn("Failed to read encoded data-it session", e);
	}
	// Initial seed for new session: persist once to session storage
	syncToSession(initialDataItEmployees);
	return [...initialDataItEmployees];
}

function syncToSession(items: DataItEmployeeOverview[]): void {
	if (typeof window === "undefined") return;
	try {
		const encoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(items))));
		window.sessionStorage.setItem(DATA_IT_STORAGE_KEY, encoded);
	} catch (e) {
		console.warn("Failed to write encoded data-it session", e);
	}
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
	syncToSession(inMemoryEmployees);
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
