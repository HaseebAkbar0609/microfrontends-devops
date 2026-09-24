"use client";

import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { generateTempId } from "@/lib/tempId";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { baseNameOf, sortPickedFiles, type PickRejection } from "../../../../shared/recordFiles";
import { todayIso } from "../../../../shared/todayIso";
import { ATA_FILE_RULES } from "../../projectAta.config";
import type { AtaFormValues } from "../ataFormSchema";

const PICK_MESSAGES: Record<PickRejection["reason"] | "none", TranslationKeys> = {
	size: localizationConstants.projectAtaFileSizeError,
	extension: localizationConstants.projectAtaFileTypeError,
	duplicate: localizationConstants.projectAtaFileDuplicate,
	count: localizationConstants.projectAtaTooManyFiles,
	none: localizationConstants.projectAtaNoFilePicked,
};

export interface AtaPickMessage {
	key: TranslationKeys;
	name?: string;
}

/**
 * The Dokument card's upload row: files picked but not yet attached, and the
 * refusal to show. "Ladda upp" attaches them to the form; Spara and Skicka
 * attach any still waiting, so a picked file is never silently dropped. The
 * store gives a file its URL only when the ÄTA is saved.
 */
export function useAtaDocuments(form: UseFormReturn<AtaFormValues>) {
	const [pending, setPending] = useState<File[]>([]);
	const [message, setMessage] = useState<AtaPickMessage | null>(null);

	const pick = useCallback(
		(files: File[]) => {
			const attached = form.getValues("documents").map((doc) => doc.fileName);
			const { accepted, rejection } = sortPickedFiles(
				[...attached, ...pending.map((file) => file.name)],
				files,
				ATA_FILE_RULES,
			);
			setPending((previous) => [...previous, ...accepted]);
			setMessage(rejection ? { key: PICK_MESSAGES[rejection.reason], name: rejection.name } : null);
		},
		[form, pending],
	);

	/** Attaches the waiting files. Returns whether there were any. */
	const commit = useCallback((): boolean => {
		if (pending.length === 0) return false;
		const today = todayIso();
		const added = pending.map((file) => ({
			id: generateTempId(),
			date: today,
			documentName: baseNameOf(file.name),
			fileName: file.name,
			file,
		}));
		form.setValue("documents", [...form.getValues("documents"), ...added], {
			shouldDirty: true,
			shouldValidate: true,
		});
		setPending([]);
		setMessage(null);
		return true;
	}, [form, pending]);

	/** The "Ladda upp" button: attach, or say there is nothing to attach. */
	const upload = useCallback(() => {
		if (!commit()) setMessage({ key: PICK_MESSAGES.none });
	}, [commit]);

	const remove = useCallback(
		(id: string) => {
			form.setValue(
				"documents",
				form.getValues("documents").filter((doc) => doc.id !== id),
				{ shouldDirty: true, shouldValidate: true },
			);
		},
		[form],
	);

	return { pending, message, pick, commit, upload, remove };
}

export type AtaDocumentsState = ReturnType<typeof useAtaDocuments>;
