"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { constructionDay } from "../diaryDates";
import type { DiaryProjectFacts } from "../hooks/useDiaryProject";
import { DIARY_STATUS_META } from "../projectDiary.config";
import type { DiaryStatus } from "../types";

const LABEL = "text-sm font-medium text-slate-900";
const VALUE = "text-sm text-slate-500";

export interface DiaryRecordBarProps {
	facts: DiaryProjectFacts;
	selectedDate: string | null;
	/** The shown diary's status, or `null` when the day has none. */
	status: DiaryStatus | null;
	onSelectDate: (date: string) => void;
}

/**
 * The strip under the toolbar: the Projekt box, Datum* (which picks the day to
 * show), Byggdag and Adress, as the frame draws them, plus the diary's status.
 */
export function DiaryRecordBar({ facts, selectedDate, status, onSelectDate }: DiaryRecordBarProps) {
	const t = useTranslate();
	const [open, setOpen] = useState(false);
	const day = selectedDate ? constructionDay(facts.startDate, facts.endDate, selectedDate) : null;

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
			<dl className="grid shrink-0 grid-cols-[auto_1fr] gap-x-6 gap-y-1 rounded-lg bg-slate-100 px-5 py-3">
				<dt className={LABEL}><Translate text={localizationConstants.projectDiaryProjectLabel} /></dt>
				<dd className="text-base text-slate-500">{facts.name}</dd>
				<dt className={LABEL}><Translate text={localizationConstants.projectDiaryProjectNo} /></dt>
				<dd className="text-base text-slate-500 tabular-nums">{facts.projectNo}</dd>
			</dl>

			<div className="grid w-full gap-1 sm:max-w-xs">
				<span id="diary-date-label" className={LABEL}>
					<Translate text={localizationConstants.projectDiaryDate} />
					<span aria-hidden className="text-red-500">*</span>
				</span>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button type="button" variant="outline" aria-labelledby="diary-date-label diary-date-value" className="h-10 w-full cursor-pointer justify-start gap-2 border-slate-200 px-3 font-normal">
							<CalendarIcon className="h-4 w-4 text-slate-500" aria-hidden />
							<span id="diary-date-value" className="tabular-nums">{selectedDate ?? "YYYY-MM-DD"}</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-auto border-0 bg-transparent p-0 shadow-none">
						<Calendar
							mode="single"
							captionLayout="dropdown"
							selected={selectedDate ? parseISO(selectedDate) : undefined}
							defaultMonth={selectedDate ? parseISO(selectedDate) : undefined}
							onSelect={(date: Date | undefined) => {
								if (!date) return;
								onSelectDate(format(date, "yyyy-MM-dd"));
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex flex-wrap gap-6 lg:ml-auto">
				<dl className="grid gap-1 border-slate-200 lg:border-l lg:pl-6">
					<dt className={LABEL}><Translate text={localizationConstants.projectDiaryConstructionDay} /></dt>
					<dd className={`${VALUE} tabular-nums`}>{day ? `${day.day}/${day.total}` : "—"}</dd>
				</dl>
				<dl className="grid gap-1 border-slate-200 lg:border-l lg:pl-6">
					<dt className={LABEL}><Translate text={localizationConstants.projectDiaryAddress} /></dt>
					<dd className={VALUE}>{facts.address || "—"}</dd>
				</dl>
				{status && (
					<div className="flex items-center">
						<Badge variant={DIARY_STATUS_META[status].badge} className="text-sm">
							{t(DIARY_STATUS_META[status].labelKey)}
						</Badge>
					</div>
				)}
			</div>
		</div>
	);
}

export default DiaryRecordBar;
