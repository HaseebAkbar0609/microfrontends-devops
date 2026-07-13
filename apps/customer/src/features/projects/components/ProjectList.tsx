"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Search,
  CalendarDays,
  ChevronRight,
  FolderX,
  // Loader2, // TODO: re-enable when API integration is active
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BreadcrumbItem } from "@/types/user";
import type { ActiveProject } from "../types";
import { cn } from "@/lib/utils";
import { DUMMY_PROJECTS } from "../constants";
// TODO: re-enable when API integration is confirmed working
// import { useEffect, useCallback } from "react";
// import { getActiveProjectsAPIAction } from "@/api-actions/project/active";
// import type { ActiveProjectItem } from "@/api-actions/project/active";
// import { resolveCompanyName } from "../utils/activeProject";

type SortOption = "updatedAt_desc" | "dueDate_asc" | "name_asc";

// type ApiActiveProject = ActiveProjectItem; // TODO: re-enable with API integration

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.projectmanagement },
];

const statusBadgeClass: Record<ActiveProject["status"], string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  "on-hold": "bg-yellow-50 text-yellow-700 border-yellow-200",
  completed: "bg-slate-100 text-slate-500 border-slate-200",
};

// TODO: re-enable when API integration is confirmed working
// function mapApiActiveProjectToFrontend(item: ApiActiveProject): ActiveProject {
//   const statusValue = (item.status ?? "").toLowerCase();
//   const companyName = resolveCompanyName(item, item.id);
//   return {
//     id: item.id,
//     name: item.name ?? "Unnamed project",
//     referenceNo: item.projectCode || item.id.substring(0, 8).toUpperCase(),
//     clientNo: "",
//     projectNo: "",
//     startDate: item.startDate || "-",
//     endDate: item.dueDate || "-",
//     contactPersonName: item.primaryContact?.name || "-",
//     mobileNumber: "",
//     email: "",
//     address: "",
//     postalCode: "",
//     companyName,
//     status: statusValue === "active" ? "active" : statusValue === "on-hold" ? "on-hold" : "completed",
//     statusLabel: item.statusLabel,
//     progressPercent: item.progressPercent,
//     updatedAt: item.updatedAt,
//     primaryContact: item.primaryContact,
//     summary: item.summary,
//     category: "Construction",
//     description: "",
//   };
// }

function ProjectCard({ project }: { project: ActiveProject }) {
  return (
    <Link
      href={`/projectmanagement/${project.id}`}
      className="group block bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
          <FolderOpen className="h-5 w-5 text-slate-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                REF- {project.referenceNo} · {project.category}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize text-xs font-medium",
                  statusBadgeClass[project.status],
                )}
              >
                {project.statusLabel || project.status.replace("-", " ")}
              </Badge>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>

          {project.description && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {project.startDate}
            </span>
            <span>→</span>
            <span>{project.endDate}</span>
            <span className="ml-auto text-slate-400">
              {project.companyName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// TODO: re-enable when API integration is confirmed working
// function mapApiActiveProjectToFrontend(item: ApiActiveProject): ActiveProject {
//   const statusValue = (item.status ?? "").toLowerCase();
//   const companyName = resolveCompanyName(item, item.id);
//   return {
//     id: item.id,
//     name: item.name ?? "Unnamed project",
//     referenceNo: item.projectCode || item.id.substring(0, 8).toUpperCase(),
//     clientNo: "",
//     projectNo: "",
//     startDate: item.startDate || "-",
//     endDate: item.dueDate || "-",
//     contactPersonName: item.primaryContact?.name || "-",
//     mobileNumber: "",
//     email: "",
//     address: "",
//     postalCode: "",
//     companyName,
//     status: statusValue === "active" ? "active" : statusValue === "on-hold" ? "on-hold" : "completed",
//     statusLabel: item.statusLabel,
//     progressPercent: item.progressPercent,
//     updatedAt: item.updatedAt,
//     primaryContact: item.primaryContact,
//     summary: item.summary,
//     category: "Construction",
//     description: "",
//   };
// }

export function ProjectList() {
  const [search, setSearch] = useState("");
  const [projects] = useState<ActiveProject[]>(DUMMY_PROJECTS);
  const [sort, setSort] = useState<SortOption>("updatedAt_desc");

  // TODO: re-enable when API integration is confirmed working
  // const [loading, setLoading] = useState(true);
  // const [loadingMore, setLoadingMore] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [nextCursor, setNextCursor] = useState<string | null>(null);
  // const [hasNextPage, setHasNextPage] = useState(false);
  //
  // const loadProjects = useCallback(
  //   async (cursorVal: string | null = null, isReset = false) => {
  //     if (isReset) { setLoading(true); } else { setLoadingMore(true); }
  //     const res = await getActiveProjectsAPIAction({ limit: 30, cursor: cursorVal || undefined, sort });
  //     if (res.success && res.data) {
  //       const mapped = res.data.data.map(mapApiActiveProjectToFrontend);
  //       if (isReset) { setProjects(mapped); } else { setProjects((prev) => [...prev, ...mapped]); }
  //       setNextCursor(res.data.pageInfo.nextCursor);
  //       setHasNextPage(res.data.pageInfo.hasNextPage);
  //       setError(null);
  //     } else {
  //       setError(res.error || "Failed to load projects");
  //     }
  //     setLoading(false);
  //     setLoadingMore(false);
  //   },
  //   [sort],
  // );
  //
  // useEffect(() => { loadProjects(null, true); }, [loadProjects]);
  //
  // const handleLoadMore = () => {
  //   if (hasNextPage && nextCursor) { loadProjects(nextCursor, false); }
  // };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.projectmanagement}
        breadcrumbs={BREADCRUMBS}
      />

      <div className="p-6 space-y-4 flex-1">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="updatedAt_desc">Latest Updated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="dueDate_asc">Due Date (Earliest)</option>
            </select>
          </div>
        </div>

        {/* Project cards */}
        {/* TODO: re-enable loading/error states when API integration is active
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FolderX className="h-12 w-12 mb-3 text-slate-200" />
            <p className="text-sm">
              <Translate text={localizationConstants.projectNoProjectsFound} />
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* TODO: re-enable when API pagination is active
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                  Load More Projects
                </button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
