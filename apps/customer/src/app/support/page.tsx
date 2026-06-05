"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detailTabTriggerClass } from "@/features/quote/constants";
import { ContactSection, GuideSection } from "@/features/support";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";


const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools },
  { label: localizationConstants.support },
];

export default function SupportPage() {
  return (
    <Tabs defaultValue="support">
      <PageHeader
        title={localizationConstants.support}
        breadcrumbs={BREADCRUMBS}
        className="pb-0"
      >
        <TabsList className="mt-2 flex h-auto w-full justify-start gap-x-8 rounded-none bg-transparent p-0">
          <TabsTrigger value="support" className={detailTabTriggerClass}>
            Support
          </TabsTrigger>

          <TabsTrigger value="guide" className={detailTabTriggerClass}>
            Guide
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <TabsContent value="support">
        <div className="p-6">
          <ContactSection />
        </div>
      </TabsContent>

      <TabsContent value="guide">
        <GuideSection />
      </TabsContent>
    </Tabs>
  );
}
