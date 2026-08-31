export type MachineTypeCategory = "Interna" | "Externa" | "Alla";

export type MachineCategoryOption =
	| "Handmaskin"
	| "Betong"
	| "Etablering"
	| "Byggställning"
	| "Trädgårdsmaskin"
	| "El och Belysning";

export interface MachineStatItem {
	id: string;
	name: string;
	brand: string;
	category: string;
	purchaseDate: string;
	totalCost: number;
	daysUsed: number;
	age: string;
	status: "Aktiv" | "Reparation" | "Avslutad";
	type: "Interna" | "Externa";
	supplier?: string;
}

export type UtilizationGrade = "High" | "Medium" | "Low";

export interface VehicleStatItem {
	id: string;
	name: string;
	model: string;
	driver: string;
	mileage: number;
	weeklyUsage: number;
	age: string;
	nextInspection: string;
	utilizationGrade: UtilizationGrade;
	status: "Aktiv" | "Reparation" | "Avslutad";
}

export interface MachineFilterState {
	machineType: MachineTypeCategory;
	supplier: string;
	ageInterval: string;
	categories: string[];
	status: string;
	search: string;
}

export interface VehicleFilterState {
	brandModel: string;
	mileageRange: string;
	driftPeriod: string;
	status: string;
	search: string;
}

export type MachineSortField =
	| "id"
	| "name"
	| "brand"
	| "category"
	| "supplier"
	| "purchaseDate"
	| "totalCost"
	| "daysUsed"
	| "age"
	| "status";

export type VehicleSortField =
	| "id"
	| "name"
	| "model"
	| "driver"
	| "mileage"
	| "weeklyUsage"
	| "age"
	| "nextInspection"
	| "utilizationGrade"
	| "status";

export type SortOrder = "asc" | "desc";
