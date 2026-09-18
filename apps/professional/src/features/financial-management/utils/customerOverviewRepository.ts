import type {
	CustomerOverviewItem,
	CustomerFilters,
} from "../types/customers.types";
import { STORAGE_KEY_CUSTOMERS } from "../constants/customerOverview.constants";

const SEED_CUSTOMERS: CustomerOverviewItem[] = [
	{
		id: "cust-1",
		customerNo: "#M101",
		name: "Byggmästarna i Stockholm AB",
		orgNo: "556123-4567",
		address: "Sveavägen 45",
		postNr: "111 34",
		city: "Stockholm",
		country: "Sverige",
		phone: "08-123 45 67",
		email: "ekonomi@byggmastarna.se",
		status: "active",
		dateAdded: "2024-01-15",
		category: "Bygg & Anläggning",
	},
	{
		id: "cust-2",
		customerNo: "#M102",
		name: "Nordic Tech Solutions AB",
		orgNo: "556789-0123",
		address: "Kungsgatan 12",
		postNr: "111 43",
		city: "Stockholm",
		country: "Sverige",
		phone: "08-765 43 21",
		email: "kontakt@nordictech.se",
		status: "active",
		dateAdded: "2024-02-10",
		category: "Konsulttjänster",
	},
	{
		id: "cust-3",
		customerNo: "#M103",
		name: "Anders Lindström",
		orgNo: "19820412-2391",
		address: "Strandvägen 8B",
		postNr: "114 56",
		city: "Stockholm",
		country: "Sverige",
		phone: "070-112 23 34",
		email: "anders.lindstrom@gmail.com",
		status: "active",
		dateAdded: "2024-03-01",
		category: "Privatperson",
	},
	{
		id: "cust-4",
		customerNo: "#M104",
		name: "Mälardalens Fastigheter AB",
		orgNo: "556456-7890",
		address: "Hamngatan 3",
		postNr: "722 12",
		city: "Västerås",
		country: "Sverige",
		phone: "021-34 56 78",
		email: "info@malardalensfast.se",
		status: "prospect",
		dateAdded: "2024-03-12",
		category: "Fastighet",
	},
	{
		id: "cust-5",
		customerNo: "#M105",
		name: "Karin Bergqvist",
		orgNo: "19781105-4428",
		address: "Vasagatan 22",
		postNr: "411 24",
		city: "Göteborg",
		country: "Sverige",
		phone: "073-987 65 43",
		email: "karin.bergqvist@outlook.com",
		status: "active",
		dateAdded: "2024-04-05",
		category: "Privatperson",
	},
];

class CustomerOverviewRepository {
	private items: CustomerOverviewItem[] = [];
	private initialized = false;

	private init(): void {
		if (this.initialized) return;
		if (typeof window === "undefined") {
			this.items = [...SEED_CUSTOMERS];
			this.initialized = true;
			return;
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.items = parsed;
					this.initialized = true;
					return;
				}
			}
		} catch {
			// fallback to seed
		}

		this.items = [...SEED_CUSTOMERS];
		this.save();
		this.initialized = true;
	}

	private save(): void {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(this.items));
			} catch {
				// storage error fallback
			}
		}
	}

	public getAll(): CustomerOverviewItem[] {
		this.init();
		return [...this.items];
	}

	public getById(id: string): CustomerOverviewItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id);
	}

	public add(customer: Omit<CustomerOverviewItem, "id">): CustomerOverviewItem {
		this.init();
		const newItem: CustomerOverviewItem = {
			...customer,
			id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		};
		this.items = [newItem, ...this.items];
		this.save();
		return newItem;
	}

	public update(id: string, updates: Partial<CustomerOverviewItem>): CustomerOverviewItem | null {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return null;

		this.items[index] = { ...this.items[index], ...updates };
		this.save();
		return this.items[index];
	}

	public delete(id: string): boolean {
		this.init();
		const initialLength = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== initialLength) {
			this.save();
			return true;
		}
		return false;
	}

	public query(filters: Partial<CustomerFilters>): CustomerOverviewItem[] {
		this.init();
		return this.items.filter((item) => {
			if (filters.status && filters.status !== "all" && item.status !== filters.status) {
				return false;
			}
			if (filters.search) {
				const q = filters.search.toLowerCase();
				const matchName = item.name.toLowerCase().includes(q);
				const matchNo = item.customerNo.toLowerCase().includes(q);
				const matchOrg = item.orgNo.toLowerCase().includes(q);
				const matchEmail = item.email.toLowerCase().includes(q);
				const matchCity = item.city.toLowerCase().includes(q);
				if (!matchName && !matchNo && !matchOrg && !matchEmail && !matchCity) {
					return false;
				}
			}
			return true;
		});
	}
}

export const customerOverviewRepository = new CustomerOverviewRepository();
