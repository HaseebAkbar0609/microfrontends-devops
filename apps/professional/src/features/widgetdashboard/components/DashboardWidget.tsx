import React from "react";
import { MoreVertical, type LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";

interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
  isEmpty?: boolean;
}

export const DashboardWidget = ({
  title,
  icon: Icon,
  subtitle,
  content,
  className,
  onMenuClick,
  isEmpty,
}: DashboardWidgetProps) => {
  return (
    <Card
      className={`${className ?? ""} shadow-none border-none gap-2.5 py-1 px-0 pb-0 rounded-sm overflow-hidden`}
      style={{
        backgroundColor: isEmpty ? "transparent" : "#F1F5F9",
        height: "100%",
        minHeight: className?.includes("h-[") ? undefined : "281px"
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between px-3 pt-3 pb-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white">
          <Icon size={20} strokeWidth={2} className="text-slate-700" />
        </div>
        <CardAction className="self-center">
          <button
            type="button"
            onClick={onMenuClick}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <CardTitle className="font-sans font-semibold text-base leading-6 tracking-normal align-middle text-[#0A0A0A]">
          <Translate text={title} />
        </CardTitle>
        {subtitle && (
          <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        )}
        {content && <div className="mt-1">{content}</div>}
      </CardContent>
    </Card>
  );
};
