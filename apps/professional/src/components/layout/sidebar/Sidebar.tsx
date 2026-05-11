"use client";

import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navConfig, type NavGroup } from "./navConfig";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { SidebarRailFlyoutContext } from "./SidebarRailContext";
import { SLATE } from "@/constants/colors";
import { cn } from "@/lib/utils";

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
						<div
							className={cn(
								"relative flex h-7 items-center",
								collapsed
									? "w-full justify-center"
									: "min-w-0 flex-1 justify-start"
							)}
						>
							<div
								className={cn(
									"flex items-center justify-center gap-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
									collapsed
										? "opacity-100"
										: "pointer-events-none absolute inset-0 scale-95 opacity-0"
								)}
								aria-hidden={!collapsed}
							>
								<span className="text-xl font-bold leading-none text-brand-orange">
									T
								</span>
								<span className="text-xl font-bold leading-none text-white">
									F
								</span>
							</div>
							<div
								className={cn(
									"flex items-center transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
									collapsed
										? "pointer-events-none absolute inset-0 justify-center scale-95 opacity-0"
										: "scale-100 opacity-100"
								)}
								aria-hidden={collapsed}
							>
								<span className="text-lg font-bold leading-none text-brand-orange">
									Time
								</span>
								<span className="text-lg font-bold leading-none text-white">
									Flow
								</span>
							</div>
						</div>

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

					<div
						className={cn(
							"grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
							collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
						)}
					>
						<div className="min-h-0 overflow-hidden">
							<div className="relative flex items-center pb-0.5 pt-0">
								<Search
									size={16}
									className="pointer-events-none absolute left-[9px] top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="text"
									placeholder="Search"
									disabled={collapsed}
									className="w-full rounded-md border border-slate-600 bg-slate-700 py-1 pl-8 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-slate-500 disabled:pointer-events-none"
								/>
							</div>
						</div>
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
