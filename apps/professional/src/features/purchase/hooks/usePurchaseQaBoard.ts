"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import type { QAThreadDraft } from "@/components/common/QAThreadCreateDialog";
import { ROLES } from "@/constants/roles";
import { useQAThreadFilters } from "@/hooks/useQAThreadFilters";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_PURCHASE_QA } from "../data/purchaseQa.mock";
import type {
	PurchaseQaMessage,
	PurchaseQaStatus,
} from "../types/purchase.types";

/** The create dialog's values, with the subject already resolved to its label. */
export type PurchaseQaDraft = QAThreadDraft;

/**
 * Board state for the purchase module's Fråga/Svar screen.
 *
 * Search and the chips live in the shared `useQAThreadFilters`, which the
 * project record's board uses too; this hook adds the purchase list and the
 * mutations, with their permission checks.
 */
export function usePurchaseQaBoard() {
	const { t } = useTranslation();

	const [messages, setMessages] =
		useState<PurchaseQaMessage[]>(MOCK_PURCHASE_QA);
	const filters = useQAThreadFilters(messages);

	/**
	 * The create button is wrapped in `PermissionGate`, but these actions are
	 * reachable from the hook, so they re-check rather than trusting the
	 * rendered tree. A guard, not a boundary — the server must enforce it too.
	 */
	const ensureCanEdit = useCallback(() => {
		if (hasPermission(ROLES.MANAGER, "EDIT_PURCHASE")) return true;
		showToast("error", t(localizationConstants.purchaseQaUnavailable));
		return false;
	}, [t]);

	const reply = useCallback(
		(id: string, text: string, author: string) => {
			if (!ensureCanEdit()) return;

			setMessages((previous) =>
				previous.map((row) =>
					row.id === id
						? {
								...row,
								status: "answered" as PurchaseQaStatus,
								answerUser: author,
								answerText: text,
								answerDate: row.date,
							}
						: row,
				),
			);
			showToast("success", t(localizationConstants.purchaseQaRepliedToast));
		},
		[ensureCanEdit, t],
	);

	const markAsRead = useCallback(
		(id: string) => {
			if (!ensureCanEdit()) return;

			setMessages((previous) =>
				previous.map((row) =>
					row.id === id && row.status === "new"
						? { ...row, status: "opened" as PurchaseQaStatus }
						: row,
				),
			);
			showToast("success", t(localizationConstants.purchaseQaReadToast));
		},
		[ensureCanEdit, t],
	);

	const archive = useCallback(
		(id: string) => {
			if (!ensureCanEdit()) return;

			setMessages((previous) =>
				previous.map((row) =>
					row.id === id ? { ...row, archived: !row.archived } : row,
				),
			);
			showToast(
				"success",
				t(localizationConstants.purchaseQaArchivedToast),
			);
		},
		[ensureCanEdit, t],
	);

	const remove = useCallback(
		(id: string) => {
			if (!ensureCanEdit()) return;

			setMessages((previous) => previous.filter((row) => row.id !== id));
			showToast("info", t(localizationConstants.purchaseQaDeletedToast));
		},
		[ensureCanEdit, t],
	);

	const create = useCallback(
		(draft: PurchaseQaDraft, author: string, company: string) => {
			if (!hasPermission(ROLES.MANAGER, "CREATE_PURCHASE")) {
				showToast(
					"error",
					t(localizationConstants.purchaseQaUnavailable),
				);
				return;
			}

			const text = draft.description.trim();
			if (!text) return;

			/**
			 * `new Date()` is fine here — a click handler runs only on the
			 * client, unlike a mock evaluated during render.
			 */
			const now = new Date();
			const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

			setMessages((previous) => [
				{
					id: `qa-${now.getTime()}`,
					sender: author,
					company,
					badge: "Fråga",
					message: draft.subject ? `[${draft.subject}] ${text}` : text,
					date,
					status: "new",
					archived: false,
				},
				...previous,
			]);

			showToast("success", t(localizationConstants.purchaseQaCreatedToast));
		},
		[t],
	);

	return {
		...filters,
		reply,
		markAsRead,
		archive,
		remove,
		create,
	};
}
