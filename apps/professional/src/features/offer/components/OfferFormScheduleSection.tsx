"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function OfferFormScheduleSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormStartDate} />
        </p>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-9 bg-white text-sm"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormEndDate} />
        </p>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-9 bg-white text-sm"
        />
      </div>
    </div>
  );
}
