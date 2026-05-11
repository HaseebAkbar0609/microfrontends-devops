import React from "react";
import { Folders, MoreVertical } from "lucide-react";
import { CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import { DynamicBreadcrumb } from "@/components/common";
import type { BreadcrumbItemType } from "@/components/common";

interface DashboardHeaderProps {
  title: string;
  /** Optional breadcrumb items (e.g. Home > Offer > Dashboard). Renders below the title when provided. */
  breadcrumbs?: BreadcrumbItemType[];
}

export const DashboardHeader = ({
  title,
  breadcrumbs,
}: DashboardHeaderProps) => (
  <CardHeader className="flex flex-col items-stretch gap-2 px-0">
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
          <Folders size={24} className="text-slate-700" />
        </div>
        <CardTitle className="text-2xl font-bold text-secondary">
          <Translate text={title} />
        </CardTitle>
      </div>
      <CardAction className="border-gray-300 h-10 w-10 rounded-md border flex justify-center items-center">
        <button>
          <MoreVertical size={20} className="text-foreground" />
        </button>
      </CardAction>
    </div>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <DynamicBreadcrumb items={breadcrumbs} variant="small" className="text-sm" />
    )}
  </CardHeader>
);
