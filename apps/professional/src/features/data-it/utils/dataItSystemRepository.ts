import type { SystemItem } from "../types/dataItSystem.types";
import { initialSystemItems } from "../constants/dataItSystem.mock";

/**
 * Data IT System In-Memory Mock Repository
 * Ephemeral client-side prototype store for mockup data.
 * Does not write credentials to persistent browser storage (localStorage/sessionStorage).
 * Real production credentials will be managed and masked by backend APIs.
 */

type SystemListener = (items: SystemItem[]) => void;
const listeners = new Set<SystemListener>();

function loadInitialItems(): SystemItem[] {
	return [...initialSystemItems];
}

// Global reference prevents instance mismatch across webpack dynamic chunks and route transitions
const globalStore = globalThis as unknown as {
	__TFS_DATA_IT_SYSTEM_RECORDS__?: SystemItem[];
};

let inMemorySystems: SystemItem[] =
	globalStore.__TFS_DATA_IT_SYSTEM_RECORDS__ || loadInitialItems();
globalStore.__TFS_DATA_IT_SYSTEM_RECORDS__ = inMemorySystems;

function notifyListeners(): void {
	globalStore.__TFS_DATA_IT_SYSTEM_RECORDS__ = inMemorySystems;
	const current = [...inMemorySystems];
	listeners.forEach((listener) => {
		try {
			listener(current);
		} catch (e) {
			console.error("Error notifying data-it system listener", e);
		}
	});
}

export const dataItSystemRepository = {
	getAll(): SystemItem[] {
		return [...inMemorySystems];
	},

	getById(id: string): SystemItem | undefined {
		const cleanId = decodeURIComponent(id).trim().replace(/^#/, "");
		return inMemorySystems.find(
			(item) =>
				item.id === cleanId ||
				item.systemId === id ||
				item.systemId.replace(/^#/, "") === cleanId,
		);
	},

	create(item: SystemItem): void {
		inMemorySystems = [item, ...inMemorySystems];
		notifyListeners();
	},

	update(id: string, updates: Partial<SystemItem>): void {
		const cleanId = decodeURIComponent(id).trim().replace(/^#/, "");
		inMemorySystems = inMemorySystems.map((item) => {
			if (item.id === cleanId || item.id === id) {
				return {
					...item,
					...updates,
				};
			}
			return item;
		});
		notifyListeners();
	},

	delete(id: string): void {
		const cleanId = decodeURIComponent(id).trim().replace(/^#/, "");
		inMemorySystems = inMemorySystems.filter(
			(item) => item.id !== cleanId && item.id !== id,
		);
		notifyListeners();
	},

	subscribe(listener: SystemListener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
};

export default dataItSystemRepository;
