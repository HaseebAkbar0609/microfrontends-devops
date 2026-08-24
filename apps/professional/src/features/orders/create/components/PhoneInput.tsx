"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
	value?: string;
	onChange: (val: string) => void;
	placeholder?: string;
	className?: string;
	hasError?: boolean;
}

/**
 * Parses a combined phone string like "+46 701234567" into [countryCode, nationalNumber]
 */
function parsePhoneValue(fullVal?: string): { code: string; number: string } {
	if (!fullVal || fullVal.trim() === "") {
		return { code: "+46", number: "" };
	}

	const trimmed = fullVal.trim();
	// If starts with + (e.g. +46 701234567 or +1-555-1234)
	if (trimmed.startsWith("+")) {
		const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
		if (match && match[1]) {
			return {
				code: match[1],
				number: match[2] || "",
			};
		}
	}

	return { code: "+46", number: trimmed };
}

export function PhoneInput({
	value = "",
	onChange,
	placeholder = "Enter phone number",
	className,
	hasError = false,
}: PhoneInputProps) {
	const parsed = parsePhoneValue(value);
	const [countryCode, setCountryCode] = useState(parsed.code);
	const [number, setNumber] = useState(parsed.number);

	useEffect(() => {
		const latest = parsePhoneValue(value);
		setCountryCode(latest.code);
		setNumber(latest.number);
	}, [value]);

	const emitCombined = (newCode: string, newNumber: string) => {
		const cleanNum = newNumber.replace(/[^0-9\- ()]/g, "").trim();
		if (!cleanNum) {
			onChange("");
			return;
		}
		const cleanCode = newCode.trim().startsWith("+")
			? newCode.trim()
			: `+${newCode.trim().replace(/\D/g, "")}`;
		onChange(`${cleanCode} ${cleanNum}`);
	};

	const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let val = e.target.value.replace(/[^0-9+]/g, "");
		if (val && !val.startsWith("+")) {
			val = `+${val}`;
		}
		setCountryCode(val);
		emitCombined(val, number);
	};

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;

		// If user pastes full international number starting with + into number field
		if (raw.trim().startsWith("+")) {
			const autoParsed = parsePhoneValue(raw);
			setCountryCode(autoParsed.code);
			setNumber(autoParsed.number);
			emitCombined(autoParsed.code, autoParsed.number);
			return;
		}

		const cleanedNum = raw.replace(/[^0-9+\- ()]/g, "");
		setNumber(cleanedNum);
		emitCombined(countryCode, cleanedNum);
	};

	return (
		<div
			className={cn(
				"flex h-10 rounded-md border border-slate-200 bg-white overflow-hidden focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/20 transition-all",
				hasError && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
				className
			)}
		>
			{/* Country Code Text Input (same bg as number input) */}
			<input
				type="text"
				value={countryCode}
				onChange={handleCountryCodeChange}
				placeholder="+46"
				maxLength={5}
				className="w-16 bg-white px-2.5 py-2 text-center text-sm font-medium text-slate-700 border-r border-slate-200 outline-none placeholder:text-slate-400 select-all"
				aria-label="Country Code"
			/>

			{/* Phone Number Input */}
			<input
				type="tel"
				value={number}
				onChange={handleNumberChange}
				placeholder={placeholder}
				className="flex-1 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
			/>
		</div>
	);
}
