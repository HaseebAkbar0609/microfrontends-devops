"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { PROTOCOL_TYPE_LABELS } from "../projectProtocol.config";
import { protocolUrls } from "../protocolNav";
import { hasMeeting, type ProtocolTypeLabel } from "../protocolView";
import * as store from "../services/projectProtocolService";
import type { MeetingKind, NewMeetingInput, ProjectProtocol, UploadDetails } from "../types";
import { useProtocolFileActions } from "./useProtocolFileActions";
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
	const { openFile, printFile } = useProtocolFileActions();

	/** After a create: the new list and a toast, or the refusal's toast. `undefined` keeps the dialog open. */
	const afterCreate = useCallback(
		(created: ProjectProtocol | undefined): ProtocolCreated | undefined => {
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

	/** Nytt protokoll (Ladda upp): its details and the attached file. */
	const createUpload = useCallback(
		(details: UploadDetails, file: File) => afterCreate(store.createUpload(projectId, details, file)),
		[afterCreate, projectId],
	);

	/**
	 * Nytt möte's Nästa, for a Standard or an Action protocol: stores the
	 * meeting and opens its protocol, where the points are written. `false` when
	 * the store refused it, which keeps the dialog open.
	 */
	const createMeeting = useCallback(
		(kind: MeetingKind, input: NewMeetingInput): boolean => {
			const created = facts ? store.createMeeting(projectId, facts.projectNo, kind, input) : undefined;
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
	 * ⋮ Öppna: a Standard or Action protocol's meeting, or an upload's stored
	 * file. Visa detaljer is a link to the protocol's page.
	 */
	const open = useCallback(
		(row: ProjectProtocol) => {
			if (hasMeeting(row)) {
				router.push(protocolUrls.view(projectId, row.id));
				return;
			}
			openFile(row.url);
		},
		[openFile, projectId, router],
	);

	/** ⋮ Skriv ut — that protocol's file, not the page. */
	const print = useCallback((row: ProjectProtocol) => printFile(row.url), [printFile]);

	return { project, facts, protocols, typeLabel, createUpload, createMeeting, toggleArchive, remove, open, print };
}

export type ProjectProtocolsState = ReturnType<typeof useProjectProtocols>;
