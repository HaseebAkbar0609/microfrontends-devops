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
    <div className="space-y-4 rounded-[10px] bg-white p-6">
      <div className="space-y-2 flex justify-between gap-2 items-center">
        <h2 className="text-sm font-semibold text-secondary !mb-0">
          <Translate text={localizationConstants.manageCartDiscountTitle} />
        </h2>
        <Input
          value={discountCode}
          onChange={(e) => onDiscountCodeChange(e.target.value)}
          placeholder={t(localizationConstants.manageCartDiscountPlaceholder)}
          className="h-9 max-w-[200px]"
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

      <div className="flex justify-between gap-3 pt-2">
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
