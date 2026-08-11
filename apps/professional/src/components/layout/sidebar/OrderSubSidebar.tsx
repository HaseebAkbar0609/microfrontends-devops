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
import {
	ORDER_SUB_SIDEBAR_ITEMS,
	ORDER_GOTO_ITEMS,
} from "@/features/orders/data/orderNav.config";

export function isPathActive(currentPath: string, itemHref: string, itemId?: string): boolean {
	if (currentPath === itemHref || currentPath.startsWith(`${itemHref}/`)) {
		return true;
	}
	if (itemId === "order-overview" && currentPath === "/module/production/order") {
		return true;
	}
	return false;
}

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
					const active = isPathActive(pathname, item.href, item.id);
					const ItemIcon = active ? FolderOpen : Folder;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								active
									? "bg-[#111721] text-white shadow-xs"
									: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
							)}
						>
							<ItemIcon
								className={cn(
									"h-4 w-4 shrink-0",
									active ? "text-white" : "text-slate-500"
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
							const active = isPathActive(pathname, item.href);
							const ItemIcon = active ? FolderOpen : Folder;
							const hasChildren = Boolean(item.children && item.children.length > 0);

							return (
								<div key={item.id} className="flex flex-col gap-1">
									<div
										className={cn(
											"flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
											active
												? "bg-[#111721] text-white shadow-xs"
												: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
										)}
									>
										<Link href={item.href} className="flex items-center gap-3 min-w-0 flex-1">
											<ItemIcon
												className={cn(
													"h-4 w-4 shrink-0",
													active ? "text-white" : "text-slate-500"
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
													active ? "hover:bg-slate-700 text-white" : "text-slate-400 hover:text-slate-600"
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
													active ? "text-white" : "text-slate-400"
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
