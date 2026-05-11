"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { getFavoriteNavItems, getNavConfig, type NavGroup } from "./navConfig";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { SLATE } from "@/constants/colors";

interface SidebarProps {
	autoCollapse?: boolean;
}

const FAVORITE_NAV_STORAGE_KEY = "sidebar-favorite-items";

function matchesGroupPath(group: NavGroup, pathname: string) {
	if (group.href && (pathname === group.href || pathname.startsWith(`${group.href}/`))) {
		return true;
	}
	return group.items.some(
		(item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
	);
}

function getDefaultOpenGroupId(groups: NavGroup[]) {
	return groups.find((group) => group.defaultOpen && group.items.length > 0)?.id ?? null;
}

export default function Sidebar({ autoCollapse = false }: SidebarProps) {
	const pathname = usePathname();
	const [isHovered, setIsHovered] = useState(false);
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [openGroupId, setOpenGroupId] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			const storedFavoriteIds = window.localStorage.getItem(
				FAVORITE_NAV_STORAGE_KEY
			);
			if (!storedFavoriteIds) return;

			const parsedFavoriteIds = JSON.parse(storedFavoriteIds);
			if (Array.isArray(parsedFavoriteIds)) {
				setFavoriteIds(
					parsedFavoriteIds.filter(
						(value): value is string => typeof value === "string"
					)
				);
			}
		} catch {
			setFavoriteIds([]);
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(
			FAVORITE_NAV_STORAGE_KEY,
			JSON.stringify(favoriteIds)
		);
	}, [favoriteIds]);

	const favoriteItems = useMemo(
		() => getFavoriteNavItems(favoriteIds),
		[favoriteIds]
	);

	const navGroups = useMemo(
		() => getNavConfig(favoriteItems),
		[favoriteItems]
	);

	useEffect(() => {
		setOpenGroupId((previousOpenGroupId) => {
			const activeGroupId =
				navGroups.find(
					(group) => group.items.length > 0 && matchesGroupPath(group, pathname)
				)?.id ?? null;

			if (activeGroupId) {
				return activeGroupId;
			}

			if (
				previousOpenGroupId &&
				navGroups.some(
					(group) => group.id === previousOpenGroupId && group.items.length > 0
				)
			) {
				return previousOpenGroupId;
			}

			return getDefaultOpenGroupId(navGroups);
		});
	}, [navGroups, pathname]);

	void autoCollapse;
	const collapsed = !isHovered;

	return (
		<aside
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`flex h-full shrink-0 flex-col bg-slate-800 pb-3 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
		>
			{/* Inner container with rounded corners */}
			<div className="flex h-full flex-col p-2.5 rounded-lg bg-gray-800">
				{/* Header: Logo + Search */}
				<div className="flex flex-col gap-2 p-2">
					{/* Logo row */}
					<div
						className={`flex items-center gap-4 p-2 ${collapsed ? "flex-col justify-center" : "justify-between"}`}
					>
						{/* Logo — full when expanded, abbreviated when collapsed */}
						{collapsed ? (
							<div className="flex items-center justify-center">
								<span className="text-xl font-bold leading-none text-brand-orange">
									T
								</span>
								<span className="text-xl font-bold leading-none text-white">
									F
								</span>
							</div>
						) : (
							<div className="flex items-center">
								<span className="text-lg font-bold leading-none text-brand-orange">
									Time
								</span>
								<span className="text-lg font-bold leading-none text-white">
									Flow
								</span>
							</div>
						)}

						{collapsed && (
							<hr
								className="w-full border-t "
								style={{ borderTopColor: SLATE[700] }}
							/>
						)}
					</div>

					{/* Search bar — hidden when collapsed */}
					{!collapsed && (
						<div className="relative flex items-center">
							<Search
								size={16}
								className="pointer-events-none absolute left-[9px] top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<input
								type="text"
								placeholder="Search"
								className="w-full rounded-md border border-slate-600 bg-slate-700 py-1 pl-8 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-slate-500"
							/>
						</div>
					)}
				</div>

					{/* Navigation */}
				<nav className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2 hide-scrollbar">
					<div className={`flex flex-col ${collapsed ? "px-0" : "px-2"}`}>
						{navGroups.map((group) => (
							<SidebarNavGroup
								key={group.id}
								group={group}
								collapsed={collapsed}
								isOpen={openGroupId === group.id}
								onToggle={() =>
									setOpenGroupId((previousOpenGroupId) =>
										previousOpenGroupId === group.id ? null : group.id
									)
								}
							/>
						))}
					</div>
				</nav>
			</div>
		</aside>
	);
}
