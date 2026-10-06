import {
	Laptop,
	PlusCircle,
	ShieldCheck,
	ShoppingCart,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type {
	DataItDashboardState,
	DataItQuickAction,
} from "../types/dataIt.types";

export const initialDataItDashboardState: DataItDashboardState = {
	kpi: {
		totalDevices: 148,
		activeSystems: 24,
		openTickets: 6,
		securityScore: 98,
	},
	categories: [
		{
			id: "laptops",
			labelKey: localizationConstants.dataItLaptops,
			count: 68,
			percentage: 46,
			colorClass: "bg-slate-900",
		},
		{
			id: "monitors",
			labelKey: localizationConstants.dataItMonitors,
			count: 42,
			percentage: 28,
			colorClass: "bg-slate-700",
		},
		{
			id: "mobiles",
			labelKey: localizationConstants.dataItMobileTablets,
			count: 22,
			percentage: 15,
			colorClass: "bg-slate-500",
		},
		{
			id: "servers",
			labelKey: localizationConstants.dataItServersNetwork,
			count: 10,
			percentage: 7,
			colorClass: "bg-slate-400",
		},
		{
			id: "peripherals",
			labelKey: localizationConstants.dataItOtherPeripherals,
			count: 6,
			percentage: 4,
			colorClass: "bg-slate-300",
		},
	],
	warrantyDevices: [
		{
			id: "w-1",
			name: "MacBook Pro 16\" M2 Max",
			serialNumber: "SN-MBP-9821-SE",
			assignedTo: "Johan Lindqvist (Lead Dev)",
			daysLeft: 14,
			expiryDate: "2026-10-20",
		},
		{
			id: "w-2",
			name: "Dell UltraSharp 32\" 4K",
			serialNumber: "SN-DEL-4412-SE",
			assignedTo: "Sara Bergström (Design)",
			daysLeft: 28,
			expiryDate: "2026-11-03",
		},
		{
			id: "w-3",
			name: "Lenovo ThinkPad X1 Carbon",
			serialNumber: "SN-LNV-1109-SE",
			assignedTo: "Erik Larsson (Ekonomi)",
			daysLeft: 52,
			expiryDate: "2026-11-27",
		},
	],
	upcomingPurchases: [
		{
			id: "p-1",
			itemName: "MacBook Pro 14\" M3 Pro (x4)",
			category: "Laptops",
			quantity: 4,
			estimatedCostSek: 96000,
			status: "APPROVED",
		},
		{
			id: "p-2",
			itemName: "Dell 27\" QHD Skärmar (x6)",
			category: "Skärmar",
			quantity: 6,
			estimatedCostSek: 24000,
			status: "APPROVED",
		},
		{
			id: "p-3",
			itemName: "Thunderbolt 4 Docking stations (x8)",
			category: "Kringutrustning",
			quantity: 8,
			estimatedCostSek: 36000,
			status: "PENDING",
		},
	],
	supportTickets: [
		{
			id: "t-1",
			ticketNumber: "IT-2026-089",
			subject: "VPN och nätverksåtkomst efter OS-uppdatering",
			requester: "Anna Svensson",
			priority: "HIGH",
			createdTime: "1h sedan",
		},
		{
			id: "t-2",
			ticketNumber: "IT-2026-088",
			subject: "Skärmflimmer vid anslutning till docka",
			requester: "Magnus Karlsson",
			priority: "NORMAL",
			createdTime: "3h sedan",
		},
		{
			id: "t-3",
			ticketNumber: "IT-2026-087",
			subject: "Installation av Figma Enterprise-licens",
			requester: "Karin Ek",
			priority: "NORMAL",
			createdTime: "5h sedan",
		},
	],
};

export const DATA_IT_QUICK_ACTIONS: DataItQuickAction[] = [
	{
		id: "register-equipment",
		labelKey: localizationConstants.dataItRegisterEquipment,
		successMessageKey: localizationConstants.dataItActionRegisteredSuccess,
		icon: Laptop,
	},
	{
		id: "create-ticket",
		labelKey: localizationConstants.dataItCreateSupportTicket,
		successMessageKey: localizationConstants.dataItActionTicketSuccess,
		icon: PlusCircle,
	},
	{
		id: "order-hardware",
		labelKey: localizationConstants.dataItOrderHardware,
		successMessageKey: localizationConstants.dataItActionOrderSuccess,
		icon: ShoppingCart,
	},
	{
		id: "request-permissions",
		labelKey: localizationConstants.dataItRequestPermissions,
		successMessageKey: localizationConstants.dataItActionPermissionSuccess,
		icon: ShieldCheck,
	},
];
