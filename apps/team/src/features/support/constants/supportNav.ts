import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";

export const SUPPORT_MODULE_HREF = "/support";

/**
 * Title shown on every page of the module. Rule 1 of the tab navigation
 * guideline: it stays the same as you drill in — the ticket id goes in the
 * back-navigation row instead.
 */
export const SUPPORT_MODULE_TITLE_KEY = localizationConstants.support;

/**
 * Primary tab row. This replaces the prototype's dark sidebar, which was
 * `hidden lg:flex` with no mobile fallback at all.
 */
export const SUPPORT_MODULE_TABS: ModuleTabItem[] = [
	{
		id: "support-overview",
		labelKey: localizationConstants.supportTabOverview,
		href: SUPPORT_MODULE_HREF,
	},
	{
		id: "support-inbox",
		labelKey: localizationConstants.supportTabInbox,
		href: `${SUPPORT_MODULE_HREF}/inbox`,
	},
	{
		id: "support-escalated",
		labelKey: localizationConstants.supportTabEscalated,
		href: `${SUPPORT_MODULE_HREF}/escalated`,
	},
	{
		id: "support-agents",
		labelKey: localizationConstants.supportTabAgents,
		href: `${SUPPORT_MODULE_HREF}/agents`,
	},
	{
		id: "support-statistics",
		labelKey: localizationConstants.supportTabStatistics,
		href: `${SUPPORT_MODULE_HREF}/statistics`,
	},
	{
		id: "support-settings",
		labelKey: localizationConstants.supportTabSettings,
		href: `${SUPPORT_MODULE_HREF}/settings`,
	},
];

/** Breadcrumb for the module's landing page. */
export const SUPPORT_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.dashboard, href: "/home" },
	{ label: localizationConstants.support },
];

export function getTicketHref(ticketId: string): string {
	return `${SUPPORT_MODULE_HREF}/tickets/${ticketId}`;
}

export const CREATE_TICKET_HREF = `${SUPPORT_MODULE_HREF}/tickets/new`;
