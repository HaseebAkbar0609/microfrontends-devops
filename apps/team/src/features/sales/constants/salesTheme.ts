/**
 * The sales system's teal, shared by the record header bands and the primary
 * buttons. Declared once so the palette cannot drift between screens.
 */
export const SALES_HEADER_GRADIENT_CLASS =
	"bg-gradient-to-r from-[#0b5d8a] via-[#16838c] to-[#5dbb93]";

/** Colour half of a primary button; call sites add their own layout classes. */
export const SALES_PRIMARY_BUTTON_CLASS =
	"bg-[#0f7b8a] text-white hover:bg-[#0f7b8a]/90";

/**
 * Fill for chart marks such as the statistics bars.
 *
 * Deliberately more saturated than the button teal: that one sits below the
 * chroma floor for a data mark and reads grey once it is a thin bar on white.
 * Checked with the palette validator on the light chart surface.
 */
export const SALES_CHART_FILL_CLASS = "bg-[#0089a0]";

/**
 * Pins a table's action column to the right edge.
 *
 * These tables are wider than their card on a normal laptop, so the action
 * column scrolled out of sight and its button became unreachable. The cell
 * needs an opaque background of its own: row hover and selection tints are
 * semi-transparent, so the scrolled columns would otherwise show through.
 */
export const SALES_STICKY_ACTION_HEAD_CLASS =
	"sticky right-0 z-20 bg-white shadow-[-6px_0_6px_-6px_rgba(15,23,42,0.12)]";

export const SALES_STICKY_ACTION_CELL_CLASS =
	"sticky right-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-6px_0_6px_-6px_rgba(15,23,42,0.12)]";
