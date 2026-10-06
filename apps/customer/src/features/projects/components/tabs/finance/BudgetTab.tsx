"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, Check, Trash2, Sigma, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BudgetItem, BudgetRow, BudgetSection, SectionType } from "./types";
import { DEFAULT_BUDGET_SECTIONS } from "./data";
import { fmtAmount, delsumma, sectionSum, newRowId } from "./helpers";
import { SimpleActionsMenu, SortableHeader } from "./shared";
import type { ActiveProject } from "../../../types";
import { getProjectBudgetsAPIAction, saveProjectBudgetAPIAction } from "@/api-actions";

// ─── Translation hook for section labels ──────────────────────────────────────

function useSectionLabels(): Record<SectionType, string> {
  const t = useTranslate();
  return {
    konsulter: t(localizationConstants.financeKonsulterSection),
    arbete: t(localizationConstants.financeArbeteSection),
    material: t(localizationConstants.financeMaterialSection),
    ue: t(localizationConstants.financeUESection),
  };
}

// ─── Column headers (translated) ──────────────────────────────────────────────

function MaterialHeader() {
  const t = useTranslate();
  const cols = [
    t(localizationConstants.financeArticleCol),
    t(localizationConstants.financeLeverantorCol),
    t(localizationConstants.financeVarunrCol),
    t(localizationConstants.financeBenamnCol),
    t(localizationConstants.financeAntalCol),
    t(localizationConstants.financeEnhetCol),
    t(localizationConstants.financeAPrisCol),
    t(localizationConstants.financePalaggCol),
    t(localizationConstants.financeDelsummaCol),
    "",
  ];
  return (
    <div className="grid grid-cols-[80px_110px_80px_minmax(0,1fr)_70px_70px_90px_70px_100px_36px] px-3 py-1.5 gap-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      {cols.map((h, i) => (
        <div key={i} className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">{h}</div>
      ))}
    </div>
  );
}

function StandardHeader() {
  const t = useTranslate();
  const cols = [
    t(localizationConstants.financeArticleCol),
    t(localizationConstants.financeBenamnCol),
    t(localizationConstants.financeAntalCol),
    t(localizationConstants.financeEnhetCol),
    t(localizationConstants.financeAPrisCol),
    t(localizationConstants.financePalaggCol),
    t(localizationConstants.financeDelsummaCol),
    "",
  ];
  return (
    <div className="grid grid-cols-[90px_minmax(0,1fr)_70px_70px_90px_70px_100px_36px] px-3 py-1.5 gap-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      {cols.map((h, i) => (
        <div key={i} className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">{h}</div>
      ))}
    </div>
  );
}

// ─── Budget section row ───────────────────────────────────────────────────────

function BudgetSectionRow({
  row, isMaterial, onChange, onDelete,
}: {
  row: BudgetRow; isMaterial: boolean;
  onChange: (updated: BudgetRow) => void; onDelete: () => void;
}) {
  function cell(field: keyof BudgetRow, type: "text" | "number" = "text") {
    return (
      <input
        type={type}
        value={(row[field] ?? "") as string | number}
        onChange={(e) =>
          onChange({ ...row, [field]: type === "number" ? Number(e.target.value) : e.target.value })
        }
        className="w-full h-8 px-2 text-xs border border-[#E2E8F0] rounded bg-white focus:outline-none focus:border-[#94A3B8]"
      />
    );
  }

  const ds = delsumma(row);

  if (isMaterial) {
    return (
      <div className="grid grid-cols-[80px_110px_80px_minmax(0,1fr)_70px_70px_90px_70px_100px_36px] border-b border-[#E2E8F0] last:border-b-0 px-3 py-1.5 gap-2 items-center">
        {cell("artikelNr")}
        {cell("leverantor")}
        {cell("varunr")}
        {cell("benamning")}
        {cell("antal", "number")}
        {cell("enhet")}
        {cell("aPris", "number")}
        {cell("palagg", "number")}
        <div className="text-xs text-[#374151] font-medium text-right">{ds > 0 ? fmtAmount(ds) : "0"}</div>
        <button type="button" onClick={onDelete} className="cursor-pointer flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[90px_minmax(0,1fr)_70px_70px_90px_70px_100px_36px] border-b border-[#E2E8F0] last:border-b-0 px-3 py-1.5 gap-2 items-center">
      {cell("artikelNr")}
      {cell("benamning")}
      {cell("antal", "number")}
      {cell("enhet")}
      {cell("aPris", "number")}
      {cell("palagg", "number")}
      <div className="text-xs text-[#374151] font-medium text-right">{ds > 0 ? fmtAmount(ds) : "0"}</div>
      <button type="button" onClick={onDelete} className="flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Budget step 2 (summary before save) ─────────────────────────────────────

function BudgetStep2({ budgetName, sections, onBack, onSave }: {
  budgetName: string; sections: BudgetSection[]; onBack: () => void; onSave: () => void;
}) {
  const sectionLabels = useSectionLabels();
  const totals = {
    konsulter: sections.filter((s) => s.type === "konsulter").reduce((a, s) => a + sectionSum(s), 0),
    arbete: sections.filter((s) => s.type === "arbete").reduce((a, s) => a + sectionSum(s), 0),
    material: sections.filter((s) => s.type === "material").reduce((a, s) => a + sectionSum(s), 0),
    ue: sections.filter((s) => s.type === "ue").reduce((a, s) => a + sectionSum(s), 0),
  };
  const grandTotal = Object.values(totals).reduce((a, v) => a + v, 0);

  return (
    <div className="pb-24">
      <div className="flex items-center gap-2 mb-6">
        <button type="button" onClick={onBack}
          className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Back">
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#020617]">Ny budget</h2>
        <span className="ml-auto text-sm text-[#64748B]">Steg 2/2</span>
      </div>

      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="w-4 h-4 rounded-full border-2 border-[#16A34A] bg-[#16A34A] flex items-center justify-center shrink-0">
            <Check className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#020617]">Sammanfattning</span>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-32 text-[#64748B]">Budgetnamn:</span>
            <span className="font-medium text-[#020617]">{budgetName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-32 text-[#64748B]">Sektioner:</span>
            <span className="font-medium text-[#020617]">{sections.length} st</span>
          </div>
        </div>
      </div>

      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <span className="text-sm font-semibold text-[#020617]">Kalkyl — Totaler</span>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm font-medium text-[#020617]">{sectionLabels[section.type]}</span>
                <span className="ml-2 text-xs text-[#64748B]">({section.rows.length} rader)</span>
              </div>
              <span className="text-sm font-semibold text-[#020617]">{sectionSum(section) > 0 ? fmtAmount(sectionSum(section)) : "0 kr"}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC]">
            <span className="text-sm font-bold text-[#020617]">
              <Translate text={localizationConstants.financeSlutsummaLabel} />
            </span>
            <span className="text-sm font-bold text-[#020617]">{grandTotal > 0 ? grandTotal.toLocaleString("sv-SE") + " kr" : "0 kr"}</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 px-0 py-3 bg-white border-t border-[#E2E8F0]">
        <button type="button" onClick={onBack}
          className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors">
          <Translate text={localizationConstants.financeCancelLabel} />
        </button>
        <Button onClick={onSave} className="h-9 px-5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Translate text={localizationConstants.financeSaveLabel} />
        </Button>
      </div>
    </div>
  );
}

export function BudgetCreateForm({ onBack, budget, project }: { onBack: () => void; budget?: BudgetItem; project?: ActiveProject }) {
  const t = useTranslate();
  const [step, setStep] = useState(1);
  const [budgetName, setBudgetName] = useState(budget?.projectName ?? "");
  const [sections, setSections] = useState<BudgetSection[]>(
    budget?.sections && budget.sections.length > 0 ? budget.sections : DEFAULT_BUDGET_SECTIONS
  );
  const [saving, setSaving] = useState(false);
  const sectionLabels = useSectionLabels();

  function updateSection(id: string, updater: (s: BudgetSection) => BudgetSection) {
    setSections((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
  }

  function toggleCollapse(id: string) {
    updateSection(id, (s) => ({ ...s, collapsed: !s.collapsed }));
  }

  function addRow(sectionId: string) {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base: BudgetRow = { id: newRowId(), artikelNr: "", benamning: "", antal: 0, enhet: "st", aPris: 0, palagg: 10 };
    const row = section.type === "material" ? { ...base, leverantor: "", varunr: "" } : base;
    updateSection(sectionId, (s) => ({ ...s, rows: [...s.rows, row] }));
  }

  function updateRow(sectionId: string, rowId: string, updated: BudgetRow) {
    updateSection(sectionId, (s) => ({
      ...s,
      rows: s.rows.map((r) => (r.id === rowId ? updated : r)),
    }));
  }

  function deleteRow(sectionId: string, rowId: string) {
    updateSection(sectionId, (s) => ({ ...s, rows: s.rows.filter((r) => r.id !== rowId) }));
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      { id: newRowId(), type: "konsulter", collapsed: false, rows: [] },
    ]);
  }

  const totals = {
    konsulter: sections.filter((s) => s.type === "konsulter").reduce((a, s) => a + sectionSum(s), 0),
    arbete: sections.filter((s) => s.type === "arbete").reduce((a, s) => a + sectionSum(s), 0),
    material: sections.filter((s) => s.type === "material").reduce((a, s) => a + sectionSum(s), 0),
    ue: sections.filter((s) => s.type === "ue").reduce((a, s) => a + sectionSum(s), 0),
  };
  const grandTotal = Object.values(totals).reduce((a, v) => a + v, 0);

  const handleSaveBudget = async () => {
    if (project?.id) {
      setSaving(true);
      const res = await saveProjectBudgetAPIAction(project.id, {
        id: budget?.id,
        projectName: budgetName || "Ny budget",
        date: budget?.date ?? new Date().toISOString().slice(0, 10),
        totalAmount: grandTotal,
        sections,
      });
      setSaving(false);
      if (!res.success) {
        toast.error(res.error || t(localizationConstants.budgetSaveFailed));
        return;
      }
    }
    onBack();
  };

  if (step === 2) {
    return (
      <BudgetStep2
        budgetName={budgetName}
        sections={sections}
        onBack={() => setStep(1)}
        onSave={handleSaveBudget}
      />
    );
  }

  return (
    <div className="pb-16">
      <div className="flex items-center gap-2 mb-6">
        <button type="button" onClick={onBack}
          className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Back">
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#020617]">{budget ? budget.projectName : "Ny budget"}</h2>
      </div>

      {/* Budget details */}
      <div className="border border-[#E2E8F0] rounded-xl mb-4 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <CircleUserRound className="h-4 w-4 text-[#64748B] shrink-0" />
          <span className="text-sm font-semibold text-[#020617]">
            <Translate text={localizationConstants.financeBudgetDetailsTitle} />
          </span>
        </div>
        <div className="p-4">
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            <Translate text={localizationConstants.financeBudgetNameLabel} />
          </label>
          <Input value={budgetName} onChange={(e) => setBudgetName(e.target.value)} className="h-9 w-72 text-sm border-[#E2E8F0]" />
        </div>
      </div>

      {/* Kalkyl header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#E2E8F0] rounded-xl mb-4">
        <span className="text-sm font-semibold text-[#020617]">
          <Translate text={localizationConstants.financeKalkylTitle} />
        </span>
        <button type="button" onClick={addSection}
          className="cursor-pointer inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-[#09090B] rounded-md hover:bg-[#27272A] transition-colors">
          <Plus className="h-3 w-3" />
          <Translate text={localizationConstants.financeNySektionLabel} />
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const sum = sectionSum(section);
          const isMaterial = section.type === "material";
          return (
            <div key={section.id} className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <button type="button" onClick={() => toggleCollapse(section.id)}
                className="cursor-pointer flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-slate-100 transition-colors">
                <span className="text-sm font-semibold text-[#09090B]">{sectionLabels[section.type]}</span>
                {section.collapsed
                  ? <ChevronRight className="h-4 w-4 text-[#64748B]" />
                  : <ChevronDown className="h-4 w-4 text-[#64748B]" />
                }
              </button>

              {!section.collapsed && (
                <div className="bg-white border-t border-[#E2E8F0]">
                  {isMaterial ? <MaterialHeader /> : <StandardHeader />}

                  {section.rows.map((row) => (
                    <BudgetSectionRow
                      key={row.id}
                      row={row}
                      isMaterial={isMaterial}
                      onChange={(updated) => updateRow(section.id, row.id, updated)}
                      onDelete={() => deleteRow(section.id, row.id)}
                    />
                  ))}

                  <button type="button" onClick={() => addRow(section.id)}
                    className="cursor-pointer w-full py-2.5 border-t border-[#E2E8F0] text-xs font-medium text-[#64748B] bg-[#E2E8F0]/28  hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    <Translate text={localizationConstants.financeNyRadLabel} />
                  </button>

                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] bg-white">
                    <div className="inline-flex items-center gap-2 bg-[#E2E8F0] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs">
                      <Sigma className="h-3.5 w-3.5 text-[#64748B]" />
                      <span className="font-medium text-[#374151] ">
                        <Translate text={localizationConstants.financeSummaLabel} />
                      </span>
                      <div className="w-px h-3 bg-[#E2E8F0]" />
                      <span className="font-semibold text-[#020617]">{sum > 0 ? sum.toLocaleString("sv-SE") : "0"}</span>
                    </div>
                    <button type="button" onClick={() => deleteSection(section.id)}
                      className="cursor-pointer text-xs font-medium text-[#64748B] hover:text-[#DC2626] transition-colors border border-[#E2E8F0] rounded-md px-3 py-1.5 bg-white hover:border-[#FECACA]">
                      <Translate text={localizationConstants.financeDeleteSectionLabel} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grand total — compact, left-aligned */}
      <div className="mt-6 inline-block">
        <div className="w-64 bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-2">
          {(["konsulter", "arbete", "material", "ue"] as const)
            .filter((type) => totals[type] > 0)
            .map((type) => (
              <div key={type} className="flex items-center justify-between text-sm text-[#64748B]">
                <span>{sectionLabels[type]}</span>
                <span className="font-medium text-[#020617]">{fmtAmount(totals[type])}</span>
              </div>
            ))}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
            <span className="text-sm font-bold text-[#020617]">
              <Translate text={localizationConstants.financeSlutsummaLabel} />
            </span>
            <span className="text-sm font-bold text-[#020617]">
              {grandTotal > 0 ? grandTotal.toLocaleString("sv-SE") : "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 py-3 bg-white border-t border-[#E2E8F0]">
        <button type="button" onClick={onBack}
          className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors">
          <Translate text={localizationConstants.financeCancelLabel} />
        </button>
        <Button onClick={() => setStep(2)} disabled={saving} className="h-9 px-5 gap-1 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Translate text={localizationConstants.financeNextLabel} />
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Budget list ──────────────────────────────────────────────────────────────

export function BudgetList({
  project,
  onCreateNew,
  onView,
}: {
  project?: ActiveProject;
  onCreateNew: () => void;
  onView: (budget: BudgetItem) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);

  useEffect(() => {
    if (!project?.id) return;
    let cancelled = false;
    async function loadBudgets() {
      if (!project?.id) return;
      const res = await getProjectBudgetsAPIAction(project.id);
      if (!cancelled && res.success && Array.isArray(res.data)) {
        setBudgets(res.data as BudgetItem[]);
      }
    }
    void loadBudgets();
    return () => {
      cancelled = true;
    };
  }, [project?.id]);

  useEffect(() => {
    if (!openMenuId) return;
    function close() { setOpenMenuId(null); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1" />
        <Button onClick={onCreateNew} className="h-9 px-4 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.financeCreateNewLabel} />
        </Button>
      </div>

      <div className="w-full border border-[#E2E8F0] rounded-xl">
        <div className="grid grid-cols-[1fr_150px_46px] border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl">
          <SortableHeader><Translate text={localizationConstants.financeProjectNameCol} /></SortableHeader>
          <SortableHeader><Translate text={localizationConstants.financeDateCol} /></SortableHeader>
          <div />
        </div>
        {budgets.map((item, idx) => (
          <div key={item.id}
            className={`grid grid-cols-[1fr_150px_46px] border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors ${idx === budgets.length - 1 ? "last:border-b-0 rounded-b-xl" : ""}`}>
            <div className="h-14 flex items-center px-4 text-sm text-[#020617] font-medium">{item.projectName}</div>
            <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{item.date}</div>
            <SimpleActionsMenu
              open={openMenuId === item.id}
              onOpenChange={(v) => setOpenMenuId(v ? item.id : null)}
              onView={() => onView(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

