"use client";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { DiaryEntry, MONTH_KEYS } from "../constants/mockData";
import { CalendarDay } from "../utils/calendar";

interface DiaryCalendarProps {
	month: number;
	days: CalendarDay[];
	onOpen: (entry: DiaryEntry) => void;
}

const DiaryCalendar = ({ month, days, onOpen }: DiaryCalendarProps) => (
	<div className="border-t border-slate-200">
		{days.map((calendarDay) => (
			<div
				key={calendarDay.day}
				className="flex min-h-16 border-b border-slate-100"
			>
				<div className="w-32 shrink-0 border-r border-slate-200 px-4 py-2.5">
					<p className="text-sm font-semibold text-slate-900">
						{calendarDay.day}
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={calendarDay.weekdayKey} />
						{", "}
						<Translate text={MONTH_KEYS[month - 1]} />
					</p>
				</div>
				<div className="flex flex-1 flex-col justify-center gap-1.5 px-2 py-2">
					{calendarDay.entries.length === 0 ? (
						<div className="border-b border-dashed border-slate-200" />
					) : (
						calendarDay.entries.map((entry) => (
							<button
								key={entry.id}
								type="button"
								onClick={() => onOpen(entry)}
								className={cn(
									"w-full cursor-pointer rounded-md px-3 py-2 text-left",
									entry.read
										? "bg-slate-100 text-slate-900 hover:bg-slate-200"
										: "bg-slate-700 text-white hover:bg-slate-800",
								)}
							>
								<p className="text-sm font-semibold">
									{entry.title} | {entry.projectName}
								</p>
								<p
									className={cn(
										"mt-0.5 truncate text-xs",
										entry.read
											? "text-slate-500"
											: "text-slate-200",
									)}
								>
									{entry.description}
								</p>
							</button>
						))
					)}
				</div>
			</div>
		))}
	</div>
);

export default DiaryCalendar;
