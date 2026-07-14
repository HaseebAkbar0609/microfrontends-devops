"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ContractCreateForm } from "./ContractCreateForm";
import { ContractDocumentEditor } from "./ContractDocumentEditor";
import { ContractTemplatesView } from "./ContractTemplateDetail";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContractSubTab = "list" | "contract" | "templates";

type ContractView =
  | { kind: "sub"; tab: ContractSubTab }
  | { kind: "contract-detail"; contract: Contract }
  | { kind: "create-form" }
  | { kind: "create-editor" };

type ContractStatus = "not-signed" | "signed";

interface ContractClause {
  id: string;
  date: string;
  name: string;
  fileType: string;
  fileUrl?: string;
}

interface Contract {
  id: string;
  nr: string;
  contactPerson: string;
  project: string;
  phone: string;
  email: string;
  role: string;
  status: ContractStatus;
  period: string;
  company: string;
  startDate: string;
  endDate: string;
  signedDate: string;
  nextReview: string;
  clauses: ContractClause[];
  jobDescription: string;
  jobLevel: string;
  hoursPerWeek: string;
  supervisor: string;
  offerPrice: string;
  paymentTerms: string;
  paidUntil: string;
  expensesAllowed: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_CLAUSES: ContractClause[] = [
  { id: "1", date: "2024-05-10", name: "Arbetsbeskrivning", fileType: "PDF", fileUrl: "#" },
  { id: "2", date: "2024-05-10", name: "Policy",            fileType: "PDF", fileUrl: "#" },
  { id: "3", date: "2024-05-10", name: "Policy",            fileType: "PDF", fileUrl: "#" },
];

const DUMMY_CONTRACTS: Contract[] = [
  {
    id: "1",
    nr: "K001",
    contactPerson: "Kalle Andersson",
    project: "TechCorp AB",
    phone: "070-450 50 10",
    email: "pelle@pellebygg.se",
    role: "Badrumsdesigner",
    status: "not-signed",
    period: "90 dagar",
    company: "TechCorp AB",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    signedDate: "2025-01-10",
    nextReview: "2025-02-10",
    clauses: DUMMY_CLAUSES,
    jobDescription: "Badrumsombyggnad",
    jobLevel: "Professionell",
    hoursPerWeek: "40 timmar",
    supervisor: "Anna Svensson",
    offerPrice: "56,000 kr",
    paymentTerms: "Måntalig",
    paidUntil: "-",
    expensesAllowed: "Ja",
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContractStatus }) {
  if (status === "signed") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-[#F0FDF4] text-[#047857]">
        <Translate text={localizationConstants.contractStatusSigned} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
      <Translate text={localizationConstants.contractStatusNotSigned} />
    </span>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function ContractEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center">
        <Image
          src="/assets/icons/union.svg"
          alt=""
          width={90}
          height={89}
        />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-base font-semibold text-[#09090B] mb-1">
          <Translate text={localizationConstants.contractEmptyTitle} />
        </p>
        <p className="text-sm text-[#71717A]">
          <Translate text={localizationConstants.contractEmptySubtitle} />
        </p>
      </div>
      <Button
        type="button"
        onClick={onCreate}
        className="h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
      >
        <Plus className="h-4 w-4" />
        <Translate text={localizationConstants.projectCreateNewLabel} />
      </Button>
    </div>
  );
}

// ─── Contract list ────────────────────────────────────────────────────────────

const CONTRACT_STATUS_OPTIONS: { value: "" | ContractStatus; label: string }[] = [
  { value: "",           label: "All" },
  { value: "signed",     label: "Signed" },
  { value: "not-signed", label: "Not Signed" },
];

function ContractList({
  onSelect,
  onCreateNew,
}: {
  onSelect: (contract: Contract) => void;
  onCreateNew: () => void;
}) {
  const t = useTranslate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ContractStatus>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);

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

  const filtered = DUMMY_CONTRACTS.filter(
    (c) =>
      (c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
       c.project.toLowerCase().includes(search.toLowerCase()) ||
       c.nr.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "" || c.status === statusFilter),
  );

  return (
    <div className="pb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(localizationConstants.searchPlaceholder)}
            className="pl-9 h-9 w-48 text-sm border-[#E2E8F0]"
          />
        </div>
        <button
          type="button"
          onClick={toggleFilter}
          className={`cursor-pointer h-9 px-3 flex items-center gap-1.5 text-sm font-medium border rounded-lg transition-colors ${
            statusFilter
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Translate text={localizationConstants.contractFilterLabel} />
          {statusFilter && <span className="text-xs font-normal">· {statusFilter === "signed" ? "Signed" : "Not Signed"}</span>}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <Button
          type="button"
          onClick={onCreateNew}
          className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.projectCreateNewLabel} />
        </Button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <ContractEmptyState onCreate={onCreateNew} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-4 h-12 text-left text-sm font-medium text-[#64748B] w-16">
                    <button type="button" className="cursor-pointer flex items-center gap-1 hover:text-slate-700">
                      <Translate text={localizationConstants.contractNrLabel} />
                      <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </th>
                  {[
                    localizationConstants.contractContactPersonLabel,
                    localizationConstants.contractProjectLabel,
                    localizationConstants.projectOrgPhoneLabel,
                    localizationConstants.contractEmailLabel,
                    localizationConstants.contractRoleLabel,
                    localizationConstants.contractStatusLabel,
                  ].map((key) => (
                    <th key={key} className="px-4 h-12 text-left text-sm font-medium text-[#64748B]">
                      <button type="button" className="flex items-center gap-1 hover:text-slate-700 whitespace-nowrap">
                        <Translate text={key} />
                        <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </th>
                  ))}
                  <th className="w-10 border-l border-[#E2E8F0]" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onSelect(contract)}
                  >
                    <td className="px-4 py-0 h-14 text-sm font-semibold text-[#020617] whitespace-nowrap">
                      {contract.nr}
                    </td>
                    <td className="px-4 py-0 h-14 text-sm text-[#020617]">
                      <span className="block truncate max-w-40">{contract.contactPerson}</span>
                    </td>
                    <td className="px-4 py-0 h-14 text-sm text-[#020617]">
                      <span className="block truncate max-w-40">{contract.project}</span>
                    </td>
                    <td className="px-4 py-0 h-14 text-sm text-[#020617] whitespace-nowrap">
                      {contract.phone}
                    </td>
                    <td className="px-4 py-0 h-14 text-sm text-[#020617]">
                      <span className="block truncate max-w-50">{contract.email}</span>
                    </td>
                    <td className="px-4 py-0 h-14 text-sm text-[#020617] whitespace-nowrap">
                      {contract.role}
                    </td>
                    <td className="px-4 py-0 h-14">
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className="py-0 h-14 w-10 border-l border-[#E2E8F0]" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="flex items-center justify-center h-full w-10 text-[#64748B] hover:text-[#18181B] hover:bg-slate-100 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Filter portal */}
      {filterOpen && filterAnchor && (
        <div
          style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
          className="w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Status</p>
          {CONTRACT_STATUS_OPTIONS.map((opt) => (
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

// ─── Contract detail ──────────────────────────────────────────────────────────

function ContractDetail({ contract }: { contract: Contract }) {
  return (
    <div className="pb-10">
      <div className="grid grid-cols-2 gap-5">

        {/* Top-left: Contract details */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg">
          <div className="flex items-center gap-2 p-4 border-b border-[#E4E4E7]">
            <Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} className="shrink-0" />
            <h3 className="text-base font-medium text-[#09090B]">
              <Translate text={localizationConstants.contractDetailsTitle} />
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractPeriodLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.period}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractCompanyLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractIdLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.nr.replace("K", "CN-2025-0")}</p>
            </div>
            <div />
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractStartDateLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractEndDateLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.endDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractSignedLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.signedDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractNextReviewLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.nextReview}</p>
            </div>
          </div>
        </div>

        {/* Top-right: Contract clauses — no card wrapper */}
        <div>
          <h3 className="text-sm font-medium text-[#09090B] mb-3">
            <Translate text={localizationConstants.contractClausesTitle} />
          </h3>
          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="grid grid-cols-[126px_1fr_73px_107px] border-b border-[#E2E8F0]">
              {[
                localizationConstants.projectFileDateLabel,
                localizationConstants.contractDocNameLabel,
                localizationConstants.projectFileLabel,
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  className="cursor-pointer flex items-center gap-1 h-12 px-3 text-sm font-medium text-[#64748B] hover:text-slate-700 whitespace-nowrap"
                >
                  <Translate text={key} />
                  <ArrowUpDown className="h-4 w-4 shrink-0" />
                </button>
              ))}
              <div className="h-12 border-l border-[#E2E8F0]" />
            </div>
            {contract.clauses.map((clause) => (
              <div
                key={clause.id}
                className="grid grid-cols-[126px_1fr_73px_107px] items-stretch border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
              >
                <span className="h-12 flex items-center px-3 text-sm text-[#020617]">
                  {clause.date}
                </span>
                <div className="h-12 flex items-center px-3 gap-2 min-w-0 overflow-hidden">
                  <Image
                    src="/assets/icons/file-pdf-icon.svg"
                    alt="PDF"
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <span className="text-sm text-[#020617] truncate min-w-0">
                    {clause.name}
                  </span>
                </div>
                <span className="h-12 flex items-center px-3 text-sm text-[#020617]">
                  {clause.fileType}
                </span>
                <div className="h-12 flex items-center px-3 border-l border-[#E2E8F0]">
                  {clause.fileUrl && (
                    <a
                      href={clause.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-w-16 h-9 px-2 text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      <Translate text={localizationConstants.contractViewFileLabel} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-left: Position details */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} className="shrink-0" />
              <h3 className="text-base font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractPositionTitle} />
              </h3>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-9 gap-2 text-sm font-medium bg-[#F4F4F5] text-[#09090B] hover:bg-zinc-200 border-0 shadow-sm"
            >
              <Pencil className="h-4 w-4" />
              <Translate text={localizationConstants.edit} />
            </Button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractJobDescLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.jobDescription}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractJobLevelLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.jobLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractHoursPerWeekLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.hoursPerWeek}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractSupervisorLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.supervisor}</p>
            </div>
          </div>
        </div>

        {/* Bottom-right: Compensation details */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} className="shrink-0" />
              <h3 className="text-base font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractCompensationTitle} />
              </h3>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-9 gap-2 text-sm font-medium bg-[#F4F4F5] text-[#09090B] hover:bg-zinc-200 border-0 shadow-sm"
            >
              <Pencil className="h-4 w-4" />
              <Translate text={localizationConstants.edit} />
            </Button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractOfferPriceLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.offerPrice}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractPaymentTermsLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.paymentTerms}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractPaidUntilLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.paidUntil}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#09090B]">
                <Translate text={localizationConstants.contractExpensesAllowedLabel} />
              </p>
              <p className="text-sm text-[#71717A]">{contract.expensesAllowed}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ContractTab({ onFullscreenChange }: { onFullscreenChange?: (v: boolean) => void }) {
  const [view, setView] = useState<ContractView>({ kind: "sub", tab: "list" });

  useEffect(() => {
    const isFullscreen = view.kind === "create-form" || view.kind === "create-editor";
    onFullscreenChange?.(isFullscreen);
  }, [view.kind, onFullscreenChange]);

  const subTabTriggerClass =
    "h-8 rounded-[6px] border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-slate-500 shadow-none " +
    "transition-all hover:text-slate-700 cursor-pointer select-none";
  const subTabActiveClass =
    "bg-white text-slate-900 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

  const SUB_TABS: { value: ContractSubTab; labelKey: string }[] = [
    { value: "list",      labelKey: localizationConstants.contractSubTabList },
    { value: "contract",  labelKey: localizationConstants.contractSubTabContract },
    { value: "templates", labelKey: localizationConstants.contractSubTabTemplates },
  ];

  const activeSubTab: ContractSubTab =
    view.kind === "sub" ? view.tab :
    view.kind === "contract-detail" ? "contract" :
    "list";

  const handleSubTabClick = (tab: ContractSubTab) => {
    setView({ kind: "sub", tab });
  };

  const showSubTabs =
    view.kind === "sub" ||
    view.kind === "contract-detail";

  return (
    <div>
      {/* Sub-tab pill bar — hidden during create flow */}
      {showSubTabs && (
        <div className="inline-flex h-10 items-center rounded-xl bg-[#F1F5F9] p-1 mb-6 w-fit gap-0">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleSubTabClick(tab.value)}
              className={`${subTabTriggerClass} ${activeSubTab === tab.value ? subTabActiveClass : ""}`}
            >
              <Translate text={tab.labelKey} />
            </button>
          ))}
        </div>
      )}

      {/* ── Views ── */}

      {view.kind === "sub" && view.tab === "list" && (
        <ContractList
          onSelect={(contract) =>
            setView({ kind: "contract-detail", contract })
          }
          onCreateNew={() => setView({ kind: "create-form" })}
        />
      )}

      {view.kind === "sub" && view.tab === "contract" && (
        <ContractDetail contract={DUMMY_CONTRACTS[0]} />
      )}

      {view.kind === "sub" && view.tab === "templates" && (
        <ContractTemplatesView
          onNewTemplate={() => setView({ kind: "create-editor" })}
        />
      )}

      {view.kind === "contract-detail" && (
        <ContractDetail contract={view.contract} />
      )}

      {view.kind === "create-form" && (
        <ContractCreateForm
          onBack={() => setView({ kind: "sub", tab: "list" })}
          onNext={() => setView({ kind: "create-editor" })}
        />
      )}

      {view.kind === "create-editor" && (
        <ContractDocumentEditor
          onBack={() => setView({ kind: "create-form" })}
          onSave={() => setView({ kind: "sub", tab: "list" })}
        />
      )}
    </div>
  );
}
