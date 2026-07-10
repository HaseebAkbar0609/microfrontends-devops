"use client";

import { Search, ChevronDown, ArrowUpDown, MoreVertical, Check, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import type { InvoiceStatus, ATAStatus } from "./types";

// ─── Sortable table header cell ───────────────────────────────────────────────

export function SortableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "h-12 flex items-center gap-1 px-4 text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap w-full text-left",
        className,
      )}
    >
      {children}
      <ArrowUpDown className="h-3 w-3 text-[#94A3B8] ml-0.5 shrink-0" />
    </button>
  );
}

// ─── Toolbar search input ─────────────────────────────────────────────────────

export function ToolbarSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslate();
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(localizationConstants.searchPlaceholder)}
        className="pl-9 h-9 w-52 text-sm border-[#E2E8F0]"
      />
    </div>
  );
}

// ─── Filter button ────────────────────────────────────────────────────────────

export function FilterButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[#374151] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors"
    >
      <Translate text={localizationConstants.contractFilterLabel} />
      <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
    </button>
  );
}

// ─── Status badges ────────────────────────────────────────────────────────────

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
        <Translate text={localizationConstants.financeStatusPaid} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
      <Translate text={localizationConstants.financeStatusUnpaid} />
    </span>
  );
}

export function ATAStatusBadge({ status }: { status: ATAStatus }) {
  if (status === "godkand") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
        <Translate text={localizationConstants.financeStatusApproved} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
      <Translate text={localizationConstants.financeStatusReview} />
    </span>
  );
}

// ─── Actions menus ────────────────────────────────────────────────────────────

export function ActionsMenu({
  open, onOpenChange, onView, onApprove, onReject,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onView?: () => void; onApprove?: () => void; onReject?: () => void;
}) {
  return (
    <div className="relative flex items-center justify-center h-14">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onOpenChange(!open); }}
        className="flex items-center justify-center h-9 w-9 rounded-[6px] text-[#64748B] hover:bg-slate-100 hover:text-[#18181B] transition-colors"
        aria-label="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-[#E2E8F0] rounded-lg shadow-md py-1 min-w-36">
          {onView && (
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onView(); onOpenChange(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-slate-50">
              <Eye className="h-3.5 w-3.5 text-[#64748B]" />
              <Translate text={localizationConstants.financeViewAction} />
            </button>
          )}
          {onApprove && (
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onApprove(); onOpenChange(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#16A34A] hover:bg-slate-50">
              <Check className="h-3.5 w-3.5" />
              <Translate text={localizationConstants.financeApproveAction} />
            </button>
          )}
          {onReject && (
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onReject(); onOpenChange(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#DC2626] hover:bg-slate-50">
              <X className="h-3.5 w-3.5" />
              <Translate text={localizationConstants.financeRejectAction} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function SimpleActionsMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <div className="relative flex items-center justify-center h-14">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onOpenChange(!open); }}
        className="flex items-center justify-center h-9 w-9 rounded-[6px] text-[#64748B] hover:bg-slate-100 hover:text-[#18181B] transition-colors"
        aria-label="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-[#E2E8F0] rounded-lg shadow-md py-1 min-w-36">
          <button type="button"
            onClick={(e) => { e.stopPropagation(); onOpenChange(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-slate-50">
            <Eye className="h-3.5 w-3.5 text-[#64748B]" />
            <Translate text={localizationConstants.financeViewAction} />
          </button>
        </div>
      )}
    </div>
  );
}
