import { projectRecordUrl } from "../projectProductionNav.config";

/** Where the project record's payment plans live. */
export const paymentPlanUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/betalningsplan`,
	view: (projectId: string, planId: string) =>
		`${projectRecordUrl(projectId)}/betalningsplan/${encodeURIComponent(planId)}`,
	/** Where the project's own fields are edited. */
	projectInfo: (projectId: string) =>
		`${projectRecordUrl(projectId)}/projektinformation`,
};
