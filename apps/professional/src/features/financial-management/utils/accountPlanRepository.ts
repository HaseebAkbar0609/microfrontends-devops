import { ACCOUNT_PLAN_STORAGE_KEY } from "../constants/accountPlan.constants";
import {
	INITIAL_ACCOUNT_PLAN_MOCK_DATA,
	INITIAL_IMPORT_MAPPING_ROWS,
} from "../mock/accountPlanMockData";
import type {
	AccountPlanItem,
	AccountStatus,
	CreateAccountFormData,
	ImportAccountRow,
	ImportAccountSettings,
} from "../types/accountPlan.types";

const IMPORT_ROWS_STORAGE_KEY = `${ACCOUNT_PLAN_STORAGE_KEY}_import_rows`;

class AccountPlanRepository {
	private items: AccountPlanItem[] = [];
	private importRows: ImportAccountRow[] = [];
	private initialized = false;
	private listeners: Set<() => void> = new Set();

	constructor() {
		this.init();
	}

	private init() {
		if (typeof window === "undefined") {
			if (!this.initialized) {
				this.items = [...INITIAL_ACCOUNT_PLAN_MOCK_DATA];
				this.importRows = [...INITIAL_IMPORT_MAPPING_ROWS];
				this.initialized = true;
			}
			return;
		}

		try {
			const stored = localStorage.getItem(ACCOUNT_PLAN_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.items = parsed;
				} else {
					this.items = [...INITIAL_ACCOUNT_PLAN_MOCK_DATA];
				}
			} else {
				this.items = [...INITIAL_ACCOUNT_PLAN_MOCK_DATA];
			}

			const storedImport = localStorage.getItem(IMPORT_ROWS_STORAGE_KEY);
			if (storedImport) {
				const parsedImport = JSON.parse(storedImport);
				if (Array.isArray(parsedImport) && parsedImport.length > 0) {
					this.importRows = parsedImport;
				} else {
					this.importRows = [...INITIAL_IMPORT_MAPPING_ROWS];
				}
			} else {
				this.importRows = [...INITIAL_IMPORT_MAPPING_ROWS];
			}

			this.initialized = true;
		} catch (e) {
			console.error("Failed to parse stored account plan data:", e);
			this.items = [...INITIAL_ACCOUNT_PLAN_MOCK_DATA];
			this.importRows = [...INITIAL_IMPORT_MAPPING_ROWS];
			this.initialized = true;
		}
	}

	private saveToStorage() {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(
				ACCOUNT_PLAN_STORAGE_KEY,
				JSON.stringify(this.items),
			);
			localStorage.setItem(
				IMPORT_ROWS_STORAGE_KEY,
				JSON.stringify(this.importRows),
			);
		} catch (e) {
			console.error("Failed to save account plan data:", e);
		}
		this.notify();
	}

	public subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notify() {
		this.listeners.forEach((listener) => {
			try {
				listener();
			} catch (e) {
				console.error("Account plan listener error:", e);
			}
		});
	}

	getAll(): AccountPlanItem[] {
		this.init();
		return [...this.items];
	}

	getById(id: string): AccountPlanItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id || item.kontoNr === id);
	}

	create(data: CreateAccountFormData): AccountPlanItem {
		this.init();
		const now = new Date().toISOString();
		const newItem: AccountPlanItem = {
			id: `acc_${Date.now()}`,
			kontoNr: data.kontoNr,
			benamning: data.benamning,
			momskod: data.momskod || "-",
			sru: data.sru || "102",
			automatkont: "SEK",
			ingaendeBalans: data.ingaendeBalans || "0",
			budget: "0",
			status: data.aktivt === "Inaktiv" ? "inactive" : "active",
			aktivt: data.aktivt || "Beijer",
			kostnadsstalleMode: data.kostnadsstalleMode || "obligatoriskt",
			projektMode: data.projektMode || "obligatoriskt",
			foreslaKostnadsstalle: data.foreslaKostnadsstalle || "Kontor 10",
			foreslaProjekt: data.foreslaProjekt || "",
			description: "",
			createdAt: now,
			updatedAt: now,
		};

		this.items = [newItem, ...this.items];
		this.saveToStorage();
		return newItem;
	}

	update(id: string, data: Partial<AccountPlanItem>): AccountPlanItem | undefined {
		this.init();
		const index = this.items.findIndex(
			(item) => item.id === id || item.kontoNr === id,
		);
		if (index === -1) return undefined;

		const existing = this.items[index];
		const updated: AccountPlanItem = {
			...existing,
			...data,
			updatedAt: new Date().toISOString(),
		};

		this.items[index] = updated;
		this.saveToStorage();
		return updated;
	}

	delete(id: string): boolean {
		this.init();
		const initialLen = this.items.length;
		this.items = this.items.filter(
			(item) => item.id !== id && item.kontoNr !== id,
		);
		if (this.items.length !== initialLen) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	bulkUpdateStatus(ids: string[], status: AccountStatus): void {
		this.init();
		let changed = false;
		this.items = this.items.map((item) => {
			if (ids.includes(item.id) || ids.includes(item.kontoNr)) {
				changed = true;
				return {
					...item,
					status,
					aktivt: status === "active" ? "Aktiv" : "Inaktiv",
					updatedAt: new Date().toISOString(),
				};
			}
			return item;
		});

		if (changed) {
			this.saveToStorage();
		}
	}

	getImportRows(): ImportAccountRow[] {
		this.init();
		return [...this.importRows];
	}

	updateImportRow(id: string, updates: Partial<ImportAccountRow>): void {
		this.init();
		this.importRows = this.importRows.map((r) =>
			r.id === id ? { ...r, ...updates } : r,
		);
		this.saveToStorage();
	}

	executeImport(
		settings: ImportAccountSettings,
		rows: ImportAccountRow[],
	): number {
		this.init();
		let count = 0;
		const now = new Date().toISOString();

		rows.forEach((row) => {
			if (row.action === "ignorera") return;

			const existingIndex = this.items.findIndex(
				(item) => item.kontoNr === row.targetKonto,
			);

			if (existingIndex >= 0) {
				// Koppla / Update existing
				const existing = this.items[existingIndex];
				this.items[existingIndex] = {
					...existing,
					benamning:
						settings.anvandBenamningFran === "sie_fil"
							? row.sourceBenamning
							: (row.targetBenamning || existing.benamning),
					momskod:
						row.momskodPercent && row.momskodPercent !== "-"
							? row.momskodPercent
							: existing.momskod,
					updatedAt: now,
				};
				count++;
			} else {
				// Skapa nytt
				const newItem: AccountPlanItem = {
					id: `acc_${Date.now()}_${count}`,
					kontoNr: row.targetKonto || row.sourceKonto,
					benamning: row.targetBenamning || row.sourceBenamning,
					momskod: row.momskodPercent || "-",
					sru: "102",
					automatkont: "SEK",
					ingaendeBalans: "0",
					budget: "0",
					status: "active",
					aktivt: "Aktiv",
					kostnadsstalleMode: "obligatoriskt",
					projektMode: "obligatoriskt",
					foreslaKostnadsstalle: "Kontor 10",
					foreslaProjekt: "",
					createdAt: now,
					updatedAt: now,
				};
				this.items.push(newItem);
				count++;
			}
		});

		this.items.sort((a, b) =>
			a.kontoNr.localeCompare(b.kontoNr, undefined, { numeric: true }),
		);

		this.saveToStorage();
		return count;
	}

	resetSeedData() {
		this.items = [...INITIAL_ACCOUNT_PLAN_MOCK_DATA];
		this.importRows = [...INITIAL_IMPORT_MAPPING_ROWS];
		this.saveToStorage();
	}
}

export const accountPlanRepository = new AccountPlanRepository();
