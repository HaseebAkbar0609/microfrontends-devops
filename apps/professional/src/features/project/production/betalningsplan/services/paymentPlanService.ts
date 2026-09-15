import { generateTempId } from "@/lib/tempId";
import { SEEDED_PAYMENT_PLANS } from "../data/paymentPlans.mock";
import type { PaymentTerms, ProjectPaymentPlan } from "../types";

/**
 * The payment plans, in memory.
 *
 * There is no payment-plan endpoint for projects, so this stands in for one, as
 * `timeplanService` does for timeplans: a module-level array every screen reads
 * through, each mutator reassigning it. **Every change goes through here**;
 * nothing writes to the seed.
 *
 * The list and the plan are separate routes and remount on navigation, so a
 * read on mount is current. A hard reload resets everything to the seed.
 * Nothing is persisted to browser storage (AGENTS.md rule 6).
 */
let plans: ProjectPaymentPlan[] = SEEDED_PAYMENT_PLANS.map((plan) => ({ ...plan }));

export function listPlans(projectId: string): ProjectPaymentPlan[] {
	return plans.filter((plan) => plan.projectId === projectId);
}

export function getPlan(
	projectId: string,
	planId: string,
): ProjectPaymentPlan | undefined {
	return plans.find((plan) => plan.projectId === projectId && plan.id === planId);
}

export interface NewPaymentPlan {
	name: string;
	contractFileName?: string;
	createdBy: string;
	/** `yyyy-MM-dd`. */
	today: string;
	terms: PaymentTerms;
}

/** Adds an empty draft, numbered after the project's highest plan. */
export function createPlan(projectId: string, input: NewPaymentPlan): ProjectPaymentPlan {
	const highest = listPlans(projectId).reduce(
		(max, plan) => Math.max(max, plan.planNumber),
		0,
	);
	const plan: ProjectPaymentPlan = {
		id: generateTempId(),
		projectId,
		planNumber: highest + 1,
		name: input.name,
		contractFileName: input.contractFileName,
		createdBy: input.createdBy,
		createdDate: input.today,
		revisedDate: input.today,
		status: "draft",
		terms: input.terms,
		acontos: [],
		documents: [],
	};
	plans = [...plans, plan];
	return plan;
}

/** Replaces a plan wholesale — the editor saves its draft this way. */
export function savePlan(plan: ProjectPaymentPlan): void {
	plans = plans.map((existing) => (existing.id === plan.id ? plan : existing));
}

export function markSent(planId: string): void {
	plans = plans.map((plan) => (plan.id === planId ? { ...plan, status: "sent" } : plan));
}

/** Records an aconto's invoice. A row already invoiced keeps its first date. */
export function invoiceAconto(planId: string, acontoId: string, date: string): void {
	plans = plans.map((plan) =>
		plan.id !== planId
			? plan
			: {
					...plan,
					acontos: plan.acontos.map((aconto) =>
						aconto.id === acontoId && !aconto.invoicedDate
							? { ...aconto, invoicedDate: date }
							: aconto,
					),
				},
	);
}

/** Permanent. Keep it behind a confirm. */
export function removePlan(planId: string): void {
	plans = plans.filter((plan) => plan.id !== planId);
}
