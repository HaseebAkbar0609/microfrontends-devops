import { PROJECT_MODULE_BASE_URL } from "../../data/projectNav.config";

/**
 * Garantiåtaganden's own URLs, in one place: the list and one commitment's
 * detail page, which the row, its ⋮ and the detail page's back arrow share.
 */
export const warrantyUrls = {
	list: (projectId: string) => `${PROJECT_MODULE_BASE_URL}/${projectId}/garantiataganden`,
	view: (projectId: string, commitmentId: string) =>
		`${PROJECT_MODULE_BASE_URL}/${projectId}/garantiataganden/${commitmentId}`,
};
