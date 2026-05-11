"use client";

import { useEffect, useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import { t } from "i18next";

export interface SearchProps extends Omit<
	React.ComponentProps<typeof Input>,
	"type" | "value" | "onChange"
> {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	/** Optional wrapper class for the search container (icon + input) */
	wrapperClassName?: string;
}

/**
 * Reusable search input with icon. Use across list pages (Offers, Quotes, etc.)
 * for consistent search UX.
 */
export function Search({
	value: propValue,
	onChange: propOnChange,
	placeholder = "Search…",
	className,
	wrapperClassName,
	...inputProps
}: SearchProps) {
	const { search, changeQuery } = useQueryParams();

	// Determine the external value and external change handler
	const externalValue = propValue !== undefined ? propValue : search;

	const externalOnChange = useMemo(
		() => propOnChange || ((val: string) => changeQuery("search", val)),
		[propOnChange, changeQuery],
	);

	// Local state for immediate feedback
	const [inputValue, setInputValue] = useState(externalValue);

	// Debounce the local state
	const debouncedValue = useDebounce(inputValue, 500);

	// Sync local state with external value if it changes externally
	useEffect(() => {
		setInputValue(externalValue);
	}, [externalValue]);

	// Trigger the external change handler when the debounced value changes
	useEffect(() => {
		if (debouncedValue === inputValue && debouncedValue !== externalValue) {
			externalOnChange(debouncedValue);
		}
	}, [debouncedValue, externalOnChange, externalValue, inputValue]);

	const handleClear = () => {
		setInputValue("");
		externalOnChange("");
	};

	return (
		<div
			className={cn(
				"relative flex items-center text-slate-500",
				wrapperClassName,
			)}
		>
			<SearchIcon
				className="absolute left-3 h-4 w-4 shrink-0 pointer-events-none"
				aria-hidden
			/>
			<Input
				type="text"
				role="searchbox"
				placeholder={t(placeholder)}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				className={cn(
					"pl-9 pr-9 border-0 border-b border-slate-300 rounded-none bg-transparent focus-visible:ring-0 focus:border-slate-300 [&::-webkit-search-cancel-button]:hidden",
					className,
				)}
				{...inputProps}
			/>
			{inputValue && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute cursor-pointer right-3 h-4 w-4 shrink-0 hover:text-slate-900 transition-colors"
					aria-label="Clear search"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
