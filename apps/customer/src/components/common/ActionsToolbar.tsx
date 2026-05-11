"use client";

import { Plus, ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Search } from "../search/Search";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useState } from "react";

export interface FilterOption {
	label: string;
	value: string;
}

export interface FilterConfig {
	label: string;
	options: FilterOption[];
	onFilterChange: (value: string) => void;
	/** Selected option value (e.g. from URL). When set, the trigger shows that option's label. */
	value?: string | null;
}

interface FilterDropdownProps {
	filter: FilterConfig;
}

function FilterDropdown({ filter }: FilterDropdownProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const selected = filter.options.find((o) => o.value === filter.value);
	const triggerLabel = selected?.label ?? filter.label;

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="h-10 w-[150px] bg-transparent justify-between border-slate-200 font-normal hover:bg-transparent"
				>
					<div className="flex items-center gap-2 overflow-hidden flex-1">
						{!selected && <Filter className="h-4 w-4 shrink-0" />}
						<span className="truncate">
							<Translate text={triggerLabel} />
						</span>
					</div>
					<div className="flex items-center gap-1">
						
						<ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[150px]">
				{filter.options.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						onClick={() =>
							filter.value === opt.value
								? filter.onFilterChange("")
								: filter.onFilterChange(opt.value)
						}
						className={
							filter.value === opt.value ? "bg-slate-100" : ""
						}
					>
						<Translate text={opt.label} />
					</DropdownMenuItem>
				))}
				{selected && (
					<>
						<div className="h-px bg-slate-200 my-1" />
						<DropdownMenuItem
							onClick={() => filter.onFilterChange("")}
							className="text-red-500 focus:text-red-500 focus:bg-red-50"
						>
							<X className="h-4 w-4 mr-2" />
							<Translate text="Clear filter" />
						</DropdownMenuItem>
					</>
				)}
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
	createButtonLabel = localizationConstants.createNewButtonText,
	className,
}: ActionsToolbarProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4  px-5 py-6 ",
				className,
			)}
		>
			<div className="flex items-center gap-3 flex-1 max-w-2xl">
				<Search
					value={searchValue}
					onChange={onSearchChange}
					placeholder={searchPlaceholder}
					className="h-10 w-full max-w-[300px]"
				/>
				{filters?.map((filter, index) => (
					<FilterDropdown key={index} filter={filter} />
				))}
			</div>

			{onCreateClick && (
				<Button
					onClick={onCreateClick}
					className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors"
				>
					<Plus className="h-4 w-4" />
					<Translate text={createButtonLabel} />
				</Button>
			)}
		</div>
	);
}
