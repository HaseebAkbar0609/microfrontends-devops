"use client";

import { useCallback, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MaterialStockRow } from "../types/materialStorage.types";
import type { ReceiveMaterialPreset } from "../types/materialTransaction.types";

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

interface ReceiveDialogState {
	open: boolean;
	/** Bumped on every opening so the dialog remounts with a clean form. */
	key: number;
	preset: ReceiveMaterialPreset;
}

/**
 * What the overview's buttons and row menu do. "Ta in material" is live
 * (TFS-1073); the rest come with later tickets (TFS-1074 to TFS-1078) and until
 * then say so instead of silently doing nothing.
 */
export function useMaterialOverviewActions(depotId: string | null) {
	const t = useTranslate();
	const [receiveDialog, setReceiveDialog] = useState<ReceiveDialogState>({
		open: false,
		key: 0,
		preset: { depotId: null, article: null },
	});

	const showComingSoon = useCallback(
		() => showToast("info", t(localizationConstants.comingSoonMessage)),
		[t],
	);

	const openReceive = useCallback(
		(preset: ReceiveMaterialPreset) =>
			setReceiveDialog((current) => ({ open: true, key: current.key + 1, preset })),
		[],
	);

	const closeReceive = useCallback(() => setReceiveDialog((current) => ({ ...current, open: false })), []);

	const onPageAction = useCallback(
		(action: MaterialPageAction) => {
			if (action === "receive") openReceive({ depotId, article: null });
			else showComingSoon();
		},
		[depotId, openReceive, showComingSoon],
	);

	const onRowAction = useCallback(
		(action: MaterialRowAction, row: MaterialStockRow) => {
			if (action === "receive")
				openReceive({
					depotId: row.depotId,
					article: { id: row.articleId, supplierName: row.supplierName, purchasePrice: row.purchasePrice },
				});
			else showComingSoon();
		},
		[openReceive, showComingSoon],
	);

	return { onPageAction, onRowAction, receiveDialog, closeReceive };
}
