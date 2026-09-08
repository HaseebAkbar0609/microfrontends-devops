"use client";

import { useState } from "react";
import { ChevronDown, Filter, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/search/Search";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface FilterOption {
	label: string;
	value: string;
}

export interface FilterConfig {
	label: string;
	options: FilterOption[];
	onFilterChange: (value: string) => void;
	value?: string | null;
}

interface FilterDropdownProps {
	filter: FilterConfig;
}

function FilterDropdown({ filter }: FilterDropdownProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const selected = filter.options.find((option) => option.value === filter.value);
	const triggerLabel = selected?.label ?? filter.label;

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="h-10 w-fit !bg-gray-100 justify-between border-slate-200  font-normal hover:bg-transparent"
				>
					<div className="flex flex-1 items-center gap-2 overflow-hidden">
						{!selected && <Filter className="h-4 w-4 shrink-0" />}
						<span className="truncate">
							<Translate text={triggerLabel} />
						</span>
					</div>
					<ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[150px]">
				{filter.options.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onClick={() =>
							filter.value === option.value
								? filter.onFilterChange("")
								: filter.onFilterChange(option.value)
						}
						className={filter.value === option.value ? "bg-slate-100" : ""}
					>
						<Translate text={option.label} />
					</DropdownMenuItem>
				))}
				{selected ? (
					<>
						<div className="my-1 h-px bg-slate-200" />
						<DropdownMenuItem
							onClick={() => filter.onFilterChange("")}
							className="text-red-500 focus:bg-red-50 focus:text-red-500"
						>
							<X className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.clearFilterLabel} />
						</DropdownMenuItem>
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface ActionsToolbarProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder?: string;
	filters?: FilterConfig[];
	onCreateClick?: () => void;
	createButtonLabel?: string;
	className?: string;
}

export function ActionsToolbar({
	searchValue,
	onSearchChange,
	searchPlaceholder = localizationConstants.searchPlaceholder,
	filters,
	onCreateClick,
	createButtonLabel = localizationConstants.createLabel,
	className,
}: ActionsToolbarProps) {
	return (
		<div className={cn("flex items-center justify-between gap-4 px-5 py-6", className)}>
			<div className="flex max-w-2xl flex-1 flex-wrap items-center gap-3">
				<Search
					value={searchValue}
					onChange={onSearchChange}
					placeholder={searchPlaceholder}
					className="h-10 w-full max-w-[300px]"
				/>
				{filters?.map((filter, index) => (
					<FilterDropdown key={`${filter.label}-${index}`} filter={filter} />
				))}
			</div>

			{onCreateClick ? (
				<Button
					onClick={onCreateClick}
					className="h-10 gap-2 rounded-md bg-[#18181B] px-4 text-white transition-colors hover:bg-[#18181B]/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={createButtonLabel} />
				</Button>
			) : null}
		</div>
	);
}
