import { SEEDED_SUPPLIER_PLANS } from "../data/supplierPlans.mock";
import { canApprove } from "../supplierPlanMath";
import type { SupplierPaymentPlan } from "../types";

/**
 * Subcontractor and supplier payment plans, in memory.
 *
 * There is no endpoint for them, so this stands in for one, as
 * `paymentPlanService` does for the Beställare plans: a module-level array
 * every screen reads through, each mutator reassigning it. A hard reload resets
 * to the seed; nothing reaches browser storage (AGENTS.md rule 6).
 *
 * The mutators re-check their own preconditions rather than trusting the
 * buttons that call them, so a stale screen cannot approve a plan twice or pay
 * a row that is already paid. A guard, not a boundary: the server must enforce
 * it too once there is one.
 */
let plans: SupplierPaymentPlan[] = SEEDED_SUPPLIER_PLANS.map((plan) => ({ ...plan }));

export function listSupplierPlans(projectId: string): SupplierPaymentPlan[] {
	return plans.filter((plan) => plan.projectId === projectId);
}

export function getSupplierPlan(
	projectId: string,
	planId: string,
): SupplierPaymentPlan | undefined {
	return plans.find((plan) => plan.projectId === projectId && plan.id === planId);
}

function update(planId: string, change: (plan: SupplierPaymentPlan) => SupplierPaymentPlan): void {
	plans = plans.map((plan) => (plan.id === planId ? change(plan) : plan));
}

/** Approves a plan under review whose documents are all reviewed. */
export function approveSupplierPlan(planId: string, today: string): boolean {
	const plan = plans.find((candidate) => candidate.id === planId);
	if (!plan || !canApprove(plan)) return false;
	update(planId, (current) => ({ ...current, status: "approved", approvedDate: today }));
	return true;
}

/** Records an unpaid aconto as paid today. */
export function markAcontoPaid(planId: string, acontoId: string, today: string): boolean {
	const aconto = plans
		.find((candidate) => candidate.id === planId)
		?.acontos.find((candidate) => candidate.id === acontoId);
	if (!aconto || aconto.economy === "paid") return false;
	update(planId, (current) => ({
		...current,
		acontos: current.acontos.map((row) =>
			row.id === acontoId ? { ...row, economy: "paid", paidDate: today } : row,
		),
	}));
	return true;
}

/**
 * Ticks or unticks documents as reviewed. Refused once the plan is approved:
 * the review is what the approval rests on.
 */
export function setDocumentsReviewed(planId: string, documentIds: string[], reviewed: boolean): boolean {
	const plan = plans.find((candidate) => candidate.id === planId);
	if (!plan || plan.status === "approved") return false;
	update(planId, (current) => ({
		...current,
		documents: current.documents.map((doc) =>
			documentIds.includes(doc.id) ? { ...doc, reviewed } : doc,
		),
	}));
	return true;
}
