"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Folder,
	FolderOpen,
	ChevronsUpDown,
	ChevronRight,
	ChevronDown,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

export interface OrderSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
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

export interface SubOrderGoToItem {
	id: string;
	title: string;
	href: string;
	children?: { id: string; title: string; href: string }[];
}

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

export function OrderSubSidebar() {
	const pathname = usePathname();
	const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

	const toggleOrderExpand = (id: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<aside className="sticky top-0 hidden md:flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header */}
			<div className="flex h-16 w-full items-center justify-between border-b border-slate-200 px-5">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111721] text-white font-semibold shadow-2xs">
						<Folder className="h-5 w-5 text-white" aria-hidden />
					</div>
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.orderModule} />
					</span>
				</div>
				<ChevronsUpDown className="h-4 w-4 text-slate-500 cursor-pointer" aria-hidden />
			</div>

			{/* Nav items */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 overflow-y-auto">
				{ORDER_SUB_SIDEBAR_ITEMS.map((item) => {
					const isActive =
						pathname === item.href ||
						pathname.startsWith(`${item.href}/`) ||
						(item.id === "order-overview" && pathname === "/module/production/order");

					const ItemIcon = isActive ? FolderOpen : Folder;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								isActive
									? "bg-[#111721] text-white shadow-xs"
									: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
							)}
						>
							<ItemIcon
								className={cn(
									"h-4 w-4 shrink-0",
									isActive ? "text-white" : "text-slate-500"
								)}
								aria-hidden
							/>
							<span className="truncate">
								<Translate text={item.labelKey} />
							</span>
						</Link>
					);
				})}

				{/* "Gå till" section */}
				<div className="mt-4 pt-4 border-t border-slate-200">
					<p className="px-3.5 mb-2 text-xs font-semibold text-slate-500">
						<Translate text={localizationConstants.orderGoTo} />
					</p>
					<div className="flex flex-col gap-1">
						{ORDER_GOTO_ITEMS.map((item) => {
							const isExpanded = !!expandedOrders[item.id];
							const isActive =
								pathname === item.href || pathname.startsWith(`${item.href}/`);
							const ItemIcon = isActive ? FolderOpen : Folder;
							const hasChildren = item.children && item.children.length > 0;

							return (
								<div key={item.id} className="flex flex-col gap-1">
									<div
										className={cn(
											"flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
											isActive
												? "bg-[#111721] text-white shadow-xs"
												: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
										)}
									>
										<Link href={item.href} className="flex items-center gap-3 min-w-0 flex-1">
											<ItemIcon
												className={cn(
													"h-4 w-4 shrink-0",
													isActive ? "text-white" : "text-slate-500"
												)}
												aria-hidden
											/>
											<span className="truncate">{item.title}</span>
										</Link>
										{hasChildren ? (
											<button
												type="button"
												onClick={(e) => toggleOrderExpand(item.id, e)}
												className={cn(
													"p-0.5 rounded hover:bg-slate-200/50 transition-colors cursor-pointer",
													isActive ? "hover:bg-slate-700 text-white" : "text-slate-400 hover:text-slate-600"
												)}
												aria-label={`Toggle ${item.title}`}
											>
												{isExpanded ? (
													<ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
												) : (
													<ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
												)}
											</button>
										) : (
											<ChevronRight
												className={cn(
													"h-4 w-4 shrink-0",
													isActive ? "text-white" : "text-slate-400"
												)}
												aria-hidden
											/>
										)}
									</div>

									{isExpanded && item.children && (
										<div className="ml-4 pl-3 flex flex-col gap-1 border-l border-slate-200">
											{item.children.map((child) => {
												const isChildActive = pathname === child.href;
												return (
													<Link
														key={child.id}
														href={child.href}
														className={cn(
															"flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
															isChildActive
																? "bg-[#111721] text-white"
																: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
														)}
													>
														<span className="truncate">{child.title}</span>
													</Link>
												);
											})}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</nav>
		</aside>
	);
}

export default OrderSubSidebar;
