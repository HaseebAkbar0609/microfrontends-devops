import {
	AssetHistoryLog,
	CompanyAssetItem,
} from "../types/equipment.types";
import {
	EQUIPMENT_STORAGE_KEYS,
	SEED_COMPANY_ASSETS,
} from "../constants/equipment.constants";

class CompanyEquipmentRepository {
	private assets: CompanyAssetItem[] = [];

	constructor() {
		this.loadFromStorage();
	}

	private loadFromStorage(): void {
		if (typeof window === "undefined") {
			this.assets = [...SEED_COMPANY_ASSETS];
			return;
		}

		try {
			const data = localStorage.getItem(EQUIPMENT_STORAGE_KEYS.COMPANY_ASSETS);
			if (data) {
				this.assets = JSON.parse(data);
			} else {
				this.assets = [...SEED_COMPANY_ASSETS];
				this.saveToStorage();
			}
		} catch {
			this.assets = [...SEED_COMPANY_ASSETS];
		}
	}

	private saveToStorage(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(
				EQUIPMENT_STORAGE_KEYS.COMPANY_ASSETS,
				JSON.stringify(this.assets)
			);
		} catch {
			// fallback
		}
	}

	public getAll(): CompanyAssetItem[] {
		return JSON.parse(JSON.stringify(this.assets));
	}

	public getById(id: string): CompanyAssetItem | undefined {
		const found = this.assets.find((item) => item.id === id);
		return found ? JSON.parse(JSON.stringify(found)) : undefined;
	}

	public create(assetData: Omit<CompanyAssetItem, "id" | "history">): CompanyAssetItem {
		const newAsset: CompanyAssetItem = {
			...assetData,
			id: `ast_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
			history: [
				{
					id: `log_${Date.now()}`,
					date: new Date().toISOString().split("T")[0],
					type: "assignment",
					description: assetData.assignedEmployeeName
						? `Tillgång registrerad och tilldelad till ${assetData.assignedEmployeeName}.`
						: "Tillgång registrerad i företagets lager.",
					performedBy: "Administratör",
				},
			],
		};

		this.assets = [newAsset, ...this.assets];
		this.saveToStorage();
		return JSON.parse(JSON.stringify(newAsset));
	}

	public update(id: string, updates: Partial<CompanyAssetItem>): CompanyAssetItem | undefined {
		const index = this.assets.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const current = this.assets[index];
		const updatedItem: CompanyAssetItem = {
			...current,
			...updates,
			id: current.id, // Immutable ID
		};

		// If status or assignment changed, append a history log automatically
		if (updates.status && updates.status !== current.status) {
			const statusLog: AssetHistoryLog = {
				id: `log_${Date.now()}`,
				date: new Date().toISOString().split("T")[0],
				type: "status_change",
				description: `Status uppdaterad till ${updates.status}.`,
				performedBy: "System / Administratör",
			};
			updatedItem.history = [statusLog, ...(updatedItem.history || [])];
		}

		if (
			updates.assignedEmployeeId !== undefined &&
			updates.assignedEmployeeId !== current.assignedEmployeeId
		) {
			const assignLog: AssetHistoryLog = {
				id: `log_${Date.now() + 1}`,
				date: new Date().toISOString().split("T")[0],
				type: "assignment",
				description: updates.assignedEmployeeName
					? `Tilldelning ändrad till ${updates.assignedEmployeeName}.`
					: "Tilldelning borttagen (återförd till lager).",
				performedBy: "Administratör",
			};
			updatedItem.history = [assignLog, ...(updatedItem.history || [])];
		}

		this.assets[index] = updatedItem;
		this.saveToStorage();
		return JSON.parse(JSON.stringify(updatedItem));
	}

	public addHistoryLog(assetId: string, log: Omit<AssetHistoryLog, "id">): CompanyAssetItem | undefined {
		const asset = this.getById(assetId);
		if (!asset) return undefined;

		const newLog: AssetHistoryLog = {
			...log,
			id: `log_${Date.now()}`,
		};

		const updatedHistory = [newLog, ...(asset.history || [])];
		return this.update(assetId, { history: updatedHistory });
	}

	public delete(id: string): boolean {
		const initialLength = this.assets.length;
		this.assets = this.assets.filter((item) => item.id !== id);
		if (this.assets.length !== initialLength) {
			this.saveToStorage();
			return true;
		}
		return false;
	}
}

export const companyEquipmentRepository = new CompanyEquipmentRepository();
