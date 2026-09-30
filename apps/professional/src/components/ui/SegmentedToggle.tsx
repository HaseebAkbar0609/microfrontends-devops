"use client";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

export interface SegmentedToggleOption<T extends string> {
	id: T;
	labelKey: TranslationKeys;
}

export interface SegmentedToggleProps<T extends string> {
	options: SegmentedToggleOption<T>[];
	value: T;
	onChange: (value: T) => void;
	/** Names what the group switches between, since the buttons alone don't say. */
	ariaLabel: string;
	/**
	 * "pill" (default): grey track, chosen option lifted out in white (Prognos frames).
	 * "boxed": bordered row, chosen option filled dark (Materialhantering frames).
	 */
	variant?: "pill" | "boxed";
	className?: string;
	/** Added to every option, e.g. to let options share a full-width group. */
	buttonClassName?: string;
}

const VARIANT_CLASSES = {
	pill: {
		group: "rounded-full bg-slate-100 p-0.5",
		button: "rounded-full px-3 py-1 text-xs",
		active: "bg-white text-slate-900 shadow-sm",
		inactive: "text-slate-600 hover:text-slate-900",
	},
	boxed: {
		group: "rounded-md border border-slate-200 bg-white divide-x divide-slate-200 overflow-hidden",
		// Inset ring: the group clips its corners, which would cut off an outer one.
		button: "h-10 px-5 text-sm focus-visible:ring-inset",
		active: "bg-[#111721] text-white",
		inactive: "text-slate-700 hover:bg-slate-50",
	},
} as const;

/**
 * A row of mutually exclusive choices. Each button says whether it is the one
 * pressed, so the group reads as a set of choices rather than as unrelated
 * buttons.
 */
export function SegmentedToggle<T extends string>({ options, value, onChange, ariaLabel, variant = "pill", className, buttonClassName }: SegmentedToggleProps<T>) {
	const t = useTranslate();
	const styles = VARIANT_CLASSES[variant];

	return (
		<div role="group" aria-label={ariaLabel} className={cn("inline-flex", styles.group, className)}>
			{options.map((option) => {
				const active = option.id === value;
				return (
					<button
						key={option.id}
						type="button"
						aria-pressed={active}
						onClick={() => onChange(option.id)}
						className={cn(
							"cursor-pointer font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none",
							styles.button,
							active ? styles.active : styles.inactive,
							buttonClassName,
						)}
					>
						{t(option.labelKey)}
					</button>
				);
			})}
		</div>
	);
}

export default SegmentedToggle;
