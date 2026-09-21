"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const HOURS_12 = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

function to12Hour(time24: string): { hour: string; minute: string; period: "AM" | "PM" } {
	if (!time24) return { hour: "", minute: "", period: "AM" };
	const [h, m] = time24.split(":");
	const hour24 = parseInt(h || "0", 10);
	const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
	const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
	return { hour: String(hour12), minute: m || "00", period };
}

function to24Hour(hour12: string, minute: string, period: "AM" | "PM"): string {
	if (!hour12) return "";
	let h = parseInt(hour12, 10);
	if (period === "AM" && h === 12) h = 0;
	else if (period === "PM" && h !== 12) h += 12;
	return `${String(h).padStart(2, "0")}:${minute}`;
}

function formatDisplay(time24: string, format24 = false): string {
	if (!time24) return "";
	if (format24) return time24;
	const { hour, minute, period } = to12Hour(time24);
	return `${hour}:${minute} ${period}`;
}

interface TimePickerProps {
	value?: string;
	onChange?: (time: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	id?: string;
	format24?: boolean;
	/** Names for the hour and minute selects, which otherwise read only their number. */
	hourLabel?: string;
	minuteLabel?: string;
	/* Handed down by `FormControl`, so a form field's error reaches the button. */
	"aria-invalid"?: boolean | "true" | "false";
	"aria-describedby"?: string;
	"aria-required"?: boolean;
}

export function TimePicker({
	value = "",
	onChange,
	placeholder = "Choose time",
	disabled = false,
	className,
	id,
	format24 = true,
	hourLabel,
	minuteLabel,
	"aria-invalid": ariaInvalid,
	"aria-describedby": ariaDescribedBy,
	"aria-required": ariaRequired,
}: TimePickerProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const [hVal, mVal] = (value || "").split(":");
	const { hour, minute, period } = to12Hour(value);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Element | null;
			if (!ref.current || ref.current.contains(target)) return;
			/* The hour and minute lists render in a portal, outside `ref`. A press on
			   one is not outside the picker — closing here unmounted the select
			   before it could take the choice. */
			if (target?.closest?.('[data-slot="select-content"]')) return;
			setOpen(false);
		};
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	const handleHourChange24 = (h: string) => {
		onChange?.(`${h}:${mVal || "00"}`);
	};

	const handleMinuteChange24 = (m: string) => {
		onChange?.(`${hVal || "12"}:${m}`);
	};

	const handleHourChange = (h: string) => {
		onChange?.(to24Hour(h, minute || "00", period));
	};

	const handleMinuteChange = (m: string) => {
		onChange?.(to24Hour(hour || "12", m, period));
	};

	const handlePeriodChange = (p: "AM" | "PM") => {
		onChange?.(to24Hour(hour || "12", minute || "00", p));
	};

	return (
		<div ref={ref} className="relative w-full">
			<Button
				id={id}
				type="button"
				variant="outline"
				disabled={disabled}
				aria-expanded={open}
				aria-invalid={ariaInvalid}
				aria-describedby={ariaDescribedBy}
				aria-required={ariaRequired}
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"w-full flex items-center justify-start text-left font-normal h-10 px-3 bg-white text-sm shadow-none hover:bg-slate-50",
					!value ? "text-muted-foreground" : "text-slate-900",
					className,
				)}
			>
				<Clock className="mr-2 h-4 w-4 text-zinc-500 stroke-[1.33] shrink-0" />
				<span className="truncate">
					{value ? formatDisplay(value, format24) : placeholder}
				</span>
			</Button>

			{open && (
				<div className="absolute top-full left-0 mt-1 p-3 bg-white border border-slate-200 rounded-lg shadow-xl z-[10000]">
					{format24 ? (
						<div className="flex items-center gap-2">
							<Select value={hVal || "12"} onValueChange={handleHourChange24}>
								<SelectTrigger aria-label={hourLabel} className="w-16 h-9 text-sm bg-white text-slate-900 px-2 cursor-pointer focus:ring-1 focus:ring-slate-900 shadow-none">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="min-w-[4rem]">
									{HOURS_24.map((h) => (
										<SelectItem key={h} value={h}>{h}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<span className="text-slate-400 font-medium text-sm">:</span>

							<Select value={mVal || "00"} onValueChange={handleMinuteChange24}>
								<SelectTrigger aria-label={minuteLabel} className="w-16 h-9 text-sm bg-white text-slate-900 px-2 cursor-pointer focus:ring-1 focus:ring-slate-900 shadow-none">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="min-w-[4rem]">
									{MINUTES.map((m) => (
										<SelectItem key={m} value={m}>{m}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Select value={hour} onValueChange={handleHourChange}>
								<SelectTrigger className="w-16 h-9 text-sm bg-white text-slate-800 px-2 cursor-pointer focus:ring-1 focus:ring-slate-900 shadow-none">
									<SelectValue placeholder="--" />
								</SelectTrigger>
								<SelectContent className="min-w-[4rem]">
									{HOURS_12.map((h) => (
										<SelectItem key={h} value={h}>{h}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<span className="text-slate-400 font-medium text-sm">:</span>

							<Select value={minute} onValueChange={handleMinuteChange}>
								<SelectTrigger className="w-16 h-9 text-sm bg-white text-slate-800 px-2 cursor-pointer focus:ring-1 focus:ring-slate-900 shadow-none">
									<SelectValue placeholder="--" />
								</SelectTrigger>
								<SelectContent className="min-w-[4rem]">
									{MINUTES.map((m) => (
										<SelectItem key={m} value={m}>{m}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={period} onValueChange={(val) => handlePeriodChange(val as "AM" | "PM")}>
								<SelectTrigger className="w-18 h-9 text-sm bg-white text-slate-800 px-2 cursor-pointer focus:ring-1 focus:ring-slate-900 shadow-none">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="min-w-[4.5rem]">
									<SelectItem value="AM">AM</SelectItem>
									<SelectItem value="PM">PM</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default TimePicker;
