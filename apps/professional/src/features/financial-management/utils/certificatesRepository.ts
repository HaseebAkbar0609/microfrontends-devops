import type { CertificateItem, CertificateFormData } from "../types/certificates.types";
import { STORAGE_KEY_CERTIFICATES } from "../constants/certificates.constants";

const SEED_CERTIFICATES: CertificateItem[] = [
	{
		id: "001",
		category: "Overhead",
		name: "Overhead",
		objectType: "OR501",
		objectId: "OR501",
		objectName: "Overhead Central",
		responsiblePerson: "Kalle Andersson",
		responsibleRole: "Projektledare",
		masterApprover: "Conny Larsson",
		masterRole: "Ekonomichef",
		status: "active",
		issueDate: "2024-01-01",
		expiryDate: "2027-01-01",
		description: "Overhead attestflöde för löpande administrativa kostnader",
		fileName: "attest_overhead_OR501.pdf",
		fileSize: "1.4 MB",
		fileType: "application/pdf",
		createdAt: "2024-01-01T08:00:00Z",
	},
	{
		id: "002",
		category: "Projekt",
		name: "Ombyggnad kök",
		objectType: "OR501",
		objectId: "OR501",
		objectName: "Ombyggnad kök Stockholm",
		responsiblePerson: "Erik Holm",
		responsibleRole: "Platschef",
		status: "active",
		issueDate: "2024-03-15",
		expiryDate: "2026-12-31",
		description: "Projektattest för köksombyggnation och materialinköp",
		fileName: "ombyggnad_kok_godkannande.pdf",
		fileSize: "820 KB",
		fileType: "application/pdf",
		createdAt: "2024-03-15T09:30:00Z",
	},
	{
		id: "003",
		category: "Projekt",
		name: "Nytt badrum",
		objectType: "P2025-001",
		objectId: "P2025-001",
		objectName: "Nytt badrum Nacka",
		responsiblePerson: "Anna Svensson",
		responsibleRole: "Projektledare",
		masterApprover: "Conny Larsson",
		masterRole: "Ekonomichef",
		status: "active",
		issueDate: "2025-01-10",
		expiryDate: "2027-01-10",
		description: "Huvudattest för badrumsprojekt med våtrumsauktorisation",
		fileName: "badrum_attestintyg.pdf",
		fileSize: "2.1 MB",
		fileType: "application/pdf",
		createdAt: "2025-01-10T11:15:00Z",
	},
	{
		id: "004",
		category: "Projekt",
		name: "Tillbyggnad",
		objectType: "P2025-002",
		objectId: "P2025-002",
		objectName: "Tillbyggnad Täby",
		responsiblePerson: "Ej tildelad",
		responsibleRole: "",
		status: "pending",
		issueDate: "2025-06-01",
		expiryDate: "2027-06-01",
		description: "Väntar på tilldelning av ansvarig projektledare för tillbyggnad",
		fileName: "tillbyggnad_utkast.pdf",
		fileSize: "540 KB",
		fileType: "application/pdf",
		createdAt: "2025-06-01T14:00:00Z",
	},
	{
		id: "005",
		category: "Projekt",
		name: "Nytt sovrum",
		objectType: "OR502",
		objectId: "OR502",
		objectName: "Nytt sovrum Göteborg",
		responsiblePerson: "Erik Holm",
		responsibleRole: "Platschef",
		status: "active",
		issueDate: "2025-02-20",
		expiryDate: "2026-11-20",
		description: "Attest för sovrumsrenovering och snickeriarbeten",
		fileName: "sovrum_attest_OR502.pdf",
		fileSize: "1.1 MB",
		fileType: "application/pdf",
		createdAt: "2025-02-20T10:45:00Z",
	},
	{
		id: "006",
		category: "Projekt",
		name: "Ombyggnad golv",
		objectType: "OR503",
		objectId: "OR503",
		objectName: "Ombyggnad golv Uppsala",
		responsiblePerson: "Kalle Larsson",
		responsibleRole: "Ledande montör",
		masterApprover: "Conny Larsson",
		masterRole: "Ekonomichef",
		status: "active",
		issueDate: "2025-04-12",
		expiryDate: "2027-04-12",
		description: "Slutattest för golvläggning och ytbehandling",
		fileName: "golv_slutattest.pdf",
		fileSize: "960 KB",
		fileType: "application/pdf",
		createdAt: "2025-04-12T16:20:00Z",
	},
];

type Listener = () => void;

class CertificatesRepository {
	private items: CertificateItem[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (this.isInitialized) return;
		if (typeof window !== "undefined") {
			try {
				const saved = window.localStorage.getItem(STORAGE_KEY_CERTIFICATES);
				if (saved) {
					this.items = JSON.parse(saved);
				} else {
					this.items = [...SEED_CERTIFICATES];
					this.persist();
				}
			} catch {
				this.items = [...SEED_CERTIFICATES];
			}
		} else {
			this.items = [...SEED_CERTIFICATES];
		}
		this.isInitialized = true;
	}

	private persist(): void {
		if (typeof window !== "undefined") {
			try {
				window.localStorage.setItem(
					STORAGE_KEY_CERTIFICATES,
					JSON.stringify(this.items),
				);
			} catch {
				// Silently fallback if storage is restricted
			}
		}
		this.notify();
	}

	private notify(): void {
		this.listeners.forEach((l) => l());
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	public getAll(): CertificateItem[] {
		this.init();
		return [...this.items];
	}

	public getById(id: string): CertificateItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id);
	}

	public create(formData: CertificateFormData): CertificateItem {
		this.init();
		let nextId = formData.id?.trim();
		if (!nextId) {
			const existingNumbers = this.items
				.map((i) => parseInt(i.id, 10))
				.filter((n) => !isNaN(n));
			const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
			nextId = String(max + 1).padStart(3, "0");
		}

		const newItem: CertificateItem = {
			id: nextId,
			category: formData.category || "Projekt",
			name: formData.name,
			objectType: formData.objectType || formData.objectId || "Order",
			objectId: formData.objectId || "OR501",
			objectName: formData.objectName || formData.name,
			responsiblePerson: formData.responsiblePerson || "Ej tildelad",
			responsibleRole: formData.responsibleRole || "",
			masterApprover: formData.masterApprover || undefined,
			masterRole: formData.masterRole || undefined,
			issueDate: formData.issueDate,
			expiryDate: formData.expiryDate,
			description: formData.description,
			fileName: formData.fileName || (formData.file ? formData.file.name : "attest_dokument.pdf"),
			fileSize: formData.fileSize || (formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB"),
			fileType: formData.file ? formData.file.type : "application/pdf",
			fileUrl: formData.fileUrl,
			status: "active",
			createdAt: new Date().toISOString(),
		};

		this.items = [newItem, ...this.items];
		this.persist();
		return newItem;
	}

	public update(id: string, formData: Partial<CertificateFormData>): CertificateItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const current = this.items[index];
		const updated: CertificateItem = {
			...current,
			category: formData.category ?? current.category,
			name: formData.name ?? current.name,
			objectType: formData.objectType ?? current.objectType,
			objectId: formData.objectId ?? current.objectId,
			objectName: formData.objectName ?? current.objectName,
			responsiblePerson: formData.responsiblePerson ?? current.responsiblePerson,
			responsibleRole: formData.responsibleRole ?? current.responsibleRole,
			masterApprover: formData.masterApprover ?? current.masterApprover,
			masterRole: formData.masterRole ?? current.masterRole,
			issueDate: formData.issueDate ?? current.issueDate,
			expiryDate: formData.expiryDate ?? current.expiryDate,
			description: formData.description ?? current.description,
			fileName: formData.fileName ?? (formData.file ? formData.file.name : current.fileName),
			fileSize: formData.fileSize ?? (formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : current.fileSize),
			fileUrl: formData.fileUrl ?? current.fileUrl,
			updatedAt: new Date().toISOString(),
		};

		this.items[index] = updated;
		this.persist();
		return updated;
	}

	public delete(id: string): boolean {
		this.init();
		const prevLen = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== prevLen) {
			this.persist();
			return true;
		}
		return false;
	}

	public archive(id: string): boolean {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return false;
		this.items[index] = {
			...this.items[index],
			status: "archived",
			updatedAt: new Date().toISOString(),
		};
		this.persist();
		return true;
	}

	public resetToSeedData(): void {
		this.items = [...SEED_CERTIFICATES];
		this.persist();
	}
}

export const certificatesRepository = new CertificatesRepository();
