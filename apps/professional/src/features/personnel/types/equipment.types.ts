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

export type PersonalkortTabType =
	| "information"
	| "kontaktperson"
	| "anstallningsvillkor"
	| "kompetens"
	| "dokument"
	| "utrustning_fordon"
	| "arbetstid"
	| "lon"
	| "halsa"
	| "friskvard"
	| "personal_process"
	| "arende";
