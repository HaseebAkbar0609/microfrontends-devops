import localizationConstants from "@/utils/translation/constants";

export interface OrderSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
}

export interface SubOrderGoToItem {
	id: string;
	title: string;
	href: string;
	children?: { id: string; title: string; href: string }[];
}

export const ORDER_SUB_SIDEBAR_ITEMS: OrderSubSidebarItem[] = [
	{
		id: "order-dashboard",
		labelKey: localizationConstants.orderDashboard,
		href: "/module/production/order/dashboard",
	},
	{
		id: "order-overview",
		labelKey: localizationConstants.orderOverview,
		href: "/module/production/order/overview",
	},
	{
		id: "order-direct",
		labelKey: localizationConstants.orderDirect,
		href: "/module/production/order/direct",
	},
	{
		id: "economic-overview",
		labelKey: localizationConstants.economicOverview,
		href: "/module/production/order/economy",
	},
	{
		id: "planning",
		labelKey: localizationConstants.planning,
		href: "/module/production/order/planning",
	},
	{
		id: "warranty",
		labelKey: localizationConstants.warrantyCommitments,
		href: "/module/production/order/warranty",
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/production/order/archive",
	},
];

export const ORDER_GOTO_ITEMS: SubOrderGoToItem[] = [
	{
		id: "5000-001",
		title: "Order 5000-001",
		href: "/module/production/order/5000-001",
		children: [
			{ id: "5000-001-sub1", title: "Delorder 1", href: "/module/production/order/5000-001/sub1" },
		],
	},
	{
		id: "5000-002",
		title: "Order 5000-002",
		href: "/module/production/order/5000-002",
		children: [
			{ id: "5000-002-sub1", title: "Delorder 1", href: "/module/production/order/5000-002/sub1" },
		],
	},
];
