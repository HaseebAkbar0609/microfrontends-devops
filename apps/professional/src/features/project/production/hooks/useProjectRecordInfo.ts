"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { getProfessionalProject, saveProfessionalProject } from "../../services/professionalProjectService";
import { projectRecordFromApi } from "../projectRecordFromApi";
import type { ProjectInfoSectionKey, ProjectRecordInfo } from "../types";

export function useProjectRecordInfo(projectId: string) {
	const t = useTranslate();
	const { company, isAuthenticated } = useAuthStatus();
	const queryClient = useQueryClient();
	const [editing, setEditing] = useState<ProjectInfoSectionKey | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const queryKey = useMemo(
		() => ["professional-project", company?.id, projectId],
		[company?.id, projectId],
	);
	const query = useQuery({
		queryKey,
		queryFn: () => getProfessionalProject(projectId),
		enabled: Boolean(company?.id && isAuthenticated && projectId),
		retry: false,
	});
	const info = useMemo(
		() => query.data ? projectRecordFromApi(query.data, company) : null,
		[query.data, company],
	);
	const closeEditor = useCallback(() => setEditing(null), []);

	const saveSection = useCallback(async (
		section: ProjectInfoSectionKey,
		values: Partial<
			ProjectRecordInfo["customer"] &
			ProjectRecordInfo["contactPerson"] &
			ProjectRecordInfo["details"]
		>,
	) => {
		const record = query.data;
		if (!record || isSaving) return;
		const data = { ...record.data };
		if (section === "customer") data.customer = { ...data.customer, ...values };
		else if (section === "contact") data.contactPerson = { ...data.contactPerson, ...values };
		else data.details = { ...data.details, ...values };
		setIsSaving(true);
		try {
			const updated = await saveProfessionalProject(data, record.isDraft, {
				id: record.id,
				version: record.version,
			});
			queryClient.setQueryData(queryKey, updated);
			await queryClient.invalidateQueries({ queryKey: ["professional-projects", company?.id] });
			setEditing(null);
			showToast("success", t(localizationConstants.toastChangesSaved));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSaving(false);
		}
	}, [company?.id, isSaving, query.data, queryClient, queryKey, t]);

	const unsupportedDocumentEdit = useCallback(() => {
		showToast("error", t(localizationConstants.genericError));
	}, [t]);

	return {
		info,
		editing,
		setEditing,
		closeEditor,
		saveSection,
		renameDocument: unsupportedDocumentEdit,
		removeDocument: unsupportedDocumentEdit,
		isLoading: query.isLoading || !company,
		isError: query.isError,
		refresh: query.refetch,
		isSaving,
	};
}
