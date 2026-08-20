"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormScheduleSection() {
  const t = useTranslate();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormStartDate} />
        </label>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-between text-left font-normal border-slate-200 bg-white px-3 shadow-none hover:bg-slate-50 text-sm"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
                <span className={startDate ? "text-slate-900" : "text-slate-400"}>
                  {startDate
                    ? format(startDate, "yyyy-MM-dd")
                    : t(localizationConstants.offerFormPickADate)}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0 border-0 bg-transparent shadow-none">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={new Date(2015, 0)}
              endMonth={new Date(2035, 11)}
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setStartOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormEndDate} />
        </label>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-between text-left font-normal border-slate-200 bg-white px-3 shadow-none hover:bg-slate-50 text-sm"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
                <span className={endDate ? "text-slate-900" : "text-slate-400"}>
                  {endDate
                    ? format(endDate, "yyyy-MM-dd")
                    : t(localizationConstants.offerFormPickADate)}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0 border-0 bg-transparent shadow-none">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={new Date(2015, 0)}
              endMonth={new Date(2035, 11)}
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setEndOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
