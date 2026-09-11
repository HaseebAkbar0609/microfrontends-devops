import type {
	BankAccountItem,
	BankLoanItem,
	BankDocumentItem,
	BankAccountFormData,
	BankLoanFormData,
} from "../types/bank.types";
import { BANK_STORAGE_KEY } from "../constants/bank.constants";

interface StoredBankData {
	accounts: BankAccountItem[];
	loans: BankLoanItem[];
	documents: BankDocumentItem[];
}

const SEED_DATA: StoredBankData = {
	accounts: [
		{
			id: "acc-1",
			bankName: "SEB (Skandinaviska Enskilda Banken)",
			accountType: "Företagskonto",
			accountNumber: "5201 1234567",
			iban: "SE45 5000 0000 0520 1123 4567",
			swiftBic: "ESSESESS",
			currency: "SEK",
			balance: 2450000,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			createdAt: "2025-01-01T08:00:00Z",
			updatedAt: "2025-01-01T08:00:00Z",
		},
	],
	loans: [
		{
			id: "5000",
			loanNr: "#5000",
			title: "Fastighetslån 1",
			loanType: "Fastighetsfinansiering",
			bank: "SEB",
			startDate: "2025-06-01",
			endDate: "2026-06-01",
			status: "active",
			interestRate: 3.25,
			monthlyCost: 48500,
			originalAmount: 5000000,
			remainingDebt: 3750000,
			repaidPercent: 25.0,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [
				{
					id: "doc-1",
					date: "2024-05-10",
					name: "filename.pdf",
					fileType: "PDF",
					loanId: "5000",
				},
				{
					id: "doc-2",
					date: "2024-05-10",
					name: "filename.pdf",
					fileType: "PDF",
					loanId: "5000",
				},
			],
			createdAt: "2025-01-02T10:00:00Z",
			updatedAt: "2025-01-02T10:00:00Z",
		},
		{
			id: "5001",
			loanNr: "#5000",
			title: "2026-01-01",
			loanType: "Hårdvara",
			bank: "2026-01-01",
			startDate: "2026-01-01",
			endDate: "2026-01-01",
			status: "active",
			interestRate: 4.5,
			monthlyCost: 15200,
			originalAmount: 850000,
			remainingDebt: 620000,
			repaidPercent: 27.0,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [],
			createdAt: "2026-01-01T08:00:00Z",
			updatedAt: "2026-01-01T08:00:00Z",
		},
		{
			id: "5002",
			loanNr: "#5000",
			title: "2026-01-01",
			loanType: "Hårdvara",
			bank: "2026-01-01",
			startDate: "2026-01-01",
			endDate: "2026-01-01",
			status: "active",
			interestRate: 4.5,
			monthlyCost: 12000,
			originalAmount: 600000,
			remainingDebt: 450000,
			repaidPercent: 25.0,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [],
			createdAt: "2026-01-01T08:00:00Z",
			updatedAt: "2026-01-01T08:00:00Z",
		},
		{
			id: "5003",
			loanNr: "#5000",
			title: "2026-01-01",
			loanType: "Hårdvara",
			bank: "2026-01-01",
			startDate: "2026-01-01",
			endDate: "2026-01-01",
			status: "active",
			interestRate: 4.5,
			monthlyCost: 18000,
			originalAmount: 900000,
			remainingDebt: 720000,
			repaidPercent: 20.0,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [],
			createdAt: "2026-01-01T08:00:00Z",
			updatedAt: "2026-01-01T08:00:00Z",
		},
		{
			id: "5004",
			loanNr: "#5000",
			title: "2026-01-01",
			loanType: "Hårdvara",
			bank: "2026-01-01",
			startDate: "2026-01-01",
			endDate: "2026-01-01",
			status: "active",
			interestRate: 4.5,
			monthlyCost: 9500,
			originalAmount: 400000,
			remainingDebt: 310000,
			repaidPercent: 22.5,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [],
			createdAt: "2026-01-01T08:00:00Z",
			updatedAt: "2026-01-01T08:00:00Z",
		},
		{
			id: "5005",
			loanNr: "#5000",
			title: "2026-01-01",
			loanType: "Hårdvara",
			bank: "2026-01-01",
			startDate: "2026-01-01",
			endDate: "2026-01-01",
			status: "active",
			interestRate: 4.5,
			monthlyCost: 11000,
			originalAmount: 550000,
			remainingDebt: 440000,
			repaidPercent: 20.0,
			contactPerson: {
				name: "Karl Andersson",
				role: "info",
				email: "karl.andersson@seb.se",
				phone: "+46 8 763 80 00",
			},
			documents: [],
			createdAt: "2026-01-01T08:00:00Z",
			updatedAt: "2026-01-01T08:00:00Z",
		},
	],
	documents: [
		{
			id: "bdoc-1",
			date: "2024-05-10",
			name: "Bankavtal_SEB_2024.pdf",
			fileType: "PDF",
		},
		{
			id: "bdoc-2",
			date: "2024-05-10",
			name: "Fastighetslan_Villkor.pdf",
			fileType: "PDF",
		},
	],
};

class BankRepository {
	private data: StoredBankData = { accounts: [], loans: [], documents: [] };
	private initialized = false;

	private init() {
		if (this.initialized) return;

		if (typeof window !== "undefined") {
			try {
				const stored = window.sessionStorage.getItem(BANK_STORAGE_KEY);
				if (stored) {
					this.data = JSON.parse(stored);
					this.initialized = true;
					return;
				}
			} catch {
				// Fallback
			}
		}

		this.data = JSON.parse(JSON.stringify(SEED_DATA));
		this.saveToStorage();
		this.initialized = true;
	}

	private saveToStorage() {
		if (typeof window !== "undefined") {
			try {
				window.sessionStorage.setItem(
					BANK_STORAGE_KEY,
					JSON.stringify(this.data),
				);
			} catch {
				// storage error ignored
			}
		}
	}

	// Accounts
	getAccounts(): BankAccountItem[] {
		this.init();
		return [...this.data.accounts];
	}

	getAccountById(id: string): BankAccountItem | undefined {
		this.init();
		return this.data.accounts.find((a) => a.id === id);
	}

	createAccount(payload: BankAccountFormData): BankAccountItem {
		this.init();
		const newItem: BankAccountItem = {
			id: String(Date.now()),
			bankName: payload.bankName,
			accountType: payload.accountType,
			accountNumber: payload.accountNumber,
			iban: payload.iban,
			swiftBic: payload.swiftBic,
			currency: payload.currency || "SEK",
			balance: Number(payload.balance) || 0,
			contactPerson: payload.contactPerson || {
				name: "",
				role: "",
				email: "",
				phone: "",
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		this.data.accounts.unshift(newItem);
		this.saveToStorage();
		return newItem;
	}

	updateAccount(id: string, payload: Partial<BankAccountFormData>): BankAccountItem | undefined {
		this.init();
		const idx = this.data.accounts.findIndex((a) => a.id === id);
		if (idx === -1) return undefined;
		this.data.accounts[idx] = {
			...this.data.accounts[idx],
			...payload,
			updatedAt: new Date().toISOString(),
		};
		this.saveToStorage();
		return this.data.accounts[idx];
	}

	// Loans
	getLoans(): BankLoanItem[] {
		this.init();
		return [...this.data.loans];
	}

	getLoanById(id: string): BankLoanItem | undefined {
		this.init();
		return this.data.loans.find((l) => l.id === id || l.loanNr === id);
	}

	createLoan(payload: BankLoanFormData): BankLoanItem {
		this.init();
		const newId = String(Date.now());
		const newItem: BankLoanItem = {
			id: newId,
			loanNr: payload.loanNr?.trim() || `#${newId.slice(-4)}`,
			title: payload.title,
			loanType: payload.loanType,
			bank: payload.bank,
			startDate: payload.startDate,
			endDate: payload.endDate,
			status: payload.status || "active",
			interestRate: Number(payload.interestRate) || 0,
			monthlyCost: Number(payload.monthlyCost) || 0,
			originalAmount: Number(payload.originalAmount) || 0,
			remainingDebt: Number(payload.remainingDebt) || 0,
			repaidPercent: Number(payload.repaidPercent) || 0,
			contactPerson: payload.contactPerson || {
				name: "",
				role: "",
				email: "",
				phone: "",
			},
			documents: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		this.data.loans.unshift(newItem);
		this.saveToStorage();
		return newItem;
	}

	updateLoan(id: string, payload: Partial<BankLoanFormData>): BankLoanItem | undefined {
		this.init();
		const idx = this.data.loans.findIndex((l) => l.id === id || l.loanNr === id);
		if (idx === -1) return undefined;
		this.data.loans[idx] = {
			...this.data.loans[idx],
			...payload,
			updatedAt: new Date().toISOString(),
		};
		this.saveToStorage();
		return this.data.loans[idx];
	}

	deleteLoan(id: string): boolean {
		this.init();
		const before = this.data.loans.length;
		this.data.loans = this.data.loans.filter((l) => l.id !== id && l.loanNr !== id);
		if (this.data.loans.length !== before) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	// Documents
	getDocuments(): BankDocumentItem[] {
		this.init();
		return [...this.data.documents];
	}

	addDocument(doc: Omit<BankDocumentItem, "id">): BankDocumentItem {
		this.init();
		const newDoc: BankDocumentItem = {
			...doc,
			id: String(Date.now()),
		};
		this.data.documents.unshift(newDoc);

		if (doc.loanId) {
			const loan = this.data.loans.find((l) => l.id === doc.loanId);
			if (loan) {
				loan.documents = [newDoc, ...(loan.documents || [])];
			}
		}

		this.saveToStorage();
		return newDoc;
	}

	deleteDocument(id: string): boolean {
		this.init();
		const before = this.data.documents.length;
		this.data.documents = this.data.documents.filter((d) => d.id !== id);
		for (const loan of this.data.loans) {
			if (loan.documents) {
				loan.documents = loan.documents.filter((d) => d.id !== id);
			}
		}
		if (this.data.documents.length !== before) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	resetData(): void {
		this.data = JSON.parse(JSON.stringify(SEED_DATA));
		this.saveToStorage();
	}
}

export const bankRepository = new BankRepository();
