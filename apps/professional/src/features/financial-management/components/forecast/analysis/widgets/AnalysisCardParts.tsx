import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { AnalysisTone } from "../../../../types/forecastAnalysis.types";

export const TONE_CLASS: Record<AnalysisTone, string> = {
	positive: "text-emerald-600",
	negative: "text-red-600",
	neutral: "text-amber-600",
};

/** A change reads as good when it is up, unless being up is the problem. */
export function changeTone(value: number, upIsGood = true): AnalysisTone {
	if (value === 0) return "neutral";
	return value > 0 === upIsGood ? "positive" : "negative";
}

/** A label above a figure, for the cards that carry two or three side by side. */
export function StatBlock({
	labelKey,
	value,
	meta,
	className,
}: {
	labelKey: TranslationKeys;
	value: React.ReactNode;
	meta?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex min-w-0 flex-1 basis-40 flex-col gap-1", className)}>
			<p className="text-xs font-medium text-slate-500">
				<Translate text={labelKey} />
			</p>
			<p className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
			{meta && <div className="text-xs text-slate-500">{meta}</div>}
		</div>
	);
}
