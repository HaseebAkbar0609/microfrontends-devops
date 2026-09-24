"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	getDiscountFilters,
	listDiscounts,
} from "../services/discountService";
import type {
	Discount,
	DiscountFilters,
	DiscountStatus,
} from "../types/discount.types";

const EMPTY_FILTERS: DiscountFilters = { suppliers: [], categories: [] };

export interface UseDiscountsResult {
	discounts: Discount[];
	filterOptions: DiscountFilters;
	filtersLoading: boolean;
	listLoading: boolean;
	error: string | null;
	supplier: string;
	setSupplier: (value: string) => void;
	category: string;
	setCategory: (value: string) => void;
	status: DiscountStatus | "";
	setStatus: (value: DiscountStatus | "") => void;
	hasActiveFilters: boolean;
	clearFilters: () => void;
	/** False only when the data source itself holds no discounts. */
	hasAnyDiscounts: boolean;
}

/**
 * Owns the Tools / Discount list state: filter options, the active
 * supplier/category/status selection, and the matching discounts.
 *
 * Filtering runs in the mock service rather than here so the same call sites
 * keep working once the query moves server-side.
 */
export function useDiscounts(): UseDiscountsResult {
	const t = useTranslate();

	const [filterOptions, setFilterOptions] =
		useState<DiscountFilters>(EMPTY_FILTERS);
	const [filtersLoading, setFiltersLoading] = useState(true);

	const [discounts, setDiscounts] = useState<Discount[]>([]);
	const [listLoading, setListLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [supplier, setSupplier] = useState("");
	const [category, setCategory] = useState("");
	const [status, setStatus] = useState<DiscountStatus | "">("");

	useEffect(() => {
		let isMounted = true;

		getDiscountFilters().then((result) => {
			if (!isMounted) return;
			setFilterOptions(result.success && result.data ? result.data : EMPTY_FILTERS);
			setFiltersLoading(false);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;
		setListLoading(true);

		listDiscounts({ supplier, category, status }).then((result) => {
			if (!isMounted) return;
			if (result.success && result.data) {
				setDiscounts(result.data);
				setError(null);
			} else {
				setDiscounts([]);
				setError(result.error || t(localizationConstants.discountsLoadError));
			}
			setListLoading(false);
		});

		return () => {
			isMounted = false;
		};
		// `t` is recreated on every render by useTranslate; refetching on it would loop.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supplier, category, status]);

	const hasActiveFilters = Boolean(supplier || category || status);

	const clearFilters = useCallback(() => {
		setSupplier("");
		setCategory("");
		setStatus("");
	}, []);

	const hasAnyDiscounts = useMemo(
		() =>
			filterOptions.suppliers.length > 0 ||
			filterOptions.categories.length > 0,
		[filterOptions.suppliers, filterOptions.categories],
	);

	return {
		discounts,
		filterOptions,
		filtersLoading,
		listLoading,
		error,
		supplier,
		setSupplier,
		category,
		setCategory,
		status,
		setStatus,
		hasActiveFilters,
		clearFilters,
		hasAnyDiscounts,
	};
}
