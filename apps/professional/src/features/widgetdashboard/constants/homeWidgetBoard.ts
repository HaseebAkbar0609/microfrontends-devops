import { SIDEBAR_ITEMS } from "./index";
export const HOME_STANDARD_WIDGET_IDS = [
	"kpiDashboard",
	"aiAssistant",
	"messagesNews",
];

export const HOME_BOARD_LIBRARY_ITEMS = SIDEBAR_ITEMS.filter(
	(item) => item.id !== "emptyPage",
);
