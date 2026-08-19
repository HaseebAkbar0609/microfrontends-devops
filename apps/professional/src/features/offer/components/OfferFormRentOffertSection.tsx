"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormRentOffertSection() {
  const t = useTranslate();
  const [hourlyRate, setHourlyRate] = useState("");
  const [startDate, setStartDate] = useState("");
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
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder={t(localizationConstants.offerFormPickADate)}
              className="h-10 pl-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400"
            />
          </div>
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
