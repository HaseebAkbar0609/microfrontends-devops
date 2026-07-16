"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { isAllowedQueryValue, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import { projectDetailTabTriggerClass } from "@/features/quote/constants";
import type { ActiveProject, ApiProjectDetailItem } from "../types";
import { normalizeProjectStatus } from "@/utils/statusNormalizer";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACTIVE_PROJECT_MAIN_TABS,
  ACTIVE_PROJECT_MAIN_TAB_VALUES,
  ACTIVE_PROJECT_DEFAULT_TAB,
  ACTIVE_PROJECT_SUB_TABS,
  ACTIVE_PROJECT_SUB_TAB_VALUES,
  ACTIVE_PROJECT_DEFAULT_SUB_TAB,
} from "../constants";
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { MeetingMinutesTab } from "./tabs/MeetingMinutesTab";
import { QuestionsTab } from "./tabs/QuestionsTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { OrgPlanTab } from "./tabs/OrgPlanTab";
import { ContractTab } from "./tabs/ContractTab";
import { FinanceTab } from "./tabs/FinanceTab";
import { QualityTab } from "./tabs/QualityTab";

const subTabTriggerClass =
  "h-8 rounded-[6px] border-0 bg-transparent px-3 py-[6px] text-sm font-medium text-slate-500 shadow-none " +
  "transition-all hover:text-slate-700 " +
  "data-[state=active]:bg-white data-[state=active]:text-slate-900 " +
  "data-[state=active]:shadow-[0px_1px_2px_rgba(0,0,0,0.05)] " +
  "data-[state=active]:!border-b-0 data-[state=active]:!border-transparent";

import { getProjectByIdAPIAction } from "@/api-actions/project/get";

const DEFAULT_PROJECT_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function parseTimestampToMs(val: string | number | undefined | null): number | null {
  if (!val || val === "-") return null;
  let ms: number | null = null;
  if (typeof val === "number" && isFinite(val) && val > 0) {
    ms = val < 1e11 ? val * 1000 : val;
  } else if (typeof val === "string") {
    const parsed = Date.parse(val);
    if (!isNaN(parsed) && isFinite(parsed) && parsed > 0) {
      ms = parsed;
    } else {
      const num = Number(val);
      if (!isNaN(num) && isFinite(num) && num > 0) {
        ms = num < 1e11 ? num * 1000 : num;
      }
    }
  }
  return ms && !isNaN(ms) && ms > 0 ? ms : null;
}

function formatTimestamp(val: string | number | undefined | null): string | null {
  const ms = parseTimestampToMs(val);
  if (!ms) return null;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  if (year < 1970 || year > 2100) return null;
  return date.toISOString().split("T")[0];
}

function ProjectDetailInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { changeQueries, replaceQueries } = useQueryParams();
  const id = params.id as string;

  const [liveProject, setLiveProject] = useState<ActiveProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (activeGuard?: { active: boolean }) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProjectByIdAPIAction(id);
      if (activeGuard && !activeGuard.active) return;
      if (res.success && res.data) {
        const p = res.data as unknown as ApiProjectDetailItem;
        const fullName = [p.personal_information?.first_name, p.personal_information?.last_name]
          .filter(Boolean)
          .join(" ");

        const createdMs = parseTimestampToMs(p.created_at);

        const defaultStart = createdMs ? new Date(createdMs).toISOString().split("T")[0] : "-";
        const defaultEnd = createdMs ? new Date(createdMs + DEFAULT_PROJECT_DURATION_MS).toISOString().split("T")[0] : "-";

        const resolvedStart =
          formatTimestamp(p.project_details?.start_date) ||
          formatTimestamp(p.start_date) ||
          defaultStart;
        const resolvedEnd =
          formatTimestamp(p.project_details?.due_date) ||
          formatTimestamp(p.due_date) ||
          defaultEnd;

        const mapped: ActiveProject = {
          id: p.id || id,
          name: p.project_details?.project_name || p.projectName || p.name || "Project",
          referenceNo:
            p.project_details?.ref_no ||
            p.ref_no ||
            p.refNo ||
            p.client_no ||
            id.substring(0, 8).toUpperCase(),
          clientNo: p.project_details?.client_no || p.client_no || "-",
          projectNo: p.project_details?.ref_no || p.ref_no || "-",
          startDate: resolvedStart,
          endDate: resolvedEnd,
          contactPersonName: fullName || p.contact_person || "-",
          mobileNumber: p.personal_information?.mobile_number || p.contact_phone || "-",
          email: p.personal_information?.personal_email || p.contact_email || "-",
          address:
            p.personal_information?.address ||
            p.project_details?.project_address ||
            p.address ||
            "-",
          postalCode:
            p.personal_information?.postal_code ||
            p.project_details?.postal_code ||
            p.postal_code ||
            "-",
          companyName:
            p.suppliers?.invited_suppliers?.[0]?.company_name ||
            p.company_name ||
            "Assigned Supplier",
          status: normalizeProjectStatus(p.status || p.quote_status),
          statusLabel: p.status || p.quote_status || "Active",
          orderNo:
            (p.project_details?.order_no || p.order_no) &&
              (p.project_details?.order_no || p.order_no) !== "-"
              ? p.project_details?.order_no || p.order_no
              : "—",
          quoteReferenceNo: p.project_details?.ref_no || p.ref_no || "-",
          category: p.category || "-",
        };
        if (!activeGuard || activeGuard.active) setLiveProject(mapped);
      } else {
        if (!activeGuard || activeGuard.active) setError(res.error || "Failed to load project details");
      }
    } catch (err: unknown) {
      if (!activeGuard || activeGuard.active) setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      if (!activeGuard || activeGuard.active) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const guard = { active: true };
    void fetchDetail(guard);
    return () => {
      guard.active = false;
    };
  }, [fetchDetail]);

  const activeTab = useMemo(() => {
    const raw = searchParams.get("tab");
    if (isAllowedQueryValue(raw, ACTIVE_PROJECT_MAIN_TAB_VALUES)) return raw;
    return ACTIVE_PROJECT_DEFAULT_TAB;
  }, [searchParams]);

  const activeSubTab = useMemo(() => {
    const raw = searchParams.get("subtab");
    if (isAllowedQueryValue(raw, ACTIVE_PROJECT_SUB_TAB_VALUES)) return raw;
    return ACTIVE_PROJECT_DEFAULT_SUB_TAB;
  }, [searchParams]);

  useEffect(() => {
    const rawTab = searchParams.get("tab");
    const rawSubTab = searchParams.get("subtab");
    const updates: Record<string, string> = {};

    if (!isAllowedQueryValue(rawTab, ACTIVE_PROJECT_MAIN_TAB_VALUES)) {
      updates.tab = ACTIVE_PROJECT_DEFAULT_TAB;
    }
    if (!isAllowedQueryValue(rawSubTab, ACTIVE_PROJECT_SUB_TAB_VALUES)) {
      updates.subtab = ACTIVE_PROJECT_DEFAULT_SUB_TAB;
    }

    if (Object.keys(updates).length > 0) {
      replaceQueries(updates);
    }
  }, [searchParams, replaceQueries]);

  const [contractFullscreen, setContractFullscreen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" role="status" aria-label="Loading project detail" />
      </div>
    );
  }

  if (error || !liveProject) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 min-h-screen text-center bg-slate-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Project</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">{error || "The requested project details could not be found."}</p>
        <Button onClick={() => void fetchDetail()} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  const project: ActiveProject = liveProject;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: localizationConstants.home, href: "/home" },
    {
      label: localizationConstants.projectmanagement,
      href: "/projectmanagement",
    },
    { label: project.name },
  ];

  const handleMainTabChange = (value: string) => {
    changeQueries({ tab: value, subtab: ACTIVE_PROJECT_DEFAULT_SUB_TAB });
  };

  const handleSubTabChange = (value: string) => {
    changeQueries({ subtab: value });
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-50/50 min-h-screen">
      <div className={cn("bg-white flex-1", !contractFullscreen && "border-b border-slate-200")}>
        {!contractFullscreen && (
          <PageHeader
            title={project.name}
            breadcrumbs={breadcrumbs}
            className="border-none px-6 py-6"
          />
        )}

        <div className={cn(!contractFullscreen && "px-5 ml-4")}>
          <Tabs
            value={activeTab}
            onValueChange={handleMainTabChange}
            className="w-full"
          >
            {!contractFullscreen && (
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10">
                {ACTIVE_PROJECT_MAIN_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(projectDetailTabTriggerClass)}
                  >
                    <Translate text={tab.label} />
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            <div className={cn(!contractFullscreen && "mt-6 pb-0")}>
              <TabsContent value="project" className="mt-0">
                {/* Sub-tabs — only shown under "project" tab */}
                <Tabs
                  value={activeSubTab}
                  onValueChange={handleSubTabChange}
                  className="w-full"
                >
                  <TabsList className="inline-flex h-10 items-center rounded-xl bg-[#F1F5F9] p-1 mb-6 w-fit gap-0">
                    {ACTIVE_PROJECT_SUB_TABS.map((sub) => (
                      <TabsTrigger
                        key={sub.value}
                        value={sub.value}
                        className={cn(subTabTriggerClass)}
                      >
                        <Translate text={sub.label} />
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="personal-info" className="mt-0 px-0">
                    <PersonalInfoTab project={project} />
                  </TabsContent>
                  <TabsContent value="documents" className="mt-0 px-0">
                    <DocumentsTab projectId={project.id} projectName={project.name} />
                  </TabsContent>
                  <TabsContent value="meeting-minutes" className="mt-0 px-0">
                    <MeetingMinutesTab projectId={project.id} />
                  </TabsContent>
                  <TabsContent value="qa" className="mt-0 px-0">
                    <QuestionsTab projectId={project.id} />
                  </TabsContent>
                  <TabsContent value="timeline" className="mt-0 px-0">
                    <TimelineTab project={project} />
                  </TabsContent>
                  <TabsContent value="org-plan" className="mt-0 px-0">
                    <OrgPlanTab project={project} />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="contract" className="mt-0 px-0">
                <ContractTab project={project} onFullscreenChange={setContractFullscreen} />
              </TabsContent>

              <TabsContent value="finance" className="mt-0 px-0">
                <FinanceTab project={project} />
              </TabsContent>

              <TabsContent value="quality" className="mt-0 px-0">
                <QualityTab project={project} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetail() {
  return (
    <Suspense>
      <ProjectDetailInner />
    </Suspense>
  );
}
