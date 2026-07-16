"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/user";
import type { ArchivedProject, ApiQuoteItem } from "../types";
import { ArchivedProjectsTable } from "./ArchivedProjectsTable";
import { getProjectListAPIAction } from "@/api-actions";
import { resolveCompanyName } from "../utils/activeProject";
import { Loader2 } from "lucide-react";
import { MAX_PAGE_SIZE } from "@/constants/api";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.projectMyProjects },
	{ label: localizationConstants.archivedprojects },
];

export function ArchivedProjectList() {
	const t = useTranslate();
	const { query } = useQueryParams();

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [projects, setProjects] = useState<ArchivedProject[]>(
		DUMMY_ARCHIVED_PROJECTS,
	);

	const rows = useMemo(() => {
		if (!sortBy) return projects;

		const dir = sortOrder === "desc" ? -1 : 1;
		return [...projects].sort((a, b) => {
			const av = (a[sortBy as keyof ArchivedProject] ?? "").toString();
			const bv = (b[sortBy as keyof ArchivedProject] ?? "").toString();
			return av.localeCompare(bv) * dir;
		});
	}, [projects, sortBy, sortOrder]);

	const handleActivate = (project: ArchivedProject) => {
		setProjects((prev) => prev.filter((p) => p.id !== project.id));
		showToast("success", t(localizationConstants.projectActivatedSuccess));
	};

	const handleDelete = (project: ArchivedProject) => {
		setProjects((prev) => prev.filter((p) => p.id !== project.id));
		showToast("success", t(localizationConstants.projectDeletedSuccess));
	};

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.archivedprojects}
				breadcrumbs={BREADCRUMBS}
			/>
			<div className="px-5 pt-6 pb-5 flex-1">
				<ArchivedProjectsTable
					data={rows}
					onActivate={handleActivate}
					onDelete={handleDelete}
				/>
			</div>
		</div>
	);
}
