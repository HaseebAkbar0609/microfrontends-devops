import type { ComponentType } from "react";
import type { TranslationKeys } from "@/utils/translation/constants";

/**
 * Interface representing an item in the top tabbar / route-aware navigation.
 */
export interface RouteTabItem {
	id: string;
	/** Translation key, resolved through `Translate`. Preferred over `label`. */
	labelKey?: TranslationKeys | string;
	/** Literal label, for values that are not translatable (e.g. a record number). */
	label?: string;
	href: string;
	icon?: ComponentType<{ size?: number; className?: string }>;
	activeIcon?: ComponentType<{ size?: number; className?: string }>;
	/** Match the pathname exactly instead of also matching nested routes. */
	exact?: boolean;
	/** Additional subpaths that should activate this tab */
	matchSubPaths?: string[];
	badge?: string | number;
}

/**
 * Alias for RouteTabItem.
 */
export type ModuleTabItem = RouteTabItem;

/**
 * Backward-compatible alias for RouteTabItem.
 */
export type DynamicSubSidebarItem = RouteTabItem;

export function isRouteTabActive(
	item: RouteTabItem,
	pathname: string
): boolean {
	if (item.exact) return pathname === item.href;
	if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
	if (item.matchSubPaths && item.matchSubPaths.some((sub) => pathname.startsWith(sub))) return true;
	return false;
}

/**
 * Most-specific match wins:
 * 1. Exact match on item.href
 * 2. Direct child match on item.href (e.g. pathname.startsWith(`${item.href}/`))
 * 3. Match via matchSubPaths (longest matching prefix wins)
 */
export function findActiveRouteTab(
	items: RouteTabItem[],
	pathname: string
): RouteTabItem | undefined {
	const activeItems = items.filter((item) => isRouteTabActive(item, pathname));
	if (activeItems.length === 0) return undefined;
	if (activeItems.length === 1) return activeItems[0];

	// Priority 1: Exact match on item.href
	const exactMatch = activeItems.find((item) => pathname === item.href);
	if (exactMatch) return exactMatch;

	// Priority 2: Direct child match on item.href (e.g. pathname.startsWith(`${item.href}/`))
	const directChildMatches = activeItems.filter((item) =>
		pathname.startsWith(`${item.href}/`)
	);
	if (directChildMatches.length > 0) {
		return directChildMatches.sort((a, b) => b.href.length - a.href.length)[0];
	}

	// Priority 3: Match via matchSubPaths (longest matching subpath wins)
	return activeItems.sort((a, b) => {
		const getLongestSubMatch = (item: RouteTabItem) => {
			const matchingSubs =
				item.matchSubPaths?.filter((sub) => pathname.startsWith(sub)) || [];
			return matchingSubs.reduce((max, sub) => Math.max(max, sub.length), 0);
		};
		return getLongestSubMatch(b) - getLongestSubMatch(a);
	})[0];
}
