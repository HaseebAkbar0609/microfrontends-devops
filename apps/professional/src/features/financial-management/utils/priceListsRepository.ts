import type {
	PriceListDetail,
	PriceListOverviewRow,
	CreatePriceListFormData,
	PriceListBulkUpdateData,
	PriceListArticleItem,
} from "../types/priceLists.types";
import { MOCK_PRICE_LISTS, MOCK_PRICE_LIST_ARTICLES } from "../mock/priceListsMockData";
import { STORAGE_KEY_PRICE_LISTS } from "../constants/priceLists.constants";

type Listener = () => void;

class PriceListsRepository {
	private priceLists: PriceListDetail[] = [];
	private listeners: Set<Listener> = new Set();
	private initialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (typeof window === "undefined") {
			this.priceLists = [...MOCK_PRICE_LISTS];
			this.initialized = true;
			return;
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY_PRICE_LISTS);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.priceLists = parsed;
					this.initialized = true;
					return;
				}
			}
		} catch {
			// Fallback to mock data
		}

		this.priceLists = [...MOCK_PRICE_LISTS];
		this.persist();
		this.initialized = true;
	}

	private ensureInitialized(): void {
		if (!this.initialized) {
			this.init();
		}
	}

	private persist(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY_PRICE_LISTS, JSON.stringify(this.priceLists));
		} catch {
			// localStorage error handling
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

	public getAll(): PriceListDetail[] {
		this.ensureInitialized();
		return [...this.priceLists];
	}

	public getById(id: string): PriceListDetail | undefined {
		this.ensureInitialized();
		return this.priceLists.find((pl) => pl.id === id || pl.code === id);
	}

	public add(
		formData: CreatePriceListFormData,
		allMasterArticles: PriceListArticleItem[] = MOCK_PRICE_LIST_ARTICLES,
	): PriceListDetail {
		this.ensureInitialized();
		const newId = `pl_${Date.now()}`;
		const today = new Date().toISOString().split("T")[0];

		// Filter selected articles or fallback to all if empty
		const selectedArticles =
			formData.selectedArticleIds && formData.selectedArticleIds.length > 0
				? allMasterArticles.filter((art) => formData.selectedArticleIds.includes(art.id) || formData.selectedArticleIds.includes(art.articleNo))
				: allMasterArticles.slice(0, 3);

		const newPriceList: PriceListDetail = {
			id: newId,
			isFavorite: false,
			code: formData.code || `P${String(this.priceLists.length + 1).padStart(3, "0")}`,
			name: formData.name,
			category: formData.category || "Service",
			linkedCount: selectedArticles.length,
			createdBy: formData.createdBy || "Kalle Andersson",
			date: formData.date || today,
			lastUpdated: today,
			status: "active",
			comment: formData.comment || "",
			unit: formData.unit || "Styck",
			linkedCustomers: formData.customer ? [formData.customer] : ["Kund 01"],
			linkedSuppliers: formData.supplier ? [formData.supplier] : ["leverantörer 01"],
			articles: selectedArticles,
		};

		this.priceLists.unshift(newPriceList);
		this.persist();
		this.notify();
		return newPriceList;
	}

	public update(id: string, updates: Partial<PriceListDetail>): PriceListDetail | null {
		this.ensureInitialized();
		const index = this.priceLists.findIndex((pl) => pl.id === id || pl.code === id);
		if (index === -1) return null;

		const today = new Date().toISOString().split("T")[0];
		const updated: PriceListDetail = {
			...this.priceLists[index],
			...updates,
			lastUpdated: today,
		};

		this.priceLists[index] = updated;
		this.persist();
		this.notify();
		return updated;
	}

	public delete(id: string): boolean {
		this.ensureInitialized();
		const index = this.priceLists.findIndex((pl) => pl.id === id || pl.code === id);
		if (index === -1) return false;

		this.priceLists.splice(index, 1);
		this.persist();
		this.notify();
		return true;
	}

	public toggleFavorite(id: string): boolean {
		this.ensureInitialized();
		const found = this.priceLists.find((pl) => pl.id === id || pl.code === id);
		if (!found) return false;

		found.isFavorite = !found.isFavorite;
		this.persist();
		this.notify();
		return found.isFavorite;
	}

	public bulkUpdatePrices(data: PriceListBulkUpdateData): boolean {
		this.ensureInitialized();
		const targetList = this.priceLists.find(
			(pl) => pl.id === data.updatePriceListId || pl.code === data.updatePriceListId || pl.name === data.updatePriceListId,
		);
		if (!targetList) return false;

		const factor = data.direction === "increase" ? 1 + data.percentage / 100 : 1 - data.percentage / 100;

		targetList.articles = targetList.articles.map((article) => {
			const rawNumeric = parseFloat(article.outPriceListA.replace(/\s/g, "").replace(",", ".")) || 100;
			let newPriceNumeric = rawNumeric * factor;

			if (data.rounding === "helkrona") {
				newPriceNumeric = Math.round(newPriceNumeric);
			} else {
				newPriceNumeric = Math.round(newPriceNumeric * 100) / 100;
			}

			const formatted = newPriceNumeric.toLocaleString("sv-SE", {
				minimumFractionDigits: data.rounding === "helkrona" ? 0 : 2,
				maximumFractionDigits: 2,
			});

			return {
				...article,
				outPriceListA: formatted,
				customPrice: formatted,
			};
		});

		targetList.lastUpdated = new Date().toISOString().split("T")[0];
		this.persist();
		this.notify();
		return true;
	}

	public query(params?: import("../types/priceLists.types").GetPriceListsParams): import("../types/priceLists.types").GetPriceListsResponse {
		this.ensureInitialized();
		let filtered = [...this.priceLists];

		if (params?.search) {
			const q = params.search.toLowerCase();
			filtered = filtered.filter(
				(pl) =>
					pl.name.toLowerCase().includes(q) ||
					pl.code.toLowerCase().includes(q) ||
					pl.category.toLowerCase().includes(q) ||
					pl.createdBy.toLowerCase().includes(q),
			);
		}

		if (params?.category && params.category !== "all" && params.category !== "Alla") {
			filtered = filtered.filter((pl) => pl.category.toLowerCase() === params.category!.toLowerCase());
		}

		if (params?.sortBy) {
			const key = params.sortBy as keyof PriceListDetail;
			const isAsc = params.sortOrder !== "desc";
			filtered.sort((a, b) => {
				const aVal = String(a[key] ?? "");
				const bVal = String(b[key] ?? "");
				return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			});
		}

		const total = filtered.length;
		const page = params?.page ?? 1;
		const limit = params?.limit ?? 10;
		const totalPages = Math.ceil(total / limit) || 1;
		const start = (page - 1) * limit;
		const data = filtered.slice(start, start + limit);

		return {
			data,
			total,
			page,
			totalPages,
		};
	}
}

export const priceListsRepository = new PriceListsRepository();

// Bridge actions
export async function getPriceListsAPIAction(): Promise<{ data: PriceListOverviewRow[]; totalItems: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = priceListsRepository.getAll();
			resolve({
				data,
				totalItems: data.length,
			});
		}, 100);
	});
}

export async function getPriceListDetailAPIAction(id: string): Promise<PriceListDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const found = priceListsRepository.getById(id);
			if (found) {
				resolve(found);
			} else {
				reject(new Error("Price list not found"));
			}
		}, 100);
	});
}

export async function createPriceListAPIAction(formData: CreatePriceListFormData): Promise<PriceListDetail> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const created = priceListsRepository.add(formData);
			resolve(created);
		}, 150);
	});
}

export async function updatePriceListAPIAction(
	id: string,
	updates: Partial<PriceListDetail>,
): Promise<PriceListDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const updated = priceListsRepository.update(id, updates);
			if (updated) {
				resolve(updated);
			} else {
				reject(new Error("Price list not found"));
			}
		}, 100);
	});
}

export async function deletePriceListAPIAction(id: string): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			priceListsRepository.delete(id);
			resolve();
		}, 100);
	});
}

export async function togglePriceListFavoriteAPIAction(id: string): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const res = priceListsRepository.toggleFavorite(id);
			resolve(res);
		}, 80);
	});
}

export async function bulkUpdatePricesAPIAction(data: PriceListBulkUpdateData): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const res = priceListsRepository.bulkUpdatePrices(data);
			resolve(res);
		}, 120);
	});
}
