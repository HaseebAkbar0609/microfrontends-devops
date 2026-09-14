"use client";

import React, { useState } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface AtaMultiSelectProps {
	options: string[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function AtaMultiSelect({
	options,
	selectedValues,
	onChange,
	placeholder,
	className = "",
}: AtaMultiSelectProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredOptions = options.filter((opt) =>
		opt.toLowerCase().includes(searchQuery.toLowerCase().trim())
	);

	const toggleOption = (option: string) => {
		if (selectedValues.includes(option)) {
			onChange(selectedValues.filter((v) => v !== option));
		} else {
			onChange([...selectedValues, option]);
		}
	};

	const removeOption = (e: React.MouseEvent, option: string) => {
		e.stopPropagation();
		onChange(selectedValues.filter((v) => v !== option));
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<div
					role="button"
					tabIndex={0}
					className={`min-h-[42px] w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer transition-colors hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 ${className}`}
				>
					<div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
						{selectedValues.length === 0 ? (
							<span className="text-sm text-slate-400 font-normal">
								{placeholder || t(localizationConstants.createAtaSelectOption)}
							</span>
						) : (
							selectedValues.map((val) => (
								<span
									key={val}
									className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-slate-900 text-xs font-medium"
								>
									<span>{val}</span>
									<span
										role="button"
										tabIndex={0}
										onClick={(e) => removeOption(e, val)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												removeOption(e as unknown as React.MouseEvent, val);
											}
										}}
										className="hover:text-slate-600 cursor-pointer p-0.5 rounded-full"
									>
										<X className="h-3 w-3 text-slate-500" />
									</span>
								</span>
							))
						)}
					</div>
					<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
				</div>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				className="w-72 p-0 bg-white rounded-lg border border-slate-200 shadow-lg flex flex-col overflow-hidden z-50"
			>
				{/* Search header matching Screenshot */}
				<div className="px-4 py-2.5 border-b border-slate-200 bg-white">
					<input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t(localizationConstants.search)}
						aria-label={t(localizationConstants.search)}
						className="w-full bg-transparent font-semibold text-sm text-slate-900 placeholder:text-slate-900 placeholder:font-semibold focus:outline-none"
					/>
				</div>

				{/* Options list matching Screenshot */}
				<div className="max-h-56 overflow-y-auto flex flex-col py-1">
					{filteredOptions.length === 0 ? (
						<div className="py-3 text-center text-xs text-slate-400 font-normal">
							{t(localizationConstants.createAtaNoResultsFound)}
						</div>
					) : (
						filteredOptions.map((option) => {
							const isSelected = selectedValues.includes(option);
							return (
								<div
									key={option}
									role="button"
									tabIndex={0}
									onClick={() => toggleOption(option)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											toggleOption(option);
										}
									}}
									className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors select-none"
								>
									<span>{option}</span>
									{isSelected && <Check className="h-4 w-4 text-slate-600 shrink-0" />}
								</div>
							);
						})
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
