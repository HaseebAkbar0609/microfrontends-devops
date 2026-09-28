export type EquipmentCategory =
	| "work_tools"
	| "clothes"
	| "keys_cards"
	| "vehicle"
	| "safety_gear"
	| "it_device"
	| "power_tool";

export type AssetStatus =
	| "active_in_use"
	| "in_stock"
	| "maintenance"
	| "out_of_service";

export interface WorkToolItem {
	id: string;
	object: string;
	designation: string;
	markingId: string;
}

export interface ClothesItem {
	id: string;
	type: string;
	label: string;
	frequency: number;
	unit: string;
}

export interface KeyCardItem {
	id: string;
	object: string;
	designation: string;
	markingId: string;
}

export interface VehicleItem {
	id: string;
	vehicle: string;
	regNo: string;
	lastService?: string;
	nextService?: string;
	status?: AssetStatus;
}

export interface EmployeeEquipmentProfile {
	employeeId: string;
	employeeName: string;
	workTools: WorkToolItem[];
	clothes: ClothesItem[];
	keysCards: KeyCardItem[];
	vehicles: VehicleItem[];
}

export interface AssetHistoryLog {
	id: string;
	date: string;
	type: "assignment" | "maintenance" | "service" | "inspection" | "status_change";
	description: string;
	performedBy: string;
}

export interface CompanyAssetItem {
	id: string;
	name: string;
	category: EquipmentCategory;
	idNumber: string;
	assignedEmployeeId: string | null;
	assignedEmployeeName: string | null;
	assignedEmployeeAvatar?: string | null;
	status: AssetStatus;
	lastInspectionDate: string;
	nextInspectionDate: string;
	department: string;
	notes?: string;
	history: AssetHistoryLog[];
}

export type PersonalkortTabType =
	| "information"
	| "kompetens"
	| "utrustning_fordon"
	| "arbetstid"
	| "lon"
	| "halsa"
	| "personal_process"
	| "arende"
	| "dokument";

export type EquipmentMainTab = "inventory" | "personalkort";

export interface EquipmentFilterState {
	searchTerm: string;
	category: string;
	status: string;
	department: string;
}
