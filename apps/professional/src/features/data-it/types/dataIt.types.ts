import type { LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";

export interface DataItKpiData {
	totalDevices: number;
	activeSystems: number;
	openTickets: number;
	securityScore: number;
}

export interface DeviceCategoryItem {
	id: string;
	labelKey: TranslationKeys;
	count: number;
	percentage: number;
	colorClass: string;
}

export interface WarrantyExpiryDevice {
	id: string;
	name: string;
	serialNumber: string;
	assignedTo: string;
	daysLeft: number;
	expiryDate: string;
}

export interface UpcomingPurchaseItem {
	id: string;
	itemName: string;
	category: string;
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
	createdTime: string;
}

export interface DataItQuickAction {
	id: string;
	labelKey: TranslationKeys;
	successMessageKey: TranslationKeys;
	icon: LucideIcon;
}

export interface DataItDashboardState {
	kpi: DataItKpiData;
	categories: DeviceCategoryItem[];
	warrantyDevices: WarrantyExpiryDevice[];
	upcomingPurchases: UpcomingPurchaseItem[];
	supportTickets: ActiveSupportTicketItem[];
}
