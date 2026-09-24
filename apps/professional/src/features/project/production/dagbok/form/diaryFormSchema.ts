import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { DIARY_LIMITS } from "../projectDiary.config";
import type { DiaryContent, ProjectDiary } from "../types";

const M = localizationConstants;

/*
 * The rows and readings arrive already validated by their own dialogs and the
 * weather form, so here they only need to be arrays within the row limit; the
 * notes are the only fields typed straight into the page.
 */
const rows = <T>() => z.array(z.custom<T>()).max(DIARY_LIMITS.rows);

export const diaryFormSchema = z.object({
	weather: rows<DiaryContent["weather"][number]>(),
	workforce: rows<DiaryContent["workforce"][number]>(),
	works: rows<DiaryContent["works"][number]>(),
	machines: rows<DiaryContent["machines"][number]>(),
	deviations: rows<DiaryContent["deviations"][number]>(),
	generalNotes: z.string().max(DIARY_LIMITS.notes, M.projectDiaryTooLong),
	selfControlNote: z.string().max(DIARY_LIMITS.notes, M.projectDiaryTooLong),
});

export type DiaryFormValues = z.infer<typeof diaryFormSchema>;

/** A stored diary's editable content, as the form holds it. */
export function toDiaryFormValues(diary: ProjectDiary): DiaryFormValues {
	return {
		weather: diary.weather,
		workforce: diary.workforce,
		works: diary.works,
		machines: diary.machines,
		deviations: diary.deviations,
		generalNotes: diary.generalNotes,
		selfControlNote: diary.selfControlNote,
	};
}

/** The form's values as content to store, notes trimmed. */
export function toDiaryContent(values: DiaryFormValues): DiaryContent {
	return {
		...values,
		generalNotes: values.generalNotes.trim(),
		selfControlNote: values.selfControlNote.trim(),
	};
}
