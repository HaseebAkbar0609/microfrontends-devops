import { projectRecordUrl } from "../projectProductionNav.config";

/** Where the project record's Protokoll screens live. */
export const protocolUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/protokoll`,
	/** Visa detaljer: a meeting and its points, or an upload's details. */
	view: (projectId: string, protocolId: string) =>
		`${projectRecordUrl(projectId)}/protokoll/${encodeURIComponent(protocolId)}`,
	/** Ändra: the meeting's own fields. */
	edit: (projectId: string, protocolId: string) =>
		`${projectRecordUrl(projectId)}/protokoll/${encodeURIComponent(protocolId)}/edit`,
};
