"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { MoreVertical, Check, X, Plus, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PaymentPlan, PaymentPlanRow, PaymentPlanStatus } from "./types";
import { fmtAmount, newRowId } from "./helpers";
import { ToolbarSearch, FilterButton } from "./shared";


// ─── Status badge ─────────────────────────────────────────────────────────────

function PaymentPlanStatusBadge({ status }: { status: PaymentPlanStatus }) {
  const map: Record<PaymentPlanStatus, { bg: string; text: string; label: string }> = {
    draft:    { bg: "bg-slate-100",  text: "text-slate-500",  label: "Draft" },
    pending:  { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", label: "Pending" },
    approved: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]", label: "Approved" },
    declined: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", label: "Declined" },
  };
  const { bg, text, label } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ─── Actions menu ─────────────────────────────────────────────────────────────

function PaymentPlanActionsMenu({
  open, onOpenChange, status, onView, onEdit, onApprove, onDecline,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; status: PaymentPlanStatus;
  onView: () => void; onEdit: () => void; onApprove: () => void; onDecline: () => void;
}) {
  return (
    <div className="relative flex items-center justify-center h-14">
      <button type="button"
        onClick={(e) => { e.stopPropagation(); onOpenChange(!open); }}
        className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#64748B] hover:bg-slate-100 hover:text-[#18181B] transition-colors"
        aria-label="Actions">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-[#E2E8F0] rounded-lg shadow-md py-1 min-w-36">
          <button type="button" onClick={(e) => { e.stopPropagation(); onView(); onOpenChange(false); }}
            className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-slate-50">
            <Eye className="h-3.5 w-3.5 text-[#64748B]" /> View
          </button>
          {(status === "draft" || status === "pending") && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(); onOpenChange(false); }}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-slate-50">
              <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667L5 13.667l-3.333.667.667-3.334L11.333 2Z" />
              </svg>
              Edit
            </button>
          )}
          {status === "pending" && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); onApprove(); onOpenChange(false); }}
                className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm text-[#16A34A] hover:bg-slate-50">
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onDecline(); onOpenChange(false); }}
                className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm text-[#DC2626] hover:bg-slate-50">
                <X className="h-3.5 w-3.5" /> Decline
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared table (view + edit) ───────────────────────────────────────────────

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-11 flex items-center px-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
      {children}
    </div>
  );
}

const PP_COL_HEADERS = [
  localizationConstants.financeDateCol,
  localizationConstants.financePaymentItemCol,
  localizationConstants.financeDescriptionCol,
  localizationConstants.financeAmountCol,
  localizationConstants.financeWithheldFundsCol,
  localizationConstants.financeRgtCol,
  localizationConstants.financeTotalCol,
] as const;

function PaymentPlanTable({
  rows, editable, projectNo, onChange, onDelete, onAddRow,
}: {
  rows: PaymentPlanRow[]; editable: boolean; projectNo?: string;
  onChange?: (id: string, field: keyof PaymentPlanRow, val: string | number) => void;
  onDelete?: (id: string) => void;
  onAddRow?: () => void;
}) {
  const totalAmount   = rows.reduce((a, r) => a + r.amount, 0);
  const totalWithheld = rows.reduce((a, r) => a + r.withheldFunds, 0);
  const totalRot      = rows.reduce((a, r) => a + r.rgt, 0);
  const grandTotal    = totalAmount - totalWithheld - totalRot;

  function cellInput(row: PaymentPlanRow, field: keyof PaymentPlanRow, type: "text" | "number" = "text") {
    return (
      <input type={type} value={(row[field] ?? "") as string | number}
        onChange={(e) => onChange?.(row.id, field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full h-8 px-2 text-xs border border-[#E2E8F0] rounded bg-white focus:outline-none focus:border-[#94A3B8]"
      />
    );
  }

  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
      {projectNo && (
        <div className="px-4 py-3 border-b border-[#E2E8F0]">
          <span className="text-sm font-semibold text-[#020617]">
            <Translate text={localizationConstants.financeProjectNrLabel} /> {projectNo}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              {PP_COL_HEADERS.map((key) => (
                <th key={key} className="px-4 h-12 text-left text-sm font-medium text-[#64748B]">
                  <button type="button" className="cursor-pointer flex items-center gap-1 hover:text-slate-700 whitespace-nowrap">
                    <Translate text={key} /> <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </th>
              ))}
              {editable && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowTotal = row.amount - row.withheldFunds - row.rgt;
              return (
                <tr key={row.id} className="border-b border-[#E8EEF3] last:border-0">
                  <td className="px-3 py-2 h-12 min-w-32">
                    {editable ? cellInput(row, "date") : <span className="text-sm text-[#374151]">{row.date || "—"}</span>}
                  </td>
                  <td className="px-3 py-2 h-12 min-w-36">
                    {editable ? cellInput(row, "paymentItem") : <span className="text-sm text-[#374151]">{row.paymentItem || "—"}</span>}
                  </td>
                  <td className="px-3 py-2 h-12">
                    {editable ? cellInput(row, "description") : <span className="text-sm text-[#374151]">{row.description || "—"}</span>}
                  </td>
                  <td className="px-3 py-2 h-12 min-w-28">
                    {editable ? cellInput(row, "amount", "number") : <span className="text-sm text-[#374151]">{row.amount > 0 ? fmtAmount(row.amount) : "0"}</span>}
                  </td>
                  <td className="px-4 py-2 h-12 text-sm text-[#64748B] whitespace-nowrap">
                    {row.withheldFunds > 0 ? fmtAmount(row.withheldFunds) : "0"}
                  </td>
                  <td className="px-3 py-2 h-12 min-w-20">
                    {editable ? cellInput(row, "rgt", "number") : <span className="text-sm text-[#374151]">{row.rgt > 0 ? row.rgt : "0"}</span>}
                  </td>
                  <td className="px-4 py-2 h-12 text-sm font-medium text-[#020617] whitespace-nowrap">
                    {fmtAmount(rowTotal)}
                  </td>
                  {editable && (
                    <td className="py-2 h-12 w-10 text-center">
                      <button type="button" onClick={() => onDelete?.(row.id)}
                        className="cursor-pointer text-[#94A3B8] hover:text-[#DC2626] transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <td colSpan={3} className="px-4 h-12 text-sm font-bold text-[#020617]">Total</td>
              <td className="px-4 h-12 text-sm font-semibold text-[#020617] whitespace-nowrap">{totalAmount > 0 ? fmtAmount(totalAmount) : "0"}</td>
              <td className="px-4 h-12 text-sm font-semibold text-[#020617] whitespace-nowrap">{totalWithheld > 0 ? fmtAmount(totalWithheld) : "0"}</td>
              <td className="px-4 h-12 text-sm text-[#64748B]">{totalRot > 0 ? totalRot : "0"}</td>
              <td className="px-4 h-12 text-sm font-bold text-[#020617] whitespace-nowrap">{grandTotal > 0 ? fmtAmount(grandTotal) : "0"}</td>
              {editable && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
      {onAddRow && (
        <button type="button" onClick={onAddRow}
          className="cursor-pointer w-full py-3 text-sm text-[#64748B] border-t border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <Translate text={localizationConstants.financeNewLineLabel} />
        </button>
      )}
    </div>
  );
}

// ─── Payment plan list ────────────────────────────────────────────────────────

const PP_STATUS_OPTIONS: { value: "" | PaymentPlanStatus; label: string }[] = [
  { value: "",         label: "All" },
  { value: "draft",    label: "Draft" },
  { value: "pending",  label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

import type { ActiveProject } from "../../../types";
import {
  saveProjectPaymentPlanAPIAction,
  updatePaymentPlanStatusAPIAction,
} from "@/api-actions";

export function PaymentPlanList({
  plans, onView, onEdit, onCreateNew, onStatusChange, loading,
}: {
  plans: PaymentPlan[]; onView: (plan: PaymentPlan) => void; onEdit: (plan: PaymentPlan) => void;
  onCreateNew: () => void; onStatusChange: (id: string, status: PaymentPlanStatus) => void;
  project?: ActiveProject; loading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | PaymentPlanStatus>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);

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

  const filtered = useMemo(
    () =>
      plans.filter(
        (p) =>
          (p.designation.toLowerCase().includes(search.toLowerCase()) || p.idNo.includes(search)) &&
          (statusFilter === "" || p.status === statusFilter),
      ),
    [plans, search, statusFilter],
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ToolbarSearch value={search} onChange={setSearch} />
        <FilterButton onClick={toggleFilter} active={statusFilter !== ""} />
        <div className="flex-1" />
        <Button onClick={onCreateNew} className="h-9 px-4 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.financeCreateNewLabel} />
        </Button>
      </div>

      <div className="max-w-xl">
        <div className="grid grid-cols-[100px_1fr_150px_46px] border-b border-[#E2E8F0]">
          <TableHeaderCell><Translate text={localizationConstants.financeIdNoCol} /></TableHeaderCell>
          <TableHeaderCell><Translate text={localizationConstants.financeDesignationCol} /></TableHeaderCell>
          <TableHeaderCell><Translate text={localizationConstants.financeDateCol} /></TableHeaderCell>
          <div />
        </div>
        {loading ? (
          <div className="py-12 text-center text-sm text-[#94A3B8]">Loading payment plans...</div>
        ) : (
          <>
            {filtered.map((plan) => (
              <div key={plan.id} onClick={() => onView(plan)}
                className="grid grid-cols-[100px_1fr_150px_46px] border-b border-[#E8EEF3] last:border-b-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                <div className="h-14 flex items-center px-4 text-sm font-medium text-[#020617]">{plan.idNo}</div>
                <div className="h-14 flex items-center px-4 text-sm text-[#374151]">{plan.designation}</div>
                <div className="h-14 flex items-center px-4 text-sm text-[#64748B]">{plan.date}</div>
                <div onClick={(e) => e.stopPropagation()}>
                  <PaymentPlanActionsMenu
                    open={openMenuId === plan.id}
                    onOpenChange={(v) => setOpenMenuId(v ? plan.id : null)}
                    status={plan.status}
                    onView={() => onView(plan)}
                    onEdit={() => onEdit(plan)}
                    onApprove={() => onStatusChange(plan.id, "approved")}
                    onDecline={() => onStatusChange(plan.id, "declined")}
                  />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-[#94A3B8]">No payment plans match the filter.</div>
            )}
          </>
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
          {PP_STATUS_OPTIONS.map((opt) => (
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

// ─── Payment plan create ──────────────────────────────────────────────────────

export function PaymentPlanCreate({
  onBack, onCreate, plansCount, project,
}: {
  onBack: () => void; onCreate: (plan: PaymentPlan) => void; plansCount: number; project?: ActiveProject;
}) {
  const projectNo = project?.projectNo || project?.clientNo || "2024-01";
  const [rows, setRows] = useState<PaymentPlanRow[]>([
    { id: newRowId(), date: "", paymentItem: "", description: "", amount: 0, withheldFunds: 0, rgt: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  function addRow() {
    setRows((prev) => [...prev, { id: newRowId(), date: "", paymentItem: "", description: "", amount: 0, withheldFunds: 0, rgt: 0 }]);
  }

  function updateRow(id: string, field: keyof PaymentPlanRow, val: string | number) {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: val };
      if (field === "amount") updated.withheldFunds = Math.round(Number(val) * 0.1);
      return updated;
    }));
  }

  function deleteRow(id: string) { setRows((prev) => prev.filter((r) => r.id !== id)); }

  const totalAmount   = rows.reduce((a, r) => a + r.amount, 0);
  const totalWithheld = rows.reduce((a, r) => a + r.withheldFunds, 0);
  const totalRot      = rows.reduce((a, r) => a + r.rgt, 0);
  const grandTotal    = totalAmount - totalWithheld - totalRot;

  function cellInput(row: PaymentPlanRow, field: keyof PaymentPlanRow, type: "text" | "number" = "text") {
    return (
      <input type={type} value={(row[field] ?? "") as string | number}
        onChange={(e) => updateRow(row.id, field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full h-8 px-2 text-xs border border-[#E2E8F0] rounded bg-white focus:outline-none focus:border-[#94A3B8]"
      />
    );
  }

  const colHeaders = [
    localizationConstants.financeDateCol,
    localizationConstants.financePaymentItemCol,
    localizationConstants.financeDescriptionCol,
    localizationConstants.financeAmountCol,
    localizationConstants.financeWithheldFundsCol,
    localizationConstants.financeRgtCol,
    localizationConstants.financeTotalCol,
  ];

  const handleCreatePlan = async () => {
    const newPlan: PaymentPlan = {
      id: newRowId(),
      idNo: String(plansCount + 1).padStart(3, "0"),
      designation: `Payment Plan ${plansCount + 1}`,
      date: new Date().toISOString().slice(0, 10),
      projectNo,
      status: "draft",
      rows,
    };

    let planToCreate = newPlan;

    if (project?.id) {
      setSaving(true);
      try {
        const res = await saveProjectPaymentPlanAPIAction(project.id, newPlan);
        if (!res?.success) {
          toast.error(res?.error || "Failed to create payment plan");
          return;
        }
        if (res.data) {
          planToCreate = res.data as PaymentPlan;
        }
      } finally {
        setSaving(false);
      }
    }
    onCreate(planToCreate);
  };

  return (
    <div className="pb-10">
      <div className="flex items-center gap-2 mb-6">
        <button type="button" onClick={onBack}
          className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Back">
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#020617]">New Payment Plan</h2>
      </div>

      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Project header */}
        <div className="px-4 py-3 border-b border-[#E2E8F0]">
          <span className="text-sm font-semibold text-[#020617]">
            <Translate text={localizationConstants.financeProjectNrLabel} /> {projectNo}
          </span>
        </div>

        {/* Editable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {colHeaders.map((key) => (
                  <th key={key} className="px-4 h-12 text-left text-sm font-medium text-[#64748B]">
                    <button type="button" className="cursor-pointer flex items-center gap-1 hover:text-slate-700 whitespace-nowrap">
                      <Translate text={key} /> <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const total = row.amount - row.withheldFunds - row.rgt;
                return (
                  <tr key={row.id} className="border-b border-[#E8EEF3] last:border-0">
                    <td className="px-3 py-2 h-12 min-w-32">{cellInput(row, "date")}</td>
                    <td className="px-3 py-2 h-12 min-w-36">{cellInput(row, "paymentItem")}</td>
                    <td className="px-3 py-2 h-12">{cellInput(row, "description")}</td>
                    <td className="px-3 py-2 h-12 min-w-28">{cellInput(row, "amount", "number")}</td>
                    <td className="px-4 py-2 h-12 text-sm text-[#64748B] whitespace-nowrap">
                      {row.withheldFunds > 0 ? fmtAmount(row.withheldFunds) : "0"}
                    </td>
                    <td className="px-3 py-2 h-12 min-w-20">{cellInput(row, "rgt", "number")}</td>
                    <td className="px-4 py-2 h-12 text-sm font-medium text-[#020617] whitespace-nowrap">
                      {total > 0 ? fmtAmount(total) : "0"}
                    </td>
                    <td className="py-2 h-12 w-10 text-center">
                      <button type="button" onClick={() => deleteRow(row.id)}
                        className="cursor-pointer text-[#94A3B8] hover:text-[#DC2626] transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <td colSpan={3} className="px-4 h-12 text-sm font-bold text-[#020617]">Total</td>
                <td className="px-4 h-12 text-sm font-semibold text-[#020617] whitespace-nowrap">{totalAmount > 0 ? fmtAmount(totalAmount) : "0"}</td>
                <td className="px-4 h-12 text-sm font-semibold text-[#020617] whitespace-nowrap">{totalWithheld > 0 ? fmtAmount(totalWithheld) : "0"}</td>
                <td className="px-4 h-12 text-sm text-[#64748B]">{totalRot > 0 ? totalRot : "0"}</td>
                <td className="px-4 h-12 text-sm font-bold text-[#020617] whitespace-nowrap">{grandTotal > 0 ? fmtAmount(grandTotal) : "0"}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* + New Line — inside container like budget's Ny rad */}
        <button type="button" onClick={addRow}
          className="cursor-pointer w-full py-3 text-sm text-[#64748B] border-t border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <Translate text={localizationConstants.financeNewLineLabel} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E2E8F0]">
        <button type="button" onClick={onBack}
          className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
          <Translate text={localizationConstants.financeCancelLabel} />
        </button>
        <Button onClick={handleCreatePlan} disabled={saving} className="h-9 px-5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
          <Translate text={localizationConstants.financeSaveLabel} />
        </Button>
      </div>
    </div>
  );
}

// ─── Payment plan view / edit ─────────────────────────────────────────────────

export function PaymentPlanViewEdit({
  plan, mode, onBack, onSave, onStatusChange, onSwitchToEdit, project,
}: {
  plan: PaymentPlan; mode: "view" | "edit"; onBack: () => void;
  onSave: (updated: PaymentPlan) => void; onStatusChange: (status: PaymentPlanStatus) => void;
  onSwitchToEdit: () => void; project?: ActiveProject;
}) {
  const [rows, setRows] = useState<PaymentPlanRow[]>(plan.rows);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  function updateRow(id: string, field: keyof PaymentPlanRow, val: string | number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: newRowId(), date: "", paymentItem: "", description: "", amount: 0, withheldFunds: 0, rgt: 0 }]);
  }

  const handleStatusChangeInternal = async (status: PaymentPlanStatus, reason?: string) => {
    if (project?.id) {
      const res = await updatePaymentPlanStatusAPIAction(project.id, plan.id, status, reason);
      if (!res?.success) {
        toast.error(res?.error || "Failed to update status");
        return false;
      }
    }
    onStatusChange(status);
    return true;
  };

  const handleSaveInternal = async (updated: PaymentPlan) => {
    if (project?.id) {
      const res = await saveProjectPaymentPlanAPIAction(project.id, updated);
      if (!res?.success) {
        toast.error(res?.error || "Failed to save payment plan");
        return false;
      }
    }
    onSave(updated);
    return true;
  };

  return (
    <div className="pb-10">
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={onBack}
          className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Back">
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#020617]">{plan.designation}</span>
            <PaymentPlanStatusBadge status={plan.status} />
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            <Translate text={localizationConstants.financeProjectNrLabel} /> {plan.projectNo} · {plan.date}
          </p>
        </div>
        {mode === "view" && (
          <div className="ml-auto flex items-center gap-2">
            {(plan.status === "draft" || plan.status === "pending") && (
              <button type="button" onClick={onSwitchToEdit}
                className="cursor-pointer inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667L5 13.667l-3.333.667.667-3.334L11.333 2Z" />
                </svg>
                Edit
              </button>
            )}
            {plan.status === "pending" && (
              <>
                <button type="button" onClick={() => handleStatusChangeInternal("approved")}
                  className="cursor-pointer inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] rounded-md hover:bg-[#BBFCD0] transition-colors">
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button type="button" onClick={() => setShowDeclineDialog(true)}
                  className="cursor-pointer inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] rounded-md hover:bg-[#FECACA] transition-colors">
                  <X className="h-3.5 w-3.5" /> Decline
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <PaymentPlanTable
        rows={rows}
        editable={mode === "edit"}
        projectNo={plan.projectNo}
        onChange={updateRow}
        onDelete={deleteRow}
        onAddRow={mode === "edit" ? addRow : undefined}
      />

      {mode === "edit" && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E2E8F0]">
          <button type="button" onClick={onBack}
            className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
            <Translate text={localizationConstants.financeCancelLabel} />
          </button>
          <Button onClick={() => handleSaveInternal({ ...plan, rows })} className="h-9 px-5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]">
            <Translate text={localizationConstants.financeSaveLabel} />
          </Button>
        </div>
      )}

      {showDeclineDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6">
            <h3 className="text-base font-semibold text-[#020617] mb-1">Decline Payment Plan</h3>
            <p className="text-sm text-[#64748B] mb-4">Provide a reason for declining this payment plan.</p>
            <textarea value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} rows={3}
              placeholder="Reason for declining..."
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#94A3B8] resize-none mb-4" />
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowDeclineDialog(false)}
                className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50">
                Cancel
              </button>
              <Button onClick={async () => {
                const success = await handleStatusChangeInternal("declined", declineReason.trim() || undefined);
                if (success) setShowDeclineDialog(false);
              }}
                className="h-9 px-4 bg-[#DC2626] text-white text-sm font-medium hover:bg-[#B91C1C]">
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

