"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  Check,
  ArrowLeft,
  Star,
  ZoomIn,
  Download,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type KmaSubTab = "kvalitetssystem" | "miljosystem" | "arbetsmiljo" | "securecheck" | "avvikelser";
type KvalView  = "kvalitetssystem" | "kontrollplan" | "riskhantering" | "checklista";
type MiljoView = "miljosystem" | "miljoplan";
type ArbView   = "arbetsmiljo" | "arbetsmiljoplan";

interface KmaDoc {
  id: string; kma: string; date: string; documentName: string; fileType: string;
}

interface KmaFolder {
  id: string; name: string; count?: number; defaultOpen?: boolean; children?: KmaFolder[];
}

interface KmaControl {
  id: string; kontroll: string; lastUpdated: string; createdBy: string;
}

interface SecureCheck {
  id: string; nr: string; kontroll: string; source: string;
  datumKontroll: string; utfordAv: string; status: "completed" | "pending";
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_KMA_DOCS: KmaDoc[] = [
  { id: "1", kma: "Quality System", date: "2026-01-21", documentName: "Kvalitetssystem", fileType: "PDF" },
  { id: "2", kma: "Environment",    date: "2025-11-10", documentName: "Miljöplan v2",     fileType: "DOCX" },
];

const DUMMY_FOLDERS: KmaFolder[] = [
  {
    id: "10", name: "10.0 Styrande dokument", count: 5, defaultOpen: true,
    children: [
      { id: "10.1", name: "Consultancy agreement", count: 2 },
      { id: "10.2", name: "Subcontractor agreement", count: 3 },
    ],
  },
  {
    id: "11", name: "11.0 RISK- OCH KONT...", count: 4, defaultOpen: true,
    children: [
      { id: "11.1", name: "Offer letter" },
      { id: "11.2", name: "Employment confirmation", count: 5 },
    ],
  },
  { id: "12", name: "12.0 Process- och pro..." },
  { id: "13", name: "13.0 Kompetens och res..." },
  { id: "14", name: "14.0 Uppföljning och förb..." },
  { id: "m",  name: "Marketing" },
  { id: "s",  name: "Support / IT" },
  { id: "d",  name: "Debt collection" },
  { id: "o",  name: "Other modules" },
];

const DUMMY_CONTROLS: KmaControl[] = [
  { id: "1", kontroll: "10.1.1 Consultancy Agreement – Standard", lastUpdated: "2026-01-28", createdBy: "Lars Andersson" },
  { id: "2", kontroll: "10.1.2 Consultancy Agreement – Standard", lastUpdated: "2025-01-08", createdBy: "Lars Andersson" },
  { id: "3", kontroll: "10.1.3 Consultancy Agreement – Standard", lastUpdated: "2025-04-09", createdBy: "Anna Svensson" },
  { id: "4", kontroll: "10.1.4 Consultancy Agreement – Standard", lastUpdated: "2025-04-09", createdBy: "Anna Svensson" },
];

const DUMMY_SECURE_CHECKS: SecureCheck[] = [
  { id: "1", nr: "001", kontroll: "10.1.1 Consultancy Agreement – Standard", source: "Kontrollplan", datumKontroll: "2026-01-28", utfordAv: "Lars Andersson", status: "completed" },
  { id: "2", nr: "002", kontroll: "10.1.2 Consultancy Agreement – Standard", source: "Kontrollplan", datumKontroll: "2025-01-08", utfordAv: "Lars Andersson", status: "completed" },
  { id: "3", nr: "003", kontroll: "10.1.3 Consultancy Agreement – Standard", source: "Kontrollplan", datumKontroll: "2025-04-09", utfordAv: "Lars Andersson", status: "pending"   },
  { id: "4", nr: "004", kontroll: "10.1.4 Consultancy Agreement – Standard", source: "Järnkolla",    datumKontroll: "2025-04-09", utfordAv: "—",             status: "completed" },
];

// ─── Shared: row menu hook ────────────────────────────────────────────────────

function useRowMenu() {
  const [openMenu, setOpenMenu]     = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const close = () => { setOpenMenu(null); setMenuAnchor(null); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenu]);

  function handleOpen(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    e.stopPropagation();
    if (openMenu === id) { setOpenMenu(null); setMenuAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenMenu(id);
    setMenuAnchor({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }

  return { openMenu, menuAnchor, handleOpen };
}

// ─── Shared: filter button hook ───────────────────────────────────────────────

function useFilterBtn() {
  const [open, setOpen]     = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => { setOpen(false); setAnchor(null); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (open) { setOpen(false); setAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setOpen(true);
    setAnchor({ top: rect.bottom + 4, left: rect.left });
  }

  return { open, anchor, toggle, setOpen, setAnchor };
}

// ─── Shared: row menu portal ──────────────────────────────────────────────────

function RowMenuPortal({ anchor }: { anchor: { top: number; right: number } | null }) {
  const t = useTranslate();
  if (!anchor) return null;
  return (
    <div
      style={{ position: "fixed", top: anchor.top, right: anchor.right, zIndex: 9999 }}
      className="w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#374151] hover:bg-slate-50">
        <Pencil className="h-3.5 w-3.5" /> {t(localizationConstants.edit)}
      </button>
      <button type="button" className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#DC2626] hover:bg-red-50">
        <Trash2 className="h-3.5 w-3.5" /> {t(localizationConstants.delete)}
      </button>
      <button type="button" className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#374151] hover:bg-slate-50">
        <Archive className="h-3.5 w-3.5" /> {t(localizationConstants.archive)}
      </button>
    </div>
  );
}

// ─── Shared: generic view-selector dropdown ───────────────────────────────────

function ViewDropdown<T extends string>({
  value, options, onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const current = options.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer h-9 px-3 flex items-center gap-2 text-sm font-medium text-[#374151] bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors"
      >
        {current.label}
        <ChevronDown className={cn("h-4 w-4 text-[#94A3B8] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-52 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-2 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {opt.value === value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Folder icon (inline SVG so stroke color can be controlled) ───────────────

function FolderIcon({ hasChildren }: { hasChildren: boolean }) {
  const stroke = hasChildren ? "#F59E0B" : "#94A3B8";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M3.00001 8.26807C2.6951 8.44411 2.44206 8.69752 2.26647 9.00269C2.09088 9.30787 1.99896 9.65398 2.00001 10.0061V19.0001C2.00001 19.5305 2.21072 20.0392 2.5858 20.4143C2.96087 20.7894 3.46958 21.0001 4.00001 21.0001H15C15.3511 21.0001 15.696 20.9076 16 20.7321C16.304 20.5566 16.5565 20.3041 16.732 20.0001M20 5C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V14C22 14.5304 21.7893 15.0391 21.4142 15.4142C21.0391 15.7893 20.5304 16 20 16H9C8.46957 16 7.96086 15.7893 7.58579 15.4142C7.21071 15.0391 7 14.5304 7 14V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H11.5C11.7329 3 11.9625 3.05422 12.1708 3.15836C12.3791 3.2625 12.5603 3.41371 12.7 3.6L13.3 4.4C13.4397 4.58629 13.6209 4.7375 13.8292 4.84164C14.0375 4.94578 14.2671 5 14.5 5H20Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Shared: folder tree node ─────────────────────────────────────────────────

function FolderNode({ folder, selectedId, onSelect, depth = 0 }: {
  folder: KmaFolder; selectedId: string | null; onSelect: (id: string) => void; depth?: number;
}) {
  const [open, setOpen] = useState(folder.defaultOpen ?? false);
  const hasChildren = (folder.children?.length ?? 0) > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => { if (hasChildren) setOpen((o) => !o); onSelect(folder.id); }}
        className={cn(
          "cursor-pointer w-full flex items-center gap-1.5 px-2 py-[5px] text-xs rounded-md text-left transition-colors",
          selectedId === folder.id ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#374151] hover:bg-slate-50",
          hasChildren && selectedId !== folder.id && "font-semibold",
          depth > 0 && "pl-6",
        )}
      >
        {hasChildren ? (
          <ChevronRight className={cn("h-3 w-3 shrink-0 text-[#94A3B8] transition-transform", open && "rotate-90")} />
        ) : (
          <span className="h-3 w-3 shrink-0" />
        )}
        <FolderIcon hasChildren={hasChildren} />
        <span className="flex-1 truncate">{folder.name}</span>
        {folder.count !== undefined && (
          <span className="text-[10px] text-[#94A3B8] shrink-0 ml-1">{folder.count}</span>
        )}
      </button>
      {open && hasChildren && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode key={child.id} folder={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── KMA doc table (KMA / Date / Document name / File) ───────────────────────

const FILE_TYPE_OPTIONS = [
  { value: "",     label: "All Types" },
  { value: "PDF",  label: "PDF"       },
  { value: "DOCX", label: "DOCX"      },
];

function KMADocTable({ showCreateBtn = true, showFilters = true }: { showCreateBtn?: boolean; showFilters?: boolean }) {
  const t = useTranslate();
  const [search, setSearch]       = useState("");
  const [fileType, setFileType]   = useState("");
  const { open: fOpen, anchor: fAnchor, toggle: fToggle, setOpen: fSetOpen, setAnchor: fSetAnchor } = useFilterBtn();
  const { openMenu, menuAnchor, handleOpen } = useRowMenu();

  const filtered = DUMMY_KMA_DOCS.filter((d) => {
    const matchSearch = d.kma.toLowerCase().includes(search.toLowerCase()) || d.documentName.toLowerCase().includes(search.toLowerCase());
    const matchType   = fileType === "" || d.fileType === fileType;
    return matchSearch && matchType;
  });

  const activeLabel = FILE_TYPE_OPTIONS.find((o) => o.value === fileType)?.label;

  return (
    <div>
      {(showFilters || showCreateBtn) && (
        <div className="flex items-center gap-3 mb-4">
          {showFilters && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(localizationConstants.search)} className="pl-9 h-9 w-52 text-sm border-[#E2E8F0] bg-white" />
              </div>

              <button
                type="button"
                onClick={fToggle}
                className={cn(
                  "cursor-pointer h-9 px-3 flex items-center gap-2 text-sm font-medium border rounded-lg transition-colors",
                  fileType ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-[#E2E8F0] text-[#374151] hover:bg-slate-50",
                )}
              >
                {t(localizationConstants.filter)}
                {fileType && <span className="text-xs font-normal">· {activeLabel}</span>}
                <ChevronDown className={cn("h-4 w-4 transition-transform", fOpen && "rotate-180")} />
              </button>
            </>
          )}

          {showCreateBtn && (
            <button type="button" className="cursor-pointer ml-auto h-9 px-4 flex items-center gap-1.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <Plus className="h-4 w-4" /> {t(localizationConstants.createNewButtonText)}
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {[localizationConstants.kma, localizationConstants.kmaColDate, localizationConstants.kmaColDocumentName, localizationConstants.kmaColFile].map((col) => (
                  <th key={col} className="px-4 py-3.5 text-left font-medium text-slate-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{t(col)} <ArrowUpDown className="h-3.5 w-3.5 opacity-50" /></span>
                  </th>
                ))}
                <th className="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-600">{doc.kma}</td>
                  <td className="px-4 py-3.5 text-slate-600">{doc.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Image src="/assets/icons/file-pdf-icon.svg" alt="PDF" width={24} height={24} className="shrink-0" />
                      <span className="text-slate-600">{doc.documentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{doc.fileType}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button type="button" onClick={(e) => handleOpen(e, doc.id)} className="cursor-pointer p-1 rounded hover:bg-slate-100 text-[#94A3B8] transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No documents match the filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter portal */}
      {fOpen && fAnchor && (
        <div
          style={{ position: "fixed", top: fAnchor.top, left: fAnchor.left, zIndex: 9999 }}
          className="w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">File Type</p>
          {FILE_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setFileType(opt.value); fSetOpen(false); fSetAnchor(null); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {fileType === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}

      {openMenu && <RowMenuPortal anchor={menuAnchor} />}
    </div>
  );
}

// ─── Control table (colName / File / Last Updated / Created by) ───────────────

const CREATOR_OPTIONS = [
  { value: "",               label: "All" },
  { value: "Lars Andersson", label: "Lars Andersson" },
  { value: "Anna Svensson",  label: "Anna Svensson"  },
];

function ControlTableRows({ colName, onRowClick, showFilters = true }: { colName: string; onRowClick?: (c: KmaControl) => void; showFilters?: boolean }) {
  const t = useTranslate();
  const [search, setSearch]     = useState("");
  const [creator, setCreator]   = useState("");
  const { open: fOpen, anchor: fAnchor, toggle: fToggle, setOpen: fSetOpen, setAnchor: fSetAnchor } = useFilterBtn();
  const { openMenu, menuAnchor, handleOpen } = useRowMenu();

  const filtered = DUMMY_CONTROLS.filter((c) => {
    const matchSearch  = c.kontroll.toLowerCase().includes(search.toLowerCase()) || c.createdBy.toLowerCase().includes(search.toLowerCase());
    const matchCreator = creator === "" || c.createdBy === creator;
    return matchSearch && matchCreator;
  });

  const activeLabel = CREATOR_OPTIONS.find((o) => o.value === creator)?.label;

  return (
    <>
      {showFilters && (
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(localizationConstants.search)} className="pl-9 h-9 w-44 text-sm border-[#E2E8F0] bg-white" />
          </div>

          <button
            type="button"
            onClick={fToggle}
            className={cn(
              "cursor-pointer h-9 px-3 flex items-center gap-2 text-sm font-medium border rounded-lg transition-colors",
              creator ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-[#E2E8F0] text-[#374151] hover:bg-slate-50",
            )}
          >
            {t(localizationConstants.filter)}
            {creator && <span className="text-xs font-normal">· {activeLabel}</span>}
            <ChevronDown className={cn("h-4 w-4 transition-transform", fOpen && "rotate-180")} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-4 py-3.5 text-left font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1">{colName} <ArrowUpDown className="h-3.5 w-3.5 opacity-50" /></span>
                </th>
                <th className="px-4 py-3.5 text-left font-medium text-slate-500">{t(localizationConstants.kmaColFile)}</th>
                <th className="px-4 py-3.5 text-left font-medium text-slate-500 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">{t(localizationConstants.projectLastUpdatedLabel)}... <ArrowUpDown className="h-3.5 w-3.5 opacity-50" /></span>
                </th>
                <th className="px-4 py-3.5 text-left font-medium text-slate-500 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">{t(localizationConstants.kmaColCreatedBy)} <ArrowUpDown className="h-3.5 w-3.5 opacity-50" /></span>
                </th>
                <th className="px-4 py-3.5 w-10">
                  <button type="button" className="cursor-pointer p-0.5 rounded hover:bg-slate-100 text-[#64748B] transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((control) => (
                <tr
                  key={control.id}
                  onClick={() => onRowClick?.(control)}
                  className={cn(
                    "border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60 transition-colors",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  <td className="px-4 py-3.5 text-slate-600">{control.kontroll}</td>
                  <td className="px-4 py-3.5">
                    <Image src="/assets/icons/file-pdf-icon.svg" alt="PDF" width={24} height={24} className="shrink-0" />
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{control.lastUpdated}</td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{control.createdBy}</td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={(e) => handleOpen(e, control.id)} className="cursor-pointer p-1 rounded hover:bg-slate-100 text-[#94A3B8] transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No records match the filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter portal */}
      {fOpen && fAnchor && (
        <div
          style={{ position: "fixed", top: fAnchor.top, left: fAnchor.left, zIndex: 9999 }}
          className="w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Created by</p>
          {CREATOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setCreator(opt.value); fSetOpen(false); fSetAnchor(null); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {creator === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}

      {openMenu && <RowMenuPortal anchor={menuAnchor} />}
    </>
  );
}

// ─── Standalone control table (no folder tree) ────────────────────────────────

function StandaloneControlView({ colName, showFilters = true }: { colName: string; showFilters?: boolean }) {
  return <ControlTableRows colName={colName} showFilters={showFilters} />;
}

// ─── Split view (folder tree + control table) ─────────────────────────────────

function SplitView({ colName, title, onRowClick, showFilters = true }: { colName: string; title: string; onRowClick?: (c: KmaControl) => void; showFilters?: boolean }) {
  const t = useTranslate();
  const [selectedFolder, setSelectedFolder] = useState<string | null>("10.1");
  const [folderSearch, setFolderSearch]     = useState("");

  const filteredFolders = folderSearch
    ? DUMMY_FOLDERS.filter((f) => f.name.toLowerCase().includes(folderSearch.toLowerCase()))
    : DUMMY_FOLDERS;

  return (
    <div className="flex gap-4">
      <div className="w-60 shrink-0 bg-white border border-[#E2E8F0] rounded-xl p-3 flex flex-col gap-2 self-start">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
          <input
            value={folderSearch}
            onChange={(e) => setFolderSearch(e.target.value)}
            placeholder={`${t(localizationConstants.search)} folders...`}
            className="w-full pl-8 pr-2 h-8 text-xs rounded-md border border-[#E2E8F0] bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="space-y-0.5">
          {filteredFolders.map((folder) => (
            <FolderNode key={folder.id} folder={folder} selectedId={selectedFolder} onSelect={setSelectedFolder} />
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-3">{title}</h3>
        <ControlTableRows colName={colName} onRowClick={onRowClick} showFilters={showFilters} />
      </div>
    </div>
  );
}

// ─── SecureCheck detail view ──────────────────────────────────────────────────

type DetailRightTab = "details" | "foto" | "avvikelse";

function SecureCheckDetail({ check, onBack }: { check: SecureCheck; onBack: () => void }) {
  const t = useTranslate();
  const [rightTab, setRightTab] = useState<DetailRightTab>("details");

  const rightTabs: { value: DetailRightTab; label: string }[] = [
    { value: "details",   label: "Details" },
    { value: "foto",      label: t(localizationConstants.kmaDetailPhoto) },
    { value: "avvikelse", label: t(localizationConstants.kmaDetailDeviation) },
  ];

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-3 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[#0F172A]">{check.kontroll}</h2>
          <Star className="h-5 w-5 fill-amber-400 text-amber-400 shrink-0" />
        </div>
        <button type="button" className="cursor-pointer shrink-0 h-9 px-4 flex items-center gap-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <Check className="h-4 w-4" /> Mark as done
        </button>
      </div>

      <div className="flex gap-5">
        {/* Left: document preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-[#0F172A]">Document Preview</span>
            <button type="button" className="cursor-pointer flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
              <ZoomIn className="h-3.5 w-3.5" /> Zoom
            </button>
            <button type="button" className="cursor-pointer flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 min-h-96">
            {/* Swedish document content — kept as-is (document data, not UI) */}
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Kontrollplan</h3>
            <p className="text-sm text-[#374151] mb-1">Kontroll nr: KA-2025-001</p>
            <p className="text-sm text-[#374151] mb-5">Datum: 2025-01-10</p>
            <h4 className="text-sm font-semibold text-[#0F172A] mb-1">1. Kontrollera fall i badrum</h4>
            <p className="text-sm text-[#374151] mb-5">Skall luta 2 cm per meter till golvbrunn</p>

            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-[#E2E8F0] bg-slate-50">
                <div className="px-4 py-2 text-xs font-medium text-[#374151] border-r border-[#E2E8F0]">Bad/Duschplats</div>
                <div className="px-4 py-2 text-xs font-medium text-[#374151]">Övrig golvyta</div>
              </div>
              <div className="flex">
                <div className="flex-1 flex items-center justify-start px-3 py-2">
                  <span className="text-xs text-[#64748B] italic">Se bild</span>
                </div>
                <div className="flex-3 py-2 px-2">
                  <svg viewBox="0 0 320 80" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="70" x2="320" y2="70" stroke="#94A3B8" strokeWidth="1" />
                    <polygon points="0,65 320,60 320,70 0,70" fill="#93C5FD" opacity="0.6" />
                    <polygon points="0,50 160,48 320,45 320,60 160,62 0,65" fill="#CBD5E1" opacity="0.7" />
                    <line x1="70" y1="20" x2="20" y2="20" stroke="#64748B" strokeWidth="1" markerEnd="url(#arrow)" />
                    <defs>
                      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#64748B" />
                      </marker>
                    </defs>
                    <text x="240" y="58" fontSize="7" fill="#374151">Fastmassa</text>
                    <text x="240" y="68" fontSize="7" fill="#374151">Tätskikt</text>
                    <line x1="160" y1="10" x2="160" y2="72" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="3,2" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-[#E2E8F0] text-xs text-[#64748B]">
                <div className="px-4 py-2 border-r border-[#E2E8F0]">
                  <div>1:150 – 1:50</div>
                  <div className="text-[#94A3B8]">7 – 20 mm/m</div>
                </div>
                <div className="px-4 py-2">
                  <div>Övrig golvfall: 1:500 – 1:100</div>
                  <div className="text-[#94A3B8]">2 – 10 mm/m</div>
                </div>
              </div>
              <div className="px-4 py-1.5 border-t border-[#E2E8F0] bg-slate-50 text-xs text-[#64748B]">
                Rekommendation: 5 – 10 mm/m
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 shrink-0 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden self-start">
          <div className="flex border-b border-[#E2E8F0]">
            {rightTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setRightTab(tab.value)}
                className={cn(
                  "cursor-pointer flex-1 py-2.5 text-xs font-medium transition-colors",
                  rightTab === tab.value
                    ? "text-[#0F172A] border-b-2 border-[#0F172A]"
                    : "text-[#64748B] hover:text-[#0F172A]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {rightTab === "details" && (
            <div className="p-4 space-y-4 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1.5">Category Path</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded text-[#374151] text-[11px]">Agreements</span>
                  <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
                  <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded text-[#374151] text-[11px]">Consultancy agreement</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1.5">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                  Pending
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {["konsult", "avtal", "standard"].map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded-full text-[11px] text-[#374151]">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Owner</p>
                <p className="text-[#374151]">Anna Svensson</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Created</p>
                  <p className="text-[#374151]">2024-01-15</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Last Updated</p>
                  <p className="text-[#374151]">2025-01-10</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Recent Activity</p>
                <p className="text-[#374151]">Published by Anna Svensson • 2 days ago</p>
              </div>
              <div className="border-t border-[#E2E8F0]" />
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">{t(localizationConstants.kmaRegisteredInfo)}</p>
                <div className="space-y-2">
                  <p className="text-[#374151] font-medium">Kalle Andersson</p>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">{t(localizationConstants.kmaColDate)}</p>
                    <p className="text-[#374151]">2024-01-15</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">Time</p>
                    <p className="text-[#374151]">09:37</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">{t(localizationConstants.kmaColControl)}</p>
                    <p className="text-[#374151]">Bank-id (Timeflow-sign)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">{t(localizationConstants.kmaFieldComment)}</p>
                    <p className="text-[#374151]">Vi kontrollerade golvet och det är perfekt för att lägga klinker.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {rightTab === "foto"      && <div className="p-4 text-xs text-[#94A3B8] text-center py-12">{t(localizationConstants.kmaNoPhotos)}</div>}
          {rightTab === "avvikelse" && <div className="p-4 text-xs text-[#94A3B8] text-center py-12">{t(localizationConstants.kmaNoDeviations)}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── SecureCheck list view ────────────────────────────────────────────────────

const STATUS_STYLE = {
  completed: { bg: "bg-[#F0FDF4]", text: "text-[#047857]", label: "Completed" },
  pending:   { bg: "bg-amber-50",  text: "text-amber-600",  label: "Pending"   },
};

function SecureCheckListView({ onRowClick }: { onRowClick: (check: SecureCheck) => void }) {
  const t = useTranslate();
  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { openMenu, menuAnchor, handleOpen } = useRowMenu();

  const totalChecks     = DUMMY_SECURE_CHECKS.length;
  const completedChecks = DUMMY_SECURE_CHECKS.filter((c) => c.status === "completed").length;

  const totalPages = Math.max(1, Math.ceil(DUMMY_SECURE_CHECKS.length / rowsPerPage));
  const pageRows   = DUMMY_SECURE_CHECKS.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div>
      <h3 className="text-base font-semibold text-[#0F172A] mb-4">{t(localizationConstants.kmaAllChecks)}</h3>

      {/* Stats */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex flex-col gap-2 bg-white border border-[#E2E8F0] rounded-lg w-96 pt-[21px] px-[21px] pb-5">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-[0.3px]">Total Checks</p>
          <p className="text-[32px] font-semibold text-[#0A0A0A] leading-[48px]">{totalChecks}</p>
          <p className="text-xs text-[#64748B]">Checks info</p>
        </div>
        <div className="flex flex-col gap-2 bg-white border border-[#E2E8F0] rounded-lg w-96 pt-[21px] px-[21px] pb-5">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-[0.3px]">Completed Checks</p>
          <p className="text-[32px] font-semibold text-[#0A0A0A] leading-[48px]">{completedChecks}</p>
          <p className="text-xs text-[#64748B]">{t(localizationConstants.kmaCompletedChecksInfo)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {[
                  { label: "Nr", w: "w-16" },
                  { label: t(localizationConstants.kmaColControl) },
                  { label: "Source" },
                  { label: t(localizationConstants.kmaColInspectionDate) },
                  { label: t(localizationConstants.kmaColPerformedBy) },
                  { label: "Status" },
                  { label: t(localizationConstants.kmaColFile), noSort: true },
                ].map(({ label, w, noSort }) => (
                  <th key={label} className={cn("px-4 py-3.5 text-left font-medium text-slate-500 whitespace-nowrap", w)}>
                    {noSort ? label : (
                      <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className="h-3.5 w-3.5 opacity-50" /></span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3.5 w-10">
                  <button type="button" className="cursor-pointer p-0.5 rounded hover:bg-slate-100 text-[#64748B]">
                    <Plus className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((check) => {
                const style = STATUS_STYLE[check.status];
                return (
                  <tr
                    key={check.id}
                    onClick={() => onRowClick(check)}
                    className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-950">{check.nr}</td>
                    <td className="px-4 py-3.5 text-slate-600">{check.kontroll}</td>
                    <td className="px-4 py-3.5 text-slate-600">{check.source}</td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{check.datumKontroll}</td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{check.utfordAv}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", style.bg, style.text)}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Image src="/assets/icons/file-pdf-icon.svg" alt="PDF" width={24} height={24} className="shrink-0" />
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={(e) => handleOpen(e, check.id)} className="cursor-pointer p-1 rounded hover:bg-slate-100 text-[#94A3B8] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">No checks match the filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-[#E2E8F0] text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="text-xs">{t(localizationConstants.kmaRowsPerPage)}</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="cursor-pointer h-7 rounded border border-[#E2E8F0] bg-white px-1.5 text-xs focus:outline-none"
            >
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <span className="text-xs">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="cursor-pointer p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="cursor-pointer p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {openMenu && <RowMenuPortal anchor={menuAnchor} />}
    </div>
  );
}

// ─── Sub-tab: Kvalitetssystem ─────────────────────────────────────────────────

function KvalitetssystemSubTab() {
  const t = useTranslate();
  const [view, setView]                       = useState<KvalView>("kvalitetssystem");
  const [selectedControl, setSelectedControl] = useState<KmaControl | null>(null);

  const KVAL_OPTIONS: { value: KvalView; label: string }[] = [
    { value: "kvalitetssystem", label: t(localizationConstants.kmaSubTabQualitySystem) },
    { value: "kontrollplan",    label: t(localizationConstants.kmaViewControlPlan)      },
    { value: "riskhantering",   label: t(localizationConstants.kmaViewRiskManagement)   },
    { value: "checklista",      label: t(localizationConstants.kmaViewChecklist)        },
  ];

  const KVAL_SPLIT_TITLES: Record<KvalView, string> = {
    kvalitetssystem: "",
    kontrollplan:    t(localizationConstants.kmaViewControlPlan),
    riskhantering:   t(localizationConstants.kmaViewRiskManagement),
    checklista:      t(localizationConstants.kmaViewChecklist),
  };

  if (selectedControl) {
    const asCheck: SecureCheck = {
      id: selectedControl.id, nr: "001", kontroll: selectedControl.kontroll,
      source: "Kontrollplan", datumKontroll: selectedControl.lastUpdated,
      utfordAv: selectedControl.createdBy, status: "pending",
    };
    return <SecureCheckDetail check={asCheck} onBack={() => setSelectedControl(null)} />;
  }

  return (
    <div>
      <div className="mb-5">
        <ViewDropdown value={view} options={KVAL_OPTIONS} onChange={setView} />
      </div>
      {view === "kvalitetssystem" ? (
        <KMADocTable showFilters={false} />
      ) : (
        <SplitView
          colName={t(localizationConstants.kmaColControl)}
          title={KVAL_SPLIT_TITLES[view]}
          onRowClick={setSelectedControl}
          showFilters={view !== "checklista"}
        />
      )}
    </div>
  );
}

// ─── Sub-tab: Miljösystem ─────────────────────────────────────────────────────

function MiljosystemSubTab() {
  const t = useTranslate();
  const [view, setView] = useState<MiljoView>("miljosystem");

  const MILJO_OPTIONS: { value: MiljoView; label: string }[] = [
    { value: "miljosystem", label: t(localizationConstants.kmaSubTabEnvironment)    },
    { value: "miljoplan",   label: t(localizationConstants.kmaViewEnvironmentalPlan) },
  ];

  return (
    <div>
      <div className="mb-5">
        <ViewDropdown value={view} options={MILJO_OPTIONS} onChange={setView} />
      </div>
      {view === "miljosystem" ? (
        <StandaloneControlView colName={t(localizationConstants.kmaSubTabEnvironment)} showFilters={false} />
      ) : (
        <SplitView colName={t(localizationConstants.kmaSubTabEnvironment)} title={t(localizationConstants.kmaViewEnvironmentalPlan)} />
      )}
    </div>
  );
}

// ─── Sub-tab: Arbetsmiljö ─────────────────────────────────────────────────────

function ArbetsmiljoSubTab() {
  const t = useTranslate();
  const [view, setView] = useState<ArbView>("arbetsmiljo");

  const ARB_OPTIONS: { value: ArbView; label: string }[] = [
    { value: "arbetsmiljo",     label: t(localizationConstants.kmaSubTabWorkEnv)  },
    { value: "arbetsmiljoplan", label: t(localizationConstants.kmaViewWorkEnvPlan) },
  ];

  return (
    <div>
      <div className="mb-5">
        <ViewDropdown value={view} options={ARB_OPTIONS} onChange={setView} />
      </div>
      {view === "arbetsmiljo" ? (
        <KMADocTable showFilters={false} />
      ) : (
        <SplitView colName={t(localizationConstants.kmaSubTabWorkEnv)} title={t(localizationConstants.kmaViewWorkEnvPlan)} />
      )}
    </div>
  );
}

// ─── Sub-tab: SecureCheck ─────────────────────────────────────────────────────

function SecureCheckSubTab() {
  const [selectedCheck, setSelectedCheck] = useState<SecureCheck | null>(null);

  if (selectedCheck) {
    return <SecureCheckDetail check={selectedCheck} onBack={() => setSelectedCheck(null)} />;
  }
  return <SecureCheckListView onRowClick={setSelectedCheck} />;
}

// ─── Main export ──────────────────────────────────────────────────────────────

const subTabBase   = "cursor-pointer h-8 rounded-[6px] border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-slate-500 shadow-none transition-all hover:text-slate-700 select-none whitespace-nowrap";
const subTabActive = "bg-white text-slate-900 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

export function QualityTab() {
  const t = useTranslate();
  const [activeSubTab, setActiveSubTab] = useState<KmaSubTab>("kvalitetssystem");

  const KMA_SUB_TABS: { value: KmaSubTab; label: string }[] = [
    { value: "kvalitetssystem", label: t(localizationConstants.kmaSubTabQualitySystem) },
    { value: "miljosystem",     label: t(localizationConstants.kmaSubTabEnvironment)   },
    { value: "arbetsmiljo",     label: t(localizationConstants.kmaSubTabWorkEnv)       },
    { value: "securecheck",     label: "Secure Checks"                                 },
    { value: "avvikelser",      label: t(localizationConstants.kmaSubTabDeviations)    },
  ];

  return (
    <div className="pb-10">
      <div className="inline-flex h-10 items-center rounded-xl bg-[#F1F5F9] p-1 mb-6 w-fit gap-0">
        {KMA_SUB_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveSubTab(tab.value)}
            className={cn(subTabBase, activeSubTab === tab.value && subTabActive)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "kvalitetssystem" && <KvalitetssystemSubTab />}
      {activeSubTab === "miljosystem"     && <MiljosystemSubTab />}
      {activeSubTab === "arbetsmiljo"     && <ArbetsmiljoSubTab />}
      {activeSubTab === "securecheck"     && <SecureCheckSubTab />}
      {activeSubTab === "avvikelser"      && (
        <div className="py-16 text-center text-slate-400 text-sm">Coming soon</div>
      )}
    </div>
  );
}
