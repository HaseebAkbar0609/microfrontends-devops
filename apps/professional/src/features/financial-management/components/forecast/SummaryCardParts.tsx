"use client";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export const SUMMARY_CARD = "flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs";

/** The frame's dark card, as the machines and calculation statistics draw theirs. */
export const SUMMARY_CARD_DARK = "flex flex-col gap-2 rounded-xl bg-[#1E293B] p-4 text-white shadow-2xs";

/** Four cards across, two on a tablet, stacked on a phone. */
export const SUMMARY_CARD_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4";

/**
 * Six across, three on a laptop, two on a tablet, stacked on a phone. It
 * breaks at 2xl rather than xl because the shell keeps a 288px sidebar: at
 * xl six cards would be about 144px each, which a figure does not fit in.
 */
export const SUMMARY_CARD_GRID_SIX =
	"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6";

/** The surface the statistics panels share: the ring, the events and the table. */
export const PANEL_SURFACE =
	"flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs";

export const PANEL_TITLE = "text-base font-semibold text-slate-900";

export const SUMMARY_VALUE = "text-2xl font-bold tracking-tight tabular-nums";
export const SUMMARY_CAPTION = "text-xs text-slate-500";
export const SUMMARY_CAPTION_DARK = "text-xs text-white/70";

export interface SummaryCardHeadingProps {
	icon: React.ReactNode;
	labelKey: TranslationKeys;
	tone?: "light" | "dark";
}

export function SummaryCardHeading({ icon, labelKey, tone = "light" }: SummaryCardHeadingProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 text-sm font-medium",
				tone === "dark" ? "text-white/90" : "text-slate-600",
			)}
		>
			{icon}
			<Translate text={labelKey} />
		</div>
	);
}
