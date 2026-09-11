"use client";

import { useCallback, useState } from "react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
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

	return { info, editing, setEditing, closeEditor, saveSection };
}
