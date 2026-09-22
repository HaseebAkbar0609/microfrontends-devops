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
import {
	FORECAST_CATEGORY_LABELS,
	FORECAST_CUSTOMER_TYPE_LABELS,
} from "../../../constants/forecastList.constants";
import type { ForecastListFilters } from "../../../types/forecastList.types";

/** The radio value for Alla; a group's filter is `null` then. */
const ALL = "all";
const ITEM = "cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900";

function FilterGroup<T extends string>({
	labelKey,
	labels,
	value,
	onChange,
}: {
	labelKey: TranslationKeys;
	labels: Record<T, TranslationKeys>;
	value: T | null;
	onChange: (value: T | null) => void;
}) {
	return (
		<>
			<DropdownMenuLabel className="text-xs font-medium text-slate-500">
				<Translate text={labelKey} />
			</DropdownMenuLabel>
			<DropdownMenuRadioGroup
				value={value ?? ALL}
				onValueChange={(next) => onChange(next === ALL ? null : (next as T))}
			>
				<DropdownMenuRadioItem value={ALL} className={ITEM}>
					<Translate text={localizationConstants.forecastFilterAll} />
				</DropdownMenuRadioItem>
				{(Object.keys(labels) as T[]).map((option) => (
					<DropdownMenuRadioItem key={option} value={option} className={ITEM}>
						<Translate text={labels[option]} />
					</DropdownMenuRadioItem>
				))}
			</DropdownMenuRadioGroup>
		</>
	);
}

export interface ForecastListToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	filters: ForecastListFilters;
	onFilterChange: <K extends keyof ForecastListFilters>(key: K, value: ForecastListFilters[K]) => void;
	activeFilterCount: number;
}

/** Sök and Filter above Prognoslista; Filter narrows by Kategori and Typ, and counts what is set. */
export function ForecastListToolbar({ search, onSearchChange, filters, onFilterChange, activeFilterCount }: ForecastListToolbarProps) {
	const t = useTranslate();

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
					<FilterGroup
						labelKey={localizationConstants.forecastColCategory}
						labels={FORECAST_CATEGORY_LABELS}
						value={filters.category}
						onChange={(value) => onFilterChange("category", value)}
					/>
					<DropdownMenuSeparator />
					<FilterGroup
						labelKey={localizationConstants.forecastColType}
						labels={FORECAST_CUSTOMER_TYPE_LABELS}
						value={filters.customerType}
						onChange={(value) => onFilterChange("customerType", value)}
					/>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default ForecastListToolbar;
