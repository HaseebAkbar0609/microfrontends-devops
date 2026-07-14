"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, ActionsToolbar } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/user";
import type { ActiveProject } from "../types";
import {
	ACTIVE_PROJECT_STATUS_FILTER_OPTIONS,
	DUMMY_PROJECTS,
} from "../constants";
import { ActiveProjectsTable } from "./ActiveProjectsTable";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.projectMyProjects },
	{ label: localizationConstants.projectmanagement },
];

const toolbarLinkClass =
	"bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors flex items-center text-sm font-medium";

export function ProjectList() {
	const t = useTranslate();
	const { search, changeQuery, query } = useQueryParams();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const statusFilter = query.get("status") || "";

	const [projects, setProjects] = useState<ActiveProject[]>(DUMMY_PROJECTS);

	const { pageRows, totalItems } = useMemo(() => {
		const q = search.trim().toLowerCase();
		let rows = projects;

		if (q) {
			rows = rows.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.referenceNo.toLowerCase().includes(q) ||
					(p.companyName ?? "").toLowerCase().includes(q),
			);
		}

		if (statusFilter) {
			rows = rows.filter((p) => p.status === statusFilter);
		}

		if (sortBy) {
			const dir = sortOrder === "desc" ? -1 : 1;
			rows = [...rows].sort((a, b) => {
				const av = (a[sortBy as keyof ActiveProject] ?? "").toString();
				const bv = (b[sortBy as keyof ActiveProject] ?? "").toString();
				return av.localeCompare(bv) * dir;
			});
		}

		const start = (page - 1) * pageSize;
		return {
			pageRows: rows.slice(start, start + pageSize),
			totalItems: rows.length,
		};
	}, [projects, search, statusFilter, sortBy, sortOrder, page, pageSize]);

	const handleArchive = (project: ActiveProject) => {
		setProjects((prev) => prev.filter((p) => p.id !== project.id));
		showToast("success", t(localizationConstants.projectArchivedSuccess));
	};

	const handleDelete = (project: ActiveProject) => {
		setProjects((prev) => prev.filter((p) => p.id !== project.id));
		showToast("success", t(localizationConstants.projectDeletedSuccess));
	};

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.projectmanagement}
				breadcrumbs={BREADCRUMBS}
			/>
			<ActionsToolbar
				searchValue={search}
				onSearchChange={(val) => changeQuery("search", val)}
				filters={[
					{
						label: localizationConstants.status,
						options: [...ACTIVE_PROJECT_STATUS_FILTER_OPTIONS],
						value: statusFilter || undefined,
						onFilterChange: (val) => changeQuery("status", val),
					},
				]}
				actions={
					<>
						<Link
							href="/business/offer/create"
							className={toolbarLinkClass}
						>
							<Plus className="h-4 w-4" />
							<Translate
								text={
									localizationConstants.projectNewOrderDirect
								}
							/>
						</Link>
						<Link
							href="/business/offer/create"
							className={toolbarLinkClass}
						>
							<Plus className="h-4 w-4" />
							<Translate
								text={localizationConstants.projectNewProject}
							/>
						</Link>
					</>
				}
			/>
			<div className="px-5 pb-5 flex-1">
				<ActiveProjectsTable
					data={pageRows}
					totalItems={totalItems}
					onArchive={handleArchive}
					onDelete={handleDelete}
				/>
			</div>
		</div>
	);
}
