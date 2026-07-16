"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, ActionsToolbar } from "@/components/common";
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
	const { search, changeQuery, query } = useQueryParams();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [projects, setProjects] = useState<ArchivedProject[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function fetchArchived() {
			setLoading(true);
			const res = await getProjectListAPIAction({ page: 1, pageSize: MAX_PAGE_SIZE, quote_status: "archived" });
			if (cancelled) return;
			if (res.success && res.data?.quotes) {
				const mapped: ArchivedProject[] = res.data.quotes.map((q: ApiQuoteItem) => ({
					id: q.project_id || q.id || "",
					name: q.project_name || q.projectName || "Archived Project",
					referenceNo: q.ref_no || q.refNo || q.id?.substring(0, 8).toUpperCase() || "-",
					clientNo: q.client_no || q.clientNo || "-",
					projectNo: q.ref_no || q.refNo || "-",
					startDate: "-",
					endDate: "-",
					contactPersonName: "-",
					mobileNumber: "-",
					email: "-",
					address: "-",
					postalCode: "-",
					companyName: q.company_name || q.companyName || resolveCompanyName({}, q.project_name || q.projectName),
					status: "archived",
					category: q.category || "-",
					archivedDate: q.created_at || "-",
				}));
				setProjects(mapped);
			} else {
				setProjects([]);
			}
			setLoading(false);
		}
		void fetchArchived();
		return () => {
			cancelled = true;
		};
	}, []);

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

		if (sortBy) {
			const dir = sortOrder === "desc" ? -1 : 1;
			rows = [...rows].sort((a, b) => {
				const av = (
					a[sortBy as keyof ArchivedProject] ?? ""
				).toString();
				const bv = (
					b[sortBy as keyof ArchivedProject] ?? ""
				).toString();
				return av.localeCompare(bv) * dir;
			});
		}

		const start = (page - 1) * pageSize;
		return {
			pageRows: rows.slice(start, start + pageSize),
			totalItems: rows.length,
		};
	}, [projects, search, sortBy, sortOrder, page, pageSize]);

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
			<ActionsToolbar
				searchValue={search}
				onSearchChange={(val) => changeQuery("search", val)}
			/>
			<div className="px-5 pb-5 flex-1">
				{loading ? (
					<div className="flex items-center justify-center p-16">
						<Loader2 className="h-8 w-8 animate-spin text-slate-500" role="status" aria-label="Loading archived projects" />
					</div>
				) : (
					<ArchivedProjectsTable
						data={pageRows}
						totalItems={totalItems}
						onActivate={handleActivate}
						onDelete={handleDelete}
					/>
				)}
			</div>
		</div>
	);
}
