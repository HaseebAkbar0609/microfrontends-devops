"use client";

import { useEffect, useMemo, useState } from "react";
import {
	getActiveProjectsAPIAction,
	getProjectListAPIAction,
} from "@/api-actions";
import { projectMessages } from "@/constants/messages";
import {
	ACCEPTED_OFFER_QUOTE_STATUS,
	PROJECT_CREATION_MODE,
} from "@/features/quote/constants";
import type { ActiveProject } from "../types";
import {
	mergeProjectRows,
	sortProjectRows,
	type ProjectSortKey,
	type SortDirection,
} from "../utils/activeProject";

const PROJECT_LIST_QUERY = { page: 1, pageSize: 10 } as const;
/** Backend max for /project/active, which also returns requests whose offer is not yet accepted */
const ACTIVE_PROJECTS_LIMIT = 100;

/**
 * Aktiva projekt: accepted offers plus projects started from Projects (TFS-1202).
 * Sorting is client-side; the list API does not sort on these columns.
 */
export function useActiveProjectList() {
	const [rows, setRows] = useState<ActiveProject[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reloadKey, setReloadKey] = useState(0);
	const [sortKey, setSortKey] = useState<ProjectSortKey>("referenceNo");
	const [sortDir, setSortDir] = useState<SortDirection>("desc");

	useEffect(() => {
		let cancelled = false;
		async function loadProjects() {
			setLoading(true);
			setError(null);
			const [activeRes, acceptedRes, directRes] = await Promise.all([
				getActiveProjectsAPIAction({ limit: ACTIVE_PROJECTS_LIMIT }),
				getProjectListAPIAction({
					...PROJECT_LIST_QUERY,
					quote_status: ACCEPTED_OFFER_QUOTE_STATUS,
					creation_mode: PROJECT_CREATION_MODE.quoteFirst,
				}),
				getProjectListAPIAction({
					...PROJECT_LIST_QUERY,
					creation_mode: PROJECT_CREATION_MODE.directOrder,
				}),
			]);
			if (cancelled) return;

			const failed = [acceptedRes, directRes].find(
				(res) => !res.success || !res.data?.quotes,
			);
			if (failed) {
				setError(failed.error || projectMessages.load.listFailed);
			} else {
				// /project/active only enriches rows, so its failure still shows the list
				setRows(
					mergeProjectRows(
						[acceptedRes, directRes].flatMap(
							(res) => res.data?.quotes ?? [],
						),
						activeRes.success ? (activeRes.data?.data ?? []) : [],
					),
				);
			}
			setLoading(false);
		}

		void loadProjects();
		return () => {
			cancelled = true;
		};
	}, [reloadKey]);

	const projects = useMemo(
		() => sortProjectRows(rows, sortKey, sortDir),
		[rows, sortKey, sortDir],
	);

	function toggleSort(key: ProjectSortKey) {
		if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

	const reload = () => setReloadKey((k) => k + 1);

	return { projects, loading, error, sortKey, toggleSort, reload };
}
