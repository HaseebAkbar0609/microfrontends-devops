"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	QA_QUESTION_MAX_LENGTH,
	type QAThreadDraft,
} from "@/components/common/QAThreadCreateDialog";
import { useQAThreadFilters } from "@/hooks/useQAThreadFilters";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import {
	matchesQaFilter,
	PROJECT_QA_FUNCTION_OPTIONS,
	PROJECT_QA_TYPE_OPTIONS,
} from "../projectQa.config";
import { todayIso } from "../qaDate";
import * as store from "../services/projectQaService";
import type { ProjectQuestion } from "../types";

/**
 * Board state for a project's Fråga/Svar screen: the project's questions, the
 * shared search and chips, Filter ▾ (Typ or Funktion), and the mutations.
 *
 * One instance serves both Alla and Arkiv, so archiving on one tab is visible
 * on the other. Every mutation writes through the store and then re-reads it.
 *
 * There is no `PROJECT_*` permission key yet, so nothing here is gated — the
 * same as the record's other sections. The server must enforce access once
 * there is one.
 */
export function useProjectQaBoard(projectId: string) {
	/* react-i18next's `t` is stable across renders, unlike `useTranslate()`'s,
	   so the callbacks below are not rebuilt on every render. */
	const { t } = useTranslation();

	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	const [questions, setQuestions] = useState<ProjectQuestion[]>(() =>
		store.listQuestions(projectId),
	);
	const [filter, setFilter] = useState<string | null>(null);

	const matches = useCallback(
		(question: ProjectQuestion) => matchesQaFilter(question, filter),
		[filter],
	);
	const filters = useQAThreadFilters(questions, matches);
	const { resetFilters: resetChips } = filters;

	const refresh = useCallback(
		() => setQuestions(store.listQuestions(projectId)),
		[projectId],
	);

	/** Reset in the chip row clears everything, Filter ▾ included. */
	const resetFilters = useCallback(() => {
		resetChips();
		setFilter(null);
	}, [resetChips]);

	const reply = useCallback(
		(id: string, text: string, author: string) => {
			store.replyTo(id, { author, text, date: todayIso() });
			refresh();
			showToast("success", t(localizationConstants.projectQaRepliedToast));
		},
		[refresh, t],
	);

	const markAsRead = useCallback(
		(id: string) => {
			store.markAsRead(id);
			refresh();
			showToast("success", t(localizationConstants.projectQaReadToast));
		},
		[refresh, t],
	);

	const toggleArchive = useCallback(
		(question: ProjectQuestion) => {
			store.setArchived(question.id, !question.archived);
			refresh();
			showToast(
				"success",
				t(
					question.archived
						? localizationConstants.projectQaUnarchivedToast
						: localizationConstants.projectQaArchivedToast,
				),
			);
		},
		[refresh, t],
	);

	const remove = useCallback(
		(id: string) => {
			store.removeQuestion(id);
			refresh();
			showToast("info", t(localizationConstants.projectQaDeletedToast));
		},
		[refresh, t],
	);

	/**
	 * Validated here as well as in the dialog: the values arrive as plain
	 * strings, so an unknown Typ or Funktion is rejected rather than stored.
	 */
	const create = useCallback(
		(draft: QAThreadDraft, author: string, company: string) => {
			const message = draft.description.trim();
			const type = PROJECT_QA_TYPE_OPTIONS.find(
				(option) => option.value === draft.type,
			)?.value;
			const trade = PROJECT_QA_FUNCTION_OPTIONS.find(
				(option) => option.value === draft.subject,
			)?.value;

			if (!message || message.length > QA_QUESTION_MAX_LENGTH || !type) return;
			if (draft.subject && !trade) return;

			store.createQuestion(projectId, {
				sender: author,
				company,
				type,
				function: trade,
				message,
				date: todayIso(),
			});
			refresh();
			showToast("success", t(localizationConstants.projectQaCreatedToast));
		},
		[projectId, refresh, t],
	);

	return {
		project,
		...filters,
		resetFilters,
		hasFilters: filters.hasFilters || filter !== null,
		filter,
		setFilter,
		reply,
		markAsRead,
		toggleArchive,
		remove,
		create,
	};
}

export type ProjectQaBoardState = ReturnType<typeof useProjectQaBoard>;
