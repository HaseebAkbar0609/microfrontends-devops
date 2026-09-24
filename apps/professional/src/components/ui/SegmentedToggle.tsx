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
	className?: string;
}

/**
 * The pill switch the Prognos frames draw: one button per choice on a grey
 * track, the chosen one lifted out in white. Each button says whether it is
 * the one pressed, so the group reads as a set of choices rather than as
 * unrelated buttons.
 */
export function SegmentedToggle<T extends string>({ options, value, onChange, ariaLabel, className }: SegmentedToggleProps<T>) {
	const t = useTranslate();

	return (
		<div role="group" aria-label={ariaLabel} className={cn("inline-flex rounded-full bg-slate-100 p-0.5", className)}>
			{options.map((option) => {
				const active = option.id === value;
				return (
					<button
						key={option.id}
						type="button"
						aria-pressed={active}
						onClick={() => onChange(option.id)}
						className={cn(
							"cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none",
							active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
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
