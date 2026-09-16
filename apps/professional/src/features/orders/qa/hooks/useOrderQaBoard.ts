"use client";

import { useCallback, useEffect, useState } from "react";
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
	matchesOrderQaFilter,
	ORDER_QA_FUNCTION_OPTIONS,
	ORDER_QA_TYPE_OPTIONS,
} from "../orderQa.config";
import * as store from "../services/orderQaService";
import type { OrderQuestion } from "../types";

/**
 * Board state for an order's Q&A screen: the order's questions,
 * the shared search and chips, Filter ▾ (Typ or Funktion), and mutations.
 */
export function useOrderQaBoard(orderId: string) {
	const { t } = useTranslation();

	const [questions, setQuestions] = useState<OrderQuestion[]>(() =>
		store.listOrderQuestions(orderId),
	);
	const [filter, setFilter] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		store.initializeOrderQuestions(orderId).then((data) => {
			if (isMounted) {
				setQuestions(data);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [orderId]);

	const matches = useCallback(
		(question: OrderQuestion) => matchesOrderQaFilter(question, filter),
		[filter],
	);
	const filters = useQAThreadFilters(questions, matches);
	const { resetFilters: resetChips } = filters;

	const refresh = useCallback(
		() => setQuestions(store.listOrderQuestions(orderId)),
		[orderId],
	);

	/** Reset in the chip row clears everything, Filter ▾ included. */
	const resetFilters = useCallback(() => {
		resetChips();
		setFilter(null);
	}, [resetChips]);

	const reply = useCallback(
		async (id: string, text: string, author: string) => {
			if (!text.trim()) {
				showToast("error", t(localizationConstants.fieldRequired));
				return;
			}
			await store.replyToOrderQuestion(orderId, id, {
				author,
				text: text.trim(),
				date: todayIso(),
			});
			refresh();
			showToast("success", t(localizationConstants.projectQaRepliedToast));
		},
		[orderId, refresh, t],
	);

	const markAsRead = useCallback(
		async (id: string) => {
			await store.markOrderQuestionAsRead(orderId, id);
			refresh();
			showToast("success", t(localizationConstants.projectQaReadToast));
		},
		[orderId, refresh, t],
	);

	const toggleArchive = useCallback(
		async (question: OrderQuestion) => {
			await store.setOrderQuestionArchived(orderId, question.id, !question.archived);
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
		[orderId, refresh, t],
	);

	const remove = useCallback(
		async (id: string) => {
			await store.removeOrderQuestion(orderId, id);
			refresh();
			showToast("info", t(localizationConstants.projectQaDeletedToast));
		},
		[orderId, refresh, t],
	);

	const create = useCallback(
		async (draft: QAThreadDraft, author: string, company: string) => {
			const message = draft.description.trim();
			const type = ORDER_QA_TYPE_OPTIONS.find(
				(option) => option.value === draft.type,
			)?.value;
			const trade = ORDER_QA_FUNCTION_OPTIONS.find(
				(option) => option.value === draft.subject,
			)?.value;

			if (!message) {
				showToast("error", t(localizationConstants.fieldRequired));
				return;
			}
			if (message.length > QA_QUESTION_MAX_LENGTH) {
				return;
			}
			if (!type) {
				showToast("error", t(localizationConstants.fieldRequired));
				return;
			}
			if (draft.subject && !trade) return;

			await store.createOrderQuestion(orderId, {
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
		[orderId, refresh, t],
	);

	return {
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

export type OrderQaBoardState = ReturnType<typeof useOrderQaBoard>;
