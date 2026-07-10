"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  ZoomIn,
  Download,
  Search,
  Plus,
  ArrowUpDown,
  MoreVertical,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  tags: string[];
  owner: string;
  linkedModules: string[];
  status: "published" | "draft";
  created: string;
  lastUpdated: string;
  recentActivity: string;
  categoryPath: string[];
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_TEMPLATES: ContractTemplate[] = [
  {
    id: "1",
    name: "Consultancy Agreement – Standard",
    type: "Contract",
    category: "Agreements",
    tags: ["konsult", "avtal", "standard"],
    owner: "Anna Svensson",
    linkedModules: ["Legal", "Data-It"],
    status: "published",
    created: "2024-01-15",
    lastUpdated: "2025-01-10",
    recentActivity: "Published by Anna Svensson • 2 days ago",
    categoryPath: ["Agreements", "Consultancy agreement"],
  },
  {
    id: "2",
    name: "Service Agreement – Basic",
    type: "Contract",
    category: "Agreements",
    tags: ["service", "basic"],
    owner: "Erik Lindqvist",
    linkedModules: ["Legal"],
    status: "draft",
    created: "2024-03-10",
    lastUpdated: "2024-11-22",
    recentActivity: "Draft updated by Erik • 5 days ago",
    categoryPath: ["Agreements", "Service agreement"],
  },
];

const DOCUMENT_PREVIEW = `<h1>Kontrakt</h1>
<p>Avtalsnummer: KA-2025-001</p>
<p>Datum: 2025-01-10</p>
<h2>1. PARTER</h2>
<p>Detta konsultavtal ("Avtalet") har denna dag ingåtts mellan:</p>
<p><strong>Uppdragsgivare:</strong> [Företagsnamn]<br>Organisationsnummer: [Org.nr]<br>Adress: [Adress]</p>
<p><strong>Konsult:</strong> [Konsultens namn]<br>Personnummer: [Personnummer]<br>Adress: [Adress]</p>
<h2>2. UPPDRAGETS OMFATTNING</h2>
<p>Konsulten åtar sig att utföra följande tjänster för Uppdragsgivaren:</p>
<ul>
  <li>Rådgivning och expertis inom [område]</li>
  <li>Deltagande i projektmöten och workshops</li>
  <li>Dokumentation och rapportering av utfört arbete</li>
</ul>
<h2>3. AVTALSTID</h2>
<p>Avtalet gäller från och med [startdatum] till och med [slutdatum], såvida det inte sägs upp eller förlängs enligt punkterna i detta avtal.</p>`;

// ─── Template detail view ─────────────────────────────────────────────────────

type DetailTab = "details" | "comments" | "versions";

function TemplateDetailView({
  template,
  onBack,
}: {
  template: ContractTemplate;
  onBack: () => void;
}) {
  const [starred, setStarred] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");

  const tabClass = (tab: DetailTab) =>
    `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? "border-[#09090B] text-[#09090B]"
        : "border-transparent text-[#64748B] hover:text-[#09090B]"
    }`;

  return (
    <div className="pb-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#09090B] transition-colors"
        >
          <Image src="/assets/icons/arrow-left.svg" alt="" width={16} height={16} />
          <Translate text={localizationConstants.contractBackLabel} />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-[#64748B] mb-3">
        {["Home", "Mina Projekt", "Projekthantering", "Bathroom"].map(
          (crumb, i, arr) => (
            <span key={crumb} className="flex items-center gap-1">
              <span className={i === arr.length - 1 ? "text-[#09090B] font-medium" : ""}>
                {crumb}
              </span>
              {i < arr.length - 1 && <span className="text-slate-300">&gt;</span>}
            </span>
          ),
        )}
      </div>

      {/* Title row */}
      <div className="flex items-center gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#09090B]">{template.name}</h2>
            <button
              type="button"
              onClick={() => setStarred((v) => !v)}
              className="text-amber-400 hover:text-amber-500 transition-colors"
              aria-label="Favourite"
            >
              <Star
                className="h-5 w-5"
                fill={starred ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="mt-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#047857] border border-green-200">
              <Translate text={localizationConstants.contractPublishedBadge} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="flex gap-5 items-start">
        {/* Left — Document preview */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            {/* Preview header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#09090B]">
                <Translate text={localizationConstants.contractDocPreviewLabel} />
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border-[#E2E8F0] text-[#09090B]"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  Zoom
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs border-[#E2E8F0] text-[#09090B]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <Translate text={localizationConstants.contractDownloadLabel} />
                </Button>
              </div>
            </div>

            {/* Document body — scrollable */}
            <div className="overflow-y-auto" style={{ maxHeight: 560 }}>
              <div className="bg-slate-50 p-6 min-h-120">
                <div className="max-w-150 mx-auto bg-white shadow-sm rounded-sm px-12 py-10 text-sm text-[#09090B]">
                  <style>{`
                    .preview-doc h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
                    .preview-doc h2 { font-size: 1rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.4rem; }
                    .preview-doc p  { margin-bottom: 0.6rem; line-height: 1.6; }
                    .preview-doc ul { padding-left: 1.5rem; margin-bottom: 0.75rem; }
                    .preview-doc li { margin-bottom: 0.2rem; }
                    .preview-doc strong { font-weight: 600; }
                  `}</style>
                  <div
                    className="preview-doc"
                    dangerouslySetInnerHTML={{ __html: DOCUMENT_PREVIEW }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="w-70 shrink-0 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={tabClass("details")}
            >
              <Translate text={localizationConstants.contractDetailsTabLabel} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("comments")}
              className={tabClass("comments")}
            >
              <Translate text={localizationConstants.contractCommentsTabLabel} />
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                1
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("versions")}
              className={tabClass("versions")}
            >
              <Translate text={localizationConstants.contractVersionsTabLabel} />
            </button>
          </div>

          <div className="p-4">
            {activeTab === "details" && (
              <div className="space-y-4 text-sm">
                {/* Category Path */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                    <Translate text={localizationConstants.contractCategoryPathLabel} />
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {template.categoryPath.map((c, i) => (
                      <span key={c} className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1 text-xs text-[#09090B] cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={i === template.categoryPath.length - 1}
                            className="rounded accent-[#18181B]"
                            readOnly
                          />
                          {c}
                        </label>
                        {i < template.categoryPath.length - 1 && (
                          <span className="text-slate-300 text-xs">›</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Template Type */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">
                    <Translate text={localizationConstants.contractTemplateTypeLabel} />
                  </p>
                  <p className="text-sm text-[#09090B]">{template.type}</p>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                    <Translate text={localizationConstants.contractTagsLabel} />
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-[#475569]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Owner */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">
                    <Translate text={localizationConstants.contractOwnerLabel} />
                  </p>
                  <p className="text-sm text-[#09090B]">{template.owner}</p>
                </div>

                {/* Linked Modules */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                    <Translate text={localizationConstants.contractLinkedModulesLabel} />
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.linkedModules.map((mod) => (
                      <span
                        key={mod}
                        className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">
                    <Translate text={localizationConstants.contractCreatedLabel} />
                  </p>
                  <p className="text-sm text-[#09090B]">{template.created}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">
                    <Translate text={localizationConstants.contractLastUpdatedLabel} />
                  </p>
                  <p className="text-sm text-[#09090B]">{template.lastUpdated}</p>
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">
                    <Translate text={localizationConstants.contractRecentActivityLabel} />
                  </p>
                  <p className="text-xs text-[#64748B]">{template.recentActivity}</p>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                    AS
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#09090B]">Anna Svensson</p>
                    <div className="mt-1 bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#09090B]">
                      Please review clauses 4 and 5 before finalizing.
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-lg">
                  <textarea
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-t-lg border-0 border-b border-[#E2E8F0] resize-none focus:outline-none"
                  />
                  <div className="px-3 py-2 flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-3 text-xs bg-[#18181B] hover:bg-[#18181B]/90 text-white"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "versions" && (
              <div className="space-y-3">
                {[
                  { v: "v1.2", date: "2025-01-10", by: "Anna Svensson", note: "Updated payment clause" },
                  { v: "v1.1", date: "2024-09-05", by: "Erik Lindqvist", note: "Minor corrections" },
                  { v: "v1.0", date: "2024-01-15", by: "Anna Svensson", note: "Initial version" },
                ].map((ver) => (
                  <div key={ver.v} className="flex items-start gap-3">
                    <div className="h-6 w-10 rounded bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                      {ver.v}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#09090B]">{ver.note}</p>
                      <p className="text-[10px] text-[#64748B]">{ver.by} · {ver.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Templates list view ──────────────────────────────────────────────────────

function TemplatesList({
  onSelect,
  onNewTemplate,
}: {
  onSelect: (template: ContractTemplate) => void;
  onNewTemplate: () => void;
}) {
  const t = useTranslate();
  const [search, setSearch] = useState("");

  const filtered = DUMMY_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pb-10">
      {/* Toolbar */}
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
        <Button
          type="button"
          onClick={onNewTemplate}
          className="ml-auto h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.contractNewTemplateLabel} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_130px_140px_minmax(0,1fr)_130px_46px] border-b border-[#E2E8F0]">
          {[
            localizationConstants.contractTemplateNameLabel,
            localizationConstants.contractTemplateTypeLabel,
            localizationConstants.contractCategoryLabel,
            localizationConstants.contractTagsLabel,
            localizationConstants.contractStatusLabel,
          ].map((key) => (
            <button
              key={key}
              type="button"
              className="flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 whitespace-nowrap text-left"
            >
              <Translate text={key} />
              <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
            </button>
          ))}
          <div className="border-l border-[#E2E8F0] h-12" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>
            <div className="text-center max-w-sm">
              <p className="text-sm font-semibold text-[#09090B] mb-1">
                <Translate text={localizationConstants.contractTemplateEmptyTitle} />
              </p>
              <p className="text-sm text-[#71717A]">
                <Translate text={localizationConstants.contractTemplateEmptySubtitle} />
              </p>
            </div>
            <Button
              type="button"
              onClick={onNewTemplate}
              className="h-9 gap-1.5 bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-4"
            >
              <Plus className="h-4 w-4" />
              <Translate text={localizationConstants.contractNewTemplateLabel} />
            </Button>
          </div>
        ) : (
          filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="grid grid-cols-[minmax(0,2fr)_130px_140px_minmax(0,1fr)_130px_46px] items-stretch border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onSelect(tmpl)}
            >
              <div className="h-14 flex items-center gap-2.5 px-4 min-w-0">
                <div className="h-7 w-7 rounded-[6px] bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-[#020617] truncate">
                  {tmpl.name}
                </span>
              </div>
              <span className="h-14 flex items-center px-4 text-sm text-[#64748B]">
                {tmpl.type}
              </span>
              <span className="h-14 flex items-center px-4 text-sm text-[#64748B]">
                {tmpl.category}
              </span>
              <div className="h-14 flex items-center px-4 gap-1.5 overflow-hidden min-w-0">
                {tmpl.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium bg-slate-100 text-slate-600 whitespace-nowrap shrink-0"
                  >
                    {tag}
                  </span>
                ))}
                {tmpl.tags.length > 2 && (
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                    +{tmpl.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="h-14 flex items-center px-4">
                {tmpl.status === "published" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-semibold bg-[#F0FDF4] text-[#16A34A]">
                    <Translate text={localizationConstants.contractPublishedBadge} />
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-semibold bg-slate-100 text-slate-500">
                    Draft
                  </span>
                )}
              </div>
              <div className="h-14 flex items-center justify-center border-l border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center h-9 w-9 rounded-[6px] text-[#64748B] hover:bg-slate-100 hover:text-[#18181B] transition-colors"
                  aria-label="Actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Exported orchestrator ────────────────────────────────────────────────────

interface ContractTemplatesViewProps {
  onNewTemplate: () => void;
}

export function ContractTemplatesView({ onNewTemplate }: ContractTemplatesViewProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);

  if (selectedTemplate) {
    return (
      <TemplateDetailView
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
      />
    );
  }

  return (
    <TemplatesList
      onSelect={setSelectedTemplate}
      onNewTemplate={onNewTemplate}
    />
  );
}
