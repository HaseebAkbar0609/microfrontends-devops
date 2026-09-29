"use client";

import { useCallback, useState } from "react";

import type { PendingUploadFile } from "@/components/form";
import { revokeUrls, type RecordFileRules } from "@/features/project/shared/recordFiles";
import type { CaseDocument } from "../types/cases.types";
import { acceptPickedCaseFiles, toCaseDocument, type CasePickRejection } from "../utils/caseAttachments";

export interface UseCaseAttachmentsOptions {
	documents: CaseDocument[];
	rules: RecordFileRules;
	category: "document" | "image";
	onAdd: (document: CaseDocument) => void;
	onRemove: (id: string) => void;
}

/**
 * One kind of attachment on the create form: what has been picked but not yet
 * added, and what the case already holds.
 *
 * Picking stages chips and says at once if a file cannot be taken; Ladda upp
 * commits them. A file the reader takes back has its URL revoked here; one
 * that reaches the case belongs to the case, and the form releases it only if
 * the case is never filed.
 */
export function useCaseAttachments({ documents, rules, category, onAdd, onRemove }: UseCaseAttachmentsOptions) {
	const [pending, setPending] = useState<PendingUploadFile[]>([]);
	const [rejection, setRejection] = useState<CasePickRejection | null>(null);

	const select = useCallback(
		(files: File[]) => {
			const taken = [...documents.map((doc) => doc.name), ...pending.map((item) => item.name)];
			const { accepted, rejection: refused } = acceptPickedCaseFiles(taken, files, rules);
			setRejection(refused);
			if (accepted.length === 0) return;
			setPending((previous) => [...previous, ...accepted.map((file) => ({ name: file.name, file }))]);
		},
		[documents, pending, rules],
	);

	const removePending = useCallback((name: string) => {
		setPending((previous) => previous.filter((item) => item.name !== name));
		setRejection(null);
	}, []);

	const upload = useCallback(() => {
		if (pending.length === 0) return;
		for (const item of pending) {
			onAdd(toCaseDocument(item.file, category, rules));
		}
		setPending([]);
		setRejection(null);
	}, [category, onAdd, pending, rules]);

	const remove = useCallback(
		(id: string) => {
			const target = documents.find((doc) => doc.id === id);
			if (target) revokeUrls([target]);
			onRemove(id);
		},
		[documents, onRemove],
	);

	return { pending, rejection, select, removePending, upload, remove };
}

export type CaseAttachmentsState = ReturnType<typeof useCaseAttachments>;
