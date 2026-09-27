"use client";

import { ChevronDown } from "lucide-react";

import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/** The radio value for Alla; a group's filter is `null` then. */
const ALL = "all";
const ITEM = "cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900";

export interface ForecastFilterGroup {
	labelKey: TranslationKeys;
	options: { value: string; labelKey: TranslationKeys }[];
	value: string | null;
	onChange: (value: string | null) => void;
}

/**
 * A Filter group from a value → label map, so a list keeps its own union
 * type and only this function widens it to the menu's strings.
 */
export function forecastFilterGroup<T extends string>(
	labelKey: TranslationKeys,
	labels: Record<T, TranslationKeys>,
	value: T | null,
	onChange: (value: T | null) => void,
): ForecastFilterGroup {
	return {
		labelKey,
		options: (Object.keys(labels) as T[]).map((option) => ({ value: option, labelKey: labels[option] })),
		value,
		onChange: (next) => onChange(next as T | null),
	};
}

export interface ForecastToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	/** Each group narrows the list on its own; Alla clears that one. */
	groups: ForecastFilterGroup[];
}

/** Sök and Filter above a Prognos list: Prognoslista's and Resultat prognos's alike. */
export function ForecastToolbar({ search, onSearchChange, groups }: ForecastToolbarProps) {
	const t = useTranslate();
	const activeFilterCount = groups.filter((group) => group.value !== null).length;

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
			<Search
				value={search}
				onChange={onSearchChange}
				placeholder={localizationConstants.search}
				aria-label={t(localizationConstants.search)}
				className="h-10 w-full"
				wrapperClassName="w-full sm:w-[260px]"
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="h-10 cursor-pointer justify-between gap-1.5 self-start border-slate-200 bg-transparent px-3 text-sm font-normal text-slate-700 shadow-2xs hover:bg-slate-50"
					>
						<Translate text={localizationConstants.filter} />
						{activeFilterCount > 0 && (
							<>
								<span aria-hidden className="rounded-sm bg-slate-900 px-1.5 text-[10px] font-semibold text-white">
									{activeFilterCount}
								</span>
								<span className="sr-only">
									{t(localizationConstants.forecastFilterActiveCount, { count: activeFilterCount })}
								</span>
							</>
						)}
						<ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-52 border border-slate-200 bg-white p-1 shadow-md">
					{groups.map((group, index) => (
						<div key={group.labelKey}>
							{index > 0 && <DropdownMenuSeparator />}
							<DropdownMenuLabel className="text-xs font-medium text-slate-500">
								<Translate text={group.labelKey} />
							</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={group.value ?? ALL}
								onValueChange={(next) => group.onChange(next === ALL ? null : next)}
							>
								<DropdownMenuRadioItem value={ALL} className={ITEM}>
									<Translate text={localizationConstants.forecastFilterAll} />
								</DropdownMenuRadioItem>
								{group.options.map((option) => (
									<DropdownMenuRadioItem key={option.value} value={option.value} className={ITEM}>
										<Translate text={option.labelKey} />
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</div>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default ForecastToolbar;
