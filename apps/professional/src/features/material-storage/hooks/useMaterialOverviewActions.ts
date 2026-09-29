"use client";

import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MaterialStockRow } from "../types/materialStorage.types";

/** The buttons above the KPI cards. */
export type MaterialPageAction =
	| "manageDepots"
	| "transactionHistory"
	| "newMaterial"
	| "receive"
	| "withdraw";

/** The entries in a stock row's ⋮ menu. */
export type MaterialRowAction =
	| "view"
	| "edit"
	| "receive"
	| "withdraw"
	| "addToOffer"
	| "addToOrder"
	| "addToProject"
	| "addToInvoice";

/**
 * What the overview's buttons and row menu do. The dialogs and pages behind them
 * come with later tickets (TFS-1073 to TFS-1078). Until one lands, its action
 * says it is coming instead of silently doing nothing.
 */
export function useMaterialOverviewActions() {
	const t = useTranslate();

	const showComingSoon = useCallback(
		() => showToast("info", t(localizationConstants.comingSoonMessage)),
		[t],
	);

	const onPageAction: (action: MaterialPageAction) => void = showComingSoon;
	const onRowAction: (action: MaterialRowAction, row: MaterialStockRow) => void =
		showComingSoon;

	return { onPageAction, onRowAction };
}
