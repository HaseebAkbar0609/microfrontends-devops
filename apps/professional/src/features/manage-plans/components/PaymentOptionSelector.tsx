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
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-500 !mb-1">
        <Translate text={localizationConstants.managePlansSelectPaymentOption} />
      </h2>
      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as PaymentOption)}
        className="flex flex-row gap-6 !mb-1"
      >
        {PAYMENT_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`payment-${opt.value}`} />
            <Label
              htmlFor={`payment-${opt.value}`}
              className="cursor-pointer font-normal text-sm !mb-0"
            >
              <Translate text={opt.labelKey} />
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-gray-700">
        <Translate text={localizationConstants.managePlansPaymentDiscountText} />
      </p>
    </div>
  );
}
