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
import { todayIso } from "@/features/project/shared/todayIso";
import {
	matchesQaFilter,
	PROJECT_QA_FUNCTION_OPTIONS,
	PROJECT_QA_TYPE_OPTIONS,
} from "@/features/project/production/fraga-svar/projectQa.config";
import type { ProjectQuestion } from "@/features/project/production/fraga-svar/types";
import { getDesignProjektRecord } from "../../projektinformation/data/designProjektInfo.mock";
import * as store from "../services/designQaService";

export function useDesignQaBoard(projektId: string) {
	const { t } = useTranslation();

	const projekt = getDesignProjektRecord(projektId);
	const [questions, setQuestions] = useState<ProjectQuestion[]>(() =>
		store.listQuestions(projektId),
	);
	const [filter, setFilter] = useState<string | null>(null);

	const matches = useCallback(
		(question: ProjectQuestion) => matchesQaFilter(question, filter),
		[filter],
	);
	const filters = useQAThreadFilters(questions, matches);
	const { resetFilters: resetChips } = filters;

	const refresh = useCallback(
		() => setQuestions(store.listQuestions(projektId)),
		[projektId],
	);

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

	const create = useCallback(
		(draft: QAThreadDraft, author: string, company: string) => {
			const message = draft.description.trim();
			const type = PROJECT_QA_TYPE_OPTIONS.find(
				(o) => o.value === draft.type,
			)?.value;
			const trade = PROJECT_QA_FUNCTION_OPTIONS.find(
				(o) => o.value === draft.subject,
			)?.value;

			if (!message || message.length > QA_QUESTION_MAX_LENGTH || !type) return;
			if (draft.subject && !trade) return;

			store.createQuestion(projektId, {
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
		[projektId, refresh, t],
	);

	return {
		projekt,
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

export type DesignQaBoardState = ReturnType<typeof useDesignQaBoard>;
