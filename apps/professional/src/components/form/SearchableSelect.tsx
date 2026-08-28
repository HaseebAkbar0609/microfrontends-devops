"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface SearchableOption {
	value: string;
	label: string;
}

/**
 * Combobox that filters a list and, with `allowCustom`, also accepts a value
 * that is not in it.
 *
 * Lifted out of the order create flow so the purchase flows can share it;
 * `orders/create` keeps its own copy pending migration.
 */
export interface SearchableSelectProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	options: (string | SearchableOption)[];
	className?: string;
	allowCustom?: boolean;
	hasError?: boolean;
}

export function SearchableSelect({
	value,
	onChange,
	placeholder = "Välj...",
	searchPlaceholder = "Type a command for search...",
	options,
	className,
	allowCustom = true,
	hasError = false,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const normalizedOptions: SearchableOption[] = options.map((opt) =>
		typeof opt === "string" ? { value: opt, label: opt } : opt
	);

	const filteredOptions = normalizedOptions.filter((opt) =>
		opt.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				searchInputRef.current?.focus();
			}, 50);
			return () => clearTimeout(timer);
		} else {
			setSearchQuery("");
		}
	}, [open]);

	const selectedLabel =
		normalizedOptions.find((opt) => opt.value === value)?.label || value;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					role="combobox"
					aria-expanded={open}
					aria-controls="searchable-options-list"
					className={cn(
						"flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-none transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
						open
							? "border-slate-400 ring-2 ring-slate-400/20"
							: hasError
							? "border-red-500"
							: "border-slate-200 hover:border-slate-300",
						!value && "text-slate-400 font-normal",
						className
					)}
				>
					<span className="truncate text-left font-normal text-slate-800">
						{selectedLabel || placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-700" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 shadow-lg border border-slate-200 rounded-lg overflow-hidden bg-white z-50"
				align="start"
				sideOffset={4}
			>
				{/* Search Input Box */}
				<div className="flex items-center border-b border-slate-100 px-3.5 py-2.5 bg-white">
					<Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
					<input
						ref={searchInputRef}
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && allowCustom && searchQuery.trim()) {
								onChange(searchQuery.trim());
								setOpen(false);
							}
						}}
						placeholder={searchPlaceholder}
						className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
						>
							<X className="h-3 w-3" />
						</button>
					)}
				</div>

				{/* Options List */}
				<div id="searchable-options-list" role="listbox" className="max-h-60 overflow-y-auto p-1 text-sm space-y-0.5">
					{filteredOptions.length === 0 ? (
						<div className="py-3 px-3 text-center text-xs text-slate-500">
							{allowCustom && searchQuery.trim() ? (
								<button
									type="button"
									onClick={() => {
										onChange(searchQuery.trim());
										setOpen(false);
									}}
									className="text-slate-700 hover:underline font-medium text-xs cursor-pointer"
								>
									Använd &ldquo;{searchQuery.trim()}&rdquo;
								</button>
							) : (
								"Inga resultat hittades."
							)}
						</div>
					) : (
						filteredOptions.map((option) => {
							const isSelected = option.value === value || option.label === value;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => {
										onChange(option.value);
										setOpen(false);
									}}
									className={cn(
										"flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
										isSelected
											? "bg-slate-100 font-medium text-slate-900"
											: "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
									)}
								>
									<span>{option.label}</span>
									{isSelected && (
										<Check className="h-4 w-4 text-slate-900 shrink-0" />
									)}
								</button>
							);
						})
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
