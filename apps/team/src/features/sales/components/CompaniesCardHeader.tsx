"use client";

import { Search } from "@/components/search/Search";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getSalesStatusMeta } from "../constants/salesStatuses";
import { SALES_CATEGORIES, SALES_REGIONS } from "../constants/salesTaxonomy";
import type { SalesStatusFilter } from "../types";

const ALL_VALUE = "all";

/** The pipeline slice currently on screen, shown next to the card title. */
function getSelectionLabelKey(filter: SalesStatusFilter): string | null {
	if (filter === "all") return null;
	if (filter === "demo") return localizationConstants.salesDemoAccountsTitle;
	if (filter === "test") return localizationConstants.salesTestAccountsTitle;
	return getSalesStatusMeta(filter).labelKey;
}

type CompaniesCardHeaderProps = {
	statusFilter: SalesStatusFilter;
	category: string;
	onCategoryChange: (value: string) => void;
	region: string;
	onRegionChange: (value: string) => void;
	query: string;
	onQueryChange: (value: string) => void;
};

export function CompaniesCardHeader({
	statusFilter,
	category,
	onCategoryChange,
	region,
	onRegionChange,
	query,
	onQueryChange,
}: CompaniesCardHeaderProps) {
	const t = useTranslate();
	const selectionLabelKey = getSelectionLabelKey(statusFilter);

	const filters = [
		{
			id: "category",
			value: category,
			onChange: onCategoryChange,
			allLabelKey: localizationConstants.salesBookerAllCategories,
			options: SALES_CATEGORIES,
		},
		{
			id: "region",
			value: region,
			onChange: onRegionChange,
			allLabelKey: localizationConstants.salesBookerAllRegions,
			options: SALES_REGIONS,
		},
	];

	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-slate-200 px-5 py-4">
			<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.salesCompaniesTitle} />
					{selectionLabelKey && (
						<>
							{" · "}
							<Translate text={selectionLabelKey} />
						</>
					)}
				</h2>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				{filters.map((filter) => (
					<Select
						key={filter.id}
						value={filter.value || ALL_VALUE}
						onValueChange={(value) =>
							filter.onChange(value === ALL_VALUE ? "" : value)
						}
					>
						<SelectTrigger className="h-10 w-[170px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL_VALUE}>{t(filter.allLabelKey)}</SelectItem>
							{filter.options.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{t(option.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				))}
				<Search
					value={query}
					onChange={onQueryChange}
					placeholder={t(localizationConstants.salesSearchPlaceholder)}
					wrapperClassName="w-[260px]"
				/>
			</div>
		</div>
	);
}
