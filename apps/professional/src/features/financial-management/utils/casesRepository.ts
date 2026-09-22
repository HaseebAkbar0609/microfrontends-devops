import type {
	CaseItem,
	CaseFormData,
	CaseMessage,
	CaseDocument,
	CaseStatus,
} from "../types/cases.types";
import {
	STORAGE_KEY_CASES,
	SEED_CASES,
	DEFAULT_CREATOR_ROLE,
} from "../constants/cases.constants";

type Listener = () => void;

interface InMemoryCaseData {
	description: string;
	messages: CaseMessage[];
	createdBy: string;
}

class CasesRepository {
	private items: CaseItem[] = [];
	private inMemoryStore: Map<string, InMemoryCaseData> = new Map();
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private sanitizeAndDeduplicate(rawItems: Partial<CaseItem>[]): CaseItem[] {
		const seenIds = new Set<string>();
		const result: CaseItem[] = [];
		let autoNum = 5000;

		for (const item of rawItems) {
			let id = item.id?.trim();
			if (!id || seenIds.has(id)) {
				while (seenIds.has(String(autoNum))) {
					autoNum++;
				}
				id = String(autoNum);
				autoNum++;
			}
			seenIds.add(id);

			const seedMatch = SEED_CASES.find((s) => s.id === id);
			const mem = this.inMemoryStore.get(id);

			const description = mem?.description ?? item.description ?? seedMatch?.description ?? "";
			const createdBy = mem?.createdBy ?? item.createdBy ?? seedMatch?.createdBy ?? "Kalle Andersson";
			const messages = mem?.messages ?? (Array.isArray(item.messages) ? item.messages : seedMatch?.messages ?? []);

			this.inMemoryStore.set(id, { description, createdBy, messages });

			result.push({
				id,
				caseNumber: item.caseNumber || id,
				title: item.title || seedMatch?.title || "Ärende",
				category: item.category || seedMatch?.category || "info",
				createdBy,
				createdRole: item.createdRole || seedMatch?.createdRole || DEFAULT_CREATOR_ROLE,
				date: item.date || seedMatch?.date || new Date().toISOString().split("T")[0],
				status: item.status || seedMatch?.status || "not_started",
				description,
				messages,
				documents: Array.isArray(item.documents) ? item.documents : seedMatch?.documents ?? [],
				images: Array.isArray(item.images) ? item.images : seedMatch?.images ?? [],
				createdAt: item.createdAt || seedMatch?.createdAt || new Date().toISOString(),
				updatedAt: item.updatedAt || seedMatch?.updatedAt,
			});
		}

		for (const seed of SEED_CASES) {
			if (!seenIds.has(seed.id)) {
				seenIds.add(seed.id);
				this.inMemoryStore.set(seed.id, {
					description: seed.description || "",
					createdBy: seed.createdBy,
					messages: seed.messages,
				});
				result.push({ ...seed });
			}
		}

		return result;
	}

	private init(): void {
		if (this.isInitialized) return;

		for (const seed of SEED_CASES) {
			this.inMemoryStore.set(seed.id, {
				description: seed.description || "",
				messages: seed.messages,
				createdBy: seed.createdBy,
			});
		}

		if (typeof window !== "undefined") {
			try {
				[
					"tfs_economy_cases_data",
					"tfs_economy_cases_data_v2",
					"tfs_economy_cases_data_v3",
					"tfs_economy_cases_data_v4",
					"tfs_economy_cases_data_v5",
					"tfs_economy_cases_data_v6",
					"tfs_economy_cases_data_v7",
				].forEach((k) => window.localStorage.removeItem(k));

				const savedCases = window.localStorage.getItem(STORAGE_KEY_CASES);
				if (savedCases) {
					const parsed = JSON.parse(savedCases);
					this.items = this.sanitizeAndDeduplicate(
						Array.isArray(parsed) ? parsed : SEED_CASES
					);
					this.persist();
				} else {
					this.items = this.sanitizeAndDeduplicate([...SEED_CASES]);
					this.persist();
				}
			} catch (err) {
				console.error("Failed to load cases from localStorage", err);
				this.items = this.sanitizeAndDeduplicate([...SEED_CASES]);
			}
		} else {
			this.items = [...SEED_CASES];
		}
		this.isInitialized = true;
	}

	private persist(): void {
		for (const item of this.items) {
			this.inMemoryStore.set(item.id, {
				description: item.description || "",
				messages: item.messages,
				createdBy: item.createdBy,
			});
		}

		if (typeof window !== "undefined") {
			try {
				const safeItems = this.items.map((item) => ({
					id: item.id,
					caseNumber: item.caseNumber,
					title: item.title,
					category: item.category,
					date: item.date,
					status: item.status,
					documents: item.documents,
					images: item.images,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
				}));
				window.localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(safeItems));
			} catch (err) {
				console.error("Failed to persist cases to localStorage", err);
			}
		}
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notify(): void {
		this.listeners.forEach((listener) => listener());
	}

	public getAll(): CaseItem[] {
		this.init();
		return [...this.items];
	}

	public getById(id: string): CaseItem | undefined {
		this.init();
		const item = this.items.find(
			(c) => c.id === id || c.caseNumber === id || `#${c.caseNumber}` === id
		);
		if (!item) return undefined;
		const mem = this.inMemoryStore.get(item.id);
		return {
			...item,
			description: mem?.description ?? item.description,
			messages: mem?.messages ?? item.messages,
			createdBy: mem?.createdBy ?? item.createdBy,
		};
	}

	public getNextCaseNumber(): string {
		this.init();
		let maxNum = 5000;
		for (const item of this.items) {
			const idToTest = item.caseNumber || item.id;
			const match = idToTest.match(/\d+/);
			if (match) {
				const val = parseInt(match[0], 10);
				if (!isNaN(val) && val >= maxNum) {
					maxNum = val + 1;
				}
			}
		}
		return String(maxNum);
	}

	public create(data: CaseFormData): CaseItem {
		this.init();
		let id = data.id?.trim().replace(/^#/, "");
		if (!id || this.items.some((c) => c.id === id || c.caseNumber === id)) {
			id = this.getNextCaseNumber();
		}
		const now = new Date().toISOString();

		const initialMessages: CaseMessage[] = data.initialMessage?.trim()
			? [
					{
						id: `msg-${Date.now()}`,
						caseId: id,
						author: data.createdBy,
						authorRole: DEFAULT_CREATOR_ROLE,
						content: data.initialMessage.trim(),
						createdAt: `${now.split("T")[0]} | 12:00 pm`,
					},
			  ]
			: [];

		const newItem: CaseItem = {
			id,
			caseNumber: id,
			title: data.title,
			category: data.category,
			createdBy: data.createdBy,
			createdRole: DEFAULT_CREATOR_ROLE,
			date: data.date,
			status: "not_started",
			description: data.description,
			messages: initialMessages,
			documents: data.documents || [],
			images: data.images || [],
			createdAt: now,
			updatedAt: now,
		};

		this.inMemoryStore.set(id, {
			description: newItem.description || "",
			messages: newItem.messages,
			createdBy: newItem.createdBy,
		});

		this.items = [newItem, ...this.items];
		this.persist();
		this.notify();
		return newItem;
	}

	public update(id: string, updates: Partial<CaseFormData>): CaseItem | undefined {
		this.init();
		const index = this.items.findIndex((c) => c.id === id);
		if (index === -1) return undefined;

		const current = this.items[index];
		const updatedItem: CaseItem = {
			...current,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		if (updates.description !== undefined || updates.createdBy !== undefined) {
			const mem = this.inMemoryStore.get(id);
			this.inMemoryStore.set(id, {
				description: updates.description ?? mem?.description ?? current.description ?? "",
				createdBy: updates.createdBy ?? mem?.createdBy ?? current.createdBy,
				messages: mem?.messages ?? current.messages,
			});
		}

		this.items[index] = updatedItem;
		this.persist();
		this.notify();
		return updatedItem;
	}

	public updateStatus(id: string, status: CaseStatus): boolean {
		this.init();
		const item = this.items.find((c) => c.id === id);
		if (!item) return false;

		item.status = status;
		item.updatedAt = new Date().toISOString();
		this.persist();
		this.notify();
		return true;
	}

	public delete(id: string): boolean {
		this.init();
		const prevLen = this.items.length;
		this.items = this.items.filter((c) => c.id !== id);
		this.inMemoryStore.delete(id);
		if (this.items.length !== prevLen) {
			this.persist();
			this.notify();
			return true;
		}
		return false;
	}

	public addMessage(
		caseId: string,
		message: Omit<CaseMessage, "id" | "caseId" | "createdAt">
	): CaseMessage | undefined {
		this.init();
		const item = this.items.find((c) => c.id === caseId);
		if (!item) return undefined;

		const newMsg: CaseMessage = {
			id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
			caseId,
			...message,
			createdAt: `${new Date().toISOString().split("T")[0]} | 12:00 pm`,
		};

		item.messages = [...(item.messages || []), newMsg];
		item.updatedAt = new Date().toISOString();

		const mem = this.inMemoryStore.get(caseId);
		if (mem) {
			mem.messages = item.messages;
		}

		this.persist();
		this.notify();
		return newMsg;
	}

	public addDocument(caseId: string, doc: Omit<CaseDocument, "id">): CaseDocument | undefined {
		this.init();
		const item = this.items.find((c) => c.id === caseId);
		if (!item) return undefined;

		const newDoc: CaseDocument = {
			id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
			...doc,
		};

		item.documents = [...(item.documents || []), newDoc];
		item.updatedAt = new Date().toISOString();
		this.persist();
		this.notify();
		return newDoc;
	}

	public removeDocument(caseId: string, docId: string): boolean {
		this.init();
		const item = this.items.find((c) => c.id === caseId);
		if (!item) return false;

		item.documents = (item.documents || []).filter((d) => d.id !== docId);
		item.updatedAt = new Date().toISOString();
		this.persist();
		this.notify();
		return true;
	}

	public addImage(caseId: string, img: Omit<CaseDocument, "id">): CaseDocument | undefined {
		this.init();
		const item = this.items.find((c) => c.id === caseId);
		if (!item) return undefined;

		const newImg: CaseDocument = {
			id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
			...img,
			category: "image",
		};

		item.images = [...(item.images || []), newImg];
		item.updatedAt = new Date().toISOString();
		this.persist();
		this.notify();
		return newImg;
	}

	public removeImage(caseId: string, imgId: string): boolean {
		this.init();
		const item = this.items.find((c) => c.id === caseId);
		if (!item) return false;

		item.images = (item.images || []).filter((i) => i.id !== imgId);
		item.updatedAt = new Date().toISOString();
		this.persist();
		this.notify();
		return true;
	}

	public importCases(
		rows: Record<string, string>[],
		mapping: Record<string, string>
	): { successCount: number; failureCount: number } {
		this.init();
		let successCount = 0;
		let failureCount = 0;

		for (const row of rows) {
			try {
				const title =
					(mapping.title ? row[mapping.title] : row.title || row.rubrik || row.titel) ||
					"Importerat ärende";
				const rawCategory = (
					mapping.category ? row[mapping.category] : row.kategori || row.category || "info"
				).toLowerCase();
				const category = [
					"reklamation",
					"avvikelse",
					"info",
					"support",
				].includes(rawCategory)
					? (rawCategory as CaseItem["category"])
					: "info";
				const createdBy =
					(mapping.createdBy ? row[mapping.createdBy] : row.skapadAv || row.createdBy) ||
					"Kalle Andersson";
				const description =
					(mapping.description ? row[mapping.description] : row.beskrivning || row.description) ||
					"";
				const date =
					(mapping.date ? row[mapping.date] : row.datum || row.date) ||
					new Date().toISOString().split("T")[0];

				this.create({
					title,
					category,
					createdBy,
					description,
					date,
				});
				successCount++;
			} catch {
				failureCount++;
			}
		}

		return { successCount, failureCount };
	}
}

export const casesRepository = new CasesRepository();
