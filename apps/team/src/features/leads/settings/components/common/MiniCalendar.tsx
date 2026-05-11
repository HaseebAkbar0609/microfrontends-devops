"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";

function normalizeLocale(locale: string) {
  if (locale === "swe") return "sv-SE";
  return locale || "en-US";
}

function getMonthLabel(date: Date, locale: string) {
  return date.toLocaleString(normalizeLocale(locale), {
    month: "long",
    year: "numeric",
  });
}

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean }[] = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    cells.push({ day: prevMonthDays - i, inMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - (startDay + daysInMonth) + 1, inMonth: false });
  }

  return cells;
}

export function MiniCalendar({
  selectedDate: controlledSelectedDate,
  onSelect,
}: {
  selectedDate?: Date | null;
  onSelect?: (date: Date) => void;
}) {
  const t = useTranslate();
  const { i18n } = useTranslation();
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekLabels = [
    t(localizationConstants.sundayLabel).slice(0, 2),
    t(localizationConstants.mondayLabel).slice(0, 2),
    t(localizationConstants.tuesdayLabel).slice(0, 2),
    t(localizationConstants.wednesdayLabel).slice(0, 2),
    t(localizationConstants.thursdayLabel).slice(0, 2),
    t(localizationConstants.fridayLabel).slice(0, 2),
    t(localizationConstants.saturdayLabel).slice(0, 2),
  ];

  const cells = useMemo(() => buildCalendar(activeDate), [activeDate]);
  const actualSelectedDate = controlledSelectedDate ?? selectedDate;
  const monthLabel = getMonthLabel(activeDate, i18n.language);

  const handlePrev = () => {
    const next = new Date(activeDate);
    next.setMonth(activeDate.getMonth() - 1);
    setActiveDate(next);
  };

  const handleNext = () => {
    const next = new Date(activeDate);
    next.setMonth(activeDate.getMonth() + 1);
    setActiveDate(next);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold text-slate-900">{monthLabel}</div>
        <button
          type="button"
          onClick={handleNext}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
        {weekLabels.map((label) => (
          <div key={label} className="font-medium">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
        {cells.map((cell, index) => {
          const isSelected =
            cell.inMonth &&
            actualSelectedDate?.getFullYear() === activeDate.getFullYear() &&
            actualSelectedDate?.getMonth() === activeDate.getMonth() &&
            actualSelectedDate?.getDate() === cell.day;
          return (
            <button
              type="button"
              key={`${cell.day}-${index}`}
              onClick={() => {
                if (!cell.inMonth) return;
                const nextDate = new Date(
                  activeDate.getFullYear(),
                  activeDate.getMonth(),
                  cell.day
                );
                if (controlledSelectedDate !== undefined) {
                  onSelect?.(nextDate);
                  return;
                }
                setSelectedDate(nextDate);
                onSelect?.(nextDate);
              }}
              className={cn(
                "h-9 w-9 rounded-full",
                cell.inMonth ? "text-slate-900" : "text-slate-300",
                isSelected && "bg-slate-900 text-white"
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
