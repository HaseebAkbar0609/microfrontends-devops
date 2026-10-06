"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";

interface WorktimeDateRangePickerProps {
	value: string;
	onChange: (range: string) => void;
}

export function WorktimeDateRangePicker({
	value,
	onChange,
}: WorktimeDateRangePickerProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
		from: new Date(2024, 11, 23),
		to: new Date(2024, 11, 29),
	});

	const handleDateSelect = (range: DateRange | undefined) => {
		setSelectedRange(range);
		if (range?.from && range?.to) {
			const formatted = `${format(range.from, "d MMM")} - ${format(range.to, "d MMM")}`;
			onChange(formatted);
			setOpen(false);
		} else if (range?.from && !range?.to) {
			const formatted = format(range.from, "d MMM");
			onChange(formatted);
		}
	};

	const handlePresetSelect = (rangeStr: string, fromDate: Date, toDate: Date) => {
		setSelectedRange({ from: fromDate, to: toDate });
		onChange(rangeStr);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors select-none"
					aria-label={t(localizationConstants.pickDatePlaceholder)}
				>
					<CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
					<span>{value}</span>
					<ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-auto p-3 bg-white border border-slate-200 shadow-xl rounded-xl z-50"
			>
				{/* Quick Week Presets matching Figma standard */}
				<div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-slate-100">
					<button
						type="button"
						onClick={() =>
							handlePresetSelect("16 Dec - 22 Dec", new Date(2024, 11, 16), new Date(2024, 11, 22))
						}
						className="px-2.5 py-1 text-2xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
					>
						<Translate text={localizationConstants.worktimeBtnPrevWeek} />
					</button>
					<button
						type="button"
						onClick={() =>
							handlePresetSelect("23 Dec - 29 Dec", new Date(2024, 11, 23), new Date(2024, 11, 29))
						}
						className="px-2.5 py-1 text-2xs font-semibold rounded-md border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
					>
						<Translate text={localizationConstants.worktimeBtnThisWeek} />
					</button>
					<button
						type="button"
						onClick={() =>
							handlePresetSelect("30 Dec - 5 Jan", new Date(2024, 11, 30), new Date(2025, 0, 5))
						}
						className="px-2.5 py-1 text-2xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
					>
						<Translate text={localizationConstants.worktimeBtnNextWeek} />
					</button>
				</div>

				{/* Interactive Calendar for selecting ranges */}
				<Calendar
					mode="range"
					selected={selectedRange}
					onSelect={handleDateSelect}
					defaultMonth={new Date(2024, 11, 23)}
				/>
			</PopoverContent>
		</Popover>
	);
}
