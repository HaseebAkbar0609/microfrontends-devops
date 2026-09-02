"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ROLES } from "@/constants/roles";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_PURCHASE_QA } from "../data/purchaseQa.mock";
import type {
	PurchaseQaMessage,
	PurchaseQaStatus,
} from "../types/purchase.types";

/** Adds or removes a value, for the multi-select filter chips. */
function toggleIn<T>(list: T[], value: T): T[] {
	return list.includes(value)
		? list.filter((item) => item !== value)
		: [...list, value];
}

export interface PurchaseQaDraft {
	type: string;
	subject: string;
	description: string;
}

/**
 * Board state for the purchase module's Fråga/Svar screen.
 *
 * Every filter here actually narrows the list. The b2b board this screen is
 * modelled on keeps its selected companies and roles in state and never reads
 * them in its predicate, so its chips are decorative — that is left alone on
 * its own merged screen, but not copied into this one.
 */
export function usePurchaseQaBoard() {
	const { t } = useTranslation();

	const [messages, setMessages] =
		useState<PurchaseQaMessage[]>(MOCK_PURCHASE_QA);
	const [search, setSearch] = useState("");
	const [companies, setCompanies] = useState<string[]>([]);
	const [roles, setRoles] = useState<string[]>([]);
	const [statuses, setStatuses] = useState<PurchaseQaStatus[]>([]);
	/**
	 * Bumped by `resetFilters` and used as the search box's `key`.
	 *
	 * `Search` debounces 500 ms and pushes its debounced value up whenever that
	 * value differs from the prop. Clearing the prop while the box still holds
	 * text makes that condition true on the very next render, so the old query
	 * is pushed straight back and the reset appears to do nothing. Remounting
	 * the input sidesteps the race without reaching into a shared component.
	 */
	const [resetToken, setResetToken] = useState(0);

	/** Options come from the rows, not a hard-coded list that can drift. */
	const companyOptions = useMemo(
		() => Array.from(new Set(messages.map((row) => row.company))).sort(),
		[messages],
	);

	const roleOptions = useMemo(
		() => Array.from(new Set(messages.map((row) => row.badge))).sort(),
		[messages],
	);

	/** Everything the filters allow, both tabs' rows included. */
	const visible = useMemo(() => {
		const query = search.trim().toLowerCase();

		return messages.filter((row) => {
			if (query) {
				const haystack = `${row.sender} ${row.message}`.toLowerCase();
				if (!haystack.includes(query)) return false;
			}

			if (companies.length > 0 && !companies.includes(row.company)) {
				return false;
			}

			if (roles.length > 0 && !roles.includes(row.badge)) return false;

			if (statuses.length > 0 && !statuses.includes(row.status)) {
				return false;
			}

			return true;
		});
	}, [companies, messages, roles, search, statuses]);

	/**
	 * Rows for one column of one tab.
	 *
	 * The archived split is applied here rather than held in the hook, so the
	 * All and Arkiv boards can share a single instance — with one instance each
	 * they kept separate copies of the list, and archiving on All never reached
	 * Arkiv.
	 */
	const inColumn = useCallback(
		(status: PurchaseQaStatus, archivedOnly: boolean) =>
			visible.filter(
				(row) => row.status === status && row.archived === archivedOnly,
			),
		[visible],
	);

	const toggleCompany = useCallback(
		(value: string) => setCompanies((prev) => toggleIn(prev, value)),
		[],
	);

	const toggleRole = useCallback(
		(value: string) => setRoles((prev) => toggleIn(prev, value)),
		[],
	);

	const toggleStatus = useCallback(
		(value: PurchaseQaStatus) =>
			setStatuses((prev) => toggleIn(prev, value)),
		[],
	);

	const resetFilters = useCallback(() => {
		setResetToken((token) => token + 1);
		setSearch("");
		setCompanies([]);
		setRoles([]);
		setStatuses([]);
	}, []);

	const hasFilters =
		search.trim().length > 0 ||
		companies.length > 0 ||
		roles.length > 0 ||
		statuses.length > 0;

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
		search,
		setSearch,
		resetToken,
		companies,
		roles,
		statuses,
		companyOptions,
		roleOptions,
		toggleCompany,
		toggleRole,
		toggleStatus,
		resetFilters,
		hasFilters,
		inColumn,
		reply,
		markAsRead,
		archive,
		remove,
		create,
	};
}
