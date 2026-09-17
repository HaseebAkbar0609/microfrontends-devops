"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { useQueryParams } from "@/hooks/useQueryParams";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { todayIso } from "../../../shared/todayIso";
import { isIsoDate } from "../diaryDates";
import { DIARY_DATE_PARAM } from "../projectDiary.config";
import * as store from "../services/projectDiaryService";
import type { DiaryContent, DiarySignerRole, ProjectDiary } from "../types";
import type { DiaryProjectFacts } from "./useDiaryProject";

/**
 * The project's diaries, the day being shown, and the changes made to them.
 *
 * The day lives in the URL (`?datum=yyyy-MM-dd`), so it survives a reload and
 * browser back. A missing or malformed value shows the most recent diary — no
 * `new Date()` during render. Every change goes through the store and the list
 * is re-read from it; each reports back whether it was accepted.
 */
export function useProjectDiary(projectId: string, facts: DiaryProjectFacts) {
	const { t } = useTranslation();
	const searchParams = useSearchParams();
	const { changeQueries } = useQueryParams();
	const currentUser = useCurrentUserName(localizationConstants.projectDiaryYou);
	const [diaries, setDiaries] = useState(() => store.listDiaries(projectId));

	const requested = searchParams.get(DIARY_DATE_PARAM);
	const selectedDate = isIsoDate(requested) ? requested : (diaries[0]?.date ?? null);
	const diary = diaries.find((entry) => entry.date === selectedDate) ?? null;

	const refresh = useCallback(() => setDiaries(store.listDiaries(projectId)), [projectId]);

	const selectDate = useCallback(
		(date: string) => changeQueries({ [DIARY_DATE_PARAM]: date }),
		[changeQueries],
	);

	/** Toasts the outcome of a store call and re-reads the list when it was accepted. */
	const report = useCallback(
		(result: ProjectDiary | undefined, successKey: TranslationKeys): boolean => {
			if (!result) {
				showToast("error", t(localizationConstants.projectDiaryActionFailed));
				return false;
			}
			refresh();
			showToast("success", t(successKey));
			return true;
		},
		[refresh, t],
	);

	/** Opens an empty draft for a day and shows it. Call from a handler: it reads today. */
	const create = useCallback(
		(date: string) => {
			const created = store.createDiary(projectId, date, { createdBy: currentUser, today: todayIso() });
			if (report(created, localizationConstants.projectDiaryCreatedToast)) selectDate(date);
		},
		[projectId, currentUser, report, selectDate],
	);

	const save = useCallback(
		(id: string, content: DiaryContent) =>
			report(store.updateDiary(projectId, id, content, todayIso()), localizationConstants.projectDiarySavedToast),
		[projectId, report],
	);

	const publish = useCallback(
		(id: string) => report(store.publishDiary(projectId, id, todayIso()), localizationConstants.projectDiaryPublishedToast),
		[projectId, report],
	);

	const sign = useCallback(
		(id: string, role: DiarySignerRole) =>
			report(
				store.signDiary(projectId, id, role, { name: facts.signers[role], today: todayIso() }),
				localizationConstants.projectDiarySignedToast,
			),
		[projectId, facts.signers, report],
	);

	return {
		diaries,
		selectedDate,
		diary,
		/** Days that already have a diary, for Ny dagbok's check and the calendar. */
		takenDates: new Set(diaries.map((entry) => entry.date)),
		selectDate,
		create,
		save,
		publish,
		sign,
	};
}

export type ProjectDiaryState = ReturnType<typeof useProjectDiary>;
