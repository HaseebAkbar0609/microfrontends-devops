import { projectRecordUrl } from "../projectProductionNav.config";

/** Where each Tidsplan screen lives, so no component spells a path by hand. */
export const timeplanUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/tidsplan`,
	create: (projectId: string) =>
		`${projectRecordUrl(projectId)}/tidsplan/create`,
	view: (projectId: string, planId: string) =>
		`${projectRecordUrl(projectId)}/tidsplan/${encodeURIComponent(planId)}`,
	edit: (projectId: string, planId: string) =>
		`${projectRecordUrl(projectId)}/tidsplan/${encodeURIComponent(planId)}/edit`,
};
