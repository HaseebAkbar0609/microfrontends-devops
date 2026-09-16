"use client";

import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { parseDateValue } from "@/utils/date";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { formatLedgerDate } from "../ledgerDate";

export interface LedgerDatePickerProps {
	/** ISO `yyyy-MM-dd`, or empty. */
	value: string;
	onChange: (value: string) => void;
	/** Accessible name — the group heading above is shared by both fields. */
	ariaLabel: string;
	invalid?: boolean;
	describedBy?: string;
}

/**
 * One date field in the ledger's filter row.
 *
 * The same `Popover` + `Calendar` composition as
 * `warranty/components/visit-date/VisitDatePickerField`, which is the app's
 * standalone precedent — there is still no reusable date field under
 * `components/`, so this is the third feature-local copy. Flagged rather than
 * promoted: a shared one needs an API designed around more than this screen.
 *
 * The trigger prints the frame's long form ("Måndag 10 Dec, 2025"); the value
 * stays an ISO string so the hook can compare ranges as text.
 */
export function LedgerDatePicker({
	value,
	onChange,
	ariaLabel,
	invalid = false,
	describedBy,
}: LedgerDatePickerProps) {
	const t = useTranslate();
	const [open, setOpen] = useState(false);
	/* Memoised because it is passed as `month`: the shared calendar mirrors that
	   prop into state on every change, so a new `Date` each render would reset
	   the month the reader had navigated to. */
	const selected = useMemo(() => parseDateValue(value), [value]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					aria-label={ariaLabel}
					aria-invalid={invalid}
					aria-describedby={describedBy}
					className={`h-10 w-full cursor-pointer justify-start gap-2 rounded-md border-slate-200 bg-white font-normal text-slate-700 ${
						invalid ? "border-red-500" : ""
					}`}
				>
					<CalendarIcon className="h-4 w-4 shrink-0 text-slate-500" />
					<span className="truncate">
						{value
							? formatLedgerDate(value, t)
							: t(localizationConstants.pickDatePlaceholder)}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar
					mode="single"
					selected={selected}
					/* `month`, not `defaultMonth`: the shared calendar seeds its
					   own state from `month || new Date()` and always passes its
					   own state down, so `defaultMonth` never reaches it and the
					   picker opens on today instead of on the selected date. */
					month={selected}
					onSelect={(date) => {
						onChange(date ? toIsoDate(date) : "");
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

/**
 * `yyyy-MM-dd` from the calendar's local Date.
 *
 * Built from the local getters rather than `toISOString()`, which converts to
 * UTC first and can hand back the previous day for anyone east of Greenwich.
 */
function toIsoDate(date: Date): string {
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export default LedgerDatePicker;
