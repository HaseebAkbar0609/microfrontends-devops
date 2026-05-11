/**
 * Application color palette
 *
 * All slate/gray values map 1-to-1 to standard Tailwind utility classes —
 * use those classes directly in components (e.g. `bg-slate-800`).
 * This file serves as a single reference and is used wherever an inline
 * style or dynamic class string is needed instead of a static Tailwind class.
 *
 * Tailwind class  →  Hex       →  Constant
 * ─────────────────────────────────────────
 * bg-slate-800    →  #1E293B   →  SLATE[800]
 * bg-gray-800     →  #1F2937   →  GRAY[800]
 * bg-slate-700    →  #334155   →  SLATE[700]
 * border-slate-600→  #475569   →  SLATE[600]
 * border-slate-500→  #64748B   →  SLATE[500]
 * border-gray-600 →  #4B5563   →  GRAY[600]
 * text-slate-300  →  #CBD5E1   →  SLATE[300]
 * text-slate-200  →  #E2E8F0   →  SLATE[200]
 * text-slate-400  →  #94A3B8   →  SLATE[400]
 * text-brand-orange→ #FF8100   →  BRAND.orange  (custom — no Tailwind match)
 */

export const SLATE = {
	200: "#E2E8F0",
	300: "#CBD5E1",
	400: "#94A3B8",
	500: "#64748B",
	600: "#475569",
	700: "#334155",
	800: "#1E293B",
	900: "#0F172A", // added
} as const;

export const GRAY = {
	200: "#EEEEEE",
	600: "#4B5563",
	800: "#1F2937",
} as const;

export const BRAND = {
	/** Primary brand orange — use `text-brand-orange` / `bg-brand-orange` */
	orange: "#FF8100",
} as const;
