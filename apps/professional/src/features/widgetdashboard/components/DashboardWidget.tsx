"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Maximize2,
  RotateCw,
  Trash2,
  Lock,
  Inbox,
  Download,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WidgetCardVariant } from "../types/dashboard";
import { WidgetErrorState, WidgetLoadingState, WidgetSourceUnavailable } from "./WidgetContent";

export interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  expandedContent?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
  onRemove?: () => void;
  isLocked?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  /** Toggled off or unavailable: greyed out and non-interactive. */
  isDisabled?: boolean;
  /** Swap the content for a skeleton while the widget's data is being fetched. */
  isLoading?: boolean;
  sourceUnavailable?: boolean;
  sourceError?: boolean;
  onRefresh?: () => Promise<void> | void;
  onExport?: () => void;
  /** `muted`: the grey card — a larger icon tile and title, and a header of only the lock chip and ⋮. */
  variant?: WidgetCardVariant;
}

export const DashboardWidget = ({
  title,
  icon: Icon,
  subtitle,
  content,
  expandedContent,
  className,
  onMenuClick,
  onRemove,
  isLocked,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  isDisabled,
  isLoading,
  sourceUnavailable,
  sourceError,
  onRefresh,
  onExport,
  variant = "default",
}: DashboardWidgetProps) => {
  const t = useTranslate();
  const titleText = t(title) || title;
  const isMuted = variant === "muted";
  /* The Analys frame's figure card: the title labels the figure, and the header
     keeps only the ⋮, so a KPI reads as one number rather than as a panel. */
  const isKpi = variant === "kpi";

  // Interactive states for unified UX testing & control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localEmpty, setLocalEmpty] = useState(false);
  const [localDisabled, setLocalDisabled] = useState(false);

  const effectiveLoading = isLoading || localLoading;
  const effectiveEmpty = isEmpty || localEmpty;
  const effectiveDisabled = isDisabled || localDisabled;
  const effectiveUnavailable = sourceUnavailable && !isEmpty;

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setLocalLoading(true);
    try {
      await onRefresh();
      setLocalEmpty(false);
      showToast("success", `${t(localizationConstants.wActionRefresh)}: ${titleText}`);
    } catch {
      showToast("error", t(localizationConstants.wToastRefreshError));
    } finally {
      setLocalLoading(false);
    }
  };

  const handleToggleEmpty = () => {
    setLocalEmpty((prev) => !prev);
  };

  const handleToggleDisabled = () => {
    setLocalDisabled((prev) => !prev);
  };

  return (
    <>
      <div
        tabIndex={effectiveEmpty || effectiveDisabled ? -1 : 0}
        aria-disabled={effectiveDisabled || undefined}
        aria-busy={effectiveLoading || undefined}
        className={cn(
          "p-4 sm:p-5 overflow-hidden flex-1 h-full flex flex-col justify-between transition-all duration-200 group relative",
          !effectiveEmpty &&
            !effectiveDisabled &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 focus-visible:ring-offset-2",
          effectiveDisabled && "opacity-50 grayscale bg-slate-100/80 dark:bg-slate-800/80 select-none",
          isMuted && "rounded-sm",
          className
        )}
        style={{
          minHeight: isKpi ? "120px" : "220px",
        }}
      >
        {/* Top Header Row: Icon (left), Admin Lock + Active Dot + Quick Actions (right) */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Icon inside rounded white square matching Figma */}
          {!isKpi && (
            <div
              className={cn(
                "flex shrink-0 items-center justify-center bg-white dark:bg-slate-800",
                isMuted
                  ? "h-10 w-10 rounded-sm"
                  : "h-9 w-9 rounded-md border border-slate-200/80 shadow-xs dark:border-slate-700"
              )}
            >
              <Icon size={isMuted ? 20 : 18} strokeWidth={2} className="text-slate-700 dark:text-slate-200" />
            </div>
          )}

          {/* Right: Badges & Actions */}
          {!effectiveEmpty && (
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {/* Admin Lock Chip matching Figma node 13315:492241 */}
              {isLocked && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300 select-none"
                  title={t(localizationConstants.wChipLockedTooltip)}
                >
                  <Lock size={10} strokeWidth={2} />
                  <Translate text={localizationConstants.wChipLocked} />
                </span>
              )}

              {/* Active / Inactive Status Dot, and the quick buttons — the muted
                  card leaves them to the ⋮ menu */}
              {!isMuted && !effectiveDisabled && !effectiveUnavailable && !sourceError && (
                <span
                  className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"
                  title={t(localizationConstants.wStateActive)}
                />
              )}
              {!isMuted && effectiveDisabled && !effectiveUnavailable && (
                <span className="inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                  <Translate text={localizationConstants.wStateInactive} />
                </span>
              )}

              {!isMuted && !isKpi && (
                <>
                  {/* Quick Expand Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-400 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-none"
                    title={t(localizationConstants.wActionExpand)}
                    aria-label={t(localizationConstants.wActionExpand)}
                  >
                    <Maximize2 size={13} />
                  </Button>

                  {/* Quick Refresh Button */}
                  {onRefresh && !effectiveUnavailable && !sourceError && <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleRefresh}
                    disabled={effectiveLoading}
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-400 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-none"
                    title={t(localizationConstants.wActionRefresh)}
                    aria-label={t(localizationConstants.wActionRefresh)}
                  >
                    <RotateCw size={13} className={effectiveLoading ? "animate-spin text-blue-600" : ""} />
                  </Button>}
                </>
              )}

              {/* Action Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-none"
                    aria-label={t(localizationConstants.wWidgetOptions)}
                  >
                    <MoreVertical size={15} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800">
                  <DropdownMenuItem
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Maximize2 size={14} />
                    <span><Translate text={localizationConstants.wActionExpand} /></span>
                  </DropdownMenuItem>

                  {onRefresh && !effectiveUnavailable && !sourceError && <DropdownMenuItem
                    onClick={handleRefresh}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <RotateCw size={14} />
                    <span><Translate text={localizationConstants.wActionRefresh} /></span>
                  </DropdownMenuItem>}

                  {!effectiveUnavailable && !sourceError && <DropdownMenuItem
                    onClick={handleToggleEmpty}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Inbox size={14} />
                    <span>
                      {effectiveEmpty ? (
                        <Translate text={localizationConstants.wActionRestoreData} />
                      ) : (
                        <Translate text={localizationConstants.wActionToggleEmpty} />
                      )}
                    </span>
                  </DropdownMenuItem>}

                  {!effectiveUnavailable && !sourceError && <DropdownMenuItem
                    onClick={handleToggleDisabled}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {effectiveDisabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span><Translate text={localizationConstants.wActionToggleActive} /></span>
                  </DropdownMenuItem>}

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
            </div>
          )}
        </div>

        {/* Title Row: Full width so title never truncates */}
        <div className={isKpi ? "mt-1" : "mt-2.5"}>
          <h3
            className={cn(
              "leading-snug tracking-tight truncate",
              isKpi
                ? "text-sm font-medium text-slate-500 dark:text-slate-400"
                : cn("font-semibold text-slate-900 dark:text-slate-100", isMuted ? "text-base" : "text-sm")
            )}
            title={titleText}
          >
            <Translate text={title} />
          </h3>
          {subtitle && !effectiveLoading && !effectiveEmpty && !effectiveUnavailable && !sourceError && (
            <div className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</div>
          )}
        </div>

        {/* Content Area / States */}
        <div className="mt-2 flex-1 flex flex-col justify-between">

          {/* 1. Loading State */}
          {effectiveLoading && !sourceError && (
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <RotateCw size={12} className="animate-spin text-blue-600" />
                <Translate text={localizationConstants.wStateLoading} />
              </div>
              <WidgetLoadingState rows={3} />
            </div>
          )}

          {/* 2. Empty State */}
          {!effectiveLoading && !sourceError && !effectiveUnavailable && effectiveEmpty && (
            <div className="flex flex-col items-center justify-center text-center py-5 px-3 rounded bg-slate-50/60 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 h-full min-h-[120px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/70 text-slate-500 mb-2">
                <Inbox size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {emptyTitle ? <Translate text={emptyTitle} /> : <Translate text={localizationConstants.wEmptyDefaultTitle} />}
              </p>
              <p className="text-[11px] text-slate-500 max-w-[200px] mt-0.5">
                {emptyDescription ? <Translate text={emptyDescription} /> : <Translate text={localizationConstants.wEmptyDefaultDesc} />}
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setLocalEmpty(false);
                  onEmptyAction?.();
                }}
                className="mt-2.5 h-7 px-2.5 text-[11px] cursor-pointer"
              >
                {emptyActionLabel ? <Translate text={emptyActionLabel} /> : <Translate text={localizationConstants.wActionRestoreData} />}
              </Button>
            </div>
          )}

          {/* 3. Inactive / Disabled Overlay */}
          {!effectiveLoading && !sourceError && !effectiveUnavailable && !effectiveEmpty && effectiveDisabled && (
            <div className="flex flex-col items-center justify-center text-center py-4 px-2">
              <p className="text-xs font-medium text-slate-500 mb-2">
                <Translate text={localizationConstants.wStateInactive} />
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleToggleDisabled}
                className="h-7 text-xs cursor-pointer"
              >
                <Translate text={localizationConstants.wActionToggleActive} />
              </Button>
            </div>
          )}

          {/* 4. Default / Active Data State */}
          {sourceError ? <WidgetErrorState message={localizationConstants.widgetSourceLoadError} /> : !effectiveLoading && effectiveUnavailable && <WidgetSourceUnavailable />}

          {!effectiveLoading && !sourceError && !effectiveUnavailable && !effectiveEmpty && !effectiveDisabled && content && (
            <div className="flex-1 flex flex-col justify-between h-full">{content}</div>
          )}
        </div>
      </div>

      {/* Expanded Modal View (Full-Page / Modal Dialog View) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300">
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    <Translate text={title} />
                  </DialogTitle>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 select-none">
                      <Lock size={12} strokeWidth={2} />
                      <Translate text={localizationConstants.wChipLocked} />
                    </span>
                  )}
                  {!effectiveUnavailable && !sourceError && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <Translate text={localizationConstants.wStateActive} />
                  </span>}
                </div>
                {subtitle && !effectiveUnavailable && !sourceError && (
                  <DialogDescription className="text-sm text-slate-500 mt-0.5">
                    {subtitle}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Modal Expanded Content Body */}
          <div className="py-4">
            {sourceError ? (
              <WidgetErrorState message={localizationConstants.widgetSourceLoadError} />
            ) : effectiveUnavailable ? (
              <WidgetSourceUnavailable />
            ) : expandedContent ? (
              <div className="space-y-4">{expandedContent}</div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                {content}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between sm:justify-between">
            <div className="flex items-center gap-2">
              {onExport && !effectiveUnavailable && !sourceError && <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={onExport}
                className="gap-1.5 text-xs"
              >
                <Download size={14} />
                <Translate text={localizationConstants.wModalExport} />
              </Button>}
              {onRefresh && !effectiveUnavailable && !sourceError && <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleRefresh}
                className="gap-1.5 text-xs"
              >
                <RotateCw size={14} />
                <Translate text={localizationConstants.wActionRefresh} />
              </Button>}
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              <Translate text={localizationConstants.wModalClose} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

