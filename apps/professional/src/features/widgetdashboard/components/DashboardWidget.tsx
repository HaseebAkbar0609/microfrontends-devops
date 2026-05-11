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
import { GRAY } from "@/constants/colors";

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
      className={`${className} shadow-none border-none gap-2.5 min-h-44 h-full py-3 `}
      style={{ backgroundColor: isEmpty ? "transparent" : GRAY[100] }}
    >
      <CardHeader className="flex flex-row items-center justify-between ">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
          <Icon size={20} className="text-foreground" />
        </div>
        <CardAction className="self-center">
          <button onClick={onMenuClick} className="text-foreground">
            <MoreVertical size={20} />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="">
        <CardTitle className="text-base font-bold uppercase tracking-tight text-foreground">
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
