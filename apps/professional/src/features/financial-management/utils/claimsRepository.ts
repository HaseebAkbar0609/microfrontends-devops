import type {
	ClaimItem,
	ClaimTemplate,
	ClaimTemplateFormData,
	ClaimFormData,
	ClaimDocument,
} from "../types/claims.types";
import {
	STORAGE_KEY_CLAIMS,
	STORAGE_KEY_CLAIM_TEMPLATES,
	SEED_CLAIMS,
	SEED_CLAIM_TEMPLATES,
} from "../constants/claims.constants";

type Listener = () => void;

class ClaimsRepository {
	private items: ClaimItem[] = [];
	private templates: ClaimTemplate[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private sanitizeAndDeduplicate(rawItems: ClaimItem[]): ClaimItem[] {
		const seenIds = new Set<string>();
		const result: ClaimItem[] = [];
		let autoNum = 1;

		for (const item of rawItems) {
			let id = item.id?.trim();
			if (!id || seenIds.has(id)) {
				while (seenIds.has(String(autoNum).padStart(3, "0"))) {
					autoNum++;
				}
				id = String(autoNum).padStart(3, "0");
				autoNum++;
			}
			seenIds.add(id);
			result.push({ ...item, id });
		}
		return result;
	}

	private init(): void {
		if (this.isInitialized) return;
		if (typeof window !== "undefined") {
			try {
				const savedClaims = window.localStorage.getItem(STORAGE_KEY_CLAIMS);
				if (savedClaims) {
					const parsed = JSON.parse(savedClaims);
					this.items = this.sanitizeAndDeduplicate(Array.isArray(parsed) ? parsed : SEED_CLAIMS);
					this.persistClaims();
				} else {
					this.items = this.sanitizeAndDeduplicate([...SEED_CLAIMS]);
					this.persistClaims();
				}

				const savedTemplates = window.localStorage.getItem(STORAGE_KEY_CLAIM_TEMPLATES);
				if (savedTemplates) {
					const parsed = JSON.parse(savedTemplates);
					// Validate parsed templates have the Figma shape (title and date, without laborItems)
					if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && !parsed[0].laborItems) {
						this.templates = parsed;
					} else {
						// Old-format or empty templates — reset to Figma seeds
						this.templates = [...SEED_CLAIM_TEMPLATES];
						this.persistTemplates();
					}
				} else {
					this.templates = [...SEED_CLAIM_TEMPLATES];
					this.persistTemplates();
				}
			} catch {
				this.items = [...SEED_CLAIMS];
				this.templates = [...SEED_CLAIM_TEMPLATES];
			}
		} else {
			this.items = [...SEED_CLAIMS];
			this.templates = [...SEED_CLAIM_TEMPLATES];
		}
		this.isInitialized = true;
	}

	private persistClaims(): void {
		if (typeof window !== "undefined") {
			try {
				window.localStorage.setItem(
					STORAGE_KEY_CLAIMS,
					JSON.stringify(this.items),
				);
			} catch {
				// Silently fallback if storage is restricted
			}
		}
		this.notify();
	}

	private persistTemplates(): void {
		if (typeof window !== "undefined") {
			try {
				window.localStorage.setItem(
					STORAGE_KEY_CLAIM_TEMPLATES,
					JSON.stringify(this.templates),
				);
			} catch {
				// Silently fallback if storage is restricted
			}
		}
		this.notify();
	}

	private notify(): void {
		this.listeners.forEach((listener) => listener());
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	// ──────── Claims CRUD ────────

	public getAll(): ClaimItem[] {
		this.init();
		return [...this.items];
	}

	public getById(id: string): ClaimItem | undefined {
		this.init();
		return this.items.find((item) => item.id === id);
	}

	public getNextId(): string {
		this.init();
		const existingNumbers = this.items
			.map((i) => parseInt(i.id, 10))
			.filter((n) => !isNaN(n));
		const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
		return String(max + 1).padStart(3, "0");
	}

	public create(formData: ClaimFormData): ClaimItem {
		this.init();
		const existingIds = new Set(this.items.map((i) => i.id));
		let nextId = formData.id?.trim();
		if (!nextId || existingIds.has(nextId)) {
			nextId = this.getNextId();
		}

		const parsedAmount =
			typeof formData.disputedAmount === "number"
				? formData.disputedAmount
				: parseFloat(String(formData.disputedAmount).replace(/\s/g, "")) || 0;

		const newItem: ClaimItem = {
			id: nextId,
			date: formData.incidentDate || new Date().toISOString().slice(0, 10),
			supplier: formData.supplier || "Cleaning Services AB",
			linkedInvoice: formData.linkedInvoice || `FA-2026-${nextId}`,
			object: formData.object || "OR501",
			objectId: formData.objectId || formData.object || "OR501",
			objectName: formData.objectName || "Overhead Central",
			responsible: formData.responsible || "Kalle Anderson",
			deficiencyType: formData.deficiencyType || "Service, Delivery",
			incidentDate: formData.incidentDate || new Date().toISOString().slice(0, 10),
			supplierContact: formData.supplierContact || "",
			responseDeadline: formData.responseDeadline || "",
			deficiencyDescription: formData.deficiencyDescription || "",
			disputedAmount: parsedAmount,
			desiredAction: formData.desiredAction || "Kreditering",
			templateId: formData.templateId,
			templateName: formData.templateName,
			title: formData.title || `Reklamation #${nextId}`,
			description: formData.description || "",
			status: formData.status || "sent",
			documents: formData.documents || [],
			createdAt: new Date().toISOString(),
		};

		this.items = [newItem, ...this.items];
		this.persistClaims();
		return newItem;
	}

	public update(id: string, formData: Partial<ClaimFormData>): ClaimItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const current = this.items[index];
		const parsedAmount =
			formData.disputedAmount !== undefined
				? typeof formData.disputedAmount === "number"
					? formData.disputedAmount
					: parseFloat(String(formData.disputedAmount).replace(/\s/g, "")) || 0
				: current.disputedAmount;

		const updated: ClaimItem = {
			...current,
			supplier: formData.supplier ?? current.supplier,
			linkedInvoice: formData.linkedInvoice ?? current.linkedInvoice,
			object: formData.object ?? current.object,
			objectId: formData.objectId ?? current.objectId,
			objectName: formData.objectName ?? current.objectName,
			responsible: formData.responsible ?? current.responsible,
			deficiencyType: formData.deficiencyType ?? current.deficiencyType,
			incidentDate: formData.incidentDate ?? current.incidentDate,
			supplierContact: formData.supplierContact ?? current.supplierContact,
			responseDeadline: formData.responseDeadline ?? current.responseDeadline,
			deficiencyDescription: formData.deficiencyDescription ?? current.deficiencyDescription,
			disputedAmount: parsedAmount,
			desiredAction: formData.desiredAction ?? current.desiredAction,
			templateId: formData.templateId !== undefined ? formData.templateId : current.templateId,
			templateName: formData.templateName !== undefined ? formData.templateName : current.templateName,
			title: formData.title ?? current.title,
			description: formData.description ?? current.description,
			status: formData.status ?? current.status,
			documents: formData.documents ?? current.documents,
			updatedAt: new Date().toISOString(),
		};

		this.items[index] = updated;
		this.persistClaims();
		return updated;
	}

	public delete(id: string): boolean {
		this.init();
		const prevLen = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== prevLen) {
			this.persistClaims();
			return true;
		}
		return false;
	}

	public addDocument(claimId: string, doc: Omit<ClaimDocument, "id">): ClaimDocument | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === claimId);
		if (index === -1) return undefined;

		const newDoc: ClaimDocument = {
			...doc,
			id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		};

		this.items[index] = {
			...this.items[index],
			documents: [...this.items[index].documents, newDoc],
			updatedAt: new Date().toISOString(),
		};

		this.persistClaims();
		return newDoc;
	}

	public removeDocument(claimId: string, docId: string): boolean {
		this.init();
		const index = this.items.findIndex((item) => item.id === claimId);
		if (index === -1) return false;

		const currentDocs = this.items[index].documents;
		const filteredDocs = currentDocs.filter((d) => d.id !== docId);
		if (filteredDocs.length !== currentDocs.length) {
			this.items[index] = {
				...this.items[index],
				documents: filteredDocs,
				updatedAt: new Date().toISOString(),
			};
			this.persistClaims();
			return true;
		}
		return false;
	}

	// ──────── Templates CRUD ────────

	public getTemplates(): ClaimTemplate[] {
		this.init();
		return [...this.templates];
	}

	private normalizeTemplateId(rawId: string): string {
		if (!rawId) return "";
		let decoded = rawId;
		try {
			decoded = decodeURIComponent(rawId);
		} catch {
			decoded = rawId;
		}
		return decoded.trim().replace(/^#/, "").toLowerCase();
	}

	public getTemplateById(id: string): ClaimTemplate | undefined {
		this.init();
		if (!id) return undefined;
		const target = this.normalizeTemplateId(id);
		return this.templates.find((tpl) => this.normalizeTemplateId(tpl.id) === target);
	}

	public getNextTemplateId(): string {
		this.init();
		const existingNumbers = this.templates
			.map((t) => {
				const match = t.id.match(/(\d+)$/);
				return match ? parseInt(match[1], 10) : 0;
			})
			.filter((n) => !isNaN(n));
		const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
		return `#MA${String(max + 1).padStart(3, "0")}`;
	}

	public createTemplate(formData: ClaimTemplateFormData): ClaimTemplate {
		this.init();
		const now = new Date();
		const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
		const newTemplate: ClaimTemplate = {
			id: this.getNextTemplateId(),
			name: formData.name.trim() || "Mall Namn",
			title: formData.title.trim() || "Mall Title",
			date: formData.date.trim() || dateStr,
			description: formData.description.trim(),
			updatedAt: dateStr,
		};

		this.templates = [newTemplate, ...this.templates];
		this.persistTemplates();
		return newTemplate;
	}

	public updateTemplate(id: string, formData: Partial<ClaimTemplateFormData>): ClaimTemplate | undefined {
		this.init();
		if (!id) return undefined;
		const target = this.normalizeTemplateId(id);
		const index = this.templates.findIndex((tpl) => this.normalizeTemplateId(tpl.id) === target);
		if (index === -1) return undefined;

		const current = this.templates[index];
		const now = new Date();
		const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
		const updated: ClaimTemplate = {
			...current,
			name: formData.name !== undefined ? formData.name.trim() : current.name,
			title: formData.title !== undefined ? formData.title.trim() : current.title,
			date: formData.date !== undefined ? formData.date.trim() : current.date,
			description: formData.description !== undefined ? formData.description.trim() : current.description,
			updatedAt: dateStr,
		};

		this.templates[index] = updated;
		this.persistTemplates();
		return updated;
	}

	public deleteTemplate(id: string): boolean {
		this.init();
		if (!id) return false;
		const target = this.normalizeTemplateId(id);
		const prevLen = this.templates.length;
		this.templates = this.templates.filter((tpl) => this.normalizeTemplateId(tpl.id) !== target);
		if (this.templates.length !== prevLen) {
			this.persistTemplates();
			return true;
		}
		return false;
	}

	// ──────── Reset ────────

	public resetToSeedData(): void {
		this.items = [...SEED_CLAIMS];
		this.templates = [...SEED_CLAIM_TEMPLATES];
		this.persistClaims();
		this.persistTemplates();
	}
}

export const claimsRepository = new ClaimsRepository();
