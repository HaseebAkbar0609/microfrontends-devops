import {
	createProjectItem, deleteProjectItem, getProjectItem,
	listProjectItems, updateProjectItem,
} from "@/features/project/services/projectItemService";
import type { Timeplan, TimeplanDetails, TimeplanTask } from "../types";

const kind = "timeplan" as const;

export function listPlans(projectId: string): Promise<Timeplan[]> {
	return listProjectItems<Timeplan>(projectId, kind);
}

export function getPlan(projectId: string, planId: string): Promise<Timeplan> {
	return getProjectItem<Timeplan>(projectId, kind, planId);
}

export function createPlan(projectId: string, details: TimeplanDetails): Promise<Timeplan> {
	return createProjectItem<Timeplan>(projectId, kind, { ...details, tasks: [] });
}

export function updatePlan(plan: Timeplan, details: TimeplanDetails): Promise<Timeplan> {
	return updateProjectItem<Timeplan>(plan.projectId, kind, { ...plan, ...details });
}

export function removePlan(plan: Timeplan): Promise<void> {
	return deleteProjectItem(plan.projectId, kind, plan);
}

export function saveTasks(plan: Timeplan, tasks: TimeplanTask[]): Promise<Timeplan> {
	return updateProjectItem<Timeplan>(plan.projectId, kind, { ...plan, tasks });
}
