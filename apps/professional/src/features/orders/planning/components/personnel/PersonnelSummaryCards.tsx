"use client";

import { useState } from "react";
import Image from "next/image";
import { Blocks, Calendar, Timer, Users } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
  PlanningResource,
  PlanningStatistics,
} from "../../types/planning.types";
import { Button } from "@/components/ui/button";
import { PersonnelDetailsDrawer } from "./PersonnelDetailsDrawer";
import { MOCK_PERSONNEL_TOP_ASSIGNED_ALL } from "../../data/personnelPlanning.mock";

interface PersonnelSummaryCardsProps {
  topEmployees?: PlanningResource[];
  statistics?: PlanningStatistics;
  dateRangeText?: string;
}

export function PersonnelSummaryCards({
  topEmployees,
  statistics,
  dateRangeText = "10/12/2025 - 17/12/2025",
}: PersonnelSummaryCardsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const allEmployeesList =
    topEmployees && topEmployees.length > 0
      ? topEmployees
      : MOCK_PERSONNEL_TOP_ASSIGNED_ALL;

  const displayEmployees = allEmployeesList.slice(0, 3).map((e) => ({
    id: e.id,
    name: e.name,
    initials:
      e.initials ||
      e.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    hours:
      "hours" in e && typeof e.hours === "number"
        ? e.hours
        : "totalHours" in e
          ? e.totalHours || 40
          : 40,
    percentage: e.percentage || 70,
    avatarUrl: e.avatarUrl,
  }));

  const remainingEmployees = allEmployeesList.slice(3);
  const remainingCount = remainingEmployees.length;
  const previewRemainingAvatars = remainingEmployees.slice(0, 3).map((e) => ({
    id: e.id,
    name: e.name,
    initials:
      e.initials ||
      e.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    avatarUrl: e.avatarUrl,
  }));

  const remainingTotalHours = remainingEmployees.reduce((sum, e) => {
    const h =
      "hours" in e && typeof e.hours === "number"
        ? e.hours
        : "totalHours" in e
          ? e.totalHours || 0
          : 0;
    return sum + h;
  }, 0);
  const remainingAvgPercentage =
    remainingEmployees.length > 0
      ? Math.round(
          remainingEmployees.reduce((sum, e) => sum + (e.percentage || 0), 0) /
            remainingEmployees.length,
        )
      : 40;
  const remainingDisplayHours =
    remainingEmployees.length > 0
      ? Math.round(remainingTotalHours / remainingEmployees.length)
      : 19;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans">
      {/* Left Card: Bästa tilldelade */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-[#EEF2FF] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="font-sans font-medium text-lg leading-7 tracking-normal text-slate-900 flex items-center">
            <Translate text={localizationConstants.bastaTilldelade} />
          </h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDetailsOpen(true)}
            className="w-29 h-10 px-4 py-2 bg-white border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-800 rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Translate text={localizationConstants.visaDetaljer} />
          </Button>
        </div>

        <div className="space-y-3">
          {displayEmployees.map((emp) => (
            <div key={emp.id} className="flex items-center gap-3">
              {/* Left Column: Fixed Width for exact alignment across all rows */}
              <div className="w-42.5 sm:w-47.5 shrink-0 flex items-center gap-2.5 min-w-0">
                {emp.avatarUrl ? (
                  <Image
                    src={emp.avatarUrl}
                    alt={emp.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#F4F4F5] text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                    {emp.initials}
                  </div>
                )}
                <p className="font-sans font-medium text-[14px] leading-5 tracking-normal text-slate-900 truncate">
                  {emp.name}
                </p>
              </div>

              {/* Right Column: Progress Bar Track with height 8px & background: var(--border, #E5E5E5) */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="text-xs text-slate-600 font-medium">
                  {emp.hours}{" "}
                  <Translate text={localizationConstants.timmarSuffix} />
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${emp.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 w-9 text-right shrink-0">
                    {emp.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 4th row: Dynamic Preview Avatars + Dynamic +N Badge */}
          {remainingCount > 0 && (
            <div className="flex items-center gap-3">
              {/* Left Column: Overlapping preview avatars + remaining count circle */}
              <div className="w-42.5 sm:w-47.5 shrink-0 flex items-center gap-2.5 min-w-0">
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {previewRemainingAvatars.map((emp, idx) =>
                    emp.avatarUrl ? (
                      <Image
                        key={emp.id || idx}
                        src={emp.avatarUrl}
                        alt={emp.name || `Team member ${idx + 1}`}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-2xs"
                      />
                    ) : (
                      <div
                        key={emp.id || idx}
                        className="w-7 h-7 rounded-full bg-[#F4F4F5] border-2 border-white text-slate-700 font-semibold text-[10px] flex items-center justify-center shadow-2xs"
                      >
                        {emp.initials}
                      </div>
                    ),
                  )}
                  <div className="w-7 h-7 rounded-full bg-[#F4F4F5] border-2 border-white text-slate-700 font-semibold text-[10px] flex items-center justify-center shadow-2xs">
                    +{remainingCount}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Hours & Progress Bar for remaining team */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="text-xs text-slate-600 font-medium">
                  {remainingDisplayHours}{" "}
                  <Translate text={localizationConstants.timmarSuffix} />
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${remainingAvgPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 w-9 text-right shrink-0">
                    {remainingAvgPercentage}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Card: Övergripande statistik (bg-slate-100, width: 385px, gap: 12px) */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:p-5 shadow-2xs w-full lg:w-96.25 lg:shrink-0 flex flex-col gap-3">
        <h2 className="font-sans font-medium text-lg leading-7 tracking-normal text-slate-900 flex items-center">
          <Translate text={localizationConstants.overgripandeStatistik} />
        </h2>
        <div>
          <div className="w-60 h-9 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 shadow-2xs text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-zinc-500 stroke-[1.85] shrink-0" />
            <span className="text-slate-700 font-medium">{dateRangeText}</span>
          </div>
        </div>

        {/* 3 Rows aligned to left with width: 160px label and 8px gap */}
        <div className="flex flex-col gap-2">
          <div className="w-6 flex items-center gap-2">
            <Blocks className="w-4 h-4 text-zinc-500 stroke-[1.85] shrink-0" />
            <span className="w-40 h-5 shrink-0 font-sans font-normal text-[14px] leading-5 tracking-normal text-slate-700 truncate">
              <Translate text={localizationConstants.totaltAntalProjekt} />
            </span>
            <span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
              {statistics?.totalProjects ?? 14}
            </span>
          </div>

          <div className="w-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-500 stroke-[1.85] shrink-0" />
            <span className="w-40 h-5 shrink-0 font-sans font-normal text-[14px] leading-5 tracking-normal text-slate-700 truncate">
              <Translate text={localizationConstants.antalTilldelade} />
            </span>
            <span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
              {statistics?.assignedProjects ?? 12}
            </span>
          </div>

          <div className="w-6 flex items-center gap-2">
            <Timer className="w-4 h-4 text-zinc-500 stroke-[1.85] shrink-0" />
            <span className="w-40 h-5 shrink-0 font-sans font-normal text-[14px] leading-5 tracking-normal text-slate-700 truncate">
              <Translate text={localizationConstants.totalaArbetstimmar} />
            </span>
            <span className="font-sans font-medium text-base leading-6 tracking-normal text-black shrink-0">
              {statistics?.totalHours ?? 1420}{" "}
              <Translate text={localizationConstants.timmarSuffix} />
            </span>
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      <PersonnelDetailsDrawer
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        employees={allEmployeesList}
      />
    </div>
  );
}

export default PersonnelSummaryCards;
