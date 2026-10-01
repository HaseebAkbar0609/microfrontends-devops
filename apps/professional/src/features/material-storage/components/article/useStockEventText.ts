"use client";

import { useCallback } from "react";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MaterialStockEvent } from "../../types/materialArticle.types";
import type { WithdrawalTargetType } from "../../types/materialTransaction.types";

const WITHDRAWAL_LABELS: Record<WithdrawalTargetType, TranslationKeys> = {
	order: localizationConstants.materialEventWithdrawalOrder,
	project: localizationConstants.materialEventWithdrawalProject,
	invoice: localizationConstants.materialEventWithdrawalInvoice,
};

/** Figma colours the change: green in, red out, orange for a correction. */
export const STOCK_EVENT_TONES: Record<MaterialStockEvent["type"], string> = {
	receipt: "text-green-700",
	withdrawal: "text-red-600",
	adjustment: "text-orange-700",
};

/**
 * How an event reads in the article's history: "Uttag till projekt
 * PRJ-2026-0147", and the one detail Figma shows beside it (the supplier's
 * order number for a receipt, who took it for a withdrawal, the reason for an adjustment).
 */
export function useStockEventText() {
	const t = useTranslate();

	return useCallback(
		(event: MaterialStockEvent): { label: string; detail: string } => {
			switch (event.type) {
				case "receipt":
					return { label: t(localizationConstants.materialEventReceipt), detail: event.supplierOrderNo ?? "" };
				case "adjustment":
					return { label: t(localizationConstants.materialEventAdjustment), detail: event.reason ?? "" };
				case "withdrawal": {
					const label =
						event.linkType && event.linkType !== "internal"
							? t(WITHDRAWAL_LABELS[event.linkType], { reference: event.linkReference ?? "" })
							: t(localizationConstants.materialLinkInternal);
					return { label, detail: event.createdBy ?? "" };
				}
			}
		},
		[t],
	);
}
