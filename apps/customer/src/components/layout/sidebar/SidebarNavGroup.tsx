"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSubItem } from "./SidebarSubItem";
import type { NavGroup } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarNavGroupProps {
	group: NavGroup;
	collapsed?: boolean;
	onNavigate?: () => void;
}

export function SidebarNavGroup({
	group,
	collapsed = false,
	onNavigate,
}: SidebarNavGroupProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false);
	const Icon = group.icon;
	const hasItems = group.items.length > 0;

	// Active if the group's own href matches OR any child item's href matches
	const isActive =
		(group.href && pathname.startsWith(group.href)) ||
		group.items.some(
			(item) =>
				pathname === item.href || pathname.startsWith(item.href + "/"),
		);

	const activeSubItemId = useMemo(() => {
		let bestId: string | null = null;
		let bestLen = -1;
		for (const item of group.items) {
			const matches =
				pathname === item.href || pathname.startsWith(item.href + "/");
			if (matches && item.href.length > bestLen) {
				bestId = item.id;
				bestLen = item.href.length;
			}
		}
		return bestId;
	}, [group.items, pathname]);

	const handleClick = () => {
		if (collapsed) {
			const targetHref =
				group.href || (hasItems ? group.items[0].href : null);
			if (targetHref) {
				router.push(targetHref);
				onNavigate?.();
			}
			return;
		}

		if (!hasItems && group.href) {
			// Navigate for leaf nodes
			router.push(group.href);
			onNavigate?.();
		} else if (hasItems) {
			// Toggle expansion for groups
			setIsOpen((prev) => !prev);
		}
	};

	return (
		<div className="flex w-full flex-col">
			{/* Level 1 Button */}
			<button
				type="button"
				onClick={handleClick}
				title={collapsed ? group.label : undefined}
				className={cn(
					"flex cursor-pointer w-full flex-row items-center rounded-md p-2 transition-colors",
					isActive && "bg-slate-600", // active background
					!collapsed && (hasItems || group.href)
						? "cursor-pointer hover:bg-slate-700"
						: "cursor-default",
				)}
			>
				{/* Icon area */}
				<div
					className={cn(
						"flex h-8 shrink-0 items-center justify-center rounded-md p-1 cursor-pointer",
						collapsed ? "w-full" : "w-8",
					)}
				>
					<Icon size={16} className="text-slate-300" />
				</div>

				{/* Label + Chevron — hidden when collapsed */}
				{!collapsed && (
					<div className="flex h-7 flex-1 items-center gap-2 px-1">
						<span className="flex-1 text-left text-sm font-medium text-slate-300">
							<Translate text={group.label} />
						</span>
						{hasItems &&
							(isOpen ? (
								<ChevronUp
									size={16}
									className="shrink-0 text-slate-300"
								/>
							) : (
								<ChevronDown
									size={16}
									className="shrink-0 text-slate-300"
								/>
							))}
					</div>
				)}
			</button>

			{/* Submenu — only when expanded and not collapsed */}
			{hasItems && isOpen && !collapsed && (
				<div className="flex flex-row self-stretch pl-5 pt-1.5 pb-1.5">
					<div className="flex flex-1 flex-col gap-1.5 border-l border-gray-600 py-0.5 pl-2">
						{group.items.map((item) => (
							<SidebarSubItem
								key={item.id}
							item={item}
							isActive={item.id === activeSubItemId}
							onNavigate={onNavigate}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
