"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext, useWatch } from "react-hook-form";

import type { City } from "@/types/location";

import { FormSelect } from "./FormSelect";
import { getCitiesAPIAction } from "@/api-actions/location/cities";

export interface FormCitySelectProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	name: TName;
	countryId?: string;
	label?: React.ReactNode;
	placeholder?: string;
	className?: string;
	triggerClassName?: string;
	disabled?: boolean;
	/** When true, the trigger stays disabled until the first city page finishes loading */
	disableWhileLoading?: boolean;
	/**
	 * When the effective country changes, skip clearing the city field if its
	 * current value equals this (e.g. profile city id already on the form).
	 */
	skipCityResetWhenValue?: string;
	/**
	 * Ensures this value appears as an option when the API list does not
	 * include it yet (e.g. pre-filled profile city).
	 */
	ensureOptionIfMissing?: string;
	/**
	 * Human-readable label for {@link ensureOptionIfMissing} when it is not
	 * in the loaded pages yet (e.g. from API profile). Avoids showing the raw id.
	 */
	ensureOptionLabelIfMissing?: string;
	/**
	 * Keeps a separate form field in sync with the selected city's display name
	 * (e.g. `personalCityName` / `projectCityName` for read-only overview).
	 */
	syncLabelToField?: FieldPath<TFieldValues>;
}

export function FormCitySelect<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	name,
	countryId,
	label,
	placeholder,
	className,
	triggerClassName,
	disabled,
	disableWhileLoading,
	skipCityResetWhenValue,
	ensureOptionIfMissing,
	ensureOptionLabelIfMissing,
	syncLabelToField,
}: FormCitySelectProps<TFieldValues, TName>) {
	const { control, getValues, setValue } = useFormContext<TFieldValues>();
	const selectedCityId = useWatch({ control, name });
	const [cities, setCities] = useState<City[]>([]);
	const [cityCurrentPage, setCityCurrentPage] = useState(1);
	const [cityTotalPages, setCityTotalPages] = useState(1);
	const [isLoadingCities, setIsLoadingCities] = useState(false);
	const [isLoadingMoreCities, setIsLoadingMoreCities] = useState(false);
	const [citySearchQuery, setCitySearchQuery] = useState("");
	const [isCitySearchLoading, setIsCitySearchLoading] = useState(false);
	const citySearchRequestId = useRef(0);
	const autoLoadMoreCount = useRef(0);
	const MAX_AUTO_LOAD_MORE_PAGES = 80;
	/** Keeps label when the selected id is no longer in `cities` (e.g. after search clears and list resets to page 1). */
	const selectedCityLabelRef = useRef<{ id: string; name: string } | null>(
		null,
	);
	const skipCityResetWhenValueRef = useRef(skipCityResetWhenValue);
	const ensureOptionIfMissingRef = useRef(ensureOptionIfMissing);
	skipCityResetWhenValueRef.current = skipCityResetWhenValue;
	ensureOptionIfMissingRef.current = ensureOptionIfMissing;

	useEffect(() => {
		const id = typeof selectedCityId === "string" ? selectedCityId : "";
		if (!id) {
			if (!ensureOptionIfMissing) {
				selectedCityLabelRef.current = null;
			}
			return;
		}
		if (selectedCityLabelRef.current?.id !== id) {
			selectedCityLabelRef.current = null;
		}
		const c = cities.find((x) => x.id === id);
		if (c) {
			selectedCityLabelRef.current = { id: c.id, name: c.name };
		}
	}, [selectedCityId, cities, ensureOptionIfMissing]);

	useEffect(() => {
		if (!syncLabelToField) return;
		const id = typeof selectedCityId === "string" ? selectedCityId.trim() : "";
		if (!id) {
			setValue(syncLabelToField, "" as never);
			return;
		}
		const fromList = cities.find((x) => x.id === id)?.name?.trim();
		const fromRef =
			selectedCityLabelRef.current?.id === id
				? selectedCityLabelRef.current?.name?.trim() ?? ""
				: "";
		const missingId = ensureOptionIfMissing?.trim();
		const rawEnsure =
			missingId === id && typeof ensureOptionLabelIfMissing === "string"
				? ensureOptionLabelIfMissing.trim()
				: "";
		const fromEnsure =
			rawEnsure && rawEnsure !== "Loading…" && rawEnsure !== "—"
				? rawEnsure
				: "";
		const label = fromList || fromRef || fromEnsure;
		if (label) setValue(syncLabelToField, label as never);
	}, [
		selectedCityId,
		cities,
		syncLabelToField,
		setValue,
		ensureOptionIfMissing,
		ensureOptionLabelIfMissing,
	]);

	useEffect(() => {
		const fetchInitialCities = async () => {
			const currentCity = getValues(name) as string;
			const savedCityId =
				skipCityResetWhenValueRef.current ?? ensureOptionIfMissingRef.current;
			const preserve =
				savedCityId !== undefined &&
				currentCity === savedCityId;

			if (!preserve) {
				setValue(name, "" as never);
			}

			setCities([]);
			setCityCurrentPage(1);
			setCityTotalPages(1);
			setCitySearchQuery("");
			setIsCitySearchLoading(false);
			autoLoadMoreCount.current = 0;

			if (!countryId) {
				return;
			}

			citySearchRequestId.current += 1;
			const requestId = citySearchRequestId.current;

			setIsLoadingCities(true);
			const result = await getCitiesAPIAction({
				countryId,
				page: 1,
				pageSize: 50,
			});

			if (requestId !== citySearchRequestId.current) {
				return;
			}

			if (result.success && result.data) {
				setCities(result.data.data ?? []);
				setCityCurrentPage(result.data.current_page ?? 1);
				setCityTotalPages(result.data.total_pages ?? 1);
			}
			setIsLoadingCities(false);
		};

		fetchInitialCities();
	}, [countryId, getValues, name, setValue]);

	const hasMoreCities = countryId ? cityCurrentPage < cityTotalPages : false;

	const handleLoadMoreCities = useCallback(async () => {
		if (
			!countryId ||
			!hasMoreCities ||
			isLoadingMoreCities ||
			isLoadingCities ||
			isCitySearchLoading
		) {
			return;
		}

		setIsLoadingMoreCities(true);
		const nextPage = cityCurrentPage + 1;
		try {
			const result = await getCitiesAPIAction({
				countryId,
				page: nextPage,
				pageSize: 50,
				search: citySearchQuery || undefined,
			});

			if (result.success && result.data) {
				const responseData = result.data;
				setCities((prev) => [...prev, ...(responseData.data ?? [])]);
				setCityCurrentPage(responseData.current_page ?? nextPage);
				setCityTotalPages(responseData.total_pages ?? cityTotalPages);
			}
		} finally {
			setIsLoadingMoreCities(false);
		}
	}, [
		countryId,
		hasMoreCities,
		isLoadingMoreCities,
		isLoadingCities,
		isCitySearchLoading,
		cityCurrentPage,
		cityTotalPages,
		citySearchQuery,
	]);

	/** Until the selected id appears in `cities`, keep loading pages (pagination). */
	useEffect(() => {
		const targetId = ensureOptionIfMissing;
		if (!countryId || !targetId?.trim()) {
			return;
		}
		const currentValue = (selectedCityId as string) || "";
		if (currentValue !== targetId) {
			return;
		}
		if (citySearchQuery.trim() !== "") {
			return;
		}
		if (cities.some((c) => c.id === targetId)) {
			autoLoadMoreCount.current = 0;
			return;
		}
		if (
			!hasMoreCities ||
			isLoadingMoreCities ||
			isLoadingCities ||
			isCitySearchLoading
		) {
			return;
		}
		if (autoLoadMoreCount.current >= MAX_AUTO_LOAD_MORE_PAGES) {
			return;
		}
		autoLoadMoreCount.current += 1;
		void handleLoadMoreCities();
	}, [
		countryId,
		ensureOptionIfMissing,
		cities,
		hasMoreCities,
		isLoadingMoreCities,
		isLoadingCities,
		isCitySearchLoading,
		citySearchQuery,
		handleLoadMoreCities,
		selectedCityId,
	]);

	const handleCitySearchChange = useCallback(
		async (query: string) => {
			if (!countryId) {
				return;
			}

			citySearchRequestId.current += 1;
			const requestId = citySearchRequestId.current;

			setCitySearchQuery(query);
			setCityCurrentPage(1);
			setCityTotalPages(1);
			setIsCitySearchLoading(true);

			try {
				const result = await getCitiesAPIAction({
					countryId,
					page: 1,
					pageSize: 50,
					search: query || undefined,
				});

				if (requestId !== citySearchRequestId.current) {
					return;
				}

				if (result.success && result.data) {
					setCities(result.data.data ?? []);
					setCityCurrentPage(result.data.current_page ?? 1);
					setCityTotalPages(result.data.total_pages ?? 1);
				}
			} finally {
				if (requestId === citySearchRequestId.current) {
					setIsCitySearchLoading(false);
				}
			}
		},
		[countryId],
	);

	const mapped = cities.map((c) => ({
		value: c.id,
		label: c.name,
		searchLabel: c.name,
	}));

	const missingId = ensureOptionIfMissing;
	const missingStillNotInList =
		Boolean(missingId) &&
		!mapped.some((o) => o.value === missingId);

	const missingDisplayLabel =
		ensureOptionLabelIfMissing ??
		(missingStillNotInList && (hasMoreCities || isLoadingMoreCities)
			? "Loading…"
			: missingStillNotInList
				? "—"
				: undefined);

	const selectedId = typeof selectedCityId === "string" ? selectedCityId : "";
	const selectedNotInMapped =
		Boolean(selectedId) &&
		!mapped.some((o) => o.value === selectedId) &&
		selectedCityLabelRef.current?.id === selectedId;

	const syntheticSelected =
		selectedNotInMapped && selectedCityLabelRef.current
			? {
				value: selectedCityLabelRef.current.id,
				label: selectedCityLabelRef.current.name,
				searchLabel: selectedCityLabelRef.current.name,
			}
			: null;

	const baseOptions =
		missingId && missingStillNotInList
			? [
				{
					value: missingId,
					label: missingDisplayLabel ?? missingId,
					searchLabel:
						ensureOptionLabelIfMissing ??
						missingDisplayLabel ??
						missingId,
				},
				...mapped,
			]
			: mapped;

	const rawCityOptions = syntheticSelected
		? [syntheticSelected, ...baseOptions]
		: baseOptions;

	// syntheticSelected and the ensureOptionIfMissing entry can both resolve to
	// the same city id at once (e.g. a search temporarily drops the pre-filled
	// city out of `mapped` while selectedCityLabelRef still remembers it) —
	// dedupe by value, keeping the first occurrence since syntheticSelected
	// (when present) carries the more accurate remembered label.
	const seenCityIds = new Set<string>();
	const cityOptions = rawCityOptions.filter((option) => {
		if (seenCityIds.has(option.value)) return false;
		seenCityIds.add(option.value);
		return true;
	});

	return (
		<FormSelect
			key={countryId ?? "city"}
			control={control}
			name={name}
			label={label}
			placeholder={placeholder}
			options={cityOptions}
			disabled={
				Boolean(disabled) ||
				Boolean(disableWhileLoading && isLoadingCities)
			}
			searchable
			onSearchChange={handleCitySearchChange}
			hasMore={hasMoreCities}
			isLoadingMore={isLoadingMoreCities}
			onLoadMore={handleLoadMoreCities}
			className={className}
			triggerClassName={triggerClassName}
		/>
	);
}
