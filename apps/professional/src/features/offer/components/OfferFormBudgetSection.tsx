"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormWork} />
          </p>
          <Input
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder={t(localizationConstants.offerFormWork)}
            className="h-9 bg-white text-sm"
          />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormMaterial} />
          </p>
          <Input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={t(localizationConstants.offerFormMaterial)}
            className="h-9 bg-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={priceLabel} />
          </p>
          <Input
            value={budgetPrice}
            onChange={(e) => setBudgetPrice(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder={t(priceLabel)}
            className="h-9 bg-white text-sm"
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={rotDeduction}
              onChange={(e) => setRotDeduction(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-slate-300"
            />
            <Translate text={localizationConstants.offerFormRotDeduction} />
          </label>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormPaymentTerms} />
        </p>
        <Textarea
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder={t(localizationConstants.offerFormPaymentTerms)}
          className="min-h-24 resize-none bg-white text-sm"
        />
      </div>
    </div>
  );
}
