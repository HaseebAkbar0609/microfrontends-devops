"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findActiveRouteTab, isRouteTabActive, type RouteTabItem } from "@/types/navigation";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

export type { RouteTabItem };
export { isRouteTabActive, findActiveRouteTab };

export interface RouteTabsProps {
	items: RouteTabItem[];
	ariaLabel?: string;
	className?: string;
}

export function RouteTabs({ items, ariaLabel = "Module Tabs", className }: RouteTabsProps) {
	const pathname = usePathname();

	if (items.length === 0) return null;

	const activeTab = findActiveRouteTab(items, pathname);

	return (
		<div className="overflow-x-auto scrollbar-none">
			<nav
				className={cn(
					"inline-flex items-center gap-1 sm:gap-2 min-w-max h-[36px]",
					className,
				)}
				aria-label={ariaLabel}
			>
				{items.map((item) => {
					const isActive = activeTab?.id === item.id;
					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors",
								isActive
									? "text-slate-950"
									: "text-slate-500 hover:text-slate-900",
							)}
						>
							{item.labelKey ? (
								<Translate text={item.labelKey} />
							) : (
								item.label
							)}
							{item.badge !== undefined && (
								<span className="ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold text-slate-700">
									{item.badge}
								</span>
							)}
							{isActive && (
								<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
							)}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

export default RouteTabs;
