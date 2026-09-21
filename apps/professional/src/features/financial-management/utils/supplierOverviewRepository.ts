import type {
	SupplierOverviewRow,
	GetSupplierOverviewListParams,
	GetSupplierOverviewListResponse,
} from "../types/supplierOverview.types";
import {
	STORAGE_KEY_SUPPLIERS,
	DEFAULT_SUPPLIER_PAGE_SIZE,
} from "../constants/supplierOverview.constants";
import { MOCK_SUPPLIER_OVERVIEW_LIST } from "../mock/supplierOverviewMockData";

type Listener = () => void;

class SupplierOverviewRepository {
	private items: SupplierOverviewRow[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (typeof window === "undefined") {
			this.items = [...MOCK_SUPPLIER_OVERVIEW_LIST];
			this.isInitialized = true;
			return;
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.items = parsed;
					this.isInitialized = true;
					return;
				}
			}
		} catch {
			// localStorage error fallback
		}

		this.items = [...MOCK_SUPPLIER_OVERVIEW_LIST];
		this.persist();
		this.isInitialized = true;
	}

	private ensureInitialized(): void {
		if (!this.isInitialized) {
			this.init();
		}
	}

	private persist(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(this.items));
		} catch {
			// Ignore localStorage write error
		}
	}

	private notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch {
				// Ignore listener errors
			}
		}
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	public getAll(): SupplierOverviewRow[] {
		this.ensureInitialized();
		return [...this.items];
	}

	public getById(id: string): SupplierOverviewRow | undefined {
		this.ensureInitialized();
		return this.items.find((s) => s.id === id);
	}

	public delete(id: string): boolean {
		this.ensureInitialized();
		const index = this.items.findIndex((s) => s.id === id);
		if (index === -1) return false;

		this.items.splice(index, 1);
		this.persist();
		this.notify();
		return true;
	}

	public add(supplier: Omit<SupplierOverviewRow, "id">): SupplierOverviewRow {
		this.ensureInitialized();
		const newSupplier: SupplierOverviewRow = {
			...supplier,
			id: `supp-${Date.now()}`,
		};
		this.items.unshift(newSupplier);
		this.persist();
		this.notify();
		return newSupplier;
	}

	public update(id: string, updates: Partial<SupplierOverviewRow>): SupplierOverviewRow | undefined {
		this.ensureInitialized();
		const index = this.items.findIndex((s) => s.id === id);
		if (index === -1) return undefined;

		this.items[index] = { ...this.items[index], ...updates };
		this.persist();
		this.notify();
		return this.items[index];
	}

	public query(params?: GetSupplierOverviewListParams): GetSupplierOverviewListResponse {
		this.ensureInitialized();
		let filtered = [...this.items];

		if (params?.search) {
			const q = params.search.toLowerCase();
			filtered = filtered.filter(
				(s) =>
					s.name.toLowerCase().includes(q) ||
					s.levNr.toLowerCase().includes(q) ||
					s.orgNo.toLowerCase().includes(q) ||
					s.city.toLowerCase().includes(q) ||
					s.address.toLowerCase().includes(q) ||
					s.email.toLowerCase().includes(q) ||
					s.phone.toLowerCase().includes(q),
			);
		}

		if (params?.status && params.status !== "all") {
			filtered = filtered.filter((s) => s.status === params.status);
		}

		if (params?.sortBy) {
			const key = params.sortBy as keyof SupplierOverviewRow;
			const isAsc = params.sortOrder !== "desc";
			filtered.sort((a, b) => {
				const aVal = String(a[key] ?? "");
				const bVal = String(b[key] ?? "");
				return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			});
		}

		const page = params?.page ?? 1;
		const limit = params?.limit ?? DEFAULT_SUPPLIER_PAGE_SIZE;
		const start = (page - 1) * limit;
		const paged = filtered.slice(start, start + limit);

		return {
			data: paged,
			total: filtered.length,
			page,
			limit,
			totalPages: Math.ceil(filtered.length / limit) || 1,
		};
	}
}

export const supplierOverviewRepository = new SupplierOverviewRepository();
