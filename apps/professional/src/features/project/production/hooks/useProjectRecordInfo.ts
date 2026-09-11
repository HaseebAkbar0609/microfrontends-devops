"use client";

import { useCallback, useState } from "react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_CREATE_CONSTANTS } from "../../create/constants";
import { buildProjectRecordInfo } from "../data/projectRecordInfo.mock";
import type { ProjectInfoSectionKey, ProjectRecordInfo } from "../types";

/**
 * The record's four blocks, and which one is being edited.
 *
 * Edits stay in memory: there is no projects endpoint, and the module's other
 * screens read a module-level array. Nothing is written to `localStorage` —
 * the customer block carries an organisation or personal number, which
 * AGENTS.md rule 6 keeps out of browser storage.
 */
export function useProjectRecordInfo(projectId: string) {
	const t = useTranslate();

	const [info, setInfo] = useState<ProjectRecordInfo | null>(() =>
		buildProjectRecordInfo(projectId),
	);
	const [editing, setEditing] = useState<ProjectInfoSectionKey | null>(null);

	const closeEditor = useCallback(() => setEditing(null), []);

	/**
	 * Replaces one block. The dialog hands back the whole section, already
	 * validated, so a half-saved card is not possible.
	 */
	const saveSection = useCallback(
		(
			section: ProjectInfoSectionKey,
			values: Partial<
				ProjectRecordInfo["customer"] &
					ProjectRecordInfo["contactPerson"] &
					ProjectRecordInfo["details"]
			>,
		) => {
			setInfo((previous) => {
				if (!previous) return previous;

				if (section === "customer") {
					return { ...previous, customer: { ...previous.customer, ...values } };
				}
				if (section === "contact") {
					return {
						...previous,
						contactPerson: { ...previous.contactPerson, ...values },
					};
				}
				/* "project" and "projectInfo" are two cards over one block. */
				return { ...previous, details: { ...previous.details, ...values } };
			});

			setEditing(null);
			showToast("success", t(localizationConstants.toastChangesSaved));
		},
		[t],
	);

	/**
	 * The offer's attachments. Bounded by the same limit the create wizard
	 * applies, so a name cannot be longer here than where it was first typed.
	 */
	const renameDocument = useCallback((id: string, documentName: string) => {
		const bounded = documentName.slice(
			0,
			PROJECT_CREATE_CONSTANTS.MAX_DOCUMENT_NAME_LENGTH,
		);
		setInfo((previous) =>
			previous
				? {
						...previous,
						documents: previous.documents.map((row) =>
							row.id === id ? { ...row, documentName: bounded } : row,
						),
					}
				: previous,
		);
	}, []);

	const removeDocument = useCallback((id: string) => {
		setInfo((previous) =>
			previous
				? {
						...previous,
						documents: previous.documents.filter((row) => row.id !== id),
					}
				: previous,
		);
	}, []);

	return {
		info,
		editing,
		setEditing,
		closeEditor,
		saveSection,
		renameDocument,
		removeDocument,
	};
}
