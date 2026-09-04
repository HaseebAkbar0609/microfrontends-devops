"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

type Props = { variant: "express" | "b2c" };

export function OfferFormBudgetSection({ variant }: Props) {
  const t = useTranslate();
  const [work, setWork] = useState("");
  const [material, setMaterial] = useState("");
  const [budgetPrice, setBudgetPrice] = useState("");
  const [rotDeduction, setRotDeduction] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState("");

  const priceLabel =
    variant === "b2c"
      ? localizationConstants.offerFormTotalOffer
      : localizationConstants.offerFormBudgetPrice;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
            <Translate text={localizationConstants.offerFormWork} />
          </label>
          <Input
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder={t(localizationConstants.offerFormWorkPlaceholder)}
            className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
            <Translate text={localizationConstants.offerFormMaterial} />
          </label>
          <Input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={t(localizationConstants.offerFormMaterialPlaceholder)}
            className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
            <Translate text={priceLabel} />
          </label>
          <Input
            value={budgetPrice}
            onChange={(e) => setBudgetPrice(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder={t(priceLabel)}
            className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
            <Checkbox
              checked={rotDeduction}
              onCheckedChange={(checked) => setRotDeduction(checked === true)}
              className="border-slate-300 data-[state=checked]:bg-[#09090B] data-[state=checked]:border-[#09090B] data-[state=checked]:text-white"
            />
            <Translate text={localizationConstants.offerFormRotDeduction} />
          </label>
        </div>
      </div>

      <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
            <Translate text={localizationConstants.offerFormPaymentTerms} />
          </label>
        <Textarea
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder={t(localizationConstants.offerFormPaymentTerms)}
          className="min-h-24 resize-none rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 p-3"
        />
      </div>
    </div>
  );
}
