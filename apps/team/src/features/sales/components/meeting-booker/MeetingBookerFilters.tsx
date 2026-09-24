"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_CATEGORIES, SALES_REGIONS } from "../../constants/salesTaxonomy";

const ALL_VALUE = "all";

type MeetingBookerFiltersProps = {
	booker: string;
	bookerNames: string[];
	onBookerChange: (value: string) => void;
	category: string;
	onCategoryChange: (value: string) => void;
	region: string;
	onRegionChange: (value: string) => void;
};

/** Who is calling, and which slice of the call list they are working through. */
export function MeetingBookerFilters({
	booker,
	bookerNames,
	onBookerChange,
	category,
	onCategoryChange,
	region,
	onRegionChange,
}: MeetingBookerFiltersProps) {
	const t = useTranslate();

	const groups = [
		{
			id: "category",
			labelKey: localizationConstants.salesFilterCategoryLabel,
			value: category,
			onChange: onCategoryChange,
			allLabelKey: localizationConstants.salesBookerAllCategories,
			options: SALES_CATEGORIES,
		},
		{
			id: "region",
			labelKey: localizationConstants.salesFilterRegionLabel,
			value: region,
			onChange: onRegionChange,
			allLabelKey: localizationConstants.salesBookerAllRegions,
			options: SALES_REGIONS,
		},
	];

	return (
		<div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-2xs">
			<div className="flex items-center gap-3">
				<span className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.salesNavMeetingBooker} />
				</span>
				<Select value={booker} onValueChange={onBookerChange}>
					<SelectTrigger className="h-10 w-[200px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{bookerNames.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{groups.map((group) => (
				<div key={group.id} className="flex items-center gap-3">
					<span className="text-sm font-medium text-slate-700">
						<Translate text={group.labelKey} />
					</span>
					<Select
						value={group.value || ALL_VALUE}
						onValueChange={(value) =>
							group.onChange(value === ALL_VALUE ? "" : value)
						}
					>
						<SelectTrigger className="h-10 w-[200px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL_VALUE}>{t(group.allLabelKey)}</SelectItem>
							{group.options.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{t(option.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			))}
		</div>
	);
}
