import { AlertCircle, Circle, CircleCheck, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { AnalysisKpiNote, AnalysisTone } from "../../../../types/forecastAnalysis.types";

export const TONE_CLASS: Record<AnalysisTone, string> = {
	positive: "text-emerald-600",
	negative: "text-red-600",
	neutral: "text-amber-600",
};

/** A figure's footnote reads as good, poor or merely worth knowing. */
function noteIcon(tone: AnalysisTone, rising: boolean | null): LucideIcon {
	if (rising === true) return TrendingUp;
	if (rising === false) return TrendingDown;
	if (tone === "positive") return CircleCheck;
	if (tone === "negative") return AlertCircle;
	return Circle;
}

/** A change reads as good when it is up, unless being up is the problem. */
export function changeTone(value: number, upIsGood = true): AnalysisTone {
	if (value === 0) return "neutral";
	return value > 0 === upIsGood ? "positive" : "negative";
}

/**
 * The frame's figure card: one number with a footnote under it. Both Analys's
 * KPI cards and Nyckeltal's read this shape, so it lives here rather than
 * twice.
 */
export function KpiCard({
	value,
	note,
	rising = null,
}: {
	value: string;
	note: AnalysisKpiNote;
	rising?: boolean | null;
}) {
	const Icon = noteIcon(note.tone, rising);

	return (
		<div className="flex flex-1 flex-col justify-between gap-3">
			<p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
			<p className={cn("flex items-center gap-1.5 text-xs font-medium", TONE_CLASS[note.tone])}>
				<Icon size={14} aria-hidden />
				<Translate text={note.labelKey} values={note.values} />
			</p>
		</div>
	);
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
