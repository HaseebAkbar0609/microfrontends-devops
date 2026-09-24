import type {
	WageTypeItem,
	WageTypeFormData,
	WageTypeStatus,
	WageTypePersonalType,
	WageTypeWageForm,
	WageTypeTransactionType,
} from "../types/wageTypes.types";
import { INITIAL_WAGE_TYPES_MOCK } from "../mock/wageTypesMockData";
import {
	WAGE_TYPES_STORAGE_KEY,
	WAGE_TYPES_DEFAULT_PAGE_SIZE,
} from "../constants/wageTypes.constants";

export interface WageTypeQueryParams {
	search?: string;
	status?: "all" | WageTypeStatus;
	personalType?: "all" | WageTypePersonalType;
	wageForm?: "all" | WageTypeWageForm;
	transactionType?: "all" | WageTypeTransactionType;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface WageTypeListResponse {
	data: WageTypeItem[];
	total: number;
	page: number;
	limit: number;
}

class WageTypesRepository {
	private wageTypes: WageTypeItem[] = [];

	constructor() {
		this.init();
	}

	private init() {
		if (typeof window === "undefined") {
			this.wageTypes = [...INITIAL_WAGE_TYPES_MOCK];
			return;
		}

		try {
			const stored = localStorage.getItem(WAGE_TYPES_STORAGE_KEY);
			if (stored) {
				this.wageTypes = JSON.parse(stored);
			} else {
				this.wageTypes = [...INITIAL_WAGE_TYPES_MOCK];
				this.persist();
			}
		} catch {
			this.wageTypes = [...INITIAL_WAGE_TYPES_MOCK];
		}
	}

	private persist() {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					WAGE_TYPES_STORAGE_KEY,
					JSON.stringify(this.wageTypes),
				);
			} catch {
				// Ignore storage write errors
			}
		}
	}

	public getAll(): WageTypeItem[] {
		if (this.wageTypes.length === 0) {
			this.init();
		}
		return [...this.wageTypes];
	}

	public getById(id: string): WageTypeItem | undefined {
		if (this.wageTypes.length === 0) {
			this.init();
		}
		return this.wageTypes.find(
			(wt) => wt.id === id || wt.loneartId === id,
		);
	}

	public existsCode(code: string, excludeId?: string): boolean {
		if (this.wageTypes.length === 0) {
			this.init();
		}
		return this.wageTypes.some(
			(wt) => wt.loneartId.toLowerCase() === code.toLowerCase() && wt.id !== excludeId,
		);
	}

	public add(formData: WageTypeFormData): WageTypeItem {
		const today = new Date().toISOString().split("T")[0];
		const newWageType: WageTypeItem = {
			id: `wt_${Date.now()}`,
			loneartId: formData.loneartId,
			benamning: formData.benamning,
			personalTyp: formData.personalTyp || "tjansteman",
			loneform: formData.loneform || "fastlon",
			transaktionstyp: formData.transaktionstyp || "bruttolon",
			enhet: formData.enhet || "manad",
			preliminarskatt: formData.preliminarskatt || "Ja 30%",
			arbetsgivaravgift: formData.arbetsgivaravgift || "Ja 30%",
			skapad: today,
			andrad: today,
			konto: formData.kontoDebet || "7010",
			kontoKredit: formData.kontoKredit || "2820",
			motKontoAG: formData.motKontoAG || "2710",
			agUnderlag: formData.agUnderlag ?? true,
			semestergrundad: formData.semestergrundad ?? true,
			agiKod: formData.agiKod || "001",
			beskrivning: formData.beskrivning || "",
			status: formData.status || "active",
		};

		this.wageTypes = [newWageType, ...this.wageTypes];
		this.persist();
		return newWageType;
	}

	public update(
		id: string,
		updates: Partial<WageTypeItem>,
	): WageTypeItem | null {
		const index = this.wageTypes.findIndex(
			(wt) => wt.id === id || wt.loneartId === id,
		);
		if (index === -1) return null;

		const updated: WageTypeItem = {
			...this.wageTypes[index],
			...updates,
			andrad: new Date().toISOString().split("T")[0],
		};

		this.wageTypes[index] = updated;
		this.persist();
		return updated;
	}

	public delete(id: string): boolean {
		const initialLength = this.wageTypes.length;
		this.wageTypes = this.wageTypes.filter(
			(wt) => wt.id !== id && wt.loneartId !== id,
		);
		if (this.wageTypes.length !== initialLength) {
			this.persist();
			return true;
		}
		return false;
	}

	public toggleBatchStatus(
		ids: string[],
		targetStatus: WageTypeStatus,
	): boolean {
		const today = new Date().toISOString().split("T")[0];
		this.wageTypes = this.wageTypes.map((item) =>
			ids.includes(item.id) || ids.includes(item.loneartId)
				? { ...item, status: targetStatus, andrad: today }
				: item,
		);
		this.persist();
		return true;
	}

	public query(params: WageTypeQueryParams): WageTypeListResponse {
		let list = this.getAll();

		// Search by Name, Code/ID, Account, or Description
		if (params.search && params.search.trim() !== "") {
			const query = params.search.toLowerCase().trim();
			list = list.filter(
				(wt) =>
					wt.loneartId.toLowerCase().includes(query) ||
					wt.benamning.toLowerCase().includes(query) ||
					wt.konto.toLowerCase().includes(query) ||
					(wt.beskrivning && wt.beskrivning.toLowerCase().includes(query)),
			);
		}

		// Status filter
		if (params.status && params.status !== "all") {
			list = list.filter((wt) => wt.status === params.status);
		}

		// Personal type filter
		if (params.personalType && params.personalType !== "all") {
			list = list.filter((wt) => wt.personalTyp === params.personalType);
		}

		// Wage form filter
		if (params.wageForm && params.wageForm !== "all") {
			list = list.filter((wt) => wt.loneform === params.wageForm);
		}

		// Transaction type filter
		if (params.transactionType && params.transactionType !== "all") {
			list = list.filter((wt) => wt.transaktionstyp === params.transactionType);
		}

		// Sorting
		if (params.sortBy) {
			const key = params.sortBy as keyof WageTypeItem;
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
		const limit = params.limit && params.limit > 0 ? params.limit : WAGE_TYPES_DEFAULT_PAGE_SIZE;
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

export const wageTypesRepository = new WageTypesRepository();

export async function getWageTypesListAPIAction(
	params: WageTypeQueryParams,
): Promise<WageTypeListResponse> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.query(params);
}

export async function getWageTypeDetailAPIAction(
	id: string,
): Promise<WageTypeItem | null> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.getById(id) || null;
}

export async function createWageTypeAPIAction(
	formData: WageTypeFormData,
): Promise<WageTypeItem> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.add(formData);
}

export async function updateWageTypeAPIAction(
	id: string,
	updates: Partial<WageTypeItem>,
): Promise<WageTypeItem | null> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.update(id, updates);
}

export async function deleteWageTypeAPIAction(id: string): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.delete(id);
}

export async function toggleWageTypesStatusAPIAction(
	ids: string[],
	status: WageTypeStatus,
): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 50));
	return wageTypesRepository.toggleBatchStatus(ids, status);
}
