"use client";

import Link from "next/link";
import { memo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSubItem } from "./SidebarSubItem";
import type { NavGroup } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarNavGroupProps {
	group: NavGroup;
	collapsed?: boolean;
	pathname: string;
	onPrefetch: (href: string) => void;
}

function SidebarNavGroupComponent({
	group,
	collapsed = false,
	pathname,
	onPrefetch,
}: SidebarNavGroupProps) {
	const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false);
	const Icon = group.icon;
	const hasItems = group.items.length > 0;
	const targetHref = group.href || (hasItems ? group.items[0].href : null);

	const isActive =
		(group.href && pathname.startsWith(group.href)) ||
		group.items.some(
			(item) =>
				pathname === item.href || pathname.startsWith(item.href + "/"),
		);

	const itemClassName = cn(
		"flex cursor-pointer w-full flex-row items-center rounded-md p-2 transition-colors",
		isActive && "bg-slate-600",
		!collapsed && (hasItems || group.href)
			? "cursor-pointer hover:bg-slate-700"
			: "cursor-default",
	);

	const itemContent = (
		<>
			<div
				className={cn(
					"flex h-8 shrink-0 items-center justify-center rounded-md p-1 cursor-pointer",
					collapsed ? "w-full" : "w-8",
				)}
			>
				<Icon size={16} className="text-slate-300" />
			</div>

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
		</>
	);

	const shouldRenderLink = !!targetHref && (collapsed || !hasItems);

	return (
		<div className="flex w-full flex-col">
			{shouldRenderLink ? (
				<Link
					href={targetHref}
					prefetch
					onMouseEnter={() => onPrefetch(targetHref)}
					onFocus={() => onPrefetch(targetHref)}
					title={collapsed ? group.label : undefined}
					className={itemClassName}
				>
					{itemContent}
				</Link>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					onMouseEnter={() => targetHref && onPrefetch(targetHref)}
					onFocus={() => targetHref && onPrefetch(targetHref)}
					title={collapsed ? group.label : undefined}
					className={itemClassName}
				>
					{itemContent}
				</button>
			)}

			{hasItems && isOpen && !collapsed && (
				<div className="flex flex-row self-stretch pl-5 pt-1.5 pb-1.5">
					<div className="flex flex-1 flex-col gap-1.5 border-l border-gray-600 py-0.5 pl-2">
						{group.items.map((item) => (
							<SidebarSubItem
								key={item.id}
								item={item}
								pathname={pathname}
								onPrefetch={onPrefetch}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export const SidebarNavGroup = memo(SidebarNavGroupComponent);
