"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { monthGrid, monthOf, shiftMonth } from "../../diaryDates";

export type WorkdayKind = "full" | "part";

/* Tailwind tokens for the frame's legend: dark for the chosen day, rust for a full day, orange for a part day. */
const KIND_CLASS: Record<WorkdayKind | "selected", string> = {
	selected: "bg-slate-900 text-white hover:bg-slate-800",
	full: "bg-orange-800 text-white hover:bg-orange-900",
	part: "bg-orange-500 text-white hover:bg-orange-600",
};

const LEGEND: { kind: WorkdayKind | "selected"; labelKey: TranslationKeys }[] = [
	{ kind: "selected", labelKey: localizationConstants.projectDiaryLegendSelected },
	{ kind: "full", labelKey: localizationConstants.projectDiaryLegendFullDay },
	{ kind: "part", labelKey: localizationConstants.projectDiaryLegendPartDay },
];

/* 2024-01-07 was a Sunday: the first header the frame draws. */
const SUNDAY = Date.UTC(2024, 0, 7);
const DAY_MS = 86_400_000;

export interface DiaryMonthCalendarProps {
	selectedDate: string;
	/** The colour of each day that has a diary, by `yyyy-MM-dd`. */
	kinds: ReadonlyMap<string, WorkdayKind>;
	onSelect: (date: string) => void;
}

/**
 * The frame's month beside the weather card, and its Fotnot. A day is a button:
 * choosing it shows that day's diary. The month follows the chosen day; the
 * arrows browse without changing it. Names come from the app's language.
 */
export function DiaryMonthCalendar({ selectedDate, kinds, onSelect }: DiaryMonthCalendarProps) {
	const { t, i18n } = useTranslation();
	const locale = i18n.language === "en" ? "en-GB" : "sv-SE";
	const [shown, setShown] = useState({ anchor: selectedDate, ...monthOf(selectedDate) });

	/* A new day chosen elsewhere brings its month into view. */
	if (shown.anchor !== selectedDate) setShown({ anchor: selectedDate, ...monthOf(selectedDate) });

	const browse = (by: number) => setShown((current) => ({ ...current, ...shiftMonth(current.year, current.monthIndex, by) }));
	const format = (options: Intl.DateTimeFormatOptions, time: number) =>
		new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(time);
	const weekdays = Array.from({ length: 7 }, (_, index) => format({ weekday: "short" }, SUNDAY + index * DAY_MS).slice(0, 2));

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
			<div className="w-full max-w-[18rem] rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
				<div className="flex items-center justify-between gap-2 pb-2">
					<Button type="button" variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => browse(-1)} aria-label={t(localizationConstants.projectDiaryPrevMonth)}>
						<ChevronLeft className="h-4 w-4" aria-hidden />
					</Button>
					<p aria-live="polite" className="text-sm font-medium text-slate-900 capitalize">
						{format({ month: "long", year: "numeric" }, Date.UTC(shown.year, shown.monthIndex, 1))}
					</p>
					<Button type="button" variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => browse(1)} aria-label={t(localizationConstants.projectDiaryNextMonth)}>
						<ChevronRight className="h-4 w-4" aria-hidden />
					</Button>
				</div>
				<div role="group" aria-label={t(localizationConstants.projectDiaryCalendarLabel)} className="grid grid-cols-7 gap-1 text-center">
					{weekdays.map((weekday) => (
						<span key={weekday} aria-hidden className="py-1 text-xs text-slate-500 capitalize">
							{weekday}
						</span>
					))}
					{monthGrid(shown.year, shown.monthIndex).map((cell) => {
						const kind = cell.date === selectedDate ? "selected" : kinds.get(cell.date);
						const legend = LEGEND.find((entry) => entry.kind === kind);
						return (
							<button
								key={cell.date}
								type="button"
								onClick={() => onSelect(cell.date)}
								aria-pressed={cell.date === selectedDate}
								aria-label={[format({ dateStyle: "long" }, Date.parse(`${cell.date}T00:00:00Z`)), legend && t(legend.labelKey)].filter(Boolean).join(", ")}
								className={cn(
									"h-8 cursor-pointer rounded-md text-sm tabular-nums focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none",
									kind ? KIND_CLASS[kind] : "hover:bg-slate-100",
									!kind && (cell.inMonth ? "text-slate-900" : "text-slate-400"),
								)}
							>
								{cell.day}
							</button>
						);
					})}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.projectDiaryLegend} />
				</p>
				<ul className="flex flex-col gap-2">
					{LEGEND.map((entry) => (
						<li key={entry.kind} className="flex items-center gap-2 text-sm text-slate-900">
							<span aria-hidden className={cn("h-5 w-5 rounded", KIND_CLASS[entry.kind])} />
							<Translate text={entry.labelKey} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default DiaryMonthCalendar;
