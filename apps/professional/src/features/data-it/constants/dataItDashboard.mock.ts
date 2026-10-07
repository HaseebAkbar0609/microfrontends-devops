import {
	Laptop,
	PlusCircle,
	ShieldCheck,
	ShoppingCart,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type {
	RawDataItDashboardState,
	DataItQuickAction,
} from "../types/dataIt.types";

export const initialRawDataItDashboardState: RawDataItDashboardState = {
	categories: [
		{
			id: "laptops",
			labelKey: localizationConstants.dataItLaptops,
			count: 68,
			colorClass: "bg-slate-900",
		},
		{
			id: "monitors",
			labelKey: localizationConstants.dataItMonitors,
			count: 42,
			colorClass: "bg-slate-700",
		},
		{
			id: "mobiles",
			labelKey: localizationConstants.dataItMobileTablets,
			count: 22,
			colorClass: "bg-slate-500",
		},
		{
			id: "servers",
			labelKey: localizationConstants.dataItServersNetwork,
			count: 10,
			colorClass: "bg-slate-400",
		},
		{
			id: "peripherals",
			labelKey: localizationConstants.dataItOtherPeripherals,
			count: 6,
			colorClass: "bg-slate-300",
		},
	],
	warrantyDevices: [
		{
			id: "w-1",
			name: "MacBook Pro 16\" M2 Max",
			serialNumber: "SN-MBP-9821-SE",
			assignedTo: "Johan Lindqvist (Lead Dev)",
			expiryDate: "2026-10-21",
		},
		{
			id: "w-2",
			name: "Dell UltraSharp 32\" 4K",
			serialNumber: "SN-DEL-4412-SE",
			assignedTo: "Sara Bergström (Design)",
			expiryDate: "2026-11-04",
		},
		{
			id: "w-3",
			name: "Lenovo ThinkPad X1 Carbon",
			serialNumber: "SN-LNV-1109-SE",
			assignedTo: "Erik Larsson (Ekonomi)",
			expiryDate: "2026-11-28",
		},
	],
	upcomingPurchases: [
		{
			id: "p-1",
			itemName: "MacBook Pro 14\" M3 Pro",
			categoryKey: localizationConstants.dataItLaptops,
			quantity: 4,
			estimatedCostSek: 96000,
			status: "APPROVED",
		},
		{
			id: "p-2",
			itemName: "Dell UltraSharp 27\" 4K",
			categoryKey: localizationConstants.dataItMonitors,
			quantity: 6,
			estimatedCostSek: 24000,
			status: "APPROVED",
		},
		{
			id: "p-3",
			itemName: "Thunderbolt 4 Docking Station",
			categoryKey: localizationConstants.dataItOtherPeripherals,
			quantity: 8,
			estimatedCostSek: 36000,
			status: "PENDING",
		},
	],
	supportTickets: [
		{
			id: "t-1",
			ticketNumber: "IT-2026-089",
			subject: "VPN & Network Access - Post OS update",
			requester: "Anna Svensson",
			priority: "HIGH",
			createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		},
		{
			id: "t-2",
			ticketNumber: "IT-2026-088",
			subject: "Display flickering when connected to dock",
			requester: "Magnus Karlsson",
			priority: "NORMAL",
			createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		},
		{
			id: "t-3",
			ticketNumber: "IT-2026-087",
			subject: "Figma Enterprise License Setup",
			requester: "Karin Ek",
			priority: "NORMAL",
			createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		},
	],
	securityItems: [
		{
			id: "mfa",
			labelKey: localizationConstants.dataItMfaCompliance,
			percentage: 98.4,
			status: "ok",
		},
		{
			id: "backup",
			labelKey: localizationConstants.dataItDailyBackup,
			valueKey: localizationConstants.dataItCompleted,
			status: "ok",
		},
		{
			id: "antivirus",
			labelKey: localizationConstants.dataItAntivirusStatus,
			valueKey: localizationConstants.dataItUpToDate,
			status: "ok",
		},
		{
			id: "patches",
			labelKey: localizationConstants.dataItPendingPatches,
			valueKey: localizationConstants.dataItPending,
			count: 2,
			status: "warn",
		},
	],
	systemStatusItems: [
		{
			id: "sys-1",
			name: "ERP Visma Enterprise",
			uptimePercentage: 99.98,
			statusKey: localizationConstants.dataItOperational,
			status: "ok",
		},
		{
			id: "sys-2",
			name: "Microsoft 365 / Entra ID",
			uptimePercentage: 100.0,
			statusKey: localizationConstants.dataItOperational,
			status: "ok",
		},
		{
			id: "sys-3",
			name: "Fortnox API Sync",
			uptimePercentage: 99.95,
			statusKey: localizationConstants.dataItOperational,
			status: "ok",
		},
		{
			id: "sys-4",
			name: "TFS Local File Gateway",
			uptimePercentage: 100.0,
			statusKey: localizationConstants.dataItOperational,
			status: "ok",
		},
	],
};

export const DATA_IT_QUICK_ACTIONS: DataItQuickAction[] = [
	{
		id: "register-equipment",
		labelKey: localizationConstants.dataItRegisterEquipment,
		targetHref: "/module/business-support/data-it/equipment",
		icon: Laptop,
	},
	{
		id: "create-ticket",
		labelKey: localizationConstants.dataItCreateSupportTicket,
		targetHref: "/module/business-support/data-it/support",
		icon: PlusCircle,
	},
	{
		id: "order-hardware",
		labelKey: localizationConstants.dataItOrderHardware,
		targetHref: "/module/business-support/data-it/procurement",
		icon: ShoppingCart,
	},
	{
		id: "request-permissions",
		labelKey: localizationConstants.dataItRequestPermissions,
		icon: ShieldCheck,
	},
];

