"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useRouter } from "next/navigation";
import { CartSummaryPanelProps } from "../types";
import { formatCartCurrencyFromOre } from "../utils/currency";

export function CartSummaryPanel({
  subtotal,
  total,
  discountCode,
  onDiscountCodeChange,
  onProceed,
  disabled = false,
}: CartSummaryPanelProps) {
  const t = useTranslate();
  const router = useRouter();

  return (
    <div className="min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-secondary !mb-0">
          <Translate text={localizationConstants.manageCartDiscountTitle} />
        </h2>
        <Input
          value={discountCode}
          onChange={(e) => onDiscountCodeChange(e.target.value)}
          placeholder={t(localizationConstants.manageCartDiscountPlaceholder)}
          className="h-11 w-full"
        />
      </div>

      <div className="pt-2 text-sm text-foreground">
        <div className="flex items-center justify-between border-b border-border py-2 border-t">
          <span className="text-gray-700">
            <Translate text={localizationConstants.manageCartSubtotalLabel} />
          </span>
          <span className="text-secondary">{formatCartCurrencyFromOre(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between font-semibold border-b border-border py-2">
          <span className="text-base text-gray-700">
            <Translate text={localizationConstants.manageCartTotalLabel} />
          </span>
          <span className="text-base text-secondary">
            {formatCartCurrencyFromOre(total)}
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 [&_button]:h-11 [&_button]:w-full [&_button]:whitespace-normal">
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              new URLSearchParams(window.location.search).get("mode") === "change"
                ? "/manage-plans?change=1"
                : "/manage-plans",
            )
          }
        >
          <Translate text={localizationConstants.manageCartBackToPlans} />
        </Button>
        <Button variant="primary" onClick={onProceed} disabled={disabled}>
          <Translate text={localizationConstants.manageCartCheckoutButton} />
        </Button>
      </div>
    </div>
  );
}
