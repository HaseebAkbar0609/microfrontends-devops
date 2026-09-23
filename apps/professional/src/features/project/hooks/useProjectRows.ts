"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";
import type { ProjectListItem } from "../data/projectsOverview.mock";
import {
	archiveProfessionalProject,
	deleteProfessionalProject,
	listProfessionalProjects,
} from "../services/professionalProjectService";
import { useProjectOverviewFilters } from "./useProjectOverviewFilters";

export type ProjectRowsMode = "list" | "archive";

const EMPTY_PROJECTS: ProjectListItem[] = [];

export function useProjectRows(mode: ProjectRowsMode) {
	const t = useTranslate();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { company, isAuthenticated } = useAuthStatus();
	const [deletingProject, setDeletingProject] = useState<ProjectListItem | null>(null);
	const [isMutating, setIsMutating] = useState(false);
	const archived = mode === "archive";
	const queryKey = ["professional-projects", company?.id, archived];
	const query = useQuery({
		queryKey,
		queryFn: () => listProfessionalProjects(archived),
		enabled: Boolean(company?.id && isAuthenticated),
		retry: false,
	});
	const projects = query.data ?? EMPTY_PROJECTS;
	const filters = useProjectOverviewFilters(projects);
	const filterOptions = useMemo(() => {
		const values = new Set<string>();
		for (const project of projects) {
			if (project.category) values.add(project.category);
			if (project.department) values.add(project.department);
		}
		return [...values];
	}, [projects]);

	const refresh = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: ["professional-projects", company?.id] });
	}, [company?.id, queryClient]);

	const openProject = useCallback(
		(project: ProjectListItem) => router.push(`${PROJECT_MODULE_BASE_URL}/${project.id}`),
		[router],
	);

	const toggleArchived = useCallback(async (project: ProjectListItem) => {
		if (isMutating) return;
		setIsMutating(true);
		try {
			await archiveProfessionalProject(project, !archived);
			await refresh();
			showToast("success", t(archived
				? localizationConstants.projectListRestoredToast
				: localizationConstants.projectListArchivedToast));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsMutating(false);
		}
	}, [archived, isMutating, refresh, t]);

	const requestDelete = useCallback((project: ProjectListItem) => {
		setTimeout(() => setDeletingProject(project), 0);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deletingProject || isMutating) return;
		setIsMutating(true);
		try {
			await deleteProfessionalProject(deletingProject);
			setDeletingProject(null);
			await refresh();
			showToast("success", t(localizationConstants.projectListDeletedToast));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsMutating(false);
		}
	}, [deletingProject, isMutating, refresh, t]);

	return {
		filters,
		filterOptions,
		openProject,
		toggleArchived,
		deletingProject,
		requestDelete,
		cancelDelete: () => setDeletingProject(null),
		confirmDelete,
		isLoading: query.isLoading,
		isError: query.isError,
		refresh: query.refetch,
		isMutating,
	};
}
