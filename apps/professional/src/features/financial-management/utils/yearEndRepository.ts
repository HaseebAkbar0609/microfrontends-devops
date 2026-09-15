import { YEAR_END_STORAGE_KEY } from "../constants/yearEnd.constants";
import type {
	YearEndItem,
	YearEndFormData,
	YearEndTabType,
} from "../types/yearEnd.types";

const SEED_YEAR_END_ITEMS: YearEndItem[] = [
	// Bokslut Tab Items (Screenshot 1)
	{
		id: "ye-001",
		srNr: "001",
		tab: "bokslut",
		fiscalYear: 2025,
		category: "Årsredovisning",
		name: "2025-01-01-2025-12-31",
		fileName: "Kontrakt.pdf",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "2.4 MB",
		status: "completed",
		notes: "Fastställd och signerad årsredovisning för verksamhetsåret 2025.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-002",
		srNr: "002",
		tab: "bokslut",
		fiscalYear: 2025,
		category: "Deklaration",
		name: "Dekl + bilagor",
		fileName: "Kontrakt.pdf",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "1.2 MB",
		status: "completed",
		notes: "Inkomstdeklaration 2 med tillhörande skattemässiga justeringsbilagor.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-003",
		srNr: "003",
		tab: "bokslut",
		fiscalYear: 2025,
		category: "Balans & Resultat",
		name: "Avstämd balans-resultat",
		fileName: "Kontrakt.pdf",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "950 KB",
		status: "in_progress",
		notes: "Slutavstämd balans- och resultaträkning per sista december.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-004",
		srNr: "004",
		tab: "bokslut",
		fiscalYear: 2025,
		category: "Huvudbok",
		name: "Huvudbok",
		fileName: "Kontrakt.pdf",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "3.8 MB",
		status: "completed",
		notes: "Komplett huvudbok med samtliga verifikationer för helåret.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-005",
		srNr: "005",
		tab: "bokslut",
		fiscalYear: 2025,
		category: "Leverantörslista",
		name: "Lev-lista",
		fileName: "Kontrakt.pdf",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "420 KB",
		status: "completed",
		notes: "Avstämd leverantörsreskontra och öppna poster per bokslutsdatum.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},

	// Checklist Tab Items (Screenshot 2)
	{
		id: "ye-chk-001",
		srNr: "001",
		tab: "checklist",
		fiscalYear: 2025,
		category: "Årsredovisning",
		name: "Checklist 01",
		fileName: "Checklist 01",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "1.5 MB",
		status: "completed",
		notes: "Kontroll av noter och förvaltningsberättelse.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-chk-002",
		srNr: "002",
		tab: "checklist",
		fiscalYear: 2025,
		category: "Deklaration",
		name: "Checklist 02",
		fileName: "Checklist 02",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "800 KB",
		status: "completed",
		notes: "Avstämning av preliminärskatt och momsdeklarationer.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-chk-003",
		srNr: "003",
		tab: "checklist",
		fiscalYear: 2025,
		category: "Balans & Resultat",
		name: "Checklist 02",
		fileName: "Checklist 01",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "1.2 MB",
		status: "in_progress",
		notes: "Periodiseringar, upplupna kostnader och förutbetalda intäkter.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-chk-004",
		srNr: "004",
		tab: "checklist",
		fiscalYear: 2025,
		category: "Huvudbok",
		name: "Checklist 02",
		fileName: "Checklist 02",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "2.1 MB",
		status: "completed",
		notes: "Bankavstämning och kassa mot kontoutdrag.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
	{
		id: "ye-chk-005",
		srNr: "005",
		tab: "checklist",
		fiscalYear: 2025,
		category: "Leverantörslista",
		name: "Checklist 02",
		fileName: "Checklist 02",
		fileType: "DOC",
		fileUrl: "#",
		fileSize: "600 KB",
		status: "completed",
		notes: "Säkerställ att alla inkomna leverantörsfakturor är bokförda.",
		updatedAt: "2025-12-31",
		createdAt: "2025-12-31",
	},
];

class YearEndRepository {
	private items: YearEndItem[] = [];
	private initialized = false;
	private listeners: Set<() => void> = new Set();

	constructor() {
		this.init();
	}

	private init() {
		if (typeof window === "undefined") {
			if (!this.initialized) {
				this.items = [...SEED_YEAR_END_ITEMS];
				this.initialized = true;
			}
			return;
		}

		try {
			const stored = sessionStorage.getItem(YEAR_END_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.items = parsed;
					this.initialized = true;
					return;
				}
			}
		} catch (e) {
			console.error("Failed to parse stored year-end data:", e);
		}

		this.items = [...SEED_YEAR_END_ITEMS];
		this.initialized = true;
		this.saveToStorage();
	}

	private saveToStorage() {
		if (typeof window === "undefined") return;
		try {
			sessionStorage.setItem(YEAR_END_STORAGE_KEY, JSON.stringify(this.items));
		} catch (e) {
			console.error("Failed to save year-end data:", e);
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
				console.error("YearEnd listener error:", e);
			}
		});
	}

	getAll(): YearEndItem[] {
		this.init();
		return [...this.items];
	}

	getByTabAndYear(tab: YearEndTabType, fiscalYear: number): YearEndItem[] {
		this.init();
		return this.items.filter(
			(item) => item.tab === tab && item.fiscalYear === fiscalYear,
		);
	}

	getById(id: string): YearEndItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id);
	}

	create(data: YearEndFormData): YearEndItem {
		this.init();
		const tabItems = this.items.filter(
			(i) => i.tab === data.tab && i.fiscalYear === data.fiscalYear,
		);
		const maxSrNr = tabItems.reduce((max, item) => {
			const n = parseInt(item.srNr, 10);
			return isNaN(n) ? max : Math.max(max, n);
		}, 0);
		const srNr = data.srNr || String(maxSrNr + 1).padStart(3, "0");
		const now = new Date().toISOString().split("T")[0];

		const newItem: YearEndItem = {
			id: `ye-${Date.now()}`,
			srNr,
			tab: data.tab,
			fiscalYear: data.fiscalYear,
			category: data.category,
			name: data.name,
			fileName: data.fileName || `${data.name}.pdf`,
			fileType: data.fileType || "PDF",
			fileUrl: data.fileUrl || "#",
			fileSize: data.fileSize || "1.0 MB",
			status: data.status || "completed",
			notes: data.notes || "",
			updatedAt: now,
			createdAt: now,
		};

		this.items = [newItem, ...this.items];
		this.saveToStorage();
		return newItem;
	}

	update(id: string, data: Partial<YearEndFormData>): YearEndItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const existing = this.items[index];
		const updated: YearEndItem = {
			...existing,
			...data,
			updatedAt: new Date().toISOString().split("T")[0],
		};

		this.items[index] = updated;
		this.saveToStorage();
		return updated;
	}

	delete(id: string): boolean {
		this.init();
		const initialLen = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== initialLen) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	resetSeedData() {
		this.items = [...SEED_YEAR_END_ITEMS];
		this.saveToStorage();
	}
}

export const yearEndRepository = new YearEndRepository();
