import { AUTHORITIES_STORAGE_KEY } from "../constants/authorities.constants";
import type {
	AuthorityItem,
	AuthorityFormData,
} from "../types/authorities.types";

const SEED_AUTHORITIES_ITEMS: AuthorityItem[] = [
	{
		id: "auth-001",
		caseNr: "001",
		authorityName: "Skatteverket",
		category: "Govt Docs",
		documentName: "Inkomstdeklaration 2024",
		subject: "Årlig inkomstdeklaration med skatteberäkning",
		date: "2025-05-02",
		dueDate: "2025-05-15",
		status: "approved",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "SKV-2024-9842",
		fileName: "Inkomstdeklaration_2024.pdf",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "2.4 MB",
		notes: "Fastställd inkomstdeklaration inskickad och godkänd.",
		createdAt: "2025-05-02",
		updatedAt: "2025-05-02",
	},
	{
		id: "auth-002",
		caseNr: "002",
		authorityName: "Bolagsverket",
		category: "Legal",
		documentName: "Registreringsbevis & Ägarförteckning",
		subject: "Uppdaterat registerutdrag efter ordinarie bolagsstämma",
		date: "2025-04-18",
		dueDate: "2025-05-01",
		status: "approved",
		responsiblePerson: "Anna Lindqvist",
		referenceNumber: "BV-2025-11029",
		fileName: "Registreringsbevis.pdf",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "1.1 MB",
		notes: "Officiellt registreringsbevis gällande för innevarande verksamhetsår.",
		createdAt: "2025-04-18",
		updatedAt: "2025-04-18",
	},
	{
		id: "auth-003",
		caseNr: "003",
		authorityName: "Försäkringskassan",
		category: "Insurance",
		documentName: "Arbetsgivarintyg & Sjuklönekontroll",
		subject: "Månadsavstämning av sjuklön och arbetsgivaravgifter",
		date: "2025-03-25",
		dueDate: "2025-04-10",
		status: "submitted",
		responsiblePerson: "Johan Berg",
		referenceNumber: "FK-2025-4491",
		fileName: "Arbetsgivarintyg_Q1.pdf",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "850 KB",
		notes: "Inskickat underlag för Q1-avstämning.",
		createdAt: "2025-03-25",
		updatedAt: "2025-03-25",
	},
	{
		id: "auth-004",
		caseNr: "004",
		authorityName: "Statistiska centralbyrån (SCB)",
		category: "Financial",
		documentName: "Kvartalsstatistik & Företagsundersökning",
		subject: "Obligatorisk uppgiftslämning gällande omsättning och personal",
		date: "2025-02-14",
		dueDate: "2025-03-01",
		status: "pending",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "SCB-2025-883",
		fileName: "SCB_Kvartalsrapport.pdf",
		fileType: "PDF",
		fileUrl: "#",
		fileSize: "620 KB",
		notes: "Inväntar slutlig godkännandebekräftelse från SCB.",
		createdAt: "2025-02-14",
		updatedAt: "2025-02-14",
	},
	{
		id: "auth-005",
		caseNr: "005",
		authorityName: "Arbetsmiljöverket",
		category: "Govt Docs",
		documentName: "Egenkontroll & Skyddsrondsprotokoll",
		subject: "Årlig dokumentation av det systematiska arbetsmiljöarbetet (SAM)",
		date: "2025-01-20",
		dueDate: "2025-02-15",
		status: "approved",
		responsiblePerson: "Anna Lindqvist",
		referenceNumber: "AV-2025-0041",
		fileName: "Skyddsrond_2025.docx",
		fileType: "DOCX",
		fileUrl: "#",
		fileSize: "1.8 MB",
		notes: "Protokoll godkänt och arkiverat.",
		createdAt: "2025-01-20",
		updatedAt: "2025-01-20",
	},
];

class AuthoritiesRepository {
	private items: AuthorityItem[] = [];
	private initialized = false;
	private listeners: Set<() => void> = new Set();

	constructor() {
		this.init();
	}

	private init() {
		if (typeof window === "undefined") {
			if (!this.initialized) {
				this.items = [...SEED_AUTHORITIES_ITEMS];
				this.initialized = true;
			}
			return;
		}

		try {
			const stored = sessionStorage.getItem(AUTHORITIES_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.items = parsed;
					this.initialized = true;
					return;
				}
			}
		} catch (e) {
			console.error("Failed to parse stored authorities data:", e);
		}

		this.items = [...SEED_AUTHORITIES_ITEMS];
		this.initialized = true;
		this.saveToStorage();
	}

	private saveToStorage() {
		if (typeof window === "undefined") return;
		try {
			sessionStorage.setItem(
				AUTHORITIES_STORAGE_KEY,
				JSON.stringify(this.items),
			);
		} catch (e) {
			console.error("Failed to save authorities data:", e);
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
				console.error("Authorities listener error:", e);
			}
		});
	}

	getAll(): AuthorityItem[] {
		this.init();
		return [...this.items];
	}

	getById(id: string): AuthorityItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id);
	}

	create(data: AuthorityFormData): AuthorityItem {
		this.init();
		const maxCaseNr = this.items.reduce((max, item) => {
			const n = parseInt(item.caseNr, 10);
			return isNaN(n) ? max : Math.max(max, n);
		}, 0);
		const caseNr = data.caseNr || String(maxCaseNr + 1).padStart(3, "0");
		const now = new Date().toISOString().split("T")[0];

		const newItem: AuthorityItem = {
			id: `auth-${Date.now()}`,
			caseNr,
			authorityName: data.authorityName,
			category: data.category,
			documentName: data.documentName,
			subject: data.subject || data.documentName,
			date: data.date || now,
			dueDate: data.dueDate,
			status: data.status || "pending",
			responsiblePerson: data.responsiblePerson || "",
			referenceNumber: data.referenceNumber || "",
			fileName: data.fileName || `${data.documentName}.pdf`,
			fileType: data.fileType || "PDF",
			fileUrl: data.fileUrl || "#",
			fileSize: data.fileSize || "1.0 MB",
			notes: data.notes || "",
			createdAt: now,
			updatedAt: now,
		};

		this.items = [newItem, ...this.items];
		this.saveToStorage();
		return newItem;
	}

	update(id: string, data: Partial<AuthorityFormData>): AuthorityItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const existing = this.items[index];
		const updated: AuthorityItem = {
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
		this.items = [...SEED_AUTHORITIES_ITEMS];
		this.saveToStorage();
	}
}

export const authoritiesRepository = new AuthoritiesRepository();
