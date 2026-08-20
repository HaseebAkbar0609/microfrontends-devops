"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navConfig, type NavGroup } from "./navConfig";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { SidebarRailFlyoutContext } from "./SidebarRailContext";
import { SLATE } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { DashboardLogo } from "./DashboardLogo";

interface SidebarProps {
	autoCollapse?: boolean;
}

function matchesGroupPath(group: NavGroup, pathname: string) {
	if (
		group.href &&
		(pathname === group.href || pathname.startsWith(`${group.href}/`))
	) {
		return true;
	}
	return group.items.some(
		(item) =>
			pathname === item.href || pathname.startsWith(`${item.href}/`)
	);
}

function getInitialOpenGroupIds(groups: NavGroup[]) {
	const ids = new Set<string>();
	for (const group of groups) {
		if (group.defaultOpen && group.items.length > 0) {
			ids.add(group.id);
		}
	}
	return ids;
}

export default function Sidebar({ autoCollapse = true }: SidebarProps) {
	const pathname = usePathname();
	const [isHovered, setIsHovered] = useState(false);
	const [manuallyCollapsed, setManuallyCollapsed] = useState(false);
	const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(() =>
		getInitialOpenGroupIds(navConfig)
	);
	const [navFlyoutOpen, setNavFlyoutOpen] = useState(false);

	const collapsed = autoCollapse
		? !isHovered && !navFlyoutOpen
		: manuallyCollapsed;

	useEffect(() => {
		if (!autoCollapse) setIsHovered(false);
	}, [autoCollapse]);

	useEffect(() => {
		const activeGroupId =
			navConfig.find(
				(group) =>
					group.items.length > 0 && matchesGroupPath(group, pathname)
			)?.id ?? null;

		if (!activeGroupId) return;

		setOpenGroupIds((previous) => {
			if (previous.has(activeGroupId)) return previous;
			const next = new Set(previous);
			next.add(activeGroupId);
			return next;
		});
	}, [pathname]);

	const shellTransition =
		"transition-[width,min-width,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0";

	return (
		<SidebarRailFlyoutContext.Provider value={setNavFlyoutOpen}>
			<aside
				onMouseEnter={autoCollapse ? () => setIsHovered(true) : undefined}
				onMouseLeave={
					autoCollapse ? () => setIsHovered(false) : undefined
				}
				className={cn(
					"flex h-full shrink-0 flex-col bg-slate-800 pb-3",
					shellTransition,
					collapsed
						? "w-16 min-w-16 max-w-16 overflow-hidden"
						: "w-72 min-w-72 max-w-72"
				)}
			>
				<div className="flex h-full min-w-0 flex-col rounded-lg bg-gray-800 p-2.5">
				<div className="flex flex-col gap-2 p-2">
					<div
						className={cn(
							"relative flex items-center gap-4 p-2",
							collapsed
								? "min-h-[3rem] flex-col justify-center"
								: "min-h-[3rem] justify-between"
						)}
					>
						<DashboardLogo collapsed={collapsed} />

						{!autoCollapse && (
							<button
								type="button"
								onClick={() => setManuallyCollapsed((prev) => !prev)}
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-700 text-slate-300 transition-colors cursor-pointer hover:bg-slate-600 hover:text-white"
								aria-label={
									collapsed ? "Expand sidebar" : "Collapse sidebar"
								}
							>
								{collapsed ? (
									<PanelLeftOpen size={18} />
								) : (
									<PanelLeftClose size={18} />
								)}
							</button>
						)}

						{collapsed && (
							<hr
								className="w-full border-t"
								style={{ borderTopColor: SLATE[700] }}
							/>
						)}
					</div>
				</div>

				<nav className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2 no-scrollbar">
					<div className={cn("flex flex-col", collapsed ? "px-0" : "px-2")}>
						{navConfig.map((group) => (
							<SidebarNavGroup
								key={group.id}
								group={group}
								collapsed={collapsed}
								isOpen={openGroupIds.has(group.id)}
								onOpen={() => {
									setOpenGroupIds((previous) => {
										if (previous.has(group.id)) return previous;
										const next = new Set(previous);
										next.add(group.id);
										return next;
									});
								}}
								onToggle={() => {
									setOpenGroupIds((previous) => {
										const next = new Set(previous);
										if (next.has(group.id)) {
											next.delete(group.id);
										} else {
											next.add(group.id);
										}
										return next;
									});
								}}
							/>
						))}
					</div>
				</nav>
			</div>
		</aside>
		</SidebarRailFlyoutContext.Provider>
	);
}
