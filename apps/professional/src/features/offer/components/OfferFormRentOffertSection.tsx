"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormRentOffertSection() {
  const t = useTranslate();
  const [hourlyRate, setHourlyRate] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
            <Translate text={localizationConstants.offerFormHourlyRateLabel} />
          </label>
          <div className="flex h-10 w-full rounded-lg border border-slate-200 bg-white overflow-hidden">
            <span className="flex items-center bg-slate-50 px-3 text-xs font-medium text-slate-500 border-r border-slate-200 shrink-0">
              <Translate text={localizationConstants.offerForm350KrPerHour} />
            </span>
            <input
              type="text"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder={t(localizationConstants.offerFormEnter)}
              className="flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
            <Translate text={localizationConstants.offerFormStartDate} />
          </label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
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
                  setDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecificationsPlaceholder)}
          className="min-h-24 resize-none rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 p-3"
        />
      </div>
    </div>
  );
}
