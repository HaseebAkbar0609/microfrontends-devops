"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const YEARS = Array.from({ length: 30 }, (_, i) => 2015 + i);

function CustomHeader({ calendarMonth }: { calendarMonth: Date }) {
	const { goToMonth, previousMonth, nextMonth } = useDayPicker();
	const currentYear = calendarMonth.getFullYear();
	const currentMonth = calendarMonth.getMonth();

	const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMonth = Number(e.target.value);
		const newDate = new Date(currentYear, newMonth, 1);
		goToMonth(newDate);
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newYear = Number(e.target.value);
		const newDate = new Date(newYear, currentMonth, 1);
		goToMonth(newDate);
	};

	return (
		<div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 w-full">
			{/* Left Arrow Navigation Group */}
			<div className="flex items-center gap-1">
				<button
					type="button"
					disabled={!previousMonth}
					onClick={() => previousMonth && goToMonth(previousMonth)}
					className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-2xs cursor-pointer"
					aria-label="Previous Month"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>
				<button
					type="button"
					disabled={!nextMonth}
					onClick={() => nextMonth && goToMonth(nextMonth)}
					className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-2xs cursor-pointer"
					aria-label="Next Month"
				>
					<ChevronRight className="h-4 w-4 text-slate-700" />
				</button>
			</div>

			{/* Right Month & Year Dropdowns */}
			<div className="flex items-center gap-1.5">
				<select
					value={currentMonth}
					onChange={handleMonthChange}
					className="h-8 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-900 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-950 cursor-pointer transition-colors"
				>
					{MONTHS.map((month, index) => (
						<option key={month} value={index}>
							{month}
						</option>
					))}
				</select>

				<select
					value={currentYear}
					onChange={handleYearChange}
					className="h-8 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-900 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-950 cursor-pointer transition-colors"
				>
					{YEARS.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	month: monthProp,
	onMonthChange,
	...props
}: CalendarProps) {
	const [month, setMonth] = React.useState<Date>(monthProp || new Date());

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
		if (onMonthChange) {
			onMonthChange(newMonth);
		}
	};

	React.useEffect(() => {
		if (monthProp) {
			setMonth(monthProp);
		}
	}, [monthProp]);

	return (
		<DayPicker
			month={month}
			onMonthChange={handleMonthChange}
			showOutsideDays={showOutsideDays}
			className={cn("p-4 bg-white rounded-2xl shadow-xl border border-slate-200/80 w-72 sm:w-80", className)}
			classNames={{
				months: "flex flex-col space-y-3",
				month: "space-y-3",
				month_caption: "block",
				caption_label: "hidden",
				nav: "hidden",
				month_grid: "w-full border-collapse space-y-1 mt-1",
				weekdays: "flex justify-between mb-1",
				weekday: "text-slate-500 rounded-md w-9 font-medium text-xs text-center py-1",
				week: "flex justify-between w-full mt-1",
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-slate-900 hover:bg-slate-100 rounded-xl text-center justify-center text-sm transition-all",
				),
				range_start: "day-range-start",
				range_end: "day-range-end",
				selected:
					"bg-[#111721] text-white font-semibold hover:bg-slate-800 hover:text-white focus:bg-[#111721] focus:text-white shadow-2xs",
				today: "bg-slate-100 text-slate-900 font-bold border border-slate-200",
				outside:
					"day-outside text-slate-400 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30",
				disabled: "text-slate-300 opacity-40",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				MonthCaption: ({ calendarMonth }) => (
					<CustomHeader calendarMonth={calendarMonth.date} />
				),
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
