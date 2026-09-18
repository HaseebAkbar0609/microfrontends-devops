import type {
	CustomerOverviewRow,
	GetCustomerOverviewListParams,
	GetCustomerOverviewListResponse,
} from "../types/customerOverview.types";
import {
	STORAGE_KEY_CUSTOMERS,
	DEFAULT_CUSTOMER_PAGE_SIZE,
} from "../constants/customerOverview.constants";
import { MOCK_CUSTOMER_OVERVIEW_LIST } from "../mock/customerOverviewMockData";

type Listener = () => void;

class CustomerOverviewRepository {
	private items: CustomerOverviewRow[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (typeof window === "undefined") {
			this.items = [...MOCK_CUSTOMER_OVERVIEW_LIST];
			this.isInitialized = true;
			return;
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
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

		this.items = [...MOCK_CUSTOMER_OVERVIEW_LIST];
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
			localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(this.items));
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

	public getAll(): CustomerOverviewRow[] {
		this.ensureInitialized();
		return [...this.items];
	}

	public getById(id: string): CustomerOverviewRow | undefined {
		this.ensureInitialized();
		return this.items.find((c) => c.id === id);
	}

	public delete(id: string): boolean {
		this.ensureInitialized();
		const index = this.items.findIndex((c) => c.id === id);
		if (index === -1) return false;

		this.items.splice(index, 1);
		this.persist();
		this.notify();
		return true;
	}

	public add(customer: Omit<CustomerOverviewRow, "id">): CustomerOverviewRow {
		this.ensureInitialized();
		const newCustomer: CustomerOverviewRow = {
			...customer,
			id: `cust-${Date.now()}`,
		};
		this.items.unshift(newCustomer);
		this.persist();
		this.notify();
		return newCustomer;
	}

	public update(id: string, updates: Partial<CustomerOverviewRow>): CustomerOverviewRow | undefined {
		this.ensureInitialized();
		const index = this.items.findIndex((c) => c.id === id);
		if (index === -1) return undefined;

		this.items[index] = { ...this.items[index], ...updates };
		this.persist();
		this.notify();
		return this.items[index];
	}

	public query(params?: GetCustomerOverviewListParams): GetCustomerOverviewListResponse {
		this.ensureInitialized();
		let filtered = [...this.items];

		if (params?.search) {
			const q = params.search.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.name.toLowerCase().includes(q) ||
					c.customerNo.toLowerCase().includes(q) ||
					c.orgNo.toLowerCase().includes(q) ||
					c.city.toLowerCase().includes(q) ||
					c.address.toLowerCase().includes(q) ||
					c.email.toLowerCase().includes(q) ||
					c.phone.toLowerCase().includes(q),
			);
		}

		if (params?.status && params.status !== "all") {
			filtered = filtered.filter((c) => c.status === params.status);
		}

		if (params?.sortBy) {
			const key = params.sortBy as keyof CustomerOverviewRow;
			const isAsc = params.sortOrder !== "desc";
			filtered.sort((a, b) => {
				const aVal = String(a[key] ?? "");
				const bVal = String(b[key] ?? "");
				return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			});
		}

		const page = params?.page ?? 1;
		const limit = params?.limit ?? DEFAULT_CUSTOMER_PAGE_SIZE;
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

export const customerOverviewRepository = new CustomerOverviewRepository();
