"use client";

import { useState, useEffect } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DUMMY_INVOICES } from "./data";
import { SortableHeader, ToolbarSearch, FilterButton, SimpleActionsMenu, InvoiceStatusBadge } from "./shared";

export function InvoiceList() {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    function close() { setOpenMenuId(null); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  const filtered = DUMMY_INVOICES.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ToolbarSearch value={search} onChange={setSearch} />
        <FilterButton />
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
      </div>
    </div>
  );
}
