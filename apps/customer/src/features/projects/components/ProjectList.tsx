"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Search,
  CalendarDays,
  ChevronRight,
  FolderX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BreadcrumbItem } from "@/types/user";
import { DUMMY_PROJECTS } from "../constants";
import type { ActiveProject } from "../types";
import { cn } from "@/lib/utils";

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.projectmanagement },
];

const statusBadgeClass: Record<ActiveProject["status"], string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  "on-hold": "bg-yellow-50 text-yellow-700 border-yellow-200",
  completed: "bg-slate-100 text-slate-500 border-slate-200",
};

function ProjectCard({ project }: { project: ActiveProject }) {
  return (
    <Link
      href={`/projectmanagement/${project.id}`}
      className="group block bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
          <FolderOpen className="h-5 w-5 text-slate-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {project.referenceNo} · {project.category}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize text-xs font-medium",
                  statusBadgeClass[project.status],
                )}
              >
                {project.status.replace("-", " ")}
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

export function ProjectList() {
  const [search, setSearch] = useState("");

  const filtered = DUMMY_PROJECTS.filter(
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
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Project cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FolderX className="h-12 w-12 mb-3 text-slate-200" />
            <p className="text-sm">
              <Translate text={localizationConstants.projectNoProjectsFound} />
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
