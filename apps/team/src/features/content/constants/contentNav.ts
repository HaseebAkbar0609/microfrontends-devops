import type { LucideIcon } from "lucide-react";
import { Calculator, LayoutGrid } from "lucide-react";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/common";
import type { ContentGroupId } from "../types";
import { CONTENT_BASE_HREF, CONTENT_GROUP_IDS } from "./content.constants";
import { CONTENT_GROUPS } from "./contentGroups";

/**
 * The console is reached from the Inställningar menu, so its pages carry that
 * name. The Admin menu keeps its own "Innehåll" entry pointing at the same
 * routes.
 */
export const CONTENT_CONSOLE_TITLE_KEY = localizationConstants.settings;

/** Lives outside the console's routes but belongs to the customer dashboard. */
export const COST_CALCULATOR_HREF =
	"/timeflow-dashboard/customer/cost-calculator";

export function getContentGroupHref(groupId: ContentGroupId): string {
	return `${CONTENT_BASE_HREF}/${groupId}`;
}

export function getContentSectionHref(
	groupId: ContentGroupId,
	slug: string,
): string {
	return `${CONTENT_BASE_HREF}/${groupId}/${slug}`;
}

export type ContentNavItem = {
	id: string;
	labelKey: TranslationKeys;
	href: string;
	icon: LucideIcon;
};

export type ContentNavGroup = {
	id: ContentGroupId;
	titleKey: TranslationKeys;
	items: ContentNavItem[];
};

const COST_CALCULATOR_ITEM: ContentNavItem = {
	id: "content-kund-cost-calculator",
	labelKey: localizationConstants.costCalculatorItem,
	href: COST_CALCULATOR_HREF,
	icon: Calculator,
};

/**
 * The sub-sidebar: one collapsible group per dashboard, each opening on its
 * section grid and then listing the sections themselves.
 */
export const CONTENT_NAV_GROUPS: ContentNavGroup[] = CONTENT_GROUPS.map(
	(group) => ({
		id: group.id,
		titleKey: group.titleKey,
		items: [
			{
				id: `content-${group.id}-overview`,
				labelKey: localizationConstants.overviewTab,
				href: getContentGroupHref(group.id),
				icon: LayoutGrid,
			},
			...group.sections.map((section) => ({
				id: `content-${group.id}-${section.slug}`,
				labelKey: section.titleKey,
				href: getContentSectionHref(group.id, section.slug),
				icon: section.icon,
			})),
			...(group.id === "kund" ? [COST_CALCULATOR_ITEM] : []),
		],
	}),
);

export function isContentConsolePath(pathname: string): boolean {
	return (
		pathname === CONTENT_BASE_HREF ||
		pathname.startsWith(`${CONTENT_BASE_HREF}/`) ||
		pathname === COST_CALCULATOR_HREF ||
		pathname.startsWith(`${COST_CALCULATOR_HREF}/`)
	);
}

/** The group whose chevron has to be open on this route. */
export function getActiveContentGroupId(
	pathname: string,
): ContentGroupId | null {
	const owner = CONTENT_NAV_GROUPS.find((group) =>
		group.items.some((item) => item.href === pathname),
	);
	if (owner) return owner.id;

	const [segment] = pathname
		.slice(CONTENT_BASE_HREF.length)
		.split("/")
		.filter(Boolean);
	return CONTENT_GROUP_IDS.find((id) => id === segment) ?? null;
}

/** Hem / Inställningar / …parents / this page. */
export function getContentBreadcrumbs(
	titleKey: TranslationKeys,
	parents: BreadcrumbItem[] = [],
): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.dashboard, href: "/home" },
		...parents,
		{ label: titleKey },
	];
}
