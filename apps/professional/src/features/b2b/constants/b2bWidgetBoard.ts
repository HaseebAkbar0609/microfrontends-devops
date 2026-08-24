import { B2B_SIDEBAR_ITEMS } from "./index";

export const B2B_STANDARD_WIDGET_IDS = [
	"b2bOverview",
	"b2bAvailableAssignments",
	"b2bActivity",
];

export const B2B_BOARD_LIBRARY_ITEMS = B2B_SIDEBAR_ITEMS.filter(
	(item) => item.id !== "emptyPage",
);
