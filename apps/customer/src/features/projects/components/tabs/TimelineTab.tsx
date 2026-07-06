"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineProject {
  id: string;
  title: string;
  estimatedDays: number;
  lastUpdated: string;
}

interface GanttTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: "orange" | "green" | "red";
  isGroup: boolean;
  isExpanded: boolean;
  parentId?: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const TIMELINE_PROJECTS: TimelineProject[] = [
  { id: "1", title: "Children's Bathroom", estimatedDays: 15, lastUpdated: "2026-01-28" },
  { id: "2", title: "My Bathroom",         estimatedDays: 21, lastUpdated: "2026-01-28" },
];

const D = (m: number, day: number) => new Date(2026, m - 1, day);

const INITIAL_TASKS: GanttTask[] = [
  { id: "t1",  title: "Measurement",       startDate: D(3, 4),  endDate: D(3, 18), color: "orange", isGroup: true,  isExpanded: false },
  { id: "t2",  title: "Redesign",          startDate: D(3, 12), endDate: D(3, 23), color: "green",  isGroup: true,  isExpanded: true  },
  { id: "t2a", title: "Layout Design",     startDate: D(3, 12), endDate: D(3, 18), color: "green",  isGroup: false, isExpanded: false, parentId: "t2" },
  { id: "t2b", title: "Material Selection",startDate: D(3, 18), endDate: D(3, 23), color: "green",  isGroup: false, isExpanded: false, parentId: "t2" },
  { id: "t3",  title: "Upgrade Tech",      startDate: D(3, 15), endDate: D(3, 24), color: "red",    isGroup: true,  isExpanded: false },
  { id: "t4",  title: "Storage",           startDate: D(3, 20), endDate: D(4, 5),  color: "orange", isGroup: true,  isExpanded: false },
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────

// Start on Mon Feb 9 (Week 7) — full weeks, no sliver; end Apr 26 for scroll range
const CHART_START = new Date(2026, 1, 9);
const CHART_END   = new Date(2026, 3, 26);

// Figma: each day cell = 36px
const CELL_W = 36;

function buildDays(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function groupByWeek(days: Date[]): { weekNum: number; days: Date[] }[] {
  const groups: { weekNum: number; days: Date[] }[] = [];
  for (const day of days) {
    const wn = isoWeek(day);
    const last = groups[groups.length - 1];
    if (last && last.weekNum === wn) last.days.push(day);
    else groups.push({ weekNum: wn, days: [day] });
  }
  return groups;
}

function groupByMonth(days: Date[]): { label: string; count: number }[] {
  const groups: { label: string; count: number }[] = [];
  for (const day of days) {
    const label = day.toLocaleString("en", { month: "long", year: "numeric" });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.count++;
    else groups.push({ label, count: 1 });
  }
  return groups;
}

const ALL_DAYS = buildDays(CHART_START, CHART_END);
const WEEKS    = groupByWeek(ALL_DAYS);
const MONTHS   = groupByMonth(ALL_DAYS);

const BAR_COLOR: Record<GanttTask["color"], string> = {
  orange: "bg-orange-500",
  green:  "bg-green-700",
  red:    "bg-red-600",
};

function taskActive(day: Date, task: GanttTask): boolean {
  return day >= task.startDate && day <= task.endDate;
}

// ─── Gantt view ───────────────────────────────────────────────────────────────

function GanttView({ project, onBack }: { project: TimelineProject; onBack: () => void }) {
  const [tasks, setTasks] = useState<GanttTask[]>(INITIAL_TASKS);

  const visibleTasks = tasks.filter(
    (t) => !t.parentId || tasks.find((p) => p.id === t.parentId)?.isExpanded,
  );

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)));

  return (
    <div className="pb-10">
      {/* Back + title */}
      <div className="flex items-center gap-1 mb-4 p-0">
        <button
          type="button"
          onClick={onBack}
          className="text-[#64748B] hover:text-[#09090B] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-[#0A0A0A]">{project.title}</span>
      </div>

      {/* Gantt card — Figma border: rgba(71,85,105,0.1), radius: 12px */}
      <div className="bg-white border border-slate-500/10 rounded-xl overflow-hidden">
        <div className="flex">

          {/* ── Left panel: 180px, sticky task labels ── */}
          <div className="w-[180px] flex-shrink-0 border-r border-[#E2E8F0]">

            {/* Header — spans all 3 calendar header rows = 144px */}
            <div className="h-[144px] border-b border-[#E2E8F0] px-4 flex items-center">
              <span className="text-xl font-medium text-[#0A0A0A]">
                {project.estimatedDays} days
              </span>
            </div>

            {/* Task name rows — 40px, gray chip with left-rounded corners */}
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="h-10 flex items-center border-b border-[#E2E8F0] last:border-0 pl-0 pr-0"
              >
                <div
                  className="flex items-center gap-1 h-10 px-2 flex-1 min-w-0"
                  style={{
                    background: "#E2E8F0",
                    borderRadius: "4px 0px 0px 4px",
                    paddingLeft: task.parentId ? 20 : 8,
                  }}
                >
                  {task.isGroup ? (
                    <button
                      type="button"
                      onClick={() => toggle(task.id)}
                      className="flex-shrink-0 text-[#1E293B] hover:text-[#0A0A0A]"
                    >
                      {task.isExpanded
                        ? <ChevronDown  className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <span className="w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-[#020617] truncate">
                    {task.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right panel: scrollable calendar grid ── */}
          <div
            className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {/* Month header — 48px */}
            <div className="flex h-12 border-b border-[#E2E8F0]">
              {MONTHS.map((m) => (
                <div
                  key={m.label}
                  style={{ width: m.count * CELL_W, minWidth: m.count * CELL_W }}
                  className="flex-shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-r border-[#E2E8F0] last:border-0"
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Week header — 48px */}
            <div className="flex h-12 border-b border-[#E2E8F0]">
              {WEEKS.map((w) => (
                <div
                  key={`wk-${w.weekNum}`}
                  style={{ width: w.days.length * CELL_W, minWidth: w.days.length * CELL_W }}
                  className="flex-shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-l border-[#E2E8F0] first:border-0"
                >
                  Week {w.weekNum}
                </div>
              ))}
            </div>

            {/* Day-number header — 48px, each cell 36px with light right border */}
            <div className="flex h-12 border-b border-[#E2E8F0]">
              {ALL_DAYS.map((day) => (
                <div
                  key={day.toISOString()}
                  style={{ width: CELL_W, minWidth: CELL_W }}
                  className="flex-shrink-0 flex items-center justify-center text-sm font-medium text-[#0A0A0A] border-r border-[#F1F5F9] last:border-0"
                >
                  {day.getDate()}
                </div>
              ))}
            </div>

            {/* Task bar rows — 40px each (cell: 36×40, inner bg:#E2E8F0, bar h-6 with py-2) */}
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="flex h-10 border-b border-[#E2E8F0] last:border-0"
              >
                {ALL_DAYS.map((day) => {
                  const active = taskActive(day, task);
                  return (
                    <div
                      key={day.toISOString()}
                      style={{ width: CELL_W, minWidth: CELL_W }}
                      className="flex-shrink-0 h-full"
                    >
                      {/* Inner wrapper: always bg-[#E2E8F0] with 8px vertical padding */}
                      <div className="flex h-full py-2 bg-[#E2E8F0]">
                        {active && (
                          <div className={`flex-1 ${BAR_COLOR[task.color]}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

export function TimelineTab() {
  const [view, setView]       = useState<"list" | "gantt">("list");
  const [selected, setSelected] = useState<TimelineProject | null>(null);
  const [search, setSearch]   = useState("");

  const filtered = TIMELINE_PROJECTS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (view === "gantt" && selected) {
    return <GanttView project={selected} onBack={() => setView("list")} />;
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-sm font-medium text-slate-700 border-[#E2E8F0]"
        >
          Filter
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </Button>
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
        <div className="grid grid-cols-[1fr_160px_180px_46px] border-b border-[#E2E8F0]">
          <button
            type="button"
            className="flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
          >
            Title <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
          >
            <Translate text={localizationConstants.projectEstTimeLabel} />
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 h-12 px-4 text-sm font-medium text-[#64748B] hover:text-slate-700 text-left"
          >
            <Translate text={localizationConstants.projectLastUpdatedLabel} />
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
          <div className="border-l border-[#E2E8F0] h-12" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No timelines found</div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_160px_180px_46px] items-center hover:bg-slate-50 transition-colors cursor-pointer border-b border-[#E2E8F0] last:border-0"
              onClick={() => { setSelected(p); setView("gantt"); }}
            >
              <span className="h-12 flex items-center px-4 text-sm text-[#020617]">{p.title}</span>
              <span className="h-12 flex items-center px-4 text-sm text-[#020617]">{p.estimatedDays} days</span>
              <span className="h-12 flex items-center px-4 text-sm text-[#020617]">{p.lastUpdated}</span>
              <div className="h-12 flex items-center justify-center border-l border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center h-9 w-9 rounded-[6px] text-[#18181B] hover:bg-slate-100 transition-colors"
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
