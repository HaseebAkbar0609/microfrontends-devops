"use client";

import type { PaymentOption } from "../types";
import { PAYMENT_OPTIONS } from "../constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PaymentOptionSelectorProps {
  value: PaymentOption;
  onValueChange: (value: PaymentOption) => void;
}

export function PaymentOptionSelector({
  value,
  onValueChange,
}: PaymentOptionSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        <Translate text={localizationConstants.managePlansSelectPaymentOption} />
      </h2>
      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as PaymentOption)}
        className="flex max-w-full flex-wrap justify-center gap-1 rounded-lg border border-slate-200 bg-white p-1"
      >
        {PAYMENT_OPTIONS.map((opt) => (
          <div key={opt.value} className="relative flex">
            <RadioGroupItem value={opt.value} id={`payment-${opt.value}`} className="peer sr-only" />
            <Label
              htmlFor={`payment-${opt.value}`}
              className="!mb-0 flex min-h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
            >
              <Translate text={opt.labelKey} />
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="max-w-xl text-sm leading-6 text-slate-500">
        <Translate text={localizationConstants.managePlansPaymentDiscountText} />
      </p>
    </div>
  );
}
