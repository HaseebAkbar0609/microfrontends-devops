"use client";

import { Search } from "@/components/search/Search";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	MATERIAL_CATEGORY_IDS,
	MATERIAL_CATEGORY_LABELS,
	STOCK_FILTER_OPTIONS,
} from "../../constants/materialStorage.constants";
import type { MaterialCategoryId, StockFilter } from "../../types/materialStorage.types";

/** Select value standing for "no category filter"; never a category id. */
const ALL_CATEGORIES = "all";

interface MaterialStockToolbarProps {
	search: string;
	onSearchChange: (search: string) => void;
	categoryId: MaterialCategoryId | null;
	onCategoryChange: (categoryId: MaterialCategoryId | null) => void;
	stockFilter: StockFilter;
	onStockFilterChange: (filter: StockFilter) => void;
}

export function MaterialStockToolbar({
	search,
	onSearchChange,
	categoryId,
	onCategoryChange,
	stockFilter,
	onStockFilterChange,
}: MaterialStockToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center gap-3 p-4">
			<Search
				value={search}
				onChange={onSearchChange}
				placeholder={localizationConstants.materialSearchPlaceholder}
				aria-label={t(localizationConstants.materialSearchPlaceholder)}
				wrapperClassName="w-full md:w-md"
				className="h-10 rounded-md border border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-slate-400"
			/>
			<Select
				value={categoryId ?? ALL_CATEGORIES}
				onValueChange={(value) =>
					onCategoryChange(value === ALL_CATEGORIES ? null : (value as MaterialCategoryId))
				}
			>
				<SelectTrigger
					aria-label={t(localizationConstants.materialCategoryFilterLabel)}
					className="w-48 cursor-pointer bg-white text-slate-900"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_CATEGORIES} className="cursor-pointer">
						<Translate text={localizationConstants.materialAllCategories} />
					</SelectItem>
					{MATERIAL_CATEGORY_IDS.map((id) => (
						<SelectItem key={id} value={id} className="cursor-pointer">
							<Translate text={MATERIAL_CATEGORY_LABELS[id]} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<SegmentedToggle
				variant="boxed"
				options={STOCK_FILTER_OPTIONS}
				value={stockFilter}
				onChange={onStockFilterChange}
				ariaLabel={t(localizationConstants.materialStockFilterLabel)}
				className="ml-auto"
			/>
		</div>
	);
}
