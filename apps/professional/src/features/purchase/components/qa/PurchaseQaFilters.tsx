"use client";

import {
	QAThreadFilterChips,
	type QAThreadFilterChipsLabels,
	type QAThreadStatusOption,
} from "@/components/common/QAThreadFilterChips";
import { Search } from "@/components/search/Search";
import localizationConstants from "@/utils/translation/constants";
import type { PurchaseQaStatus } from "../../types/purchase.types";

const STATUS_OPTIONS: QAThreadStatusOption[] = [
	{ value: "new", label: localizationConstants.purchaseQaColNew },
	{ value: "opened", label: localizationConstants.purchaseQaColOpened },
	{ value: "answered", label: localizationConstants.purchaseQaColAnswered },
];

const CHIP_LABELS: QAThreadFilterChipsLabels = {
	company: localizationConstants.purchaseQaFilterCompany,
	role: localizationConstants.purchaseQaFilterRole,
	status: localizationConstants.statusLabel,
	reset: localizationConstants.purchaseQaFilterReset,
};

export interface PurchaseQaFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	companies: string[];
	companyOptions: string[];
	onToggleCompany: (value: string) => void;
	roles: string[];
	roleOptions: string[];
	onToggleRole: (value: string) => void;
	statuses: PurchaseQaStatus[];
	onToggleStatus: (value: PurchaseQaStatus) => void;
	onReset: () => void;
	hasFilters: boolean;
	/** Changes on reset; remounts the search box so it clears with the rest. */
	resetToken: number;
}

/**
 * Search and the board's filter chips. The chips are the shared
 * `QAThreadFilterChips`, which the project record's board draws too.
 */
export function PurchaseQaFilters({
	search,
	onSearchChange,
	resetToken,
	...chips
}: PurchaseQaFiltersProps) {
	return (
		<div className="flex flex-col gap-3">
			<Search
				key={`purchase-qa-search-${resetToken}`}
				value={search}
				onChange={onSearchChange}
				placeholder={localizationConstants.purchaseQaSearchPlaceholder}
				wrapperClassName="w-full sm:w-72"
				className="h-10 bg-white text-xs"
			/>

			<QAThreadFilterChips
				{...chips}
				statusOptions={STATUS_OPTIONS}
				labels={CHIP_LABELS}
			/>
		</div>
	);
}

export default PurchaseQaFilters;
