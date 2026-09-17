import { deduction, toReceive, type PaymentPlanSummary } from "../paymentPlanMath";
import type { SupplierAconto, SupplierPaymentPlan } from "./types";

/**
 * The summary box under Aconto lyft, in the shape `AcontoSummary` draws.
 *
 * Follows the frame's own figures: acontos of 100 000, 200 000 and 200 000,
 * the first paid with 10 000 retained, print Erhållet 100 000, Kvar att erhålla
 * −400 000, Innehållna medel −10 000 and Totalt 90 000. So "Totalt" is what has
 * actually been paid out here, not the contract sum as on the Beställare side.
 */
export function summariseSupplier(acontos: SupplierAconto[]): PaymentPlanSummary {
	const paid = acontos.filter((aconto) => aconto.economy === "paid");
	const planned = acontos.reduce((sum, aconto) => sum + aconto.amount, 0);
	const received = paid.reduce((sum, aconto) => sum + aconto.amount, 0);
	const retained = paid.reduce((sum, aconto) => sum + aconto.retained, 0);

	return {
		sent: received,
		remaining: deduction(planned - received),
		retained: deduction(retained),
		total: paid.reduce((sum, aconto) => sum + toReceive(aconto), 0),
	};
}

/** Every plan document has been ticked as reviewed. An empty plan has not. */
export function allDocumentsReviewed(plan: Pick<SupplierPaymentPlan, "documents">): boolean {
	return plan.documents.length > 0 && plan.documents.every((doc) => doc.reviewed);
}

/** The one state a plan can be approved from, with nothing left to review. */
export function canApprove(plan: Pick<SupplierPaymentPlan, "status" | "documents">): boolean {
	return plan.status === "under_review" && allDocumentsReviewed(plan);
}
