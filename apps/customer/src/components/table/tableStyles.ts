/**
 * Shared Tailwind typography patterns for tables.
 * Used to ensure consistency across headers and body cells.
 */
export const tableStyles = {
	/**
	 * Table Header Cells
	 * Color: #64748B (text-slate-500)
	 * Font size: text-sm
	 * Line height: leading-6
	 * Font weight: font-medium
	 * Font family: font-sans
	 */
	headerCell: "font-sans text-sm leading-6 font-medium text-slate-500",

	/**
	 * Table Body Cells
	 * Color: #020617 (text-slate-950)
	 * Font size: text-sm
	 * Line height: leading-5
	 * Font weight: font-normal
	 * Font family: font-sans
	 */
	bodyCell: "font-sans text-sm leading-5 font-normal text-slate-950",
} as const;
