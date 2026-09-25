"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
	QA_QUESTION_MAX_LENGTH,
	type QAThreadDraft,
} from "@/components/common/QAThreadCreateDialog";
import { useQAThreadFilters } from "@/hooks/useQAThreadFilters";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useProjectIdentity } from "../../hooks/useProjectIdentity";
import { todayIso } from "../../../shared/todayIso";
import {
	matchesQaFilter,
	PROJECT_QA_FUNCTION_OPTIONS,
	PROJECT_QA_TYPE_OPTIONS,
} from "../projectQa.config";
import * as store from "../services/projectQaService";
import type { ProjectQuestion } from "../types";

const EMPTY_QUESTIONS: ProjectQuestion[] = [];

/**
 * Board state for a project's Fråga/Svar screen: the project's questions, the
 * shared search and chips, Filter ▾ (Typ or Funktion), and the mutations.
 *
 * One instance serves both Alla and Arkiv, so archiving on one tab is visible
 * on the other. Every mutation writes to the project-scoped API and refreshes
 * the query; the server enforces company context and write entitlement.
 */
export function useProjectQaBoard(projectId: string) {
	/* react-i18next's `t` is stable across renders, unlike `useTranslate()`'s,
	   so the callbacks below are not rebuilt on every render. */
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const projectQuery = useProjectIdentity(projectId);
	const project = projectQuery.data;
	const queryKey = useMemo(() => ["professional-project-questions", projectId], [projectId]);
	const query = useQuery({
		queryKey,
		queryFn: () => store.listQuestions(projectId),
		enabled: Boolean(project),
		retry: false,
	});
	const questions = query.data ?? EMPTY_QUESTIONS;
	const [filter, setFilter] = useState<string | null>(null);

	const matches = useCallback(
		(question: ProjectQuestion) => matchesQaFilter(question, filter),
		[filter],
	);
	const filters = useQAThreadFilters(questions, matches);
	const { resetFilters: resetChips } = filters;

	const refresh = useCallback(
		() => queryClient.invalidateQueries({ queryKey }),
		[queryClient, queryKey],
	);

	/** Reset in the chip row clears everything, Filter ▾ included. */
	const resetFilters = useCallback(() => {
		resetChips();
		setFilter(null);
	}, [resetChips]);

	const reply = useCallback(
		async (id: string, text: string, author: string) => {
			const question = questions.find((row) => row.id === id);
			if (!question) return;
			try {
				await store.updateQuestion({ ...question, status: "answered", answerUser: author, answerText: text, answerDate: todayIso() });
				await refresh();
				showToast("success", t(localizationConstants.projectQaRepliedToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[questions, refresh, t],
	);

	const markAsRead = useCallback(
		async (id: string) => {
			const question = questions.find((row) => row.id === id);
			if (!question || question.status !== "new") return;
			try {
				await store.updateQuestion({ ...question, status: "opened" });
				await refresh();
				showToast("success", t(localizationConstants.projectQaReadToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[questions, refresh, t],
	);

	const toggleArchive = useCallback(
		async (question: ProjectQuestion) => {
			try {
				await store.updateQuestion({ ...question, archived: !question.archived });
				await refresh();
				showToast("success", t(question.archived
					? localizationConstants.projectQaUnarchivedToast
					: localizationConstants.projectQaArchivedToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[refresh, t],
	);

	const remove = useCallback(
		async (id: string) => {
			const question = questions.find((row) => row.id === id);
			if (!question) return;
			try {
				await store.removeQuestion(question);
				await refresh();
				showToast("info", t(localizationConstants.projectQaDeletedToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[questions, refresh, t],
	);

	/**
	 * Validated here as well as in the dialog: the values arrive as plain
	 * strings, so an unknown Typ or Funktion is rejected rather than stored.
	 */
	const create = useCallback(
		async (draft: QAThreadDraft, author: string, company: string) => {
			const message = draft.description.trim();
			const type = PROJECT_QA_TYPE_OPTIONS.find(
				(option) => option.value === draft.type,
			)?.value;
			const trade = PROJECT_QA_FUNCTION_OPTIONS.find(
				(option) => option.value === draft.subject,
			)?.value;

			if (!message || message.length > QA_QUESTION_MAX_LENGTH || !type) return;
			if (draft.subject && !trade) return;

			try {
				await store.createQuestion(projectId, {
					sender: author, company, type, function: trade, message, date: todayIso(),
				});
				await refresh();
				showToast("success", t(localizationConstants.projectQaCreatedToast));
			} catch (error) {
				showToast("error", t(localizationConstants.genericError));
				throw error;
			}
		},
		[projectId, refresh, t],
	);

	return {
		project,
		isLoading: projectQuery.isLoading || (Boolean(project) && query.isLoading),
		isError: projectQuery.isError || query.isError,
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
