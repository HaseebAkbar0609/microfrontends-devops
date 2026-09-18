"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../../data/projectsOverview.mock";
import { todayIso } from "../../../../shared/todayIso";
import { buildProjectRecordInfo } from "../../../data/projectRecordInfo.mock";
import * as store from "../../services/projectWarrantyService";
import type { WarrantyDocument, WarrantyDocumentInput } from "../../types";

/** The project's own fields on the frame's second card, read once. */
export interface WarrantyProjectFacts {
	/** "Projekt nr N" in the page title, as the list row stores it. */
	projectNr: string;
	projectNo: string;
	projectName: string;
	customer: string;
	customerContact: string;
	mobile: string;
	email: string;
	startDate: string;
}

/**
 * One warranty commitment: the project facts its cards show, the commitment
 * itself, and the changes the Dokument card makes. Every change goes through
 * the store and the commitment is re-read from what it returns, so the card
 * never drifts from what is stored.
 *
 * `project` and `commitment` are `null`/`undefined` for an id that matches
 * nothing, which the page turns into a 404.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * callbacks only change with the language.
 */
export function useWarrantyDetail(projectId: string, commitmentId: string) {
	const { t } = useTranslation();
	const [commitment, setCommitment] = useState(() => store.getCommitment(projectId, commitmentId));

	const project = useMemo<WarrantyProjectFacts | null>(() => {
		const row = PROJECT_LIST_ROWS.find((item) => item.id === projectId);
		const record = buildProjectRecordInfo(projectId);
		if (!row || !record) return null;

		const { details, contactPerson, customer } = record;
		return {
			projectNr: row.projectNr,
			projectNo: details.projectNo.replace(/^#/, ""),
			projectName: details.projectName,
			customer: customer.customer,
			customerContact: [contactPerson.firstName, contactPerson.lastName].filter(Boolean).join(" "),
			mobile: contactPerson.mobile,
			email: contactPerson.email,
			startDate: details.startDate,
		};
	}, [projectId]);

	/** Keeps the page on what the store returned; `undefined` means it refused the change. */
	const apply = useCallback(
		(next: ReturnType<typeof store.getCommitment>, successKey: TranslationKeys) => {
			if (!next) {
				showToast("error", t(localizationConstants.projectWarrantyChangeFailed));
				return false;
			}
			setCommitment(next);
			showToast("success", t(successKey));
			return true;
		},
		[t],
	);

	/** Stores a document dated today. `false` leaves the dialog open. Call from a handler. */
	const addDocument = useCallback(
		(input: WarrantyDocumentInput) =>
			apply(store.addDocument(projectId, commitmentId, input, todayIso()), localizationConstants.projectWarrantyDocumentSavedToast),
		[projectId, commitmentId, apply],
	);

	const renameDocument = useCallback(
		(documentId: string, name: string) =>
			apply(store.renameDocument(projectId, commitmentId, documentId, name), localizationConstants.projectWarrantyDocumentSavedToast),
		[projectId, commitmentId, apply],
	);

	const removeDocument = useCallback(
		(documentId: string) =>
			apply(store.removeDocument(projectId, commitmentId, documentId), localizationConstants.projectWarrantyDocumentDeletedToast),
		[projectId, commitmentId, apply],
	);

	/** Opens the stored file. Only a URL the store minted gets here, and `openSafeUrl` checks it again. */
	const openDocument = useCallback(
		(document: WarrantyDocument) => {
			if (!openSafeUrl(document.url)) showToast("error", t(localizationConstants.projectWarrantyDocumentNoFile));
		},
		[t],
	);

	return { project, commitment, addDocument, renameDocument, removeDocument, openDocument };
}

export type WarrantyDetailState = ReturnType<typeof useWarrantyDetail>;
