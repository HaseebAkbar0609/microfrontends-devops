"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormPersonnelSection() {
  const t = useTranslate();
  const [selectedPerson] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [specifications, setSpecifications] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormPersonnelAtHyraUt} />
        </label>
        <p className="mb-1.5 font-sans font-normal text-xs text-slate-500">
          <Translate text={localizationConstants.offerFormPersonnelHelper} />
        </p>
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <span>{selectedPerson || t(localizationConstants.offerFormSelect)}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormWorkLocation} />
        </label>
        <Input
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          placeholder={t(localizationConstants.offerFormWorkAddressPlaceholder)}
          className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
        />
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormSpecifications} />
        </label>
        <Textarea
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecificationsPlaceholder)}
          className="min-h-24 resize-none rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 p-3"
        />
      </div>
    </div>
  );
}
