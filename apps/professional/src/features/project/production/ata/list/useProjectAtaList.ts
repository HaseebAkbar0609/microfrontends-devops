"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { ataTotal } from "../ataMath";
import { linkedLabel, matchesAta, sortAtaRows, type AtaLabels, type AtaListRow } from "../ataView";
import {
	ATA_ATTESTED_LABELS,
	ATA_STATUSES,
	ATA_STATUS_META,
	type AtaListSortField,
} from "../projectAta.config";
import * as store from "../services/projectAtaService";
import type { AtaStatus, ProjectAta } from "../types";

export interface AtaEmptyState {
	titleKey: TranslationKeys;
	descriptionKey?: TranslationKeys;
}

/**
 * ÄTA - kund: search, the status filter, sorting, the summary box, and the
 * row menu's send and delete. Every change goes through the store and the list
 * is re-read from it.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * memoised labels and callbacks only change with the language.
 */
export function useProjectAtaList(projectId: string) {
	const { t, i18n } = useTranslation();
	const locale = i18n.language;
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	const [atas, setAtas] = useState(() => store.listAtas(projectId));
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<AtaStatus | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<AtaListSortField>();

	const labels = useMemo<AtaLabels>(
		() => ({
			status: (status) => t(ATA_STATUS_META[status].labelKey),
			attested: (attested) => t(ATA_ATTESTED_LABELS[attested]),
			number: (number) => t(localizationConstants.projectAtaLabel).replace("{number}", String(number)),
		}),
		[t],
	);

	const filterOptions = useMemo(
		() => ATA_STATUSES.map((value) => ({ value, label: labels.status(value) })),
		[labels],
	);

	const allRows = useMemo<AtaListRow[]>(
		() => atas.map((ata) => ({ ata, amount: ataTotal(ata.lineItems), linked: linkedLabel(ata) })),
		[atas],
	);

	const rows = useMemo(
		() =>
			sortAtaRows(
				allRows.filter((row) => matchesAta(row, filter, search, labels)),
				sortField,
				sortDir,
				labels,
				locale,
			),
		[allRows, filter, search, sortField, sortDir, labels, locale],
	);

	/** The grey box follows the rows on screen. */
	const summary = useMemo(
		() => ({ total: rows.reduce((sum, row) => sum + row.amount, 0), count: rows.length }),
		[rows],
	);

	const emptyState: AtaEmptyState =
		filter === null && !search.trim()
			? { titleKey: localizationConstants.projectAtaEmpty, descriptionKey: localizationConstants.projectAtaEmptyDesc }
			: { titleKey: localizationConstants.projectAtaNoMatches };

	/* The toolbar hands back its option value; only statuses are offered. */
	const changeFilter = useCallback((value: string | null) => setFilter(value as AtaStatus | null), []);

	const refresh = useCallback(() => setAtas(store.listAtas(projectId)), [projectId]);

	const send = useCallback(
		(ata: ProjectAta) => {
			const sent = store.sendAta(projectId, ata.id);
			refresh();
			showToast(sent ? "success" : "error", t(sent ? localizationConstants.ataSendSuccess : localizationConstants.projectAtaAlreadySent));
		},
		[projectId, refresh, t],
	);

	const remove = useCallback(
		(ata: ProjectAta) => {
			const removed = store.removeAta(projectId, ata.id);
			refresh();
			showToast(removed ? "success" : "error", t(removed ? localizationConstants.ataDeleteSuccess : localizationConstants.projectAtaLocked));
		},
		[projectId, refresh, t],
	);

	return {
		project,
		rows,
		summary,
		emptyState,
		search,
		setSearch,
		filter,
		setFilter: changeFilter,
		filterOptions,
		sortField,
		sortDir,
		onSort: toggleSort,
		labels,
		send,
		remove,
	};
}

export type ProjectAtaListState = ReturnType<typeof useProjectAtaList>;
