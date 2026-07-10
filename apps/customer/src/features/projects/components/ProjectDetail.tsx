"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { isAllowedQueryValue, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import { projectDetailTabTriggerClass } from "@/features/quote/constants";
import {
  ACTIVE_PROJECT_MAIN_TABS,
  ACTIVE_PROJECT_MAIN_TAB_VALUES,
  ACTIVE_PROJECT_DEFAULT_TAB,
  ACTIVE_PROJECT_SUB_TABS,
  ACTIVE_PROJECT_SUB_TAB_VALUES,
  ACTIVE_PROJECT_DEFAULT_SUB_TAB,
  DUMMY_PROJECTS,
} from "../constants";
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { MeetingMinutesTab } from "./tabs/MeetingMinutesTab";
import { QuestionsTab } from "./tabs/QuestionsTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { OrgPlanTab } from "./tabs/OrgPlanTab";
import { ContractTab } from "./tabs/ContractTab";
import { FinanceTab } from "./tabs/FinanceTab";

const subTabTriggerClass =
  "h-8 rounded-[6px] border-0 bg-transparent px-3 py-[6px] text-sm font-medium text-slate-500 shadow-none " +
  "transition-all hover:text-slate-700 " +
  "data-[state=active]:bg-white data-[state=active]:text-slate-900 " +
  "data-[state=active]:shadow-[0px_1px_2px_rgba(0,0,0,0.05)] " +
  "data-[state=active]:!border-b-0 data-[state=active]:!border-transparent";

function ProjectDetailInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { changeQueries, replaceQueries } = useQueryParams();
  const id = params.id as string;

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

  const project = useMemo(
    () => DUMMY_PROJECTS.find((p) => p.id === id) ?? DUMMY_PROJECTS[0],
    [id],
  );

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
                    <DocumentsTab projectName={project.name} />
                  </TabsContent>
                  <TabsContent value="meeting-minutes" className="mt-0 px-0">
                    <MeetingMinutesTab />
                  </TabsContent>
                  <TabsContent value="qa" className="mt-0 px-0">
                    <QuestionsTab />
                  </TabsContent>
                  <TabsContent value="timeline" className="mt-0 px-0">
                    <TimelineTab />
                  </TabsContent>
                  <TabsContent value="org-plan" className="mt-0 px-0">
                    <OrgPlanTab />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="contract" className="mt-0 px-0">
                <ContractTab onFullscreenChange={setContractFullscreen} />
              </TabsContent>

              <TabsContent value="finance" className="mt-0 px-0">
                <FinanceTab />
              </TabsContent>

              <TabsContent value="quality" className="mt-0 px-0">
                <div className="py-16 text-center text-slate-400 text-sm">
                  <Translate text={localizationConstants.comingSoon} />
                </div>
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
