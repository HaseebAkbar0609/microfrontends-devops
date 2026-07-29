"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormPersonnelSection() {
  const t = useTranslate();
  const [personnelType, setPersonnelType] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormPersonnelAtHyraUt} />
        </p>
        <Input
          value={personnelType}
          onChange={(e) => setPersonnelType(e.target.value)}
          placeholder={t(localizationConstants.offerFormPersonnelAtHyraUt)}
          className="h-9 bg-white text-sm"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormWorkAddress} />
        </p>
        <Input
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          placeholder={t(localizationConstants.offerFormWorkAddress)}
          className="h-9 bg-white text-sm"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormSpecialConditions} />
        </p>
        <Textarea
          value={specialConditions}
          onChange={(e) => setSpecialConditions(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecialConditions)}
          className="min-h-24 resize-none bg-white text-sm"
        />
      </div>
    </div>
  );
}
