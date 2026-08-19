"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function OfferFormScheduleSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Pick a date"
            className="h-10 pl-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormEndDate} />
        </label>
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Pick a date"
            className="h-10 pl-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
