"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DUMMY_INVOICES } from "./data";
import { SortableHeader, ToolbarSearch, FilterButton, SimpleActionsMenu, InvoiceStatusBadge } from "./shared";
import type { InvoiceStatus } from "./types";

const INVOICE_STATUS_OPTIONS: { value: "" | InvoiceStatus; label: string }[] = [
  { value: "",       label: "All" },
  { value: "paid",   label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
];

export function InvoiceList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | InvoiceStatus>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    function close() { setOpenMenuId(null); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  useEffect(() => {
    if (!filterOpen) return;
    const close = () => { setFilterOpen(false); setFilterAnchor(null); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [filterOpen]);

  function toggleFilter(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (filterOpen) { setFilterOpen(false); setFilterAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setFilterOpen(true);
    setFilterAnchor({ top: rect.bottom + 4, left: rect.left });
  }

  const filtered = DUMMY_INVOICES.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "" || inv.status === statusFilter),
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ToolbarSearch value={search} onChange={setSearch} />
        <FilterButton onClick={toggleFilter} active={statusFilter !== ""} />
      </div>

      <div className="w-full border border-[#E2E8F0] rounded-xl">
        <div className="grid grid-cols-[1fr_150px_150px_130px_46px] border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl">
          <SortableHeader><Translate text={localizationConstants.financeInvoiceNumberCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeInvoiceDateCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeDueDateCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeStatusCol} /></SortableHeader>
          <div />
        </div>
        {filtered.map((inv, idx) => (
          <div key={inv.id}
            className={`grid grid-cols-[1fr_150px_150px_130px_46px] border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors ${idx === filtered.length - 1 ? "border-b-0 rounded-b-xl" : ""}`}>
            <div className="h-14 flex items-center px-4 text-sm font-medium text-[#020617]">{inv.invoiceNumber}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{inv.invoiceDate}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{inv.dueDate}</div>
            <div className="h-14 flex items-center px-4"><InvoiceStatusBadge status={inv.status} /></div>
            <SimpleActionsMenu
              open={openMenuId === inv.id}
              onOpenChange={(v) => setOpenMenuId(v ? inv.id : null)}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#94A3B8]">No invoices match the filter.</div>
        )}
      </div>

      {/* Filter portal */}
      {filterOpen && filterAnchor && (
        <div
          style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
          className="w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Status</p>
          {INVOICE_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setStatusFilter(opt.value); setFilterOpen(false); setFilterAnchor(null); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {statusFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
