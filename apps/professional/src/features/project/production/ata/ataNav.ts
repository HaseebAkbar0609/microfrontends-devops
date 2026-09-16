import { projectRecordUrl } from "../projectProductionNav.config";

/** Where the project record's ÄTA screens live. `create` is a static segment, matched before `[ataId]`. */
export const ataUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/ata`,
	create: (projectId: string) => `${projectRecordUrl(projectId)}/ata/create`,
	/** Visa detaljer: the saved ÄTA opened on step 2. */
	view: (projectId: string, ataId: string) =>
		`${projectRecordUrl(projectId)}/ata/${encodeURIComponent(ataId)}`,
	/** Redigera: the saved ÄTA opened on step 1. */
	edit: (projectId: string, ataId: string) =>
		`${projectRecordUrl(projectId)}/ata/${encodeURIComponent(ataId)}/edit`,
};
