"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";
import type { ProjectListItem } from "../data/projectsOverview.mock";
import {
	archiveProject,
	listArchivedProjects,
	listProjects,
	removeProject,
	restoreProject,
} from "../services/projectOverviewService";
import { useProjectOverviewFilters } from "./useProjectOverviewFilters";

/** Which half of the collection a screen shows, and what its row menu offers. */
export type ProjectRowsMode = "list" | "archive";

/**
 * Rows, filters and row actions for a project table.
 *
 * Shared by the active list and Arkiv so the two cannot drift: one place
 * decides what archiving does, what deleting asks first, and where Öppna goes.
 *
 * Archiving and restoring are not confirmed — both are reversible, and the
 * whole point of the archive is that a row can come back. Deleting is
 * permanent, so it is.
 */
export function useProjectRows(mode: ProjectRowsMode) {
	const t = useTranslate();
	const router = useRouter();

	const read = useCallback(
		() => (mode === "archive" ? listArchivedProjects() : listProjects()),
		[mode],
	);

	const [projects, setProjects] = useState<ProjectListItem[]>(read);
	const [deletingProject, setDeletingProject] =
		useState<ProjectListItem | null>(null);

	const filters = useProjectOverviewFilters(projects);

	/** Options come from the rows themselves rather than a list that can drift. */
	const filterOptions = useMemo(() => {
		const values = new Set<string>();
		for (const project of projects) {
			values.add(project.category);
			values.add(project.department);
		}
		return [...values];
	}, [projects]);

	const openProject = useCallback(
		(project: ProjectListItem) =>
			router.push(`${PROJECT_MODULE_BASE_URL}/${project.id}`),
		[router],
	);

	/**
	 * Moves the row to the other list.
	 *
	 * Both directions re-read through the service rather than filtering local
	 * state, so the row that left is gone and nothing has to be kept in sync
	 * by hand.
	 */
	const toggleArchived = useCallback(
		(project: ProjectListItem) => {
			if (mode === "archive") {
				restoreProject(project.id);
				showToast(
					"success",
					t(localizationConstants.projectListRestoredToast),
				);
			} else {
				archiveProject(project.id);
				showToast(
					"success",
					t(localizationConstants.projectListArchivedToast),
				);
			}
			setProjects(read());
		},
		[mode, read, t],
	);

	/**
	 * Radix leaves `pointer-events: none` on `<body>` when a dialog opens in the
	 * same tick a dropdown item closes — the two modal layers unwind together.
	 * Deferring by one macrotask lets the menu finish first.
	 *
	 * A timeout rather than `requestAnimationFrame`, which the purchase module
	 * uses for the same fix: rAF only runs when the document is painting, so in
	 * a backgrounded or occluded page the callback never fires and clicking
	 * Radera does nothing at all. A timeout fires either way.
	 */
	const requestDelete = useCallback((project: ProjectListItem) => {
		setTimeout(() => setDeletingProject(project), 0);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!deletingProject) return;
		removeProject(deletingProject.id);
		setDeletingProject(null);
		setProjects(read());
		showToast("success", t(localizationConstants.projectListDeletedToast));
	}, [deletingProject, read, t]);

	return {
		filters,
		filterOptions,
		openProject,
		toggleArchived,
		deletingProject,
		requestDelete,
		cancelDelete: () => setDeletingProject(null),
		confirmDelete,
	};
}
