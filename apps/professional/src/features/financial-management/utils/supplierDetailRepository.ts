import type { SupplierDetailData } from "../types/supplierDetail.types";
import { STORAGE_KEY_SUPPLIER_DETAILS } from "../constants/supplierOverview.constants";
import { MOCK_SUPPLIER_DETAIL_MAP } from "../mock/supplierDetailMockData";
import { supplierOverviewRepository } from "./supplierOverviewRepository";

class SupplierDetailRepository {
	private customDetails: Record<string, SupplierDetailData> = {};
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
			const stored = localStorage.getItem(STORAGE_KEY_SUPPLIER_DETAILS);
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
			localStorage.setItem(STORAGE_KEY_SUPPLIER_DETAILS, JSON.stringify(this.customDetails));
		} catch {
			// Ignore localStorage write error
		}
	}

	public getById(id: string): SupplierDetailData | undefined {
		this.ensureInitialized();

		// Check explicitly stored full detail
		if (this.customDetails[id]) {
			return this.customDetails[id];
		}

		// Check mock map
		if (MOCK_SUPPLIER_DETAIL_MAP[id]) {
			return { ...MOCK_SUPPLIER_DETAIL_MAP[id] };
		}

		// Fallback check for levNr like L100 or %23L100
		const cleanId = id.replace(/^(%23|#)/, "");
		for (const key of Object.keys(MOCK_SUPPLIER_DETAIL_MAP)) {
			const detail = MOCK_SUPPLIER_DETAIL_MAP[key];
			if (detail.levNr.replace(/^(%23|#)/, "") === cleanId) {
				return { ...detail, id };
			}
		}

		// Check overview repository to see if this supplier exists
		const overviewSupplier = supplierOverviewRepository.getById(id);
		if (overviewSupplier) {
			return {
				id: overviewSupplier.id,
				levNr: overviewSupplier.levNr,
				name: overviewSupplier.name,
				status: overviewSupplier.status,
				mainCategory: "Byggmaterial",
				department: "Stockholm",
				region: "Stockholm",
				orgNo: overviewSupplier.orgNo,
				vatRegNo: `SE${overviewSupplier.orgNo.replace("-", "")}01`,
				visitingAddress: overviewSupplier.address || "Storgatan 1",
				visitingPostalCode: overviewSupplier.postNr || "111 22",
				visitingCity: overviewSupplier.city || "Stockholm",
				visitingCountry: overviewSupplier.country || "Sverige",
				invoiceAddress: overviewSupplier.address || "Storgatan 1",
				invoicePostalCode: overviewSupplier.postNr || "111 22",
				invoiceCity: overviewSupplier.city || "Stockholm",
				invoiceCountry: overviewSupplier.country || "Sverige",
				bankName: "Swedbank",
				bankAccount: "8327-9, 914 123 456-7",
				bankgiro: "123-4567",
				plusgiro: "12 34 56-7",
				iban: "SE55 8000 0832 7991 4123 4567",
				bic: "SWEDESSX",
				paymentDays: "30",
				interestRate: "8",
				invoiceFee: "0",
				collectionFee: "180",
				phone: overviewSupplier.phone || "08-123 456 78",
				email: overviewSupplier.email || "info@leverantor.se",
				website: "https://www.leverantor.se",
				contactNotes: "",
				contactPersons: [
					{
						id: "cp-1",
						firstName: "Kontakt",
						lastName: "Person",
						mobilePhone: overviewSupplier.phone || "070-000 00 00",
						email: overviewSupplier.email || "kontakt@leverantor.se",
						role: "Säljare",
						personalNo: "19800101-1234",
					},
				],
				ratings: {
					economy: 4,
					environment: 4,
					quality: 4,
					collaboration: 4,
					timeliness: 4,
				},
				documents: [],
				additionalNotes: "",
			};
		}

		return undefined;
	}

	public save(detail: SupplierDetailData): void {
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

export const supplierDetailRepository = new SupplierDetailRepository();
