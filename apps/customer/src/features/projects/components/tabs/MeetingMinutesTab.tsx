"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreVertical, Plus, ArrowUpDown, Search, ChevronDown, Check, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { MeetingMinute } from "../../types";
import { DUMMY_MEETING_MINUTES } from "../../constants";
import {
  getMeetingMinutesAPIAction,
  deleteMeetingMinuteAPIAction,
  type ApiMeetingMinuteItem,
} from "@/api-actions/project/meeting-minutes";

interface MeetingMinutesTabProps {
  projectId?: string;
}

const RATING_OPTIONS: { value: "" | MeetingMinute["rating"]; label: string }[] = [
  { value: "", label: "All Ratings" },
  { value: "good", label: "Good" },
  { value: "moderate", label: "Moderate" },
  { value: "bad", label: "Bad" },
];

const ratingStyle: Record<
  MeetingMinute["rating"],
  { label: string; bg: string; text: string }
> = {
  good: {
    label: localizationConstants.projectProtocolGood,
    bg: "bg-[#F0FDF4]",
    text: "text-[#047857]",
  },
  moderate: {
    label: localizationConstants.projectProtocolModerate,
    bg: "bg-[#FEFCE8]",
    text: "text-[#A16207]",
  },
  bad: {
    label: localizationConstants.projectProtocolBad,
    bg: "bg-[#FEF2F2]",
    text: "text-[#DC2626]",
  },
};

function formatEpochToDate(ms: number | string): string {
  if (typeof ms === "string" && ms.includes("-")) return ms;
  const num = typeof ms === "string" ? parseInt(ms, 10) : ms;
  if (!num || isNaN(num)) return new Date().toISOString().split("T")[0];
  return new Date(num).toISOString().split("T")[0];
}

export function MeetingMinutesTab({ projectId }: MeetingMinutesTabProps) {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"" | MeetingMinute["rating"]>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null);

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number } | null>(null);

  const fetchMinutes = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const res = await getMeetingMinutesAPIAction(projectId);
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      const mapped: MeetingMinute[] = res.data.map((item: ApiMeetingMinuteItem) => ({
        id: item.id,
        date: formatEpochToDate(item.meeting_date),
        title: item.title,
        rating: (item.action_protocol_status as MeetingMinute["rating"]) || "good",
        description: item.notes || "",
      }));
      setMinutes(mapped);
    } else {
      setMinutes([]);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setMinutes(DUMMY_MEETING_MINUTES);
      return;
    }
    void fetchMinutes();
  }, [projectId, fetchMinutes]);

  useEffect(() => {
    const close = () => {
      setFilterOpen(false);
      setFilterAnchor(null);
      setActiveMenuId(null);
      setMenuAnchor(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function toggleFilter(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (filterOpen) { setFilterOpen(false); setFilterAnchor(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setFilterOpen(true);
    setFilterAnchor({ top: rect.bottom + 4, left: rect.left });
  }

  function toggleMenu(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    e.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
      setMenuAnchor(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenuId(id);
    setMenuAnchor({ top: rect.bottom + 4, left: rect.left - 120 });
  }

  async function handleDelete(id: string) {
    if (projectId && !id.startsWith("local-")) {
      const res = await deleteMeetingMinuteAPIAction(projectId, id);
      if (res.success) {
        setMinutes((prev) => prev.filter((m) => m.id !== id));
      }
    } else {
      setMinutes((prev) => prev.filter((m) => m.id !== id));
    }
    setActiveMenuId(null);
    setMenuAnchor(null);
  }

  const filtered = minutes.filter(
    (m) =>
      (m.title.toLowerCase().includes(search.toLowerCase()) || m.date.includes(search)) &&
      (ratingFilter === "" || m.rating === ratingFilter),
  );

  return (
    <div className="pb-10">
      <div className="w-fit">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 min-w-152">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-9 h-9 w-48 text-sm border-slate-200"
            />
          </div>

          {/* Filter */}
          <button
            type="button"
            onClick={toggleFilter}
            className={`cursor-pointer h-9 px-3 flex items-center gap-1.5 text-sm font-medium border rounded-lg transition-colors ${ratingFilter
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
          >
            Filter
            {ratingFilter && <span className="text-xs font-normal">· {ratingFilter.charAt(0).toUpperCase() + ratingFilter.slice(1)}</span>}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Create New */}
          <Button
            type="button"
            className="ml-auto h-9 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <Translate text={localizationConstants.projectCreateNewLabel} />
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden min-w-[608px]">
          {/* Header */}
          <div className="grid grid-cols-[143px_240px_179px_46px] border-b border-[#E2E8F0] bg-white">
            <button
              type="button"
              className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
            >
              Date
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
            >
              Title
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="cursor-pointer flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
            >
              <Translate text={localizationConstants.projectActionProtocolLabel} />
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
            <div className="border-l border-[#E2E8F0] h-12" />
          </div>

          {/* Rows */}
          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              Loading meeting minutes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No meeting minutes found
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((minute) => {
                const rating = ratingStyle[minute.rating] || ratingStyle.good;
                return (
                  <div
                    key={minute.id}
                    className="grid grid-cols-[143px_240px_179px_46px] items-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm text-[#020617] h-14 flex items-center px-4">{minute.date}</span>
                    <span className="text-sm text-[#020617] truncate h-14 flex items-center px-4 pr-4">
                      {minute.title}
                    </span>
                    <div className="h-14 flex items-center px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium shadow-[0px_1px_2px_rgba(16,24,40,0.05)] ${rating.bg} ${rating.text}`}
                      >
                        <Translate text={rating.label} />
                      </span>
                    </div>
                    <div className="h-14 flex items-center justify-center border-l border-[#E2E8F0]">
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(e, minute.id)}
                        className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filter portal */}
      {filterOpen && filterAnchor && (
        <div
          style={{ position: "fixed", top: filterAnchor.top, left: filterAnchor.left, zIndex: 9999 }}
          className="w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Rating</p>
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setRatingFilter(opt.value); setFilterOpen(false); setFilterAnchor(null); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#374151] hover:bg-slate-50"
            >
              {opt.label}
              {ratingFilter === opt.value && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}

      {/* Actions dropdown menu */}
      {activeMenuId && menuAnchor && (
        <div
          style={{ position: "fixed", top: menuAnchor.top, left: menuAnchor.left, zIndex: 9999 }}
          className="w-36 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleDelete(activeMenuId)}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
