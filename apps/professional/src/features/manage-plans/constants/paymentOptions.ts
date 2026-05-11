import type { PaymentOption } from "../types";
import localizationConstants from "@/utils/translation/constants";

export const PAYMENT_OPTIONS: { value: PaymentOption; labelKey: string }[] = [
  {
    value: "month",
    labelKey: localizationConstants.managePlansPaymentOptionMonth,
  },
  {
    value: "quarter",
    labelKey: localizationConstants.managePlansPaymentOptionQuarter,
  },
  {
    value: "year",
    labelKey: localizationConstants.managePlansPaymentOptionYear,
  },
];
