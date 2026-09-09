"use client";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import {
	MARKETING_EMPTY_CELL,
	MARKETING_TONE_CLASS,
} from "../constants/marketing.constants";
import type { MarketingSelectOption } from "../types";

/** Shared pill, following the config-map badge convention used across the app. */
const PILL_CLASS =
	"inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold";

type MarketingBadgeProps = {
	option: MarketingSelectOption | null;
	/** Raw stored value, shown when it does not resolve to a configured option. */
	fallback?: string;
	className?: string;
};

/**
 * Renders a select value.
 *
 * Unknown ids fall back to the raw value in a neutral pill rather than
 * throwing: a register cell may be blank, and a renamed option must not take
 * the whole page down with it.
 */
export function MarketingBadge({
	option,
	fallback = "",
	className,
}: MarketingBadgeProps) {
	if (!option) {
		if (!fallback) {
			return <span className="text-slate-400">{MARKETING_EMPTY_CELL}</span>;
		}
		return (
			<span className={cn(PILL_CLASS, MARKETING_TONE_CLASS.neutral, className)}>
				{fallback}
			</span>
		);
	}

	return (
		<span
			className={cn(
				PILL_CLASS,
				MARKETING_TONE_CLASS[option.tone ?? "neutral"],
				className,
			)}
		>
			<Translate text={option.labelKey} />
		</span>
	);
}

export default MarketingBadge;
