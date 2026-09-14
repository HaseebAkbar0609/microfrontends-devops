import { generateTempId } from "@/lib/tempId";
import { SEEDED_TIMEPLANS } from "../data/timeplans.mock";
import type { Timeplan, TimeplanDetails, TimeplanTask } from "../types";

/**
 * The timeplans, in memory.
 *
 * There is no timeplan endpoint, so this stands in for one, as
 * `projectOverviewService` does for projects: a module-level array every
 * screen reads through, with each mutator reassigning it so callers get a new
 * identity.
 *
 * **Every change goes through here**; nothing writes to the seed. The project
 * module's create wizard gets this wrong — it `unshift`s into
 * `PROJECT_LIST_ROWS` after `projectOverviewService` has already copied that
 * array, so a created project never reaches the list.
 *
 * The list, the form and the Gantt are separate routes and remount on
 * navigation, so a read on mount is current without a subscription. A hard
 * reload resets everything to the seed. Nothing is persisted to browser
 * storage (AGENTS.md rule 6).
 */
let plans: Timeplan[] = SEEDED_TIMEPLANS.map((plan) => ({ ...plan }));

export function listPlans(projectId: string): Timeplan[] {
	return plans.filter((plan) => plan.projectId === projectId);
}

export function getPlan(projectId: string, planId: string): Timeplan | undefined {
	return plans.find(
		(plan) => plan.projectId === projectId && plan.id === planId,
	);
}

/**
 * Adds a plan with no tasks and returns it.
 *
 * The id is `temp-<uuid>`: it passes the route id schema and can never be the
 * literal "create", which would collide with the create route.
 */
export function createPlan(projectId: string, details: TimeplanDetails): Timeplan {
	const plan: Timeplan = {
		...details,
		id: generateTempId(),
		projectId,
		tasks: [],
	};
	plans = [plan, ...plans];
	return plan;
}

export function updatePlan(
	planId: string,
	details: TimeplanDetails,
): Timeplan | undefined {
	let updated: Timeplan | undefined;
	plans = plans.map((plan) => {
		if (plan.id !== planId) return plan;
		updated = { ...plan, ...details };
		return updated;
	});
	return updated;
}

/** Permanent. Keep it behind a confirm. */
export function removePlan(planId: string): void {
	plans = plans.filter((plan) => plan.id !== planId);
}

export function saveTasks(planId: string, tasks: TimeplanTask[]): void {
	plans = plans.map((plan) => (plan.id === planId ? { ...plan, tasks } : plan));
}
