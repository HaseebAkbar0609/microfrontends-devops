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
 * Most-specific match wins: when several hrefs are prefixes of the pathname
 * (e.g. `/module/production/order` and `/module/production/order/overview`),
 * the longest one is the active tab.
 */
export function findActiveRouteTab(
	items: RouteTabItem[],
	pathname: string
): RouteTabItem | undefined {
	return items
		.filter((item) => isRouteTabActive(item, pathname))
		.sort((a, b) => b.href.length - a.href.length)[0];
}
