import type { HomeWidgetId } from "../types";

/** Every widget the home board can show, in library order. */
export const HOME_WIDGET_IDS = [
	"stats",
	"kpiStatus",
	"users",
	"economy",
	"vehicles",
	"keys",
	"news",
	"graph",
	"image",
] as const;

/** Layout shown until the user saves their own. */
export const DEFAULT_HOME_WIDGET_IDS: readonly HomeWidgetId[] = [
	"stats",
	"kpiStatus",
	"users",
	"economy",
	"vehicles",
	"keys",
	"news",
];

/** Holds the saved widget id order only, never user data. */
export const HOME_WIDGET_LAYOUT_STORAGE_KEY = "home-widget-layout";

/** Columns of the widget grid at its widest breakpoint. */
export const HOME_BOARD_COLUMNS = 3;
