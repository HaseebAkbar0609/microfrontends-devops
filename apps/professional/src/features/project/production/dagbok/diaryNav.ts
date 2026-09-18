import { projectRecordUrl } from "../projectProductionNav.config";
import { DIARY_DATE_PARAM } from "./projectDiary.config";

const base = (projectId: string) => `${projectRecordUrl(projectId)}/dagbok`;

/** Where Dagbok's screens live. A day is carried in the query, never in the path. */
export const diaryUrls = {
	/** The diary itself, optionally on a given day. */
	list(projectId: string, date?: string | null): string {
		const url = base(projectId);
		return date ? `${url}?${new URLSearchParams({ [DIARY_DATE_PARAM]: date })}` : url;
	},
	/** Ny dagbok, which may start from the day the reader was looking at. */
	create(projectId: string, date?: string | null): string {
		const url = `${base(projectId)}/ny`;
		return date ? `${url}?${new URLSearchParams({ [DIARY_DATE_PARAM]: date })}` : url;
	},
};
