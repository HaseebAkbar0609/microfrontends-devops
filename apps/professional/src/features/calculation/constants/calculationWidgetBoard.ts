import { CALCULATION_SIDEBAR_ITEMS } from "./index";

export const CALCULATION_STANDARD_WIDGET_IDS = [
	"calcOverview",
	"calcStatus",
	"calcLatest",
];

export const CALCULATION_BOARD_LIBRARY_ITEMS = CALCULATION_SIDEBAR_ITEMS.filter(
	(item) => item.id !== "emptyPage",
);
