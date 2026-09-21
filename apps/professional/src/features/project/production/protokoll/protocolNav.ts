import { projectRecordUrl } from "../projectProductionNav.config";

/** Where the project record's Protokoll screens live. */
export const protocolUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/protokoll`,
	/** Visa detaljer: a Standard protocol's meeting and its points. */
	view: (projectId: string, protocolId: string) =>
		`${projectRecordUrl(projectId)}/protokoll/${encodeURIComponent(protocolId)}`,
	/** Ändra: the meeting's own fields. */
	edit: (projectId: string, protocolId: string) =>
		`${projectRecordUrl(projectId)}/protokoll/${encodeURIComponent(protocolId)}/edit`,
};
