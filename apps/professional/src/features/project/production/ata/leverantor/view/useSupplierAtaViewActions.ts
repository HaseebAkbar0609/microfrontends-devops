"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../../shared/todayIso";
import { supplierApproveBlockReason } from "../../ataRules";
import { useBeforeUnloadWarning } from "../../../hooks/useBeforeUnloadWarning";
import type { AtaLineItem, AtaSection } from "../../types";
import * as store from "../services/supplierAtaService";
import type { SupplierAtaViewState } from "./useSupplierAtaView";

/**
 * What View ÄTA's rail and footer do: Spara, Godkänna (behind a confirm — and
 * saving any unsaved changes first), Avbryt and Tillbaka (behind a confirm only
 * when something would be lost), and the row dialog. A `savedRef` stops a
 * double click from writing twice.
 */
export function useSupplierAtaViewActions(projectId: string, view: SupplierAtaViewState) {
	const router = useRouter();
	const { t } = useTranslation();
	const savedRef = useRef(false);
	const [approveOpen, setApproveOpen] = useState(false);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [editing, setEditing] = useState<{ section: AtaSection; today: string } | null>(null);

	const { form, persist, reveal, status, locked, listUrl, ata } = view;
	const lineItems = useWatch({ control: form.control, name: "lineItems" });
	const approveReason = supplierApproveBlockReason(status, lineItems);
	const dirty = form.formState.isDirty;
	useBeforeUnloadWarning(dirty);

	const leave = useCallback(() => router.push(listUrl), [listUrl, router]);

	const save = useCallback(() => {
		if (savedRef.current || locked) return;
		if (!dirty) return leave();
		void form.handleSubmit((values) => {
			if (!persist(values)) return showToast("error", t(localizationConstants.projectAtaLocked));
			savedRef.current = true;
			showToast("success", t(localizationConstants.projectAtaSavedToast));
			leave();
		}, reveal)();
	}, [dirty, form, leave, locked, persist, reveal, t]);

	/* `handleSubmit` hands `reveal` the errors it just found; `formState.errors` after a `trigger` is the last render's. */
	const requestApprove = useCallback(() => {
		if (approveReason || savedRef.current) return;
		if (!dirty) return setApproveOpen(true);
		void form.handleSubmit(() => setApproveOpen(true), reveal)();
	}, [approveReason, dirty, form, reveal]);

	const confirmApprove = useCallback(() => {
		setApproveOpen(false);
		if (savedRef.current || !ata) return;
		const approve = () => {
			savedRef.current = true;
			const approved = store.approveSupplierAta(projectId, ata.id, todayIso());
			showToast(
				approved ? "success" : "error",
				t(approved ? localizationConstants.viewAtaApproveSuccess : localizationConstants.projectAtaSupplierAlreadyApproved),
			);
			leave();
		};
		if (!dirty) return approve();
		void form.handleSubmit((values) => {
			if (!persist(values)) return showToast("error", t(localizationConstants.projectAtaLocked));
			approve();
		}, reveal)();
	}, [ata, dirty, form, leave, persist, projectId, reveal, t]);

	const cancel = useCallback(() => (dirty ? setDiscardOpen(true) : leave()), [dirty, leave]);

	const discard = useCallback(() => {
		setDiscardOpen(false);
		savedRef.current = true;
		leave();
	}, [leave]);

	const openLineItems = useCallback((section: AtaSection) => setEditing({ section, today: todayIso() }), []);
	const closeLineItems = useCallback(() => setEditing(null), []);
	const applyLineItems = useCallback(
		(section: AtaSection, items: AtaLineItem[]) => {
			form.setValue(`lineItems.${section}`, items, { shouldDirty: true, shouldValidate: true });
			setEditing(null);
		},
		[form],
	);

	return {
		dirty,
		approveReason,
		approveOpen,
		setApproveOpen,
		discardOpen,
		setDiscardOpen,
		editing,
		openLineItems,
		closeLineItems,
		applyLineItems,
		save,
		requestApprove,
		confirmApprove,
		cancel,
		discard,
	};
}

export type SupplierAtaViewActions = ReturnType<typeof useSupplierAtaViewActions>;
