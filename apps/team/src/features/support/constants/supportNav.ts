import {
	BarChart3,
	Inbox,
	LayoutGrid,
	Settings,
	TriangleAlert,
	UsersRound,
} from "lucide-react";
import type { ModuleSubNavItem } from "@/components/layout/sidebar/ModuleSubSidebar";
import { findActiveRouteTab } from "@/types/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type { SupportTicket } from "../types";

export const SUPPORT_MODULE_HREF = "/support";

/**
 * Title shown on every page of the module. Rule 1 of the tab navigation
 * guideline: it stays the same as you drill in — the ticket id goes in the
 * back-navigation row instead.
 */
export const SUPPORT_MODULE_TITLE_KEY = localizationConstants.support;

export type SupportSubNavItem = ModuleSubNavItem;

/**
 * Items in the support sub-sidebar, in display order. The overview is not
 * `exact` because the most specific href wins: it is lit on `/support` itself
 * and on ticket pages, whose back row returns there, and nowhere else.
 */
export const SUPPORT_SUB_NAV_ITEMS: SupportSubNavItem[] = [
	{
		id: "support-overview",
		labelKey: localizationConstants.supportTabOverview,
		href: SUPPORT_MODULE_HREF,
		icon: LayoutGrid,
	},
	{
		id: "support-inbox",
		labelKey: localizationConstants.supportTabInbox,
		href: `${SUPPORT_MODULE_HREF}/inbox`,
		icon: Inbox,
	},
	{
		id: "support-escalated",
		labelKey: localizationConstants.supportTabEscalated,
		href: `${SUPPORT_MODULE_HREF}/escalated`,
		icon: TriangleAlert,
	},
	{
		id: "support-agents",
		labelKey: localizationConstants.supportTabAgents,
		href: `${SUPPORT_MODULE_HREF}/agents`,
		icon: UsersRound,
	},
	{
		id: "support-statistics",
		labelKey: localizationConstants.supportTabStatistics,
		href: `${SUPPORT_MODULE_HREF}/statistics`,
		icon: BarChart3,
	},
	{
		id: "support-settings",
		labelKey: localizationConstants.supportTabSettings,
		href: `${SUPPORT_MODULE_HREF}/settings`,
		icon: Settings,
	},
];

export function isSupportModulePath(pathname: string): boolean {
	return (
		pathname === SUPPORT_MODULE_HREF ||
		pathname.startsWith(`${SUPPORT_MODULE_HREF}/`)
	);
}

/** Id of the lit sub-sidebar item; the most specific href wins. */
export function getActiveSupportNavId(pathname: string): string | undefined {
	return findActiveRouteTab(SUPPORT_SUB_NAV_ITEMS, pathname)?.id;
}

/** Breadcrumb for the module's landing page. */
export const SUPPORT_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.dashboard, href: "/home" },
	{ label: localizationConstants.support },
];

export function getTicketHref(ticketId: string): string {
	return `${SUPPORT_MODULE_HREF}/tickets/${ticketId}`;
}

export const CREATE_TICKET_HREF = `${SUPPORT_MODULE_HREF}/tickets/new`;

/**
 * Where the linked record lives under Customers. Private customers have a list
 * page only, so the link lands on the list filtered by name.
 */
export function getRequesterHref(
	ticket: Pick<SupportTicket, "customerId" | "customerType" | "customer">,
): string | null {
	if (!ticket.customerId) return null;
	if (ticket.customerType === "professional") {
		return `/customers/professional/${ticket.customerId}`;
	}
	return `/customers/private?search=${encodeURIComponent(ticket.customer)}`;
}
