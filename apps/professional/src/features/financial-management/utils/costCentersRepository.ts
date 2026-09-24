import type {
	CostCenterItem,
	CreateCostCenterFormData,
	CostCenterQueryParams,
	CostCenterListResponse,
	CostCenterStatus,
} from "../types/costCenters.types";
import { MOCK_COST_CENTERS } from "../mock/costCentersMockData";
import {
	COST_CENTERS_STORAGE_KEY,
	COST_CENTERS_DEFAULT_PAGE_SIZE,
} from "../constants/costCenters.constants";

class CostCentersRepository {
	private costCenters: CostCenterItem[] = [];

	constructor() {
		this.init();
	}

	private init() {
		if (typeof window === "undefined") {
			this.costCenters = [...MOCK_COST_CENTERS];
			return;
		}

		try {
			const stored = localStorage.getItem(COST_CENTERS_STORAGE_KEY);
			if (stored) {
				this.costCenters = JSON.parse(stored);
			} else {
				this.costCenters = [...MOCK_COST_CENTERS];
				this.persist();
			}
		} catch {
			this.costCenters = [...MOCK_COST_CENTERS];
		}
	}

	private persist() {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					COST_CENTERS_STORAGE_KEY,
					JSON.stringify(this.costCenters),
				);
			} catch {
				// Ignore storage write errors
			}
		}
	}

	public getAll(): CostCenterItem[] {
		if (this.costCenters.length === 0) {
			this.init();
		}
		return [...this.costCenters];
	}

	public getById(id: string): CostCenterItem | undefined {
		if (this.costCenters.length === 0) {
			this.init();
		}
		return this.costCenters.find(
			(cc) => cc.id === id || cc.kod === id,
		);
	}

	public add(formData: CreateCostCenterFormData): CostCenterItem {
		const newCostCenter: CostCenterItem = {
			id: `cc_${Date.now()}`,
			kod: formData.kod,
			benamning: formData.benamning,
			anteckningar: formData.anteckningar || "info",
			status: formData.status || "active",
			createdAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date().toISOString().split("T")[0],
		};

		this.costCenters = [newCostCenter, ...this.costCenters];
		this.persist();
		return newCostCenter;
	}

	public update(
		id: string,
		updates: Partial<CostCenterItem>,
	): CostCenterItem | null {
		const index = this.costCenters.findIndex(
			(cc) => cc.id === id || cc.kod === id,
		);
		if (index === -1) return null;

		const updated: CostCenterItem = {
			...this.costCenters[index],
			...updates,
			updatedAt: new Date().toISOString().split("T")[0],
		};

		this.costCenters[index] = updated;
		this.persist();
		return updated;
	}

	public delete(id: string): boolean {
		const initialLength = this.costCenters.length;
		this.costCenters = this.costCenters.filter(
			(cc) => cc.id !== id && cc.kod !== id,
		);
		if (this.costCenters.length !== initialLength) {
			this.persist();
			return true;
		}
		return false;
	}

	public toggleBatchStatus(
		ids: string[],
		targetStatus: CostCenterStatus,
	): boolean {
		this.costCenters = this.costCenters.map((item) =>
			ids.includes(item.id) || ids.includes(item.kod)
				? { ...item, status: targetStatus, updatedAt: new Date().toISOString().split("T")[0] }
				: item,
		);
		this.persist();
		return true;
	}

	public query(params: CostCenterQueryParams): CostCenterListResponse {
		let list = this.getAll();

		// Search
		if (params.search && params.search.trim() !== "") {
			const query = params.search.toLowerCase().trim();
			list = list.filter(
				(cc) =>
					cc.kod.toLowerCase().includes(query) ||
					cc.benamning.toLowerCase().includes(query) ||
					cc.anteckningar.toLowerCase().includes(query),
			);
		}

		// Status filter
		if (params.status && params.status !== "all") {
			list = list.filter((cc) => cc.status === params.status);
		}

		// Sorting
		if (params.sortBy) {
			const key = params.sortBy as keyof CostCenterItem;
			const isAsc = params.sortOrder !== "desc";
			list.sort((a, b) => {
				const aVal = String(a[key] ?? "");
				const bVal = String(b[key] ?? "");
				const res = aVal.localeCompare(bVal, undefined, { numeric: true });
				return isAsc ? res : -res;
			});
		}

		const total = list.length;
		const page = params.page && params.page > 0 ? params.page : 1;
		const limit = params.limit && params.limit > 0 ? params.limit : COST_CENTERS_DEFAULT_PAGE_SIZE;
		const startIndex = (page - 1) * limit;
		const paginatedData = list.slice(startIndex, startIndex + limit);

		return {
			data: paginatedData,
			total,
			page,
			limit,
		};
	}
}

export const costCentersRepository = new CostCentersRepository();

export async function getCostCentersListAPIAction(
	params: CostCenterQueryParams,
): Promise<CostCenterListResponse> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.query(params);
}

export async function getCostCenterDetailAPIAction(
	id: string,
): Promise<CostCenterItem | null> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.getById(id) || null;
}

export async function createCostCenterAPIAction(
	formData: CreateCostCenterFormData,
): Promise<CostCenterItem> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.add(formData);
}

export async function updateCostCenterAPIAction(
	id: string,
	updates: Partial<CostCenterItem>,
): Promise<CostCenterItem | null> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.update(id, updates);
}

export async function deleteCostCenterAPIAction(id: string): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.delete(id);
}

export async function toggleCostCentersStatusAPIAction(
	ids: string[],
	status: CostCenterStatus,
): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return costCentersRepository.toggleBatchStatus(ids, status);
}
