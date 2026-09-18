"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import type { WarrantySortField } from "../projectWarranty.config";
import * as store from "../services/projectWarrantyService";
import type { WarrantyCommitment, WarrantyCommitmentInput } from "../types";
import { matchesCommitment, sortCommitments, yearsOf } from "../warrantyView";

export interface WarrantyEmptyState {
	titleKey: TranslationKeys;
	descriptionKey?: TranslationKeys;
}

/**
 * Garantiåtaganden: search, the year filter, sorting, and the changes the
 * dialog and the row menu make. Every change goes through the store and the
 * list is re-read from it, so the table never drifts from what is stored.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * memoised values and callbacks only change with the language.
 */
export function useProjectWarrantyList(projectId: string) {
	const { t, i18n } = useTranslation();
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	const [commitments, setCommitments] = useState(() => store.listCommitments(projectId));
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<WarrantySortField>();

	const filterOptions = useMemo(() => yearsOf(commitments), [commitments]);

	const rows = useMemo(
		() =>
			sortCommitments(
				commitments.filter((row) => matchesCommitment(row, filter, search)),
				sortField,
				sortDir,
				i18n.language,
			),
		[commitments, filter, search, sortField, sortDir, i18n.language],
	);

	const narrowed = Boolean(search.trim()) || filter !== null;
	const emptyState: WarrantyEmptyState = narrowed
		? { titleKey: localizationConstants.projectWarrantyNoMatches }
		: {
				titleKey: localizationConstants.projectWarrantyEmpty,
				descriptionKey: localizationConstants.projectWarrantyEmptyDesc,
			};

	const refresh = useCallback(() => setCommitments(store.listCommitments(projectId)), [projectId]);

	/** Adds or updates. A new row the search or filter would hide clears them, so it shows. */
	const save = useCallback(
		(input: WarrantyCommitmentInput, id?: string) => {
			const saved = id ? store.updateCommitment(projectId, id, input) : store.createCommitment(projectId, input);
			if (!saved) return;

			if (!matchesCommitment(saved, filter, search)) {
				setFilter(null);
				setSearch("");
			}
			refresh();
			showToast("success", t(localizationConstants.projectWarrantySavedToast));
		},
		[projectId, filter, search, refresh, t],
	);

	const remove = useCallback(
		(row: WarrantyCommitment) => {
			store.removeCommitment(projectId, row.id);
			refresh();
			showToast("success", t(localizationConstants.projectWarrantyDeletedToast));
		},
		[projectId, refresh, t],
	);

	return {
		project,
		rows,
		emptyState,
		search,
		setSearch,
		filter,
		setFilter,
		filterOptions,
		sortField,
		sortDir,
		onSort: toggleSort,
		save,
		remove,
	};
}

export type ProjectWarrantyListState = ReturnType<typeof useProjectWarrantyList>;
