import localizationConstants from "@/utils/translation/constants";
import { OFFER_SIDEBAR_ITEMS } from "./dashboardSidebarItems";

export const OFFER_STANDARD_WIDGET_IDS = [
	"offerOverview",
	"offerAvailableProjects",
	"offerActivity",
];

export const OFFER_BOARD_IS_ADMIN = true;

export const OFFER_BOARD_LIBRARY_ITEMS = OFFER_SIDEBAR_ITEMS.filter(
	(item) => item.id !== "emptyPage",
);

export const OFFER_BOARD_GRID_CLASS = "grid grid-cols-12 gap-2.5" as const;

export const OFFER_BOARD_CELL_CLASS =
	"col-span-12 md:col-span-6 xl:col-span-4" as const;

export const OFFER_BOARD_SECTION_LABELS = {
	admin: localizationConstants.offerBoardAdminSection,
	own: localizationConstants.offerBoardOwnSection,
} as const;
