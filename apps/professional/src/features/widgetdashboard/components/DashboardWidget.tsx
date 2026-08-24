"use client";

import React from "react";
import {
  MoreVertical,
  Maximize2,
  RotateCw,
  Settings,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
  onRemove?: () => void;
  isEmpty?: boolean;
}

export const DashboardWidget = ({
  title,
  icon: Icon,
  subtitle,
  content,
  className,
  onMenuClick,
  onRemove,
  isEmpty,
}: DashboardWidgetProps) => {
  const t = useTranslate();
  const titleText = t(title) || title;

  return (
    <div
      className={cn(
        "rounded-sm p-4 overflow-hidden flex flex-col justify-start gap-1",
        className
      )}
      style={{
        backgroundColor: isEmpty ? "transparent" : "#F1F5F9",
        height: "100%",
        minHeight: "180px",
      }}
    >
      {/* Top Header Row: Icon & 3-dots */}
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-white border border-slate-200/60 shadow-xs">
          <Icon size={18} strokeWidth={2} className="text-slate-700" />
        </div>

        {!isEmpty && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onMenuClick}
                className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors cursor-pointer shadow-none"
                aria-label="Widget options"
              >
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white shadow-md border border-slate-200">
              <DropdownMenuItem
                onClick={() => showToast("info", `Expanded ${titleText}`)}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <Maximize2 size={14} />
                <span>Expand</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showToast("success", `Refreshed ${titleText}`)}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <RotateCw size={14} />
                <span>Refresh</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showToast("info", `Settings for ${titleText}`)}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <Settings size={14} />
                <span>Settings</span>
              </DropdownMenuItem>
              {onRemove && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="flex items-center gap-2 text-xs text-red-600 cursor-pointer hover:bg-red-50 focus:text-red-600"
                  >
                    <Trash2 size={14} />
                    <span><Translate text={localizationConstants.actionDelete} /></span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content: Title & Text Lines */}
      <div className="mt-1">
        <h3 className="font-sans font-semibold text-base leading-snug tracking-normal text-[#0A0A0A]">
          <Translate text={title} />
        </h3>
        {subtitle && (
          <div className="text-sm text-slate-500">{subtitle}</div>
        )}
        {content && <div>{content}</div>}
      </div>
    </div>
  );
};
