"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSubItem } from "./SidebarSubItem";
import type { NavGroup } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarNavGroupProps {
	group: NavGroup;
	collapsed?: boolean;
	isOpen?: boolean;
	/** Expands this group; does not collapse others or toggle this group closed. */
	onOpen?: () => void;
	/** Expands or collapses this group only (e.g. chevron). */
	onToggle?: () => void;
}

/** True if pathname is this group’s leaf href or any nested item / flyout href. */
function groupContainsActiveRoute(group: NavGroup, pathname: string) {
	if (
		group.href &&
		(pathname === group.href || pathname.startsWith(`${group.href}/`))
	) {
		return true;
	}
	for (const item of group.items) {
		if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
			return true;
		}
		if (
			item.flyoutItems?.some(
				(f) => pathname === f.href || pathname.startsWith(`${f.href}/`),
			)
		) {
			return true;
		}
	}
	return false;
}

export function SidebarNavGroup({
	group,
	collapsed = false,
	isOpen: isOpenProp,
	onOpen,
	onToggle,
}: SidebarNavGroupProps) {
	const pathname = usePathname();
	const [internalOpen, setInternalOpen] = useState(
		group.defaultOpen ?? false,
	);
	const isControlled = onToggle !== undefined || onOpen !== undefined;
	const isOpen = isControlled ? Boolean(isOpenProp) : internalOpen;
	const Icon = group.icon;
	const hasItems = group.items.length > 0;

	const routeActive = groupContainsActiveRoute(group, pathname);
	const isLeafActive =
		!hasItems &&
		group.href &&
		(pathname === group.href || pathname.startsWith(`${group.href}/`));
	const showCollapsedIconPill = collapsed && routeActive;
	const iconEmphasized =
		showCollapsedIconPill ||
		(!collapsed && isLeafActive && !hasItems && !!group.href) ||
		(!collapsed && hasItems && routeActive);

	function handleMainClick() {
		if (!hasItems) return;
		// Avoid flipping accordion state when the rail is collapsed: submenu is hidden
		// so toggling would feel like sections randomly close when the rail expands.
		if (collapsed) return;
		if (isControlled) {
			onOpen?.();
			if (!onOpen && onToggle) onToggle();
		} else {
			setInternalOpen(true);
		}
	}

	function handleChevronClick(e: React.MouseEvent) {
		e.stopPropagation();
		if (!hasItems || collapsed) return;
		if (isControlled) {
			onToggle?.();
		} else {
			setInternalOpen((previous) => !previous);
		}
	}

	const labelTextOnly = (
		<div
			aria-hidden={collapsed}
			className={cn(
				"flex h-8 min-w-0 flex-1 items-center overflow-hidden px-1 transition-[max-width,opacity,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
				collapsed
					? "max-w-0 flex-none opacity-0 px-0"
					: "min-w-0 max-w-none flex-1 opacity-100 delay-75",
			)}
		>
			<span
				className={cn(
					"min-w-0 flex-1 truncate text-left text-sm font-medium",
					!collapsed && routeActive
						? "text-slate-200"
						: "text-slate-300",
				)}
			>
				<Translate text={group.label} />
			</span>
		</div>
	);

	const iconCell = (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-lg p-1 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
				collapsed ? "mx-auto h-9 w-9" : "h-8 w-8",
				showCollapsedIconPill && "bg-slate-600 shadow-sm",
			)}
		>
			<Icon
				size={16}
				className={cn(
					showCollapsedIconPill && "text-white",
					iconEmphasized &&
						!showCollapsedIconPill &&
						"text-slate-200",
					!iconEmphasized && "text-slate-300",
				)}
			/>
		</div>
	);

	if (!hasItems && group.href) {
		return (
			<div className="flex w-full flex-col">
				<Link
					href={group.href}
					title={collapsed ? group.label : undefined}
					className={cn(
						"flex w-full flex-row items-center rounded-md p-2 transition-colors",
						isLeafActive
							? collapsed
								? "text-slate-300"
								: "bg-slate-700 text-slate-200"
							: "text-slate-300 hover:bg-slate-700/60 hover:text-slate-200",
					)}
				>
					{iconCell}
					{labelTextOnly}
				</Link>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<div
				className={cn(
					"flex w-full min-w-0 flex-row items-center rounded-md p-2 transition-colors",
					!collapsed && routeActive && "bg-slate-700/35 text-slate-200",
				)}
			>
				<button
					type="button"
					onClick={handleMainClick}
					title={collapsed ? group.label : undefined}
					className={cn(
						"flex min-w-0 flex-1 flex-row items-center rounded-md text-left transition-colors outline-none",
						hasItems && !collapsed
							? "cursor-pointer hover:bg-slate-600/25"
							: "cursor-default",
					)}
				>
					{iconCell}
					{labelTextOnly}
				</button>
				{hasItems && !collapsed ? (
					<button
						type="button"
						onClick={handleChevronClick}
						className={cn(
							"flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-slate-600/40",
							routeActive ? "text-slate-200" : "text-slate-300",
						)}
						aria-expanded={isOpen}
						aria-label={isOpen ? "Collapse section" : "Expand section"}
					>
						{isOpen ? (
							<ChevronUp size={16} className="shrink-0" />
						) : (
							<ChevronDown size={16} className="shrink-0" />
						)}
					</button>
				) : null}
			</div>

			{hasItems ? (
				<div
					className={cn(
						"grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
						isOpen && !collapsed
							? "grid-rows-[1fr]"
							: "grid-rows-[0fr]",
					)}
				>
					<div
						className={cn(
							"min-h-0 overflow-hidden",
							(!isOpen || collapsed) && "pointer-events-none",
						)}
					>
						<div className="flex flex-row self-stretch pl-5">
							<div className="flex flex-1 flex-col gap-1.5 border-l border-slate-600 py-0.5 pl-2">
								{group.items.map((item) => (
									<SidebarSubItem
										key={item.id}
										item={item}
										isGroupOpen={isOpen}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
