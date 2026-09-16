"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { inspectionLabel, matchesInspection, sortInspections } from "../inspectionView";
import {
	INSPECTION_ARCHIVED_FILTER,
	INSPECTION_TYPE_LABELS,
	INSPECTION_TYPES,
	type InspectionSortField,
} from "../projectInspection.config";
import * as store from "../services/projectInspectionService";
import type { InspectionInput, InspectionType, ProjectInspection } from "../types";

export interface InspectionEmptyState {
	titleKey: TranslationKeys;
	descriptionKey?: TranslationKeys;
}

/**
 * The Besiktning list: search, the type / Arkiverade filter, sorting, and the
 * changes the row menu and dialog make. Every change goes through the store and
 * the list is re-read from it, so the table never drifts from what is stored.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * memoised labels and callbacks only change with the language.
 */
export function useProjectInspectionList(projectId: string) {
	const { t, i18n } = useTranslation();
	const locale = i18n.language;
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	const [inspections, setInspections] = useState(() => store.listInspections(projectId));
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<InspectionSortField>();

	const typeLabel = useCallback((type: InspectionType) => t(INSPECTION_TYPE_LABELS[type]), [t]);

	const filterOptions = useMemo(
		() => [
			...INSPECTION_TYPES.map((value) => ({ value, label: typeLabel(value) })),
			{ value: INSPECTION_ARCHIVED_FILTER, label: t(localizationConstants.projectInspectionFilterArchived) },
		],
		[t, typeLabel],
	);

	const rows = useMemo(
		() =>
			sortInspections(
				inspections.filter((row) => matchesInspection(row, filter, search, typeLabel)),
				sortField,
				sortDir,
				typeLabel,
				locale,
			),
		[inspections, filter, search, sortField, sortDir, typeLabel, locale],
	);

	const hasQuery = search.trim().length > 0;
	const emptyState: InspectionEmptyState =
		filter === INSPECTION_ARCHIVED_FILTER && !hasQuery
			? { titleKey: localizationConstants.projectInspectionArchivedEmpty }
			: filter === null && !hasQuery
				? {
						titleKey: localizationConstants.inspectionEmptyState,
						descriptionKey: localizationConstants.inspectionEmptyStateDesc,
					}
				: { titleKey: localizationConstants.projectInspectionNoMatches };

	const refresh = useCallback(() => setInspections(store.listInspections(projectId)), [projectId]);

	/** Adds or updates. A new row the current filter or search would hide clears them, so it shows. */
	const save = useCallback(
		(input: InspectionInput, id?: string) => {
			if (id) {
				store.updateInspection(projectId, id, input);
				showToast("success", t(localizationConstants.inspectionUpdatedSuccess));
			} else {
				const created = store.createInspection(projectId, input);
				if (!matchesInspection(created, filter, search, typeLabel)) {
					setFilter(null);
					setSearch("");
				}
				showToast("success", t(localizationConstants.inspectionCreatedSuccess));
			}
			refresh();
		},
		[projectId, filter, search, typeLabel, refresh, t],
	);

	/** Reversible, so no confirm — as Fråga/Svar archives. */
	const toggleArchive = useCallback(
		(row: ProjectInspection) => {
			store.setInspectionArchived(projectId, row.id, !row.archived);
			refresh();
			showToast(
				"success",
				t(
					row.archived
						? localizationConstants.projectInspectionRestoredToast
						: localizationConstants.projectInspectionArchivedToast,
				),
			);
		},
		[projectId, refresh, t],
	);

	const remove = useCallback(
		(row: ProjectInspection) => {
			store.removeInspection(projectId, row.id);
			refresh();
			showToast("success", t(localizationConstants.projectInspectionDeletedToast));
		},
		[projectId, refresh, t],
	);

	const labelOf = useCallback((row: ProjectInspection) => inspectionLabel(row, typeLabel), [typeLabel]);

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
		typeLabel,
		labelOf,
		save,
		toggleArchive,
		remove,
	};
}

export type ProjectInspectionListState = ReturnType<typeof useProjectInspectionList>;
