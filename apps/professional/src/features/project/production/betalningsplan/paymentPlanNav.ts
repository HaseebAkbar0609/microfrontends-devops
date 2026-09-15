import { projectRecordUrl } from "../projectProductionNav.config";

/** Where the project record's payment plans live. */
export const paymentPlanUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/betalningsplan`,
	view: (projectId: string, planId: string) =>
		`${projectRecordUrl(projectId)}/betalningsplan/${encodeURIComponent(planId)}`,
	/** The list opened on its UE / Lev tab — where a supplier plan's back arrow returns. */
	supplierList: (projectId: string) =>
		`${projectRecordUrl(projectId)}/betalningsplan?section=ue-lev`,
	/** A subcontractor's or supplier's plan. `ue-lev` is a static segment, so it
	    is matched before the Beställare plan's `[planId]`. */
	supplierView: (projectId: string, planId: string) =>
		`${projectRecordUrl(projectId)}/betalningsplan/ue-lev/${encodeURIComponent(planId)}`,
	/** Where the project's own fields are edited. */
	projectInfo: (projectId: string) =>
		`${projectRecordUrl(projectId)}/projektinformation`,
};
