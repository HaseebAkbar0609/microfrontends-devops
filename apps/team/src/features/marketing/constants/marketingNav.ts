import { LayoutGrid, Mail } from "lucide-react";
import type { ModuleSubNavItem } from "@/components/layout/sidebar/ModuleSubSidebar";
import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingGroup, MarketingGroupId } from "../types";
import {
	MARKETING_BASE_HREF,
	MARKETING_NEWSLETTER_HREF,
} from "./marketing.constants";
import { MARKETING_GROUPS, getFirstSection } from "./marketingGroups";

/**
 * Title shown on every page of the module. Rule 1 of the tab navigation
 * guideline: it does not change as you drill in.
 */
export const MARKETING_MODULE_TITLE_KEY =
	localizationConstants.marketingModuleTitle;

export function getMarketingGroupHref(groupId: MarketingGroupId): string {
	return `${MARKETING_BASE_HREF}/${groupId}`;
}

export function getMarketingSectionHref(
	groupId: MarketingGroupId,
	slug: string,
): string {
	return `${MARKETING_BASE_HREF}/${groupId}/${slug}`;
}

export type MarketingSubNavItem = ModuleSubNavItem & {
	/** Match only the exact route, so the overview is not lit on every page. */
	exact?: boolean;
};

/**
 * The module's sub-sidebar: the overview, the six register groups, and the
 * newsletter builder, as in the Sales module. A group entry opens its first
 * register through the group route, so the section row is never empty.
 */
export const MARKETING_SUB_NAV_ITEMS: MarketingSubNavItem[] = [
	{
		id: "marketing-overview",
		labelKey: localizationConstants.marketingTabOverview,
		href: MARKETING_BASE_HREF,
		icon: LayoutGrid,
		exact: true,
	},
	...MARKETING_GROUPS.map((group) => ({
		id: `marketing-${group.id}`,
		labelKey: group.titleKey,
		href: getMarketingGroupHref(group.id),
		icon: group.icon,
	})),
	{
		id: "marketing-newsletter",
		labelKey: localizationConstants.marketingTabNewsletter,
		href: MARKETING_NEWSLETTER_HREF,
		icon: Mail,
	},
];

function matchesMarketingHref(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function isMarketingModulePath(pathname: string): boolean {
	return matchesMarketingHref(pathname, MARKETING_BASE_HREF);
}

export function isMarketingSubNavItemActive(
	item: MarketingSubNavItem,
	pathname: string,
): boolean {
	return item.exact
		? pathname === item.href
		: matchesMarketingHref(pathname, item.href);
}

/** Secondary row: the registers inside one group. */
export function getMarketingSectionTabs(group: MarketingGroup): ModuleTabItem[] {
	return group.sections.map((section) => ({
		id: `marketing-${group.id}-${section.slug}`,
		labelKey: section.titleKey,
		href: getMarketingSectionHref(group.id, section.slug),
	}));
}

export const MARKETING_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.dashboard, href: "/home" },
	{ label: localizationConstants.moduleItem },
	{ label: localizationConstants.marketingModuleTitle },
];

/** A group entry lands on its first register. */
export function getMarketingGroupLandingHref(group: MarketingGroup): string {
	return getMarketingSectionHref(group.id, getFirstSection(group).slug);
}
