import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type { ContentGroupId } from "../types";
import { CONTENT_BASE_HREF } from "./content.constants";
import { CONTENT_GROUPS } from "./contentGroups";

/**
 * Title shown on every page of the module. Rule 1 of the tab navigation
 * guideline: it does not change as you drill in — the section name goes in the
 * back-navigation row instead.
 */
export const CONTENT_MODULE_TITLE_KEY = localizationConstants.contentModuleTitle;

/** Primary tab row: the two dashboards whose content is administered. */
export const CONTENT_MODULE_TABS: ModuleTabItem[] = CONTENT_GROUPS.map(
	(group) => ({
		id: `content-${group.id}`,
		labelKey: group.titleKey,
		href: `${CONTENT_BASE_HREF}/${group.id}`,
	}),
);

export const CONTENT_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.dashboard, href: "/home" },
	{ label: localizationConstants.adminItem },
	{ label: localizationConstants.contentModuleTitle },
];

export function getContentGroupHref(groupId: ContentGroupId): string {
	return `${CONTENT_BASE_HREF}/${groupId}`;
}

export function getContentSectionHref(
	groupId: ContentGroupId,
	slug: string,
): string {
	return `${CONTENT_BASE_HREF}/${groupId}/${slug}`;
}
