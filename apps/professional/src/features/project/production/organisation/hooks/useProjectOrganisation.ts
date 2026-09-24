"use client";

import { useCallback, useMemo, useState } from "react";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { buildProjectOrganisation } from "../data/projectOrganisation.mock";
import { ORGANISATION_GROUPS } from "../organisationGroups.config";
import {
	ORGANISATION_SEARCH_FIELDS,
	type OrganisationSortField,
} from "../organisationColumns";
import type { OrganisationGroupRows, OrganisationMember } from "../types";

/**
 * The organisation's rows, and everything done to them before they are drawn.
 *
 * Rows are held flat with a `group` on each, not nested per group. The order
 * module nests them and pays for it twice: its delete has to rebuild every
 * group, and its filter returns an emptied group rather than removing it, so
 * choosing one party leaves four headers on screen with three of them empty.
 *
 * Edits stay in memory, as `useProjectRecordInfo` does — there is no projects
 * endpoint, and nothing is written to `localStorage`: these rows carry names,
 * addresses and e-mail addresses, which AGENTS.md rule 6 keeps out of browser
 * storage. A deleted row therefore returns on reload.
 */
export function useProjectOrganisation(projectId: string) {
	const t = useTranslate();

	const [members, setMembers] = useState<OrganisationMember[] | null>(() =>
		buildProjectOrganisation(projectId),
	);
	const [search, setSearchState] = useState("");
	const [filter, setFilterState] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } =
		useTableSort<OrganisationSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const all = useMemo(() => members ?? [], [members]);

	/**
	 * Search reads only the columns the table draws.
	 *
	 * Not `Object.values(row).some(...)`, which the order module uses: that also
	 * matches `id`, so typing a digit matches a row whose id happens to contain
	 * it.
	 */
	const matched = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = all;

		if (term) {
			rows = rows.filter((row) =>
				ORGANISATION_SEARCH_FIELDS.some((field) =>
					row[field].toLowerCase().includes(term),
				),
			);
		}
		if (filter) rows = rows.filter((row) => row.roll === filter);

		return rows;
	}, [all, search, filter]);

	/**
	 * Sorted group by group, then concatenated in the groups' own order.
	 *
	 * One sort field and direction for the whole screen, because there is one
	 * paginator: a per-group sort would reorder rows underneath a page window
	 * computed from a different order. Sorting *within* each group rather than
	 * across the flat list keeps a group contiguous, so it cannot appear on page
	 * 1, vanish on page 2 and come back on page 3.
	 */
	const ordered = useMemo(
		() =>
			ORGANISATION_GROUPS.flatMap((group) =>
				sortItems(
					matched.filter((row) => row.group === group.id),
					sortField,
					sortDir,
					(row, field) => String(row[field as OrganisationSortField]),
				),
			),
		[matched, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
	/* Deleting the last row of the last page would otherwise leave the page
	   number past the end, showing nothing at all. Derived rather than corrected
	   in an effect, so there is no second render and no hydration surface. */
	const safePage = Math.min(page, totalPages);

	/** Only the current page's rows, partitioned back into their groups. */
	const groups = useMemo<OrganisationGroupRows[]>(() => {
		const pageRows = ordered.slice(
			(safePage - 1) * pageSize,
			safePage * pageSize,
		);

		return ORGANISATION_GROUPS.map((group) => ({
			id: group.id,
			titleKey: group.titleKey,
			rows: pageRows.filter((row) => row.group === group.id),
		})).filter((group) => group.rows.length > 0);
	}, [ordered, safePage, pageSize]);

	/** The roles present, so the dropdown cannot offer one that matches nothing. */
	const filterOptions = useMemo(
		() => Array.from(new Set(all.map((row) => row.roll))),
		[all],
	);

	const setSearch = useCallback((value: string) => {
		setSearchState(value);
		setPage(1);
	}, []);

	const setFilter = useCallback((value: string | null) => {
		setFilterState(value);
		setPage(1);
	}, []);

	const setPageSize = useCallback((size: number) => {
		setPageSizeState(size);
		setPage(1);
	}, []);

	/* Sorting from page 3 would otherwise show a different slice of a reordered
	   list. `useProjectOverviewFilters` resets on search and filter but not on
	   sort, which is the same bug with a smaller blast radius. */
	const onSort = useCallback(
		(field: string) => {
			toggleSort(field as OrganisationSortField);
			setPage(1);
		},
		[toggleSort],
	);

	const removeMember = useCallback(
		(id: string) => {
			setMembers((previous) =>
				previous ? previous.filter((row) => row.id !== id) : previous,
			);
			showToast(
				"success",
				t(localizationConstants.projectOrgDeletedToast),
			);
		},
		[t],
	);

	return {
		/** `null` only for an id that matches no project — the page 404s. */
		exists: members !== null,
		/** True when the project has no organisation at all, before filtering. */
		isEmpty: all.length === 0,
		groups,
		filterOptions,
		search,
		setSearch,
		filter,
		setFilter,
		sortField,
		sortDir,
		onSort,
		page: safePage,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		matchCount: ordered.length,
		removeMember,
	};
}
