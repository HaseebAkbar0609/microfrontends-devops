import type { VehicleDashboardData } from "../types/vehicleDashboard.types";

export const VEHICLE_DASHBOARD_STORAGE_KEY = "tfs_vehicle_dashboard_layout_v4";

export const DEFAULT_VEHICLE_DASHBOARD_DATA: VehicleDashboardData = {
	kpis: {
		inOperation: 18,
		servicePending: 3,
		outOfService: 1,
		upcomingService: 5,
		logbookNotCompleted: 2,
		totalVehicles: 24,
		operationalRate: 75,
	},
	services: [
		{
			id: "srv-1",
			vehicleNumber: "#f-55",
			title: "Tire change next week",
			status: "scheduled",
			scheduledDate: "2026-10-06",
			estimatedCost: 8500,
			notes: "Winter tire replacement for vehicle fleet",
		},
		{
			id: "srv-2",
			vehicleNumber: "#f-11",
			title: "Brake service in progress",
			status: "in_progress",
			scheduledDate: "2026-09-30",
			estimatedCost: 12000,
			notes: "Brake pad replacement and hydraulic check",
		},
		{
			id: "srv-3",
			vehicleNumber: "#f-11",
			title: "Brake service in progress",
			status: "in_progress",
			scheduledDate: "2026-09-30",
			estimatedCost: 6500,
			notes: "Brake fluid renewal & caliper adjustments",
		},
		{
			id: "srv-4",
			vehicleNumber: "#f-08",
			title: "Annual inspection & filter",
			status: "pending",
			scheduledDate: "2026-10-12",
			estimatedCost: 4500,
			notes: "Routine inspection and cabin air filter",
		},
		{
			id: "srv-5",
			vehicleNumber: "#f-22",
			title: "Oil replacement & sensor check",
			status: "scheduled",
			scheduledDate: "2026-10-15",
			estimatedCost: 5200,
			notes: "Engine oil change and tire pressure sensor check",
		},
	],
	drive: {
		activeVehiclesCount: 18,
		noGpsCount: 1,
		unapprovedLogbooksCount: 2,
		totalDriversActive: 16,
	},
};

export const VEHICLE_WIDGET_ORDER = [
	"vehicleKpiOverview",
	"vehicleUpcomingService",
	"vehicleDriveOverview",
	"vehicleQuickActions",
] as const;

export type VehicleWidgetId = (typeof VEHICLE_WIDGET_ORDER)[number];

export const VEHICLE_WIDGET_COL_SPAN = "col-span-12 md:col-span-4 lg:col-span-4";

export const VEHICLE_WIDGET_SPANS: Record<VehicleWidgetId, string> = {
	vehicleKpiOverview: "col-span-12 md:col-span-4 lg:col-span-4",
	vehicleUpcomingService: "col-span-12 md:col-span-8 lg:col-span-8",
	vehicleDriveOverview: "col-span-12 md:col-span-8 lg:col-span-8",
	vehicleQuickActions: "col-span-12 md:col-span-4 lg:col-span-4",
};

