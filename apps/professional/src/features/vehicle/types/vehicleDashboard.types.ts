export interface VehicleKpiData {
	inOperation: number;
	servicePending: number;
	outOfService: number;
	upcomingService: number;
	logbookNotCompleted: number;
	totalVehicles: number;
	operationalRate: number;
}

export type VehicleServiceStatus =
	| "in_progress"
	| "scheduled"
	| "pending"
	| "completed";

export interface VehicleServiceItem {
	id: string;
	vehicleNumber: string;
	title: string;
	status: VehicleServiceStatus;
	scheduledDate: string;
	estimatedCost?: number;
	notes?: string;
}

export interface VehicleDriveData {
	activeVehiclesCount: number;
	noGpsCount: number;
	unapprovedLogbooksCount: number;
	totalDriversActive: number;
}

export interface VehicleDashboardData {
	kpis: VehicleKpiData;
	services: VehicleServiceItem[];
	drive: VehicleDriveData;
}

export type VehicleModalType =
	| "add_vehicle"
	| "register_service"
	| "add_machine"
	| "vehicle_map"
	| "logbook"
	| "new_key"
	| "kpi_details"
	| "service_details"
	| "drive_details"
	| null;
