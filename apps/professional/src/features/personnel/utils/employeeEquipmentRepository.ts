import {
	ClothesItem,
	EmployeeEquipmentProfile,
	KeyCardItem,
	VehicleItem,
	WorkToolItem,
} from "../types/equipment.types";
import {
	EQUIPMENT_STORAGE_KEYS,
	SEED_ANNA_SVENSSON_EQUIPMENT,
} from "../constants/equipment.constants";

class EmployeeEquipmentRepository {
	private profiles: Record<string, EmployeeEquipmentProfile> = {};

	constructor() {
		this.loadFromStorage();
	}

	private loadFromStorage(): void {
		if (typeof window === "undefined") {
			this.profiles = {
				[SEED_ANNA_SVENSSON_EQUIPMENT.employeeId]: SEED_ANNA_SVENSSON_EQUIPMENT,
			};
			return;
		}

		try {
			const data = localStorage.getItem(EQUIPMENT_STORAGE_KEYS.EMPLOYEE_PROFILES);
			if (data) {
				this.profiles = JSON.parse(data);
			} else {
				this.profiles = {
					[SEED_ANNA_SVENSSON_EQUIPMENT.employeeId]: SEED_ANNA_SVENSSON_EQUIPMENT,
				};
				this.saveToStorage();
			}
		} catch {
			this.profiles = {
				[SEED_ANNA_SVENSSON_EQUIPMENT.employeeId]: SEED_ANNA_SVENSSON_EQUIPMENT,
			};
		}
	}

	private saveToStorage(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(
				EQUIPMENT_STORAGE_KEYS.EMPLOYEE_PROFILES,
				JSON.stringify(this.profiles)
			);
		} catch {
			// silent fallback
		}
	}

	public getProfile(employeeId: string, employeeName = "Anna Svensson"): EmployeeEquipmentProfile {
		if (!this.profiles[employeeId]) {
			// Initialize with default template or clone
			this.profiles[employeeId] = {
				employeeId,
				employeeName,
				workTools: [...SEED_ANNA_SVENSSON_EQUIPMENT.workTools],
				clothes: [...SEED_ANNA_SVENSSON_EQUIPMENT.clothes],
				keysCards: [...SEED_ANNA_SVENSSON_EQUIPMENT.keysCards],
				vehicles: [...SEED_ANNA_SVENSSON_EQUIPMENT.vehicles],
			};
			this.saveToStorage();
		}
		return JSON.parse(JSON.stringify(this.profiles[employeeId]));
	}

	public updateWorkTools(employeeId: string, workTools: WorkToolItem[]): EmployeeEquipmentProfile {
		const profile = this.getProfile(employeeId);
		profile.workTools = workTools;
		this.profiles[employeeId] = profile;
		this.saveToStorage();
		return JSON.parse(JSON.stringify(profile));
	}

	public updateClothes(employeeId: string, clothes: ClothesItem[]): EmployeeEquipmentProfile {
		const profile = this.getProfile(employeeId);
		profile.clothes = clothes;
		this.profiles[employeeId] = profile;
		this.saveToStorage();
		return JSON.parse(JSON.stringify(profile));
	}

	public updateKeysCards(employeeId: string, keysCards: KeyCardItem[]): EmployeeEquipmentProfile {
		const profile = this.getProfile(employeeId);
		profile.keysCards = keysCards;
		this.profiles[employeeId] = profile;
		this.saveToStorage();
		return JSON.parse(JSON.stringify(profile));
	}

	public updateVehicles(employeeId: string, vehicles: VehicleItem[]): EmployeeEquipmentProfile {
		const profile = this.getProfile(employeeId);
		profile.vehicles = vehicles;
		this.profiles[employeeId] = profile;
		this.saveToStorage();
		return JSON.parse(JSON.stringify(profile));
	}
}

export const employeeEquipmentRepository = new EmployeeEquipmentRepository();
