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

/**
 * Primary row: the overview, the six register groups, and the newsletter
 * builder. Group tabs point straight at their first register so the secondary
 * row is never empty.
 */
export const MARKETING_MODULE_TABS: ModuleTabItem[] = [
	{
		id: "marketing-overview",
		labelKey: localizationConstants.marketingTabOverview,
		href: MARKETING_BASE_HREF,
		// Without this the base href is a prefix of every other tab and the
		// overview would stay lit on the newsletter and register pages.
		exact: true,
	},
	...MARKETING_GROUPS.map((group) => ({
		id: `marketing-${group.id}`,
		labelKey: group.titleKey,
		href: getMarketingGroupHref(group.id),
	})),
	{
		id: "marketing-newsletter",
		labelKey: localizationConstants.marketingTabNewsletter,
		href: MARKETING_NEWSLETTER_HREF,
	},
];

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

/** A group tab lands on its first register. */
export function getMarketingGroupLandingHref(group: MarketingGroup): string {
	return getMarketingSectionHref(group.id, getFirstSection(group).slug);
}
