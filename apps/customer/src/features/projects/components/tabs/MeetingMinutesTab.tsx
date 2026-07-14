"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, MoreVertical, Plus, ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DUMMY_MEETING_MINUTES } from "../../constants";
import type { MeetingMinute } from "../../types";

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

const RATING_OPTIONS: { value: "" | MeetingMinute["rating"]; label: string }[] = [
  { value: "",         label: "All" },
  { value: "good",     label: "Good" },
  { value: "moderate", label: "Moderate" },
  { value: "bad",      label: "Bad" },
];

export function MeetingMinutesTab() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"" | MeetingMinute["rating"]>("");
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

  const filtered = DUMMY_MEETING_MINUTES.filter(
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
          className={`cursor-pointer h-9 px-3 flex items-center gap-1.5 text-sm font-medium border rounded-lg transition-colors ${
            ratingFilter
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
          className="ml-auto h-9 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.projectCreateNewLabel} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
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
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No meeting minutes found
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((minute) => {
              const rating = ratingStyle[minute.rating];
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
    </div>
  );
}
