"use client";

import { useCallback, useMemo, useState } from "react";

import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { buildProjectStaffLedger } from "../data/projectStaffLedger.mock";
import type { StaffLedgerSortField } from "../staffLedgerColumns";
import type { StaffLedgerEntry } from "../types";

/** The dropdown's "all suppliers" option, which is not a supplier name. */
export const SUPPLIER_FILTER_ALL = "all";

/** The widest span the seeded entries cover, so the screen opens with data. */
function seededRange(entries: StaffLedgerEntry[]): {
	from: string;
	to: string;
} {
	if (entries.length === 0) return { from: "", to: "" };
	const dates = entries.map((entry) => entry.date).sort();
	return { from: dates[0], to: dates[dates.length - 1] };
}

/**
 * The ledger's entries, and everything done to them before they are drawn.
 *
 * Everything stays in memory. Every row is a named person and a national ID
 * number, so nothing here — not the entries and not the filter state — reaches
 * `localStorage`, per AGENTS.md rule 6. `rotRutRepository.ts` writes unmasked
 * personnummer to `localStorage` as plain JSON today; that is the pattern this
 * avoids.
 *
 * The date range opens on the span the seeded entries cover rather than on
 * today: a real ledger would default to today, but against seeded data that
 * renders an empty table on every visit. Flagged on the ticket. Either way the
 * default must not be computed with `new Date()` during render, which differs
 * between the server and the client.
 */
export function useProjectStaffLedger(projectId: string) {
	const [entries] = useState<StaffLedgerEntry[] | null>(() =>
		buildProjectStaffLedger(projectId),
	);

	const all = useMemo(() => entries ?? [], [entries]);
	const defaultRange = useMemo(() => seededRange(all), [all]);

	const [supplier, setSupplierState] = useState(SUPPLIER_FILTER_ALL);
	const [dateFrom, setDateFromState] = useState(defaultRange.from);
	const [dateTo, setDateToState] = useState(defaultRange.to);
	const [onSiteOnly, setOnSiteOnlyState] = useState(false);
	const { sortField, sortDir, toggleSort } =
		useTableSort<StaffLedgerSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	/** A range the wrong way round matches nothing; say so rather than show it. */
	const dateRangeInvalid = Boolean(dateFrom && dateTo && dateTo < dateFrom);

	const filtered = useMemo(() => {
		if (dateRangeInvalid) return [];

		return all.filter((entry) => {
			if (supplier !== SUPPLIER_FILTER_ALL && entry.supplier !== supplier)
				return false;
			if (dateFrom && entry.date < dateFrom) return false;
			if (dateTo && entry.date > dateTo) return false;
			/* Still on site: checked in, never checked out. */
			if (onSiteOnly && entry.loggedOut) return false;
			return true;
		});
	}, [all, supplier, dateFrom, dateTo, onSiteOnly, dateRangeInvalid]);

	const ordered = useMemo(
		() =>
			sortItems(filtered, sortField, sortDir, (entry, field) =>
				String(entry[field as StaffLedgerSortField]),
			),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
	/* Derived, not corrected in an effect: no second render, no hydration
	   surface. `useProjectOverviewFilters` omits this and can leave the reader
	   on a page past the end. */
	const safePage = Math.min(page, totalPages);

	const rows = useMemo(
		() => ordered.slice((safePage - 1) * pageSize, safePage * pageSize),
		[ordered, safePage, pageSize],
	);

	/** Only the suppliers present, so the dropdown cannot offer an empty result. */
	const supplierOptions = useMemo(
		() =>
			Array.from(
				new Set(all.map((entry) => entry.supplier).filter(Boolean)),
			).sort(),
		[all],
	);

	const setSupplier = useCallback((value: string) => {
		setSupplierState(value);
		setPage(1);
	}, []);

	const setDateFrom = useCallback((value: string) => {
		setDateFromState(value);
		setPage(1);
	}, []);

	const setDateTo = useCallback((value: string) => {
		setDateToState(value);
		setPage(1);
	}, []);

	const setOnSiteOnly = useCallback((value: boolean) => {
		setOnSiteOnlyState(value);
		setPage(1);
	}, []);

	const setPageSize = useCallback((size: number) => {
		setPageSizeState(size);
		setPage(1);
	}, []);

	/* Sorting from page 3 would otherwise show a different slice of a reordered
	   list — the bug `useProjectOverviewFilters` has, which resets on search and
	   filter but not on sort. */
	const onSort = useCallback(
		(field: string) => {
			toggleSort(field as StaffLedgerSortField);
			setPage(1);
		},
		[toggleSort],
	);

	return {
		/** `null` only for an id that matches no project — the page 404s. */
		exists: entries !== null,
		/** True when nobody has checked in yet, before any filtering. */
		isEmpty: all.length === 0,
		rows,
		supplier,
		setSupplier,
		supplierOptions,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		dateRangeInvalid,
		onSiteOnly,
		setOnSiteOnly,
		sortField,
		sortDir,
		onSort,
		page: safePage,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
	};
}
