"use client";

import { useState } from "react";

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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormHourlyRate} />
          </p>
          <Input
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder={t(localizationConstants.offerFormHourlyRatePlaceholder)}
            className="h-9 bg-white text-sm"
          />
        </div>

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
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormSpecialNotes} />
        </p>
        <Textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecialNotes)}
          className="min-h-24 resize-none bg-white text-sm"
        />
      </div>
    </div>
  );
}
