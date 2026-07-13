"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useSupplierDetail } from "@/hooks/tools-suppliers/useSupplierDetail";
import { SupplierProfileCard } from "./SupplierProfileCard";
import { OverviewTab } from "./tabs/OverviewTab";
import { ReviewsTab } from "./tabs/ReviewsTab";

// Tool Components
import { ToolProfileCard } from "./ToolProfileCard";
import { ToolOverviewTab } from "./tabs/ToolOverviewTab";
import { ToolSettingsTab } from "./tabs/ToolSettingsTab";
import { ToolActivityTab } from "./tabs/ToolActivityTab";
import { ToolPermissionsTab } from "./tabs/ToolPermissionsTab";
import { SupplierDetailSkeleton } from "./SupplierDetailSkeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supplierDetailTabTriggerClass } from "./constants";

export function SupplierDetailPage({ supplierId }: { supplierId: string }) {
  const t = useTranslate();
  const {
    detail,
    loading,
    error,
    supplier,
    services,
    reviews,
    starBreakdown,
    popularTags,
    allowedTabs,
    activeTab,
    breadcrumbs,
    handleTabChange,
    handleDisconnect,
  } = useSupplierDetail(supplierId);

  if (loading) {
    return <SupplierDetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col flex-1">
        <PageHeader
          title={t(localizationConstants.errorTitle)}
          breadcrumbs={[
            { label: localizationConstants.home, href: "/home" },
            { label: localizationConstants.suppliers, href: "/suppliers" },
          ]}
        />
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center gap-4 bg-slate-50/50">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {t(localizationConstants.errorDetailsFailed)}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              {error || t(localizationConstants.errorDetailsDesc)}
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#1E293B] text-white hover:bg-slate-900 px-6 h-10 rounded-md transition-colors font-medium text-sm flex items-center justify-center"
          >
            {t(localizationConstants.errorRetry)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title={detail.name} breadcrumbs={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 p-6 bg-white items-start">
        {/* Left column — profile card */}
        <div className="w-full lg:sticky lg:top-6">
          {detail.type === "tool" ? (
            <ToolProfileCard
              tool={detail}
              onDisconnect={handleDisconnect}
              onTabChange={handleTabChange}
            />
          ) : (
            supplier && <SupplierProfileCard supplier={supplier} />
          )}
        </div>

        {/* Right column — tab content */}
        <div className="min-w-0 w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b border-slate-200 px-2 overflow-x-auto">
              <TabsList className="flex h-auto w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0 whitespace-nowrap">
                {allowedTabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={cn(supplierDetailTabTriggerClass)}
                  >
                    {detail.type === "tool"
                      ? t(
                          localizationConstants[
                            `toolLabel${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof localizationConstants
                          ],
                        )
                      : t(
                          localizationConstants[
                            `supplierTab${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof localizationConstants
                          ],
                        )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl mt-4">
              {detail.type === "tool" ? (
                <>
                  <TabsContent value="overview" className="mt-0">
                    <ToolOverviewTab tool={detail} />
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <ToolSettingsTab tool={detail} />
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0">
                    <ToolActivityTab tool={detail} />
                  </TabsContent>

                  <TabsContent value="permissions" className="mt-0">
                    <ToolPermissionsTab tool={detail} />
                  </TabsContent>
                </>
              ) : (
                <>
                  <TabsContent value="overview" className="mt-0">
                    {supplier && (
                      <OverviewTab supplier={supplier} services={services} />
                    )}
                  </TabsContent>

                  <TabsContent value="projects" className="mt-0">
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200 border-dashed rounded-lg bg-slate-50/30">
                      <p className="text-sm font-medium text-slate-700">
                        {t(localizationConstants.supplierNoProjectsTitle)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t(localizationConstants.supplierNoProjectsDesc)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="mt-0">
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200 border-dashed rounded-lg bg-slate-50/30">
                      <p className="text-sm font-medium text-slate-700">
                        {t(localizationConstants.supplierNoServicesTitle)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t(localizationConstants.supplierNoServicesDesc)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0">
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200 border-dashed rounded-lg bg-slate-50/30">
                      <p className="text-sm font-medium text-slate-700">
                        {t(localizationConstants.supplierNoDocsTitle)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t(localizationConstants.supplierNoDocsDesc)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <ReviewsTab
                      reviews={reviews}
                      starBreakdown={starBreakdown}
                      popularTags={popularTags}
                    />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
