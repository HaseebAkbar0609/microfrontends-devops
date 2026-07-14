"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, Plus, ArrowUpDown, MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrgContact {
  id: string;
  name: string;
  phone: string;
  mail: string;
  role: string;
}

interface OrgCompany {
  id: string;
  company: string;
  category: string;
  role: string;
  phone: string;
  mail: string;
  contacts: OrgContact[];
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_ORG_COMPANIES: OrgCompany[] = [
  {
    id: "1",
    company: "Pelle bygg",
    category: "Målare",
    role: "-",
    phone: "070-450 50 10",
    mail: "pelle@pellebygg.se",
    contacts: [
      { id: "c1", name: "Kalle Andersson",  phone: "070-450 50 10", mail: "pelle@pellebygg.se", role: "Badrum Designer" },
      { id: "c2", name: "Stina Larsson",    phone: "070-450 50 10", mail: "pelle@pellebygg.se", role: "Electrician"     },
      { id: "c3", name: "Sven Eriksson",    phone: "070-450 50 10", mail: "pelle@pellebygg.se", role: "Wall Painter"    },
      { id: "c4", name: "Lars Gustavsson",  phone: "070-450 50 10", mail: "pelle@pellebygg.se", role: "Supervisor"      },
    ],
  },
  {
    id: "2",
    company: "Pelle bygg",
    category: "EL Tekniker",
    role: "-",
    phone: "070-450 50 10",
    mail: "pelle@pellebygg.se",
    contacts: [
      { id: "c5", name: "Johan Holm",       phone: "070-450 50 10", mail: "pelle@pellebygg.se", role: "Lead Electrician" },
      { id: "c6", name: "Anna Berg",        phone: "070-450 50 10", mail: "anna@pellebygg.se",  role: "Assistant"        },
    ],
  },
];

// ─── Detail view ─────────────────────────────────────────────────────────────

function CompanyDetail({ company, onBack }: { company: OrgCompany; onBack: () => void }) {
  return (
    <div className="pb-10">
      {/* Back + title */}
      <div className="flex items-center gap-1 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-[#64748B] hover:text-[#09090B] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-[#0A0A0A]">{company.company}</span>
      </div>

      {/* Contacts table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_180px_1fr_160px] border-b border-[#E2E8F0]">
          {[
            localizationConstants.projectContactPersonLabel,
            localizationConstants.projectOrgPhoneLabel,
            localizationConstants.projectOrgMailLabel,
            localizationConstants.projectOrgRoleLabel,
          ].map((key) => (
            <button
              key={key}
              type="button"
              className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
            >
              <Translate text={key} />
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* Rows */}
        {company.contacts.map((contact) => (
          <div
            key={contact.id}
            className="grid grid-cols-[1fr_180px_1fr_160px] items-center border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
          >
            <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{contact.name}</span>
            <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{contact.phone}</span>
            <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{contact.mail}</span>
            <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{contact.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = Array.from(new Set(DUMMY_ORG_COMPANIES.map((c) => c.category)));

export function OrgPlanTab() {
  const [selected, setSelected] = useState<OrgCompany | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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

  const filtered = DUMMY_ORG_COMPANIES.filter(
    (c) =>
      (c.company.toLowerCase().includes(search.toLowerCase()) ||
       c.category.toLowerCase().includes(search.toLowerCase())) &&
      (categoryFilter === "" || c.category === categoryFilter),
  );

  if (selected) {
    return <CompanyDetail company={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="pb-10">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-9 h-9 w-48 text-sm border-[#E2E8F0]"
          />
        </div>
        <button
          type="button"
          onClick={toggleFilter}
          className={`cursor-pointer h-9 px-3 flex items-center gap-1.5 text-sm font-medium border rounded-lg transition-colors ${
            categoryFilter
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50"
          }`}
        >
          Filter
          {categoryFilter && <span className="text-xs font-normal">· {categoryFilter}</span>}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <Button
          type="button"
          className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.projectCreateNewLabel} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_140px_140px_160px_1fr_46px] border-b border-[#E2E8F0]">
          {[
            localizationConstants.projectOrgCompanyLabel,
            localizationConstants.projectOrgCategoryLabel,
            localizationConstants.projectOrgRoleLabel,
            localizationConstants.projectOrgPhoneLabel,
            localizationConstants.projectOrgMailLabel,
          ].map((key) => (
            <button
              key={key}
              type="button"
              className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
            >
              <Translate text={key} />
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          ))}
          <div className="border-l border-[#E2E8F0] h-12" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No members found</div>
        ) : (
          filtered.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[1fr_140px_140px_160px_1fr_46px] items-center border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setSelected(member)}
            >
              <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{member.company}</span>
              <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{member.category}</span>
              <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{member.role}</span>
              <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{member.phone}</span>
              <span className="h-14 flex items-center px-4 text-sm text-[#020617]">{member.mail}</span>
              <div className="h-14 flex items-center justify-center border-l border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
                  aria-label="Actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter portal */}
      {filterOpen && filterAnchor && (
        <div
          style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
          className="w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Category</p>
          {[{ value: "", label: "All" }, ...ALL_CATEGORIES.map((c) => ({ value: c, label: c }))].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setCategoryFilter(opt.value); setFilterOpen(false); setFilterAnchor(null); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {categoryFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
