"use client";

import { useCallback, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MaterialStockRow } from "../types/materialStorage.types";
import type { MaterialDialogPreset } from "../types/materialTransaction.types";

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

/** The stock dialogs the overview opens: "Ta in material" and "Ta ut material". */
export type MaterialStockDialogKind = "receive" | "withdraw";

interface StockDialogState {
	kind: MaterialStockDialogKind;
	open: boolean;
	/** Bumped on every opening so the dialog remounts with a clean form. */
	key: number;
	preset: MaterialDialogPreset;
}

const isStockDialogAction = (action: string): action is MaterialStockDialogKind =>
	action === "receive" || action === "withdraw";

/**
 * What the overview's buttons and row menu do. "Ta in material" (TFS-1073) and
 * "Ta ut material" (TFS-1074) are live; the rest come with later tickets
 * (TFS-1075 to TFS-1078) and until then say so instead of silently doing nothing.
 */
export function useMaterialOverviewActions(depotId: string | null) {
	const t = useTranslate();
	const [stockDialog, setStockDialog] = useState<StockDialogState>({
		kind: "receive",
		open: false,
		key: 0,
		preset: { depotId: null, article: null },
	});

	const showComingSoon = useCallback(
		() => showToast("info", t(localizationConstants.comingSoonMessage)),
		[t],
	);

	const openStockDialog = useCallback(
		(kind: MaterialStockDialogKind, preset: MaterialDialogPreset) =>
			setStockDialog((current) => ({ kind, open: true, key: current.key + 1, preset })),
		[],
	);

	// Only open goes false, so the closing dialog keeps its content while it animates out.
	const closeStockDialog = useCallback(() => setStockDialog((current) => ({ ...current, open: false })), []);

	const onPageAction = useCallback(
		(action: MaterialPageAction) => {
			if (isStockDialogAction(action)) openStockDialog(action, { depotId, article: null });
			else showComingSoon();
		},
		[depotId, openStockDialog, showComingSoon],
	);

	const onRowAction = useCallback(
		(action: MaterialRowAction, row: MaterialStockRow) => {
			if (isStockDialogAction(action))
				openStockDialog(action, {
					depotId: row.depotId,
					article: {
						id: row.articleId,
						supplierName: row.supplierName,
						purchasePrice: row.purchasePrice,
						salesPrice: row.salesPrice,
					},
				});
			else showComingSoon();
		},
		[openStockDialog, showComingSoon],
	);

	return { onPageAction, onRowAction, stockDialog, closeStockDialog };
}
