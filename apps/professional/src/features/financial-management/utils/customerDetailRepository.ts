import type { CustomerDetailData } from "../types/customerDetail.types";
import {
	STORAGE_KEY_CUSTOMER_DETAILS,
} from "../constants/customerOverview.constants";
import { DEFAULT_CUSTOMER_DETAIL_M101 } from "../mock/customerDetailMockData";
import { customerOverviewRepository } from "./customerOverviewRepository";

class CustomerDetailRepository {
	private customDetails: Record<string, CustomerDetailData> = {};
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (typeof window === "undefined") {
			this.isInitialized = true;
			return;
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY_CUSTOMER_DETAILS);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (parsed && typeof parsed === "object") {
					this.customDetails = parsed;
				}
			}
		} catch {
			// localStorage error fallback
		}

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
			localStorage.setItem(STORAGE_KEY_CUSTOMER_DETAILS, JSON.stringify(this.customDetails));
		} catch {
			// Ignore localStorage write error
		}
	}

	public getById(id: string): CustomerDetailData | undefined {
		this.ensureInitialized();

		// Check explicitly stored full detail
		if (this.customDetails[id]) {
			return this.customDetails[id];
		}

		// Fallback for default mock customer or cust-1
		if (id === "cust-1" || id === "M101" || id === "%23M101") {
			return { ...DEFAULT_CUSTOMER_DETAIL_M101, id };
		}

		// Check overview repository to see if this customer exists
		const overviewCustomer = customerOverviewRepository.getById(id);
		if (overviewCustomer) {
			return {
				...DEFAULT_CUSTOMER_DETAIL_M101,
				id: overviewCustomer.id,
				customerNo: overviewCustomer.customerNo,
				name: overviewCustomer.name,
				orgNo: overviewCustomer.orgNo,
				visitingAddress: overviewCustomer.address || "Storgatan 15",
				visitingPostalCode: overviewCustomer.postNr || "111 22",
				visitingCity: overviewCustomer.city || "Stockholm",
				visitingCountry: overviewCustomer.country || "Sverige",
				invoiceAddress: overviewCustomer.address || "Box 123",
				invoicePostalCode: overviewCustomer.postNr || "111 20",
				invoiceCity: overviewCustomer.city || "Stockholm",
				invoiceCountry: overviewCustomer.country || "Sverige",
				phone: overviewCustomer.phone || "08-123 45 67",
				email: overviewCustomer.email || "info@byggdesign.se",
			};
		}

		return undefined;
	}

	public save(detail: CustomerDetailData): void {
		this.ensureInitialized();
		this.customDetails[detail.id] = detail;
		this.persist();
	}

	public delete(id: string): void {
		this.ensureInitialized();
		if (this.customDetails[id]) {
			delete this.customDetails[id];
			this.persist();
		}
	}
}

export const customerDetailRepository = new CustomerDetailRepository();
