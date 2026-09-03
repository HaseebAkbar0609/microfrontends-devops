"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const HOURS_12 = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];

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

function formatDisplay(time24: string): string {
	if (!time24) return "";
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
}

export function TimePicker({
	value = "",
	onChange,
	placeholder = "Choose time",
	disabled = false,
	className,
	id,
}: TimePickerProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const { hour, minute, period } = to12Hour(value);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

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
		<div ref={ref} className="relative">
			<button
				id={id}
				type="button"
				disabled={disabled}
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"w-full flex items-center justify-start text-left font-normal h-10 px-3 border border-slate-200 bg-white text-sm rounded-md shadow-none hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-900 cursor-pointer transition-colors",
					!value ? "text-muted-foreground" : "text-slate-800",
					disabled && "opacity-50 cursor-not-allowed",
					className,
				)}
			>
				<Clock className="mr-2 h-4 w-4 text-zinc-500 stroke-[1.33] shrink-0" />
				<span className="truncate">
					{value ? formatDisplay(value) : placeholder}
				</span>
			</button>

			{open && (
				<div className="absolute top-full left-0 mt-1 p-3 bg-white border border-slate-200 rounded-lg shadow-xl z-[10000]">
					<div className="flex items-center gap-2">
						<select
							value={hour}
							onChange={(e) => handleHourChange(e.target.value)}
							className="w-16 h-9 text-sm border border-slate-200 rounded-md bg-white text-slate-800 px-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
						>
							<option value="">--</option>
							{HOURS_12.map((h) => (
								<option key={h} value={h}>{h}</option>
							))}
						</select>

						<span className="text-slate-400 font-medium text-sm">:</span>

						<select
							value={minute}
							onChange={(e) => handleMinuteChange(e.target.value)}
							className="w-16 h-9 text-sm border border-slate-200 rounded-md bg-white text-slate-800 px-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
						>
							<option value="">--</option>
							{MINUTES.map((m) => (
								<option key={m} value={m}>{m}</option>
							))}
						</select>

						<select
							value={period}
							onChange={(e) => handlePeriodChange(e.target.value as "AM" | "PM")}
							className="w-18 h-9 text-sm border border-slate-200 rounded-md bg-white text-slate-800 px-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
						>
							<option value="AM">AM</option>
							<option value="PM">PM</option>
						</select>
					</div>
				</div>
			)}
		</div>
	);
}
