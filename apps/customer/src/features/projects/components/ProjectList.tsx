"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/user";
import type { ActiveProject, ApiQuoteItem } from "../types";
import { cn } from "@/lib/utils";
import { getActiveProjectsAPIAction, getProjectListAPIAction } from "@/api-actions";
import type { ActiveProjectItem } from "@/api-actions/project/active";
import { resolveCompanyName } from "../utils/activeProject";
import { normalizeProjectStatus } from "@/utils/statusNormalizer";

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.projectMyProjects },
  { label: localizationConstants.projectmanagement },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  "received-quote": { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
  "completed": { bg: "bg-[#F0FDF4]", text: "text-[#047857]" },
  "draft": { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
  "active": { bg: "bg-[#F0FDF4]", text: "text-[#047857]" },
  "on-hold": { bg: "bg-yellow-50", text: "text-yellow-600" },
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "received-quote", label: "Received Quote" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On Hold" },
];

const ROWS_OPTIONS = [10, 25, 50];

type SortKey = "referenceNo" | "name" | "orderNo" | "quoteReferenceNo" | "companyName" | "status";

function mapActiveProjectToFrontend(item: ActiveProjectItem): ActiveProject {
  const normStatus = normalizeProjectStatus(item.status);
  const rawItem = item as unknown as Record<string, unknown>;
  const rawOrderNo = (rawItem.orderNo || rawItem.order_no) as string | undefined;
  const orderNo = (rawOrderNo && rawOrderNo !== "-") ? rawOrderNo : "—";
  return {
    id: item.id,
    name: item.name || "Untitled Project",
    referenceNo: item.projectCode || (item.id ? item.id.substring(0, 8).toUpperCase() : "PROJ-1"),
    clientNo: "-",
    projectNo: item.projectCode || "-",
    startDate: item.startDate || "-",
    endDate: item.dueDate || "-",
    contactPersonName: item.primaryContact?.name || "-",
    mobileNumber: "-",
    email: "-",
    address: "-",
    postalCode: "-",
    companyName: resolveCompanyName(item, item.name),
    status: normStatus,
    statusLabel: item.statusLabel || item.status,
    orderNo: orderNo,
    quoteReferenceNo: "-",
    progressPercent: item.progressPercent ?? 0,
    updatedAt: item.updatedAt,
    category: "-",
  };
}

function mapListProjectToFrontend(q: ApiQuoteItem): ActiveProject {
  const projName = q.projectName || q.project_name || q.name || "Untitled Project";
  const rawId = q.project_id || q.id || "";
  const rawRef = q.refNo || q.ref_no || q.project_code || q.projectCode;
  const refCode = (rawRef && rawRef !== "-") ? rawRef : (rawId ? rawId.substring(0, 8).toUpperCase() : "-");
  const normStatus = normalizeProjectStatus(q.quote_status || q.status);
  const rawOrderNo = q.orderNo || q.order_no;
  const orderNo = (rawOrderNo && rawOrderNo !== "-") ? rawOrderNo : "—";
  return {
    id: rawId,
    name: projName,
    referenceNo: refCode,
    clientNo: q.clientNo || q.client_no || "-",
    projectNo: refCode,
    startDate: "-",
    endDate: "-",
    contactPersonName: "-",
    mobileNumber: "-",
    email: "-",
    address: "-",
    postalCode: "-",
    companyName: q.companyName || q.company_name || resolveCompanyName({}, projName),
    status: normStatus,
    statusLabel: q.quote_status || q.status || "Active",
    orderNo: orderNo,
    quoteReferenceNo: refCode,
    progressPercent: 0,
    category: q.category || "-",
  };
}

export function ProjectList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("referenceNo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; right: number } | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
      setLoading(true);
      setError(null);

      const combinedMap = new Map<string, ActiveProject>();

      const activeRes = await getActiveProjectsAPIAction({ limit: rowsPerPage });
      if (cancelled) return;

      let hasError = false;
      if (!activeRes.success) {
        hasError = true;
        setError(activeRes.error || "Failed to load active projects");
      } else if (activeRes.data?.data) {
        activeRes.data.data.forEach((item) => {
          const mapped = mapActiveProjectToFrontend(item);
          if (mapped.id) {
            combinedMap.set(mapped.id, mapped);
          }
        });
      }

      if (!hasError) {
        const listRes = await getProjectListAPIAction({
          page,
          pageSize: rowsPerPage,
          search: search.trim() || undefined,
          sortBy: sortKey || undefined,
          sortOrder: sortDir || undefined,
          quote_status: statusFilter || undefined,
        });
        if (cancelled) return;
        if (listRes.success && listRes.data?.quotes) {
          listRes.data.quotes.forEach((q: ApiQuoteItem) => {
            const item = mapListProjectToFrontend(q);
            if (item.id && !combinedMap.has(item.id)) {
              combinedMap.set(item.id, item);
            }
          });
          setTotalCount(listRes.data.totalItems ?? combinedMap.size);
        } else {
          hasError = true;
          setError(listRes.error || "Failed to load projects list");
        }
      }

      if (cancelled) return;

      if (!hasError) {
        setProjects(Array.from(combinedMap.values()));
      }
      setLoading(false);
    }

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, search, sortKey, sortDir, statusFilter]);

  // Close dropdowns on outside click, resize, or scroll
  useEffect(() => {
    if (!openMenu && !filterOpen) return;
    const close = () => {
      setOpenMenu(null); setMenuAnchor(null);
      setFilterOpen(false); setFilterAnchor(null);
    };
    document.addEventListener("click", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [openMenu, filterOpen]);

  function handleMenuOpen(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    e.stopPropagation();
    if (openMenu === id) { setOpenMenu(null); setMenuAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenMenu(id);
    setMenuAnchor({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }

  function handleFilterToggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (filterOpen) { setFilterOpen(false); setFilterAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setFilterOpen(true);
    setFilterAnchor({ top: rect.bottom + 4, left: rect.left });
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const pageRows = projects;

  const activeFilterLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All Statuses";

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.projectmanagement}
        breadcrumbs={BREADCRUMBS}
      />

      <div className="p-6 flex-1">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative max-w-64 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="pl-9 h-9 text-sm border-[#E2E8F0] bg-white"
            />
          </div>

          {/* Filter button */}
          <button
            ref={filterBtnRef}
            type="button"
            onClick={handleFilterToggle}
            className={cn(
              "h-9 px-4 flex items-center gap-2 text-sm font-medium border rounded-lg transition-colors",
              statusFilter
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-[#E2E8F0] text-[#374151] hover:bg-slate-50",
            )}
          >
            Filter
            {statusFilter && (
              <span className="text-xs font-normal">· {activeFilterLabel}</span>
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform", filterOpen && "rotate-180")} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/business/offer/create"
              className="h-9 px-4 flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <Translate text={localizationConstants.projectNewOrderDirect} />
            </Link>
            <Link
              href="/business/offer/create"
              className="h-9 px-4 flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <Translate text={localizationConstants.projectNewProject} />
            </Link>
          </div>
        </div>

        {/* Table card */}
        <div className="w-[90%] bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-white">
                  {(
                    [
                      { key: "referenceNo", label: "Ref No" },
                      { key: "name", label: "Project Name" },
                      { key: "orderNo", label: "Order No" },
                      { key: "quoteReferenceNo", label: "Quote Reference No" },
                      { key: "companyName", label: "Supplier" },
                      { key: "status", label: "Status" },
                    ] as { key: SortKey; label: string }[]
                  ).map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-medium text-[#64748B] whitespace-nowrap cursor-pointer select-none"
                      onClick={() => toggleSort(key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <ArrowUpDown
                          className={cn(
                            "h-3.5 w-3.5 transition-colors",
                            sortKey === key ? "text-[#09090B]" : "text-[#CBD5E1]",
                          )}
                        />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-[#94A3B8]">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-500 mb-2" role="status" aria-label="Loading projects" />
                      Loading projects...
                    </td>
                  </tr>
                ) : error && projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-[#94A3B8]">
                      <Translate text={localizationConstants.projectNoProjectsFound} />
                    </td>
                  </tr>
                ) : (
                  pageRows.map((project) => {
                    const badge = STATUS_STYLE[project.status] ?? STATUS_STYLE["draft"];
                    return (
                      <tr
                        key={project.id}
                        className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/projectmanagement/${project.id}`}
                            className="text-[#09090B] font-medium hover:underline"
                          >
                            {project.referenceNo}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/projectmanagement/${project.id}`}
                            className="text-[#374151] hover:underline"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[#374151]">{project.orderNo ?? "—"}</td>
                        <td className="px-4 py-3 text-[#374151]">{project.quoteReferenceNo ?? "—"}</td>
                        <td className="px-4 py-3 text-[#374151]">{project.companyName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              badge.bg,
                              badge.text,
                            )}
                          >
                            {project.statusLabel ?? project.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => handleMenuOpen(e, project.id)}
                            className="p-1 rounded hover:bg-slate-100 text-[#94A3B8] transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination — outside table card */}
        <div className="w-[90%] flex items-center justify-center gap-6 px-4 py-3 mt-2 text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="h-8 rounded-md border border-[#E2E8F0] bg-white px-2 text-sm text-[#374151] focus:outline-none"
            >
              {ROWS_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <span>Page {page} of {totalPages}</span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter dropdown — fixed portal */}
      {filterOpen && filterAnchor && (
        <div
          style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
          className="w-48 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
            Status
          </p>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
                setFilterOpen(false);
                setFilterAnchor(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {statusFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}

      {/* Row actions dropdown — fixed portal */}
      {openMenu && menuAnchor && (
        <div
          style={{ position: "fixed", top: menuAnchor.top, right: menuAnchor.right, zIndex: 9999 }}
          className="w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              const targetId = openMenu;
              setOpenMenu(null);
              router.push(`/projectmanagement/${targetId}`);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#374151] hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
