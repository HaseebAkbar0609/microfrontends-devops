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
import {
	CALCULATION_QA_FUNCTION_OPTIONS,
	CALCULATION_QA_TYPE_OPTIONS,
	matchesCalculationQaFilter,
} from "../constants/calculationQa.config";
import {
	createCalculationQuestionAPIAction,
	deleteCalculationQuestionAPIAction,
	getCalculationQuestionsAPIAction,
	updateCalculationQuestionAPIAction,
} from "../api/calculationQaApi";
import type { CalculationQuestion } from "../types/calculationQa";

const EMPTY_QUESTIONS: CalculationQuestion[] = [];

/**
 * Board state for a calculation's Fråga/Svar screen: questions,
 * shared search and chips, Filter ▾ (Typ or Funktion), and mutations.
 */
export function useCalculationQaBoard(calcId: string) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const queryKey = useMemo(
		() => ["calculation-questions", calcId],
		[calcId],
	);

	const query = useQuery({
		queryKey,
		queryFn: () => getCalculationQuestionsAPIAction(calcId),
		enabled: Boolean(calcId),
		retry: false,
	});

	const questions = query.data ?? EMPTY_QUESTIONS;
	const [filter, setFilter] = useState<string | null>(null);

	const matches = useCallback(
		(question: CalculationQuestion) =>
			matchesCalculationQaFilter(question, filter),
		[filter],
	);

	const filters = useQAThreadFilters(questions, matches);
	const { resetFilters: resetChips } = filters;

	const refresh = useCallback(
		() => queryClient.invalidateQueries({ queryKey }),
		[queryClient, queryKey],
	);

	const resetFilters = useCallback(() => {
		resetChips();
		setFilter(null);
	}, [resetChips]);

	const reply = useCallback(
		async (id: string, text: string, author: string) => {
			const question = questions.find((row) => row.id === id);
			if (!question) return;
			const todayStr = new Date().toISOString().split("T")[0];
			try {
				await updateCalculationQuestionAPIAction(calcId, {
					...question,
					status: "answered",
					answerUser: author,
					answerBadge: "Admin",
					answerText: text,
					answerDate: todayStr,
				});
				await refresh();
				showToast("success", t(localizationConstants.calcQARepliedToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[calcId, questions, refresh, t],
	);

	const markAsRead = useCallback(
		async (id: string) => {
			const question = questions.find((row) => row.id === id);
			if (!question || question.status !== "new") return;
			try {
				await updateCalculationQuestionAPIAction(calcId, {
					...question,
					status: "opened",
				});
				await refresh();
				showToast("success", t(localizationConstants.calcQAReadToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[calcId, questions, refresh, t],
	);

	const toggleArchive = useCallback(
		async (question: CalculationQuestion) => {
			try {
				await updateCalculationQuestionAPIAction(calcId, {
					...question,
					archived: !question.archived,
				});
				await refresh();
				showToast(
					"success",
					t(
						question.archived
							? localizationConstants.calcQAUnarchivedToast
							: localizationConstants.calcQAArchivedToast,
					),
				);
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[calcId, refresh, t],
	);

	const remove = useCallback(
		async (id: string) => {
			try {
				await deleteCalculationQuestionAPIAction(calcId, id);
				await refresh();
				showToast("info", t(localizationConstants.calcQADeletedToast));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[calcId, refresh, t],
	);

	const create = useCallback(
		async (draft: QAThreadDraft, author: string, company: string) => {
			const message = draft.description.trim();
			const type = CALCULATION_QA_TYPE_OPTIONS.find(
				(opt) => opt.value === draft.type,
			)?.value;
			const trade = CALCULATION_QA_FUNCTION_OPTIONS.find(
				(opt) => opt.value === draft.subject,
			)?.value;

			if (!message || message.length > QA_QUESTION_MAX_LENGTH || !type) return;
			if (draft.subject && !trade) return;

			const todayStr = new Date().toISOString().split("T")[0];

			try {
				await createCalculationQuestionAPIAction(calcId, {
					sender: author,
					company,
					type,
					function: trade,
					message,
					date: todayStr,
					badge: "Fråga",
				});
				await refresh();
				showToast("success", t(localizationConstants.calcQACreatedToast));
			} catch (error) {
				showToast("error", t(localizationConstants.genericError));
				throw error;
			}
		},
		[calcId, refresh, t],
	);

	return {
		calcId,
		isLoading: query.isLoading,
		isError: query.isError,
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

export type CalculationQaBoardState = ReturnType<typeof useCalculationQaBoard>;
