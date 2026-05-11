"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";
import { MiniCalendar } from "@/features/leads/settings/components/common/MiniCalendar";

export function TimeInputWithCalendar({
  defaultTime,
  className,
}: {
  defaultTime: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="time"
          defaultValue={defaultTime}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          className={cn(
            "h-10 w-[160px] rounded-md border border-slate-900 px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-900 text-slate-900"
        >
          <Clock className="h-4 w-4" />
        </button>
      </div>

      {selectedDate && (
        <div className="mt-1 text-xs text-slate-500">
          <Translate text={localizationConstants.selectedDateLabel} />: {selectedDate.toLocaleDateString()}
        </div>
      )}

      {open && (
        <div className="absolute right-0 z-20 mt-2">
          <MiniCalendar
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
