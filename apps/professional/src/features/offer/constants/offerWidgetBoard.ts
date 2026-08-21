import { OFFER_SIDEBAR_ITEMS } from "./dashboardSidebarItems";

export const OFFER_STANDARD_WIDGET_IDS = [
	"offerOverview",
	"offerAvailableProjects",
	"offerActivity",
];

export const OFFER_BOARD_LIBRARY_ITEMS = OFFER_SIDEBAR_ITEMS.filter(
	(item) => item.id !== "emptyPage",
);
