"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { parseDateValue } from "@/utils/date";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** The placeholder the frame prints in an empty date field. */
const DATE_PLACEHOLDER = "YYYY-MM-DD";

export interface VisitDatePickerFieldProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

/** Datum — the calendar popover, storing an ISO string. */
export function VisitDatePickerField({
	value,
	onChange,
	error,
}: VisitDatePickerFieldProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
				<Translate text={localizationConstants.dateHeaderLabel} />
			</Label>

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						className="relative flex items-center justify-start h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer hover:bg-slate-50 gap-2.5 font-normal shadow-none"
					>
						<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0 pointer-events-none" />
						<span className="font-normal truncate text-sm text-slate-900">
							{value || DATE_PLACEHOLDER}
						</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50"
					align="start"
				>
					<Calendar
						mode="single"
						selected={parseDateValue(value)}
						onSelect={(date) => {
							onChange(date ? format(date, "yyyy-MM-dd") : "");
							setIsOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>

			{error && (
				<span className="text-xs font-medium text-red-500">{error}</span>
			)}
		</div>
	);
}

export default VisitDatePickerField;
