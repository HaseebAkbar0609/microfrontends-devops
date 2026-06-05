"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { customerTabs, type CustomerTabValue } from "@/features/customers/constants";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import { ActiveCustomersTab } from "./ActiveCustomersTab";

export default function PrivateCustomersFeature() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PrivateCustomersContent />
    </Suspense>
  );
}

function PrivateCustomersContent() {
  const { query, changeQueries } = useQueryParams();
  const activeTab = (query.get("tab") ?? "active") as CustomerTabValue;

  function handleTabChange(value: string) {
    changeQueries({ tab: value, page: null, search: null });
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          <Translate text={localizationConstants.private} />
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="h-auto w-full justify-start rounded-none border-b border-slate-200 bg-transparent px-5 pb-0">
          {customerTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm font-medium text-slate-500 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
            >
              <Translate text={localizationConstants[tab.labelKey]} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <ActiveCustomersTab />
        </TabsContent>

        <TabsContent value="pending" className="mt-0 px-5 py-10">
          <p className="text-sm text-slate-500">
            <Translate text={localizationConstants.comingSoon} />
          </p>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 px-5 py-10">
          <p className="text-sm text-slate-500">
            <Translate text={localizationConstants.comingSoon} />
          </p>
        </TabsContent>

        <TabsContent value="archived" className="mt-0 px-5 py-10">
          <p className="text-sm text-slate-500">
            <Translate text={localizationConstants.comingSoon} />
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
