"use client";

import { useCallback, useState } from "react";

import type { PaymentAconto, PaymentPlanDocument } from "../types";

/**
 * Which of the view's dialogs is open, and for which row.
 *
 * Only one can be open at a time, so a single discriminated value holds it —
 * two confirms can never stack.
 */
export type PlanViewDialog =
	| { kind: "addAconto" }
	| { kind: "editAconto"; aconto: PaymentAconto }
	| { kind: "deleteAconto"; aconto: PaymentAconto }
	| { kind: "createInvoice"; aconto: PaymentAconto }
	| { kind: "viewInvoice"; aconto: PaymentAconto }
	| { kind: "deleteDocument"; document: PaymentPlanDocument }
	| { kind: "editTerms" }
	| { kind: "send" }
	| { kind: "discard" };

export function usePlanViewDialogs() {
	const [dialog, setDialog] = useState<PlanViewDialog | null>(null);

	/* Opened from a row menu, a dialog has to wait for the menu to finish
	   closing: in the same tick Radix leaves `pointer-events: none` on <body>.
	   A timeout, not rAF, which never fires in an occluded page. */
	const open = useCallback((next: PlanViewDialog) => {
		setTimeout(() => setDialog(next), 0);
	}, []);

	const close = useCallback(() => setDialog(null), []);

	return { dialog, open, close };
}

export type PlanViewDialogs = ReturnType<typeof usePlanViewDialogs>;
