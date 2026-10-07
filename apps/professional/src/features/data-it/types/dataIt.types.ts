import type { LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";

export interface DataItKpiData {
	totalDevices: number;
	activeSystems: number;
	openTickets: number;
	securityScore: number;
}

export interface RawDeviceCategoryItem {
	id: string;
	labelKey: TranslationKeys;
	count: number;
	colorClass: string;
}

export interface DeviceCategoryItem extends RawDeviceCategoryItem {
	percentage: number;
}

export interface RawWarrantyExpiryDevice {
	id: string;
	name: string;
	serialNumber: string;
	assignedTo: string;
	expiryDate: string;
}

export interface WarrantyExpiryDevice extends RawWarrantyExpiryDevice {
	daysLeft: number;
}

export interface UpcomingPurchaseItem {
	id: string;
	itemName: string;
	categoryKey: TranslationKeys;
	quantity: number;
	estimatedCostSek: number;
	status: "APPROVED" | "PENDING";
}

export interface ActiveSupportTicketItem {
	id: string;
	ticketNumber: string;
	subject: string;
	requester: string;
	priority: "HIGH" | "NORMAL";
	createdAt: string;
}

export interface DataItQuickAction {
	id: string;
	labelKey: TranslationKeys;
	targetHref?: string;
	icon: LucideIcon;
}

export interface DataItSecurityItem {
	id: string;
	labelKey: TranslationKeys;
	valueKey?: TranslationKeys;
	percentage?: number;
	count?: number;
	status: "ok" | "warn" | "error";
}

export interface DataItSystemStatusItem {
	id: string;
	name: string;
	uptimePercentage: number;
	statusKey: TranslationKeys;
	status: "ok" | "warn";
}

export interface RawDataItDashboardState {
	categories: RawDeviceCategoryItem[];
	warrantyDevices: RawWarrantyExpiryDevice[];
	upcomingPurchases: UpcomingPurchaseItem[];
	supportTickets: ActiveSupportTicketItem[];
	securityItems: DataItSecurityItem[];
	systemStatusItems: DataItSystemStatusItem[];
}

export interface DataItDashboardState {
	kpi: DataItKpiData;
	categories: DeviceCategoryItem[];
	warrantyDevices: WarrantyExpiryDevice[];
	upcomingPurchases: UpcomingPurchaseItem[];
	supportTickets: ActiveSupportTicketItem[];
	securityItems: DataItSecurityItem[];
	systemStatusItems: DataItSystemStatusItem[];
}

