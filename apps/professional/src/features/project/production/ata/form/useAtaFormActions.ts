"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../shared/todayIso";
import { ataUrls } from "../ataNav";
import { sendBlockReason } from "../ataRules";
import * as store from "../services/projectAtaService";
import type { AtaLineItem, AtaSection } from "../types";
import type { AtaDocumentsState } from "./documents/useAtaDocuments";
import type { AtaFormState } from "./useAtaForm";
import { useBeforeUnloadWarning } from "./useBeforeUnloadWarning";

/**
 * What the footer and the rail do: Spara, Skicka (behind a confirm), Avbryt
 * (behind a confirm only when something would be lost), and the row dialog.
 * A `savedRef` stops a double click from writing twice.
 */
export function useAtaFormActions(projectId: string, ata: AtaFormState, documents: AtaDocumentsState) {
	const router = useRouter();
	const { t } = useTranslation();
	const savedRef = useRef(false);
	const [sendOpen, setSendOpen] = useState(false);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [editing, setEditing] = useState<{ section: AtaSection; today: string } | null>(null);

	const { form, persist, revealErrors, status, locked } = ata;
	const lineItems = useWatch({ control: form.control, name: "lineItems" });
	const sendReason = sendBlockReason(status, lineItems);
	const dirty = form.formState.isDirty || documents.pending.length > 0;

	useBeforeUnloadWarning(dirty);

	const leave = useCallback(() => router.push(ataUrls.list(projectId)), [projectId, router]);

	const save = useCallback(() => {
		if (savedRef.current || locked) return;
		documents.commit();
		void form.handleSubmit((values) => {
			if (!persist(values)) {
				showToast("error", t(localizationConstants.projectAtaLocked));
				return;
			}
			savedRef.current = true;
			showToast("success", t(localizationConstants.projectAtaSavedToast));
			leave();
		}, revealErrors)();
	}, [documents, form, leave, locked, persist, revealErrors, t]);

	/* `handleSubmit` hands `revealErrors` the errors it just found; `formState.errors` after a `trigger` is the last render's. */
	const requestSend = useCallback(() => {
		if (sendReason || savedRef.current) return;
		documents.commit();
		void form.handleSubmit(() => setSendOpen(true), revealErrors)();
	}, [documents, form, revealErrors, sendReason]);

	const confirmSend = useCallback(() => {
		setSendOpen(false);
		if (savedRef.current) return;
		void form.handleSubmit((values) => {
			const saved = persist(values);
			if (!saved) {
				showToast("error", t(localizationConstants.projectAtaLocked));
				return;
			}
			savedRef.current = true;
			const sent = store.sendAta(projectId, saved.id);
			showToast(
				sent ? "success" : "error",
				t(sent ? localizationConstants.ataSendSuccess : localizationConstants.projectAtaSendNeedsRows),
			);
			leave();
		}, revealErrors)();
	}, [form, leave, persist, projectId, revealErrors, t]);

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
		sendReason,
		sendOpen,
		setSendOpen,
		discardOpen,
		setDiscardOpen,
		editing,
		closeLineItems,
		openLineItems,
		applyLineItems,
		save,
		requestSend,
		confirmSend,
		cancel,
		discard,
	};
}

export type AtaFormActions = ReturnType<typeof useAtaFormActions>;
