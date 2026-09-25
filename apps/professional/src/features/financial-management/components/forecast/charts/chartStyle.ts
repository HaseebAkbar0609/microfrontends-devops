/**
 * What every Prognos chart is drawn with. Three charts had declared these
 * character-for-character before the fourth arrived.
 */

/** The house axis tick, as the team app's charts set it. */
export const AXIS_TICK = { fill: "#64748b", fontSize: 12 };

export const TOOLTIP_STYLE = {
	backgroundColor: "#ffffff",
	border: "1px solid #e2e8f0",
	borderRadius: 12,
	fontSize: 12,
};

/** The grid every chart rules its plot with. */
export const GRID_STROKE = "#e2e8f0";

/** Room for an axis of kronor, and none wasted on the left. */
export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: -8 };
