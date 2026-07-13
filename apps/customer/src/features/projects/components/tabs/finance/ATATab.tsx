"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { Plus, ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ATAItem } from "./types";
import { DUMMY_ATA_ITEMS } from "./data";
import { fmtAmount } from "./helpers";
import { SortableHeader, ToolbarSearch, FilterButton, ATAStatusBadge, ActionsMenu } from "./shared";


// ─── ATA list ─────────────────────────────────────────────────────────────────

const ATA_COLS = "grid-cols-[110px_120px_minmax(0,1fr)_minmax(0,1fr)_120px_140px_46px]";

export function ATAList({ onCreateNew }: { onCreateNew: () => void }) {
  const [search, setSearch] = useState("");
  const [ataItems, setAtaItems] = useState<ATAItem[]>(DUMMY_ATA_ITEMS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    function close() { setOpenMenuId(null); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  const filtered = ataItems.filter(
    (a) =>
      a.benamning.toLowerCase().includes(search.toLowerCase()) ||
      a.ataNr.toLowerCase().includes(search.toLowerCase()),
  );

  const ataTotal = ataItems.reduce((a, i) => a + i.belopp, 0);

  function handleApprove(id: string) {
    setAtaItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: "godkand" } : a)));
  }

  function handleReject(id: string) {
    setAtaItems((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ToolbarSearch value={search} onChange={setSearch} />
        <FilterButton />
        <div className="flex-1" />
        <Button onClick={onCreateNew} className="h-9 px-4 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.financeCreateNewLabel} />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-sm font-semibold text-[#020617]">
          <Translate text={localizationConstants.financeProjectNrLabel} />
        </span>
        <span className="text-sm font-semibold text-[#020617]">2024-01</span>
      </div>

      <div className="w-full border border-[#E2E8F0] rounded-xl">
        <div className={`grid ${ATA_COLS} border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl`}>
          <SortableHeader><Translate text={localizationConstants.financeAtaNrCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeDateCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeBenamnCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeSourceCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeAmountCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeStatusCol} /></SortableHeader>
          <div />
        </div>

        {filtered.map((item) => (
          <div key={item.id}
            className={`grid ${ATA_COLS} border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors`}>
            <div className="h-14 flex items-center px-4 text-sm text-[#020617]">{item.ataNr}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{item.datum}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151] truncate">{item.benamning}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151] truncate">{item.source}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{fmtAmount(item.belopp)}</div>
            <div className="h-14 flex items-center px-4"><ATAStatusBadge status={item.status} /></div>
            <ActionsMenu
              open={openMenuId === item.id}
              onOpenChange={(v) => setOpenMenuId(v ? item.id : null)}
              onView={() => {}}
              onApprove={() => handleApprove(item.id)}
              onReject={() => handleReject(item.id)}
            />
          </div>
        ))}

        <div className={`grid ${ATA_COLS} bg-[#F8FAFC] border-t border-[#E2E8F0] rounded-b-xl`}>
          <div className="h-12 col-span-4 flex items-center px-4 text-sm font-bold text-[#020617]">
            <Translate text={localizationConstants.financeATASumLabel} />
          </div>
          <div className="h-12 flex items-center px-4 text-sm font-bold text-[#020617]">{fmtAmount(ataTotal)}</div>
          <div className="h-12 col-span-2" />
        </div>
      </div>
    </div>
  );
}

// ─── ATA create form ──────────────────────────────────────────────────────────

function LV({ label, value = "—" }: { label: ReactNode; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-[#09090B]">{label}</p>
      <p className="text-sm text-[#71717A]">{value}</p>
    </div>
  );
}

const PERSONAL_ROWS = [
  { datum: "2024/7/23",  projekt: "Alan Miller",   resurs: "00532", belopp: "156 900" },
  { datum: "2024/12/01", projekt: "Kala Andersen", resurs: "00014", belopp: "140 833" },
];
const MATERIAL_ROWS = [
  { datum: "2024/3/01", lev: "Input", resurs: "50/S2",  pris: "165 830" },
  { datum: "2024/3/01", lev: "Input", resurs: "50/S37", pris: "140 830" },
];
const DOC_ROWS = [
  { datum: "2024-06-15", typ: "pdf", namn: "Transporter",  filnr: "Transporter" },
  { datum: "2024-06-20", typ: "doc", namn: "El faktura",   filnr: "Fabrirs Electric box" },
];

export function ATACreateForm({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bestallareOpen, setBestallareOpen] = useState(true);
  const [orderOpen, setOrderOpen] = useState(true);
  const [personalOpen, setPersonalOpen] = useState(true);
  const [materialOpen, setMaterialOpen] = useState(true);
  const [dokumentOpen, setDokumentOpen] = useState(true);
  const [openDocMenu, setOpenDocMenu] = useState<string | null>(null);
  const [docMenuAnchor, setDocMenuAnchor] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!openDocMenu) return;
    function close() { setOpenDocMenu(null); setDocMenuAnchor(null); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openDocMenu]);

  return (
    <div className="pb-24 min-w-0 overflow-x-hidden">
      <div className="flex items-center gap-2 mb-6">
        <button type="button" onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Back">
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#020617]">
          <Translate text={localizationConstants.financeATATitle} />
        </h2>
      </div>

      <div className="flex gap-5 min-w-0">
        <div className="flex-1 min-w-0 space-y-4">

          {/* Orderer section */}
          <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
            <button type="button" onClick={() => setBestallareOpen((v) => !v)}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
              <Image src="/assets/icons/users.svg" alt="" width={24} height={24} />
              <span className="text-base font-medium text-[#09090B]">
                <Translate text={localizationConstants.financeATAOrdererTitle} />
              </span>
              <ChevronDown className={`ml-auto h-4 w-4 text-[#64748B] transition-transform duration-200 ${bestallareOpen ? "rotate-180" : ""}`} />
            </button>
            {bestallareOpen && (
              <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E4E4E7]">
                <LV label={<Translate text={localizationConstants.financeATAOrdererLabel} />} value="Fastighetsbolaget AB" />
                <LV label={<Translate text={localizationConstants.financeATANameLabel} />} value="Kalle Andersson" />
                <LV label={<Translate text={localizationConstants.financeATAAddressLabel} />} value="Storgatan 10" />
                <LV label={<Translate text={localizationConstants.financeATAZipCodeLabel} />} value="171 63" />
                <LV label={<Translate text={localizationConstants.financeATACityLabel} />} value="Info" />
                <LV label={<Translate text={localizationConstants.financeATAInfoLabel} />} />
              </div>
            )}
          </div>

          {/* Order information section */}
          <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
            <button type="button" onClick={() => setOrderOpen((v) => !v)}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
              <Image src="/assets/icons/info.svg" alt="" width={24} height={24} />
              <span className="text-base font-medium text-[#09090B]">
                <Translate text={localizationConstants.financeOrderInfoTitle} />
              </span>
              <ChevronDown className={`ml-auto h-4 w-4 text-[#64748B] transition-transform duration-200 ${orderOpen ? "rotate-180" : ""}`} />
            </button>
            {orderOpen && (
              <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E4E4E7]">
                <LV label={<Translate text={localizationConstants.financeATAQualityStatusLabel} />} value="Tilläggsarbete" />
                <LV label={<Translate text={localizationConstants.financeATAEconomicStatusLabel} />} value="Överlämnad" />
                <LV label={<Translate text={localizationConstants.financeATAStageLabel} />} value="Kök" />
                <LV label={<Translate text={localizationConstants.financeATAReasonLabel} />} value="Fle mätt på bänkskivan i köket" />
                <LV label={<Translate text={localizationConstants.financeATACreatedByLabel} />} value="Kalle Andersson" />
                <LV label="" value="" />
                <LV label={<Translate text={localizationConstants.financeDateCol} />} value="2025-10-15" />
                <LV label={<Translate text={localizationConstants.financeATARevisedDateLabel} />} value="Kalle Andersson" />
                <div className="col-span-2">
                  <p className="text-xs text-[#94A3B8] mb-0.5">
                    <Translate text={localizationConstants.financeDescriptionCol} />
                  </p>
                  <p className="text-sm text-[#020617]">—</p>
                </div>
                <LV label={<Translate text={localizationConstants.financeATAProposedActionLabel} />} />
                <LV label={<Translate text={localizationConstants.financeATAActionLabel} />} />
              </div>
            )}
          </div>

          {/* Detailed information — heading is OUTSIDE the box */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/assets/icons/project-info.svg" alt="" width={24} height={24} />
              <span className="text-2xl font-semibold tracking-tight text-[#020617]">
                <Translate text={localizationConstants.financeDetailInfoTitle} />
              </span>
            </div>

            <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">

              {/* Own personnel */}
              <div className="border-b border-[#E2E8F0]">
                <button type="button" onClick={() => setPersonalOpen((v) => !v)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <Image src="/assets/icons/personal-info.svg" alt="" width={15} height={15} />
                  <span className="text-sm font-medium text-[#374151]">
                    <Translate text={localizationConstants.financeEgenPersonalLabel} />
                  </span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-[#64748B] transition-transform duration-200 ${personalOpen ? "rotate-180" : ""}`} />
                </button>
                {personalOpen && (
                  <>
                    <div className="overflow-x-auto border-t border-[#E2E8F0]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            {([
                              localizationConstants.financeDateCol,
                              localizationConstants.financeATAProjectCol,
                              localizationConstants.financeATAResourceCol,
                              localizationConstants.financeDescriptionCol,
                              localizationConstants.financeAmountCol,
                              localizationConstants.financeATAQtyCol,
                              localizationConstants.financeATAUnitCol,
                              localizationConstants.financeATANetPriceCol,
                              localizationConstants.financeATANetSumCol,
                            ]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">
                                <Translate text={key} />
                              </th>
                            ))}
                            <th className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">%</th>
                            {([
                              localizationConstants.financeATAAProjectNoCol,
                              localizationConstants.financeATATotCol,
                              localizationConstants.financeATAActivityCol,
                              localizationConstants.financeATAStageLabel,
                            ]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">
                                <Translate text={key} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {PERSONAL_ROWS.map((r) => (
                            <tr key={r.resurs} className="border-b border-[#E8EEF3] last:border-0">
                              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.datum}</td>
                              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.projekt}</td>
                              <td className="px-3 py-2 text-[#374151]">{r.resurs}</td>
                              <td className="px-3 py-2 text-[#94A3B8]">—</td>
                              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.belopp}</td>
                              {Array.from({ length: 9 }).map((_, j) => (
                                <td key={j} className="px-3 py-2 text-[#94A3B8]">—</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4E4E7] bg-white">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-sm font-medium text-[#09090B]">
                        <span className="font-bold text-[#374151]">Σ</span>
                        <Translate text={localizationConstants.financeATATotalOwnPersonnelLabel} />
                        <strong className="font-semibold">02</strong>
                      </span>
                      <button type="button" className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white bg-[#09090B] rounded-md hover:bg-[#27272A] transition-colors">
                        <Image src="/assets/icons/edit.svg" alt="" width={12} height={12} className="invert" />
                        <Translate text={localizationConstants.financeATAAmendLabel} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Material */}
              <div className="border-b border-[#E2E8F0]">
                <button type="button" onClick={() => setMaterialOpen((v) => !v)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <Image src="/assets/icons/container.svg" alt="" width={15} height={15} />
                  <span className="text-sm font-medium text-[#374151]">
                    <Translate text={localizationConstants.financeATAMaterialLabel} />
                  </span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-[#64748B] transition-transform duration-200 ${materialOpen ? "rotate-180" : ""}`} />
                </button>
                {materialOpen && (
                  <>
                    <div className="overflow-x-auto border-t border-[#E2E8F0]">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            {([
                              localizationConstants.financeDateCol,
                              localizationConstants.financeATASupplierCol,
                              localizationConstants.financeATAResourceCol,
                              localizationConstants.financeDescriptionCol,
                              localizationConstants.financeAmountCol,
                              localizationConstants.financeATAInvoiceNrCol,
                              localizationConstants.financeATAUnitCol,
                              localizationConstants.financeATANetPriceCol,
                              localizationConstants.financeATANetSumCol,
                            ]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">
                                <Translate text={key} />
                              </th>
                            ))}
                            <th className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">%</th>
                            {([
                              localizationConstants.financeATAAPriceUnitCol,
                            ]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">
                                <Translate text={key} />
                              </th>
                            ))}
                            <th className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">%2</th>
                            {([
                              localizationConstants.financeATAActivityCol,
                              localizationConstants.financeATAStageLabel,
                            ]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left font-medium text-[#64748B] whitespace-nowrap">
                                <Translate text={key} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {MATERIAL_ROWS.map((r) => (
                            <tr key={r.resurs} className="border-b border-[#E8EEF3] last:border-0">
                              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.datum}</td>
                              <td className="px-3 py-2 text-[#374151]">{r.lev}</td>
                              <td className="px-3 py-2 text-[#374151]">{r.resurs}</td>
                              <td className="px-3 py-2 text-[#94A3B8]">—</td>
                              <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.pris}</td>
                              {Array.from({ length: 9 }).map((_, j) => (
                                <td key={j} className="px-3 py-2 text-[#94A3B8]">—</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4E4E7] bg-white">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-sm font-medium text-[#09090B]">
                          <span className="font-bold text-[#374151]">Σ</span>
                          <Translate text={localizationConstants.financeATATotalMaterialLabel} />
                          <strong className="font-semibold">23,0000</strong>
                        </span>
                        <div className="text-sm text-[#71717A] flex items-center gap-2 px-1">
                          <Translate text={localizationConstants.financeATAPricedItemsLabel} />
                          <span className="font-medium text-[#09090B]">23,0000</span>
                        </div>
                      </div>
                      <button type="button" className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white bg-[#09090B] rounded-md hover:bg-[#27272A] transition-colors">
                        <Image src="/assets/icons/edit.svg" alt="" width={12} height={12} className="invert" />
                        <Translate text={localizationConstants.financeATAAmendLabel} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Documents */}
              <div>
                <button type="button" onClick={() => setDokumentOpen((v) => !v)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <Image src="/assets/icons/file-plus.svg" alt="" width={15} height={15} />
                  <span className="text-sm font-medium text-[#374151]">
                    <Translate text={localizationConstants.financeDocumentLabel} />
                  </span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-[#64748B] transition-transform duration-200 ${dokumentOpen ? "rotate-180" : ""}`} />
                </button>
                {dokumentOpen && (
                  <div className="border-t border-[#E2E8F0]">
                    {/* Upload row */}
                    <div className="px-4 pt-4 pb-3 border-b border-[#E2E8F0]">
                      <p className="text-xs font-medium text-[#374151] mb-2">
                        <Translate text={localizationConstants.financeATAUploadFilesLabel} />
                      </p>
                      <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden mb-1.5">
                        <div className="flex items-center gap-2 flex-1 px-3 py-2">
                          <Image src="/assets/icons/file-plus.svg" alt="" width={13} height={13} />
                          <span className="text-xs text-[#94A3B8]"><Translate text={localizationConstants.financeUploadLabel} /></span>
                          <span className="text-xs text-[#374151]">file.txt</span>
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 text-xs font-medium text-white bg-[#64748B] hover:bg-[#475569] transition-colors whitespace-nowrap">
                          <Translate text={localizationConstants.financeUploadLabel} />
                        </button>
                        <input ref={fileInputRef} type="file" accept=".png,.jpg,.pdf" className="hidden" multiple />
                      </div>
                      <p className="text-[10px] text-[#3B82F6]">
                        <Translate text={localizationConstants.financeATAUploadHintLabel} />
                      </p>
                    </div>

                    {/* Supplier invoice + Time rapport multi-select */}
                    <div className="grid grid-cols-2 gap-3 px-4 py-3 border-b border-[#E2E8F0]">
                      <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1">
                          <Translate text={localizationConstants.financeATASupplierInvoiceLabel} />
                        </label>
                        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 min-h-8 border border-[#E2E8F0] rounded-md bg-white">
                          {["Invoice 001", "Invoice 002"].map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F1F5F9] text-[11px] text-[#374151] rounded">
                              {tag} <button type="button" className="text-[#94A3B8] hover:text-[#374151] leading-none">×</button>
                            </span>
                          ))}
                          <ChevronDown className="ml-auto h-3.5 w-3.5 text-[#64748B] shrink-0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1">
                          <Translate text={localizationConstants.financeATATimeReportLabel} />
                        </label>
                        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 min-h-8 border border-[#E2E8F0] rounded-md bg-white">
                          {["Time rapport 01", "Time rapport 02"].map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F1F5F9] text-[11px] text-[#374151] rounded">
                              {tag} <button type="button" className="text-[#94A3B8] hover:text-[#374151] leading-none">×</button>
                            </span>
                          ))}
                          <ChevronDown className="ml-auto h-3.5 w-3.5 text-[#64748B] shrink-0" />
                        </div>
                      </div>
                    </div>

                    {/* Attached invoices table */}
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#374151] mb-2">
                        <Translate text={localizationConstants.financeATAAttachedInvoicesLabel} />
                      </p>
                      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                              <th className="px-3 py-2 text-left font-medium text-[#64748B]">
                                <Translate text={localizationConstants.financeDateCol} />
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-[#64748B]">
                                <Translate text={localizationConstants.financeATADocumentNameCol} />
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-[#64748B]">
                                <Translate text={localizationConstants.financeATAFilCol} />
                              </th>
                              <th className="w-10" />
                            </tr>
                          </thead>
                          <tbody>
                            {DOC_ROWS.map((doc) => {
                              const rowKey = doc.datum + doc.namn;
                              return (
                                <tr key={rowKey} className="border-b border-[#E8EEF3] last:border-0">
                                  <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{doc.datum}</td>
                                  <td className="px-3 py-2 text-[#374151]">{doc.namn}</td>
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-1.5">
                                      {doc.typ === "pdf" ? (
                                        <span className="inline-flex items-center px-1 py-0.5 bg-red-50 rounded border border-red-100">
                                          <Image src="/assets/icons/file-pdf-icon.svg" alt="PDF" width={16} height={16} />
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-1 py-0.5 bg-blue-50 rounded border border-blue-100">
                                          <Image src="/assets/icons/doc-icon.svg" alt="DOC" width={16} height={16} />
                                        </span>
                                      )}
                                      <span className="text-[#374151]">{doc.filnr}</span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2">
                                    <div className="flex justify-end">
                                      <button type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (openDocMenu === rowKey) {
                                            setOpenDocMenu(null);
                                            setDocMenuAnchor(null);
                                          } else {
                                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                            setDocMenuAnchor({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                            setOpenDocMenu(rowKey);
                                          }
                                        }}
                                        className="p-1 rounded hover:bg-slate-100 text-[#64748B]">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ATA summary sidebar */}
        <div className="w-64 shrink-0">
          <div className="border border-[#E5E5E5] rounded-lg overflow-hidden sticky top-4">
            <div className="px-4 pt-3 pb-2.5 border-b border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#020617]">
                  <Translate text={localizationConstants.financeATAStepLabel} /> 2/2
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#09090B] rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-sm font-semibold text-[#020617]">
                <Translate text={localizationConstants.financeATANrLabel} /> 1
              </span>
              <button type="button" className="h-7 px-2.5 text-xs font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
                PRJ092
              </button>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex gap-1.5 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A]">Stockholms</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706]">Javisste</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#64748B] shrink-0">
                  <Translate text={localizationConstants.financeATAOwnPersonnelStat} />
                </span>
                <span className="text-xs font-semibold text-[#020617]">02</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#64748B] shrink-0">
                  <Translate text={localizationConstants.financeATATotalMaterialLabel} />
                </span>
                <span className="text-xs font-semibold text-[#020617]">1.586.000</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#64748B] shrink-0">
                  <Translate text={localizationConstants.financeATATotalMachineryLabel} />
                </span>
                <span className="text-xs font-semibold text-[#020617]">486.000</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#64748B] shrink-0">
                  <Translate text={localizationConstants.financeATATotalUELabel} />
                </span>
                <span className="text-xs font-semibold text-[#020617]">23.000</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#64748B] shrink-0">
                  <Translate text={localizationConstants.financeATATotalSupplierLabel} />
                </span>
                <span className="text-xs font-semibold text-[#020617]">312.000</span>
              </div>
              <button type="button"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 h-9 text-sm font-medium text-white bg-[#09090B] rounded-md hover:bg-[#27272A] transition-colors">
                <Image src="/assets/icons/send.svg" alt="" width={14} height={14} />
                <Translate text={localizationConstants.financeSendLabel} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Doc row 3-dot dropdown — rendered outside overflow-hidden ancestors */}
      {openDocMenu && docMenuAnchor && (
        <div
          style={{ position: "fixed", top: docMenuAnchor.top, right: docMenuAnchor.right, zIndex: 9999 }}
          className="w-32 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
        >
          <button type="button" className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#374151] hover:bg-slate-50">
            <Pencil className="h-3 w-3" />
            <Translate text={localizationConstants.financeATAEditDocLabel} />
          </button>
          <button type="button" className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#DC2626] hover:bg-red-50">
            <Trash2 className="h-3 w-3" />
            <Translate text={localizationConstants.financeATADeleteLabel} />
          </button>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="sticky bottom-0 mt-6 flex items-center gap-3 py-3 bg-white border-t border-[#E2E8F0] z-10">
        <button type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
          <Image src="/assets/icons/arrow-left.svg" alt="" width={16} height={16} />
          <Translate text={localizationConstants.financeATABackToLabel} />
        </button>
        <div className="flex-1" />
        <button type="button" onClick={onBack}
          className="h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
          <Translate text={localizationConstants.financeCancelLabel} />
        </button>
        <button type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-white bg-[#09090B] rounded-md hover:bg-[#27272A] transition-colors">
          <Image src="/assets/icons/save.svg" alt="" width={15} height={15} className="" />
          <Translate text={localizationConstants.financeSaveLabel} />
        </button>
        <Button className="h-9 px-5 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Image src="/assets/icons/send.svg" alt="" width={15} height={15} className="" />
          <Translate text={localizationConstants.financeSendLabel} />
        </Button>
      </div>
    </div>
  );
}