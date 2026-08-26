"use client";

import { cn } from "@/lib/utils";

export interface PhoneInputProps {
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

/**
 * Split country-code / national-number phone field, defaulting to +46.
 *
 * Shared by the order and purchase create flows; `orders/create` still carries
 * its own copy pending migration.
 */
export function PhoneInput({
	value = "",
	onChange,
	placeholder = "Enter phone number",
	className,
	hasError = false,
}: PhoneInputProps) {
	const { code: countryCode, number } = parsePhoneValue(value);

	const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let val = e.target.value.replace(/[^0-9+]/g, "");
		if (val && !val.startsWith("+")) {
			val = `+${val}`;
		}
		const cleanCode = val.trim().startsWith("+")
			? val.trim()
			: `+${val.trim().replace(/\D/g, "")}`;
		onChange(number ? `${cleanCode} ${number}` : cleanCode);
	};

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		if (raw.trim().startsWith("+")) {
			onChange(raw.trim());
			return;
		}

		const cleanedNum = raw.replace(/[^0-9+\- ()]/g, "");
		if (!cleanedNum) {
			onChange("");
			return;
		}
		const cleanCode = countryCode || "+46";
		onChange(`${cleanCode} ${cleanedNum}`);
	};

	return (
		<div
			className={cn(
				"flex h-10 rounded-md border border-slate-200 bg-white overflow-hidden focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/20 transition-all",
				hasError && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
				className
			)}
		>
			{/* Country Code Text Input */}
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
