/**
 * The Gantt's fixed geometry, in pixels, taken from the frame.
 *
 * Fixed widths are what let the header's per-day cells and each row's single
 * spanning timeline cell line up exactly under `table-layout: fixed`, and what
 * give the sticky left columns their cumulative offsets.
 */
export const DAY_COL_PX = 36;
export const TASK_COL_PX = 200;
export const START_COL_PX = 110;
export const ADD_COL_PX = 52;

export const START_COL_LEFT = TASK_COL_PX;
export const ADD_COL_LEFT = TASK_COL_PX + START_COL_PX;
export const LEFT_COLS_PX = TASK_COL_PX + START_COL_PX + ADD_COL_PX;

/** Indentation per tree level, capped so a deep tree cannot push text out. */
export const INDENT_PX = 16;
export const MAX_INDENT_DEPTH = 4;

/** Below this many days, a month cell uses the short month name. */
export const SHORT_MONTH_BELOW_DAYS = 5;

/** A rough label width for placing the pill; exactness is not needed. */
const PILL_CHAR_PX = 7;
const PILL_PADDING_PX = 28;
const PILL_GAP_PX = 8;

export type PillPlacement = "right" | "left" | "none";

/**
 * Where a bar's name pill goes: after the bar if it fits before the timeline's
 * end, before it if it fits after the timeline's start, otherwise nowhere.
 *
 * The frame puts it to the right, to the left where a bar runs to the edge, and
 * draws no pill at all on a bar that fills the row — "5000 - Köksrenov" and the
 * long red "Mesh & Rebar". The name is in the Aktivitet column either way.
 * Checking actual room rather than "is this the last column" also stops a long
 * name that ends a column or two early from being clipped.
 */
export function pillPlacement(
	startCol: number,
	spanCols: number,
	totalCols: number,
	label: string,
): PillPlacement {
	const needed = label.length * PILL_CHAR_PX + PILL_PADDING_PX + PILL_GAP_PX;
	const roomRight = (totalCols - (startCol + spanCols)) * DAY_COL_PX;
	const roomLeft = startCol * DAY_COL_PX;

	if (roomRight >= needed) return "right";
	if (roomLeft >= needed) return "left";
	return "none";
}
