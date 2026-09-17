"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { todayIso } from "../../../shared/todayIso";
import type { DocumentLabels } from "../documentView";
import { DOCUMENT_KIND_META, DRAWING_CATEGORY_LABELS } from "../projectDocuments.config";
import * as store from "../services/projectDocumentService";
import type { ProjectDocument, ProjectDocumentInput } from "../types";

/**
 * The project's files and the changes made to them, shared by every tab so a
 * file archived on Handlingar shows under Arkiv. Every change goes through the
 * store and the list is re-read from it, so the tables never drift from it.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders, so the
 * memoised labels and callbacks only change with the language.
 */
export function useProjectDocuments(projectId: string) {
	const { t } = useTranslation();
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	const currentUser = useCurrentUserName(localizationConstants.projectDocumentsYou);
	const [documents, setDocuments] = useState(() => store.listDocuments(projectId));

	const labels: DocumentLabels = useMemo(
		() => ({
			category: (category) => t(DRAWING_CATEGORY_LABELS[category]),
			kind: (kind) => t(DOCUMENT_KIND_META[kind].kindKey),
		}),
		[t],
	);

	const refresh = useCallback(() => setDocuments(store.listDocuments(projectId)), [projectId]);

	/** Stores an upload dated today; `undefined` when the store refuses it. Call from a handler. */
	const upload = useCallback(
		(input: ProjectDocumentInput): ProjectDocument | undefined => {
			const created = store.createDocument(projectId, input, { createdBy: currentUser, today: todayIso() });
			if (!created) {
				showToast("error", t(localizationConstants.projectDocumentsUploadFailed));
				return undefined;
			}
			refresh();
			showToast("success", t(localizationConstants.projectDocumentsUploadedToast));
			return created;
		},
		[projectId, currentUser, refresh, t],
	);

	/** Reversible, so no confirm — as Besiktning archives. */
	const toggleArchive = useCallback(
		(doc: ProjectDocument) => {
			store.setDocumentArchived(projectId, doc.id, !doc.archived);
			refresh();
			showToast(
				"success",
				t(doc.archived ? localizationConstants.projectDocumentsRestoredToast : localizationConstants.projectDocumentsArchivedToast),
			);
		},
		[projectId, refresh, t],
	);

	const remove = useCallback(
		(doc: ProjectDocument) => {
			store.removeDocument(projectId, doc.id);
			refresh();
			showToast("success", t(localizationConstants.projectDocumentsDeletedToast));
		},
		[projectId, refresh, t],
	);

	/** Opens the stored file. Only a URL the store minted gets here, and `openSafeUrl` checks it again. */
	const open = useCallback(
		(doc: ProjectDocument) => {
			if (!openSafeUrl(doc.url)) showToast("error", t(localizationConstants.projectDocumentsNoFile));
		},
		[t],
	);

	return { project, documents, labels, upload, toggleArchive, remove, open };
}

export type ProjectDocumentsState = ReturnType<typeof useProjectDocuments>;
