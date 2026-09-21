"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { disposePrintFrame, printStoredFile } from "../../../shared/printStoredFile";
import { PROTOCOL_TYPE_LABELS } from "../projectProtocol.config";
import { protocolUrls } from "../protocolNav";
import { hasMeeting, type ProtocolTypeLabel } from "../protocolView";
import * as store from "../services/projectProtocolService";
import type { NewMeetingInput, ProjectProtocol, ProjectProtocolInput } from "../types";
import { useProtocolProject } from "./useProtocolProject";

/** A stored protocol and the list it now sits in, which the table reads to find its page. */
export interface ProtocolCreated {
	row: ProjectProtocol;
	protocols: ProjectProtocol[];
}

/**
 * The project's protocols and the changes made to them. Every change goes
 * through the store and the list is re-read from it, so the table never drifts
 * from what is stored.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * type labels and callbacks only change with the language.
 */
export function useProjectProtocols(projectId: string) {
	const { t } = useTranslation();
	const router = useRouter();
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	/** Projekt nr and namn as Nytt möte shows them. */
	const facts = useProtocolProject(projectId);
	const [protocols, setProtocols] = useState(() => store.listProtocols(projectId));

	const typeLabel: ProtocolTypeLabel = useCallback((type) => t(PROTOCOL_TYPE_LABELS[type]), [t]);

	const refresh = useCallback(() => setProtocols(store.listProtocols(projectId)), [projectId]);

	/* The print frame, if one was used, leaves with the section. */
	useEffect(() => disposePrintFrame, []);

	/** Stores a new protocol; `undefined` when the store refuses it, which keeps the dialog open. */
	const create = useCallback(
		(input: ProjectProtocolInput): ProtocolCreated | undefined => {
			const created = store.createProtocol(projectId, input);
			if (!created) {
				showToast("error", t(localizationConstants.projectProtocolSaveFailed));
				return undefined;
			}
			const next = store.listProtocols(projectId);
			setProtocols(next);
			showToast("success", t(localizationConstants.projectProtocolCreatedToast));
			return { row: created, protocols: next };
		},
		[projectId, t],
	);

	/**
	 * Nytt möte's Nästa: stores the meeting and opens its protocol, where the
	 * points are written. `false` when the store refused it, which keeps the
	 * dialog open.
	 */
	const createMeeting = useCallback(
		(input: NewMeetingInput): boolean => {
			const created = facts ? store.createMeeting(projectId, facts.projectNo, input) : undefined;
			if (!created) {
				showToast("error", t(localizationConstants.projectProtocolSaveFailed));
				return false;
			}
			refresh();
			showToast("success", t(localizationConstants.projectProtocolCreatedToast));
			router.push(protocolUrls.view(projectId, created.id));
			return true;
		},
		[facts, projectId, refresh, router, t],
	);

	/** Reversible, so no confirm — as Besiktning archives. */
	const toggleArchive = useCallback(
		(row: ProjectProtocol) => {
			store.setProtocolArchived(projectId, row.id, !row.archived);
			refresh();
			showToast(
				"success",
				t(row.archived ? localizationConstants.projectProtocolRestoredToast : localizationConstants.projectProtocolArchivedToast),
			);
		},
		[projectId, refresh, t],
	);

	const remove = useCallback(
		(row: ProjectProtocol) => {
			store.removeProtocol(projectId, row.id);
			refresh();
			showToast("success", t(localizationConstants.projectProtocolDeletedToast));
		},
		[projectId, refresh, t],
	);

	/**
	 * Visa detaljer and ⋮ Öppna: a Standard protocol's meeting, or the PDF. Only
	 * a URL the store minted gets here, and `openSafeUrl` checks it again.
	 */
	const open = useCallback(
		(row: ProjectProtocol) => {
			if (hasMeeting(row)) {
				router.push(protocolUrls.view(projectId, row.id));
				return;
			}
			if (!openSafeUrl(row.url)) showToast("error", t(localizationConstants.projectProtocolNoFile));
		},
		[projectId, router, t],
	);

	/** ⋮ Skriv ut — that protocol's PDF, not the page. Runs in the click, so a fallback tab is not blocked. */
	const print = useCallback(
		(row: ProjectProtocol) => {
			if (!row.url) {
				showToast("error", t(localizationConstants.projectProtocolNoFile));
				return;
			}
			const failed = () => showToast("error", t(localizationConstants.projectProtocolPrintFailed));
			if (!printStoredFile(row.url, failed)) failed();
		},
		[t],
	);

	return { project, facts, protocols, typeLabel, create, createMeeting, toggleArchive, remove, open, print };
}

export type ProjectProtocolsState = ReturnType<typeof useProjectProtocols>;
