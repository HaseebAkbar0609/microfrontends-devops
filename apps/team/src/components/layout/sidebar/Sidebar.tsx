"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
	getFavoriteNavItems,
	getNavConfig,
	navGroupMatchesPath,
	type NavGroup,
} from "./navConfig";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { DashboardLogo } from "./DashboardLogo";
import { SLATE } from "@/constants/colors";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

interface SidebarProps {
	/** Start collapsed, for pages that bring their own sub-sidebar. */
	autoCollapse?: boolean;
}

const FAVORITE_NAV_STORAGE_KEY = "sidebar-favorite-items";

function getDefaultOpenGroupId(groups: NavGroup[]) {
	return groups.find((group) => group.defaultOpen && group.items.length > 0)?.id ?? null;
}

export default function Sidebar({ autoCollapse = false }: SidebarProps) {
	const pathname = usePathname();
	const t = useTranslate();
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [openGroupId, setOpenGroupId] = useState<string | null>(null);
	// Null until the toggle is pressed. Until then the menu is open, except on
	// pages with their own sub-sidebar, where two open menus would crowd the page.
	const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null);
	const collapsed = manualCollapsed ?? autoCollapse;

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
					(group) => group.items.length > 0 && navGroupMatchesPath(group, pathname)
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

	const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
	const toggleLabel = t(
		collapsed
			? localizationConstants.sidebarExpand
			: localizationConstants.sidebarCollapse
	);

	return (
		<aside
			className={`flex h-full shrink-0 flex-col bg-slate-800 pb-3 transition-[width] duration-200 ease-out motion-reduce:transition-none ${collapsed ? "w-16" : "w-60"}`}
		>
			<div className="flex h-full flex-col rounded-lg bg-gray-800 p-2.5">
				{/* Header: logotype and the collapse toggle */}
				<div
					className={`flex items-center gap-2 p-2 ${collapsed ? "flex-col" : "justify-between"}`}
				>
					<DashboardLogo collapsed={collapsed} />
					<button
						type="button"
						onClick={() => setManualCollapsed(!collapsed)}
						aria-label={toggleLabel}
						aria-expanded={!collapsed}
						title={toggleLabel}
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-600 text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100 active:scale-[0.97]"
					>
						<ToggleIcon size={16} />
					</button>
				</div>

				{collapsed && (
					<hr
						className="mx-2 mb-2 border-t"
						style={{ borderTopColor: SLATE[700] }}
					/>
				)}

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
