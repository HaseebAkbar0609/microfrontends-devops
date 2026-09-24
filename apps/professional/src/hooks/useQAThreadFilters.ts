"use client";

import { useCallback, useMemo, useState } from "react";

import type { QAThreadStatus } from "@/components/common/QAThreadColumn";

/** What a Fråga/Svar row has to carry for the board's filters to read it. */
export interface QAThreadFilterRow {
	sender: string;
	message: string;
	/** Drives the Företag chip. */
	company: string;
	/** Drives the Kund chip — the role shown beside the sender. */
	badge: string;
	status: QAThreadStatus;
	archived: boolean;
}

/** Adds or removes a value, for the multi-select filter chips. */
function toggleIn<T>(list: T[], value: T): T[] {
	return list.includes(value)
		? list.filter((item) => item !== value)
		: [...list, value];
}

/** Distinct, non-empty values, sorted, for a chip's options. */
function optionsOf(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
	);
}

/**
 * Search and chip state for a Fråga/Svar board, and the rows it lets through.
 *
 * Lifted out of the purchase board so the project record's board filters the
 * same way. Every filter here actually narrows the list — the b2b board keeps
 * its chips in state and never reads them.
 *
 * @param rows every question, both tabs included.
 * @param matches an extra predicate for filters a board adds on top (the
 *   project board's Typ / Funktion). Applied to the rows but not to the chip
 *   options, so narrowing it cannot make a chip's other values disappear.
 *   Memoise it: it is a dependency of the filtered list.
 */
export function useQAThreadFilters<T extends QAThreadFilterRow>(
	rows: T[],
	matches?: (row: T) => boolean,
) {
	const [search, setSearch] = useState("");
	const [companies, setCompanies] = useState<string[]>([]);
	const [roles, setRoles] = useState<string[]>([]);
	const [statuses, setStatuses] = useState<QAThreadStatus[]>([]);
	/**
	 * Bumped by `resetFilters`, for a caller to use as its search box's `key`.
	 *
	 * The shared `Search` debounces 500 ms and pushes its debounced value up
	 * whenever that value differs from the prop. Clearing the prop while the
	 * box still holds text makes that condition true on the very next render,
	 * so the old query is pushed straight back. Remounting the input sidesteps
	 * the race without reaching into a shared component.
	 */
	const [resetToken, setResetToken] = useState(0);

	/** Options come from the rows, not a hard-coded list that can drift. */
	const companyOptions = useMemo(
		() => optionsOf(rows.map((row) => row.company)),
		[rows],
	);

	const roleOptions = useMemo(
		() => optionsOf(rows.map((row) => row.badge)),
		[rows],
	);

	/** Everything the filters allow, both tabs' rows included. */
	const visible = useMemo(() => {
		const query = search.trim().toLowerCase();

		return rows.filter((row) => {
			if (query) {
				const haystack = `${row.sender} ${row.message}`.toLowerCase();
				if (!haystack.includes(query)) return false;
			}

			if (companies.length > 0 && !companies.includes(row.company)) {
				return false;
			}

			if (roles.length > 0 && !roles.includes(row.badge)) return false;

			if (statuses.length > 0 && !statuses.includes(row.status)) {
				return false;
			}

			return matches ? matches(row) : true;
		});
	}, [companies, matches, roles, rows, search, statuses]);

	/**
	 * Rows for one column of one tab.
	 *
	 * The archived split is applied here rather than held in state, so the All
	 * and Arkiv boards can share a single instance — with one each they kept
	 * separate copies of the list, and archiving on All never reached Arkiv.
	 */
	const inColumn = useCallback(
		(status: QAThreadStatus, archivedOnly: boolean) =>
			visible.filter(
				(row) => row.status === status && row.archived === archivedOnly,
			),
		[visible],
	);

	const toggleCompany = useCallback(
		(value: string) => setCompanies((prev) => toggleIn(prev, value)),
		[],
	);

	const toggleRole = useCallback(
		(value: string) => setRoles((prev) => toggleIn(prev, value)),
		[],
	);

	const toggleStatus = useCallback(
		(value: QAThreadStatus) => setStatuses((prev) => toggleIn(prev, value)),
		[],
	);

	const resetFilters = useCallback(() => {
		setResetToken((token) => token + 1);
		setSearch("");
		setCompanies([]);
		setRoles([]);
		setStatuses([]);
	}, []);

	const hasFilters =
		search.trim().length > 0 ||
		companies.length > 0 ||
		roles.length > 0 ||
		statuses.length > 0;

	return {
		search,
		setSearch,
		resetToken,
		companies,
		roles,
		statuses,
		companyOptions,
		roleOptions,
		toggleCompany,
		toggleRole,
		toggleStatus,
		resetFilters,
		hasFilters,
		inColumn,
	};
}
