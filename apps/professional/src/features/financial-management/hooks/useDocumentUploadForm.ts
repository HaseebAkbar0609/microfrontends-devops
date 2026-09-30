"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { PendingUploadFile } from "@/components/form/MultiFileUploadField";
import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import {
	mintTypedUrl,
	revokeUrls,
	sortPickedFiles,
	type PickRejectionReason,
} from "@/features/project/shared/recordFiles";
import { generateTempId } from "@/lib/tempId";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	DOCUMENT_BATCH_MAX,
	DOCUMENT_FILE_RULES,
	documentRoutes,
} from "../constants/forecastDocuments.constants";
import type { DocumentCategory, StagedDocument } from "../types/forecastDocuments.types";
import { createDocuments } from "../utils/forecastDocumentsService";

/** Why a pick was refused, in the reader's words. */
export interface DocumentPickRejection {
	key: TranslationKeys;
	name?: string;
}

const REJECTION_KEYS: Record<PickRejectionReason, TranslationKeys> = {
	size: localizationConstants.forecastDocumentsFileSizeError,
	extension: localizationConstants.forecastDocumentsFileTypeError,
	duplicate: localizationConstants.forecastDocumentsFileDuplicate,
	count: localizationConstants.forecastDocumentsFileCount,
};

/**
 * The create page's state: one category, a chip row of files chosen but not
 * yet taken, and the staged rows those become.
 *
 * A staged row's `blob:` URL is minted the moment it leaves the chip row,
 * because the staged table offers "Se fil" on a row that is not filed yet.
 * That makes this page the owner of those URLs until it either files them or
 * is left — hence `mintedRef` and `savedRef`: saving navigates, and without
 * the flag the unmount would revoke the very files just filed.
 */
export function useDocumentUploadForm(basePath?: string) {
	const router = useRouter();
	const t = useTranslate();
	const routes = documentRoutes(basePath);

	const [category, setCategoryValue] = useState<DocumentCategory | null>(null);
	const [pending, setPending] = useState<PendingUploadFile[]>([]);
	const [staged, setStaged] = useState<StagedDocument[]>([]);
	const [rejection, setRejection] = useState<DocumentPickRejection | null>(null);
	/** How many of the last pick were refused; only the first says why. */
	const [refusedCount, setRefusedCount] = useState(0);
	const [categoryError, setCategoryError] = useState<TranslationKeys | null>(null);
	const [filesError, setFilesError] = useState<TranslationKeys | null>(null);
	const [leaving, setLeaving] = useState(false);

	const savedRef = useRef(false);
	const mintedRef = useRef<string[]>([]);

	/* One upload is not the whole register: the ceiling the picker enforces
	   is the batch's, the one the service enforces is the register's. */
	const batchRules = useMemo(() => ({ ...DOCUMENT_FILE_RULES, maxCount: DOCUMENT_BATCH_MAX }), []);

	/* What this page minted belongs to the register once it is filed; if the
	   reader walks away instead, this is what releases it. The alias is
	   deliberate: copying the array here would snapshot it empty at mount. */
	useEffect(() => {
		const minted = mintedRef.current;
		return () => {
			if (!savedRef.current) revokeUrls(minted.map((url) => ({ url })));
		};
	}, []);

	const dirty = staged.length > 0 || pending.length > 0;

	/* Picked files cost more to replace than typed text — several folders
	   deep, in some order — so a reload is worth interrupting. */
	useEffect(() => {
		if (!dirty) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

	/** Mints one chip's file and records the URL as this page's to release. */
	const stage = useCallback((item: PendingUploadFile): StagedDocument => {
		const url = mintTypedUrl(item.file, DOCUMENT_FILE_RULES.types);
		mintedRef.current.push(url);
		return { id: generateTempId(), name: item.name, date: MOCK_REFERENCE_DATE, fileSize: item.file.size, url };
	}, []);

	const setCategory = useCallback((next: DocumentCategory) => {
		setCategoryValue(next);
		setCategoryError(null);
	}, []);

	/** Checks a pick against the rules; good files survive a bad one. */
	const selectFiles = useCallback(
		(files: File[]) => {
			const taken = [...staged.map((row) => row.name), ...pending.map((item) => item.name)];
			const { accepted, rejection: refused } = sortPickedFiles(taken, files, batchRules);

			setRejection(refused ? { key: REJECTION_KEYS[refused.reason], name: refused.name } : null);
			setRefusedCount(files.length - accepted.length);
			if (accepted.length === 0) return;
			setFilesError(null);
			setPending((current) => [...current, ...accepted.map((file) => ({ name: file.name, file }))]);
		},
		[staged, pending, batchRules],
	);

	const clearRejection = useCallback(() => {
		setRejection(null);
		setRefusedCount(0);
	}, []);

	const removePending = useCallback(
		(name: string) => {
			setPending((current) => current.filter((item) => item.name !== name));
			clearRejection();
		},
		[clearRejection],
	);

	/** Takes the chips into the table, minting each file's URL as it goes. */
	const commitPending = useCallback(() => {
		if (pending.length === 0) return;
		setStaged((current) => [...current, ...pending.map(stage)]);
		setPending([]);
		setFilesError(null);
		clearRejection();
	}, [pending, stage, clearRejection]);

	/**
	 * A staged row taken back releases its file straight away. No confirm:
	 * nothing has been filed yet, so there is nothing to undo — the
	 * register's own delete is the one that asks.
	 */
	const removeStaged = useCallback(
		(id: string) => {
			const target = staged.find((row) => row.id === id);
			if (!target) return;
			revokeUrls([target]);
			mintedRef.current = mintedRef.current.filter((url) => url !== target.url);
			setStaged((current) => current.filter((row) => row.id !== id));
		},
		[staged],
	);

	const leave = useCallback(() => {
		router.push(routes.list);
	}, [router, routes.list]);

	/** Asks first when there is staged work to lose. */
	const requestLeave = useCallback(() => {
		if (dirty) {
			setLeaving(true);
			return;
		}
		leave();
	}, [dirty, leave]);

	const submit = useCallback(() => {
		if (savedRef.current) return;

		/* Files still on the chip row are files the reader chose; take them
		   rather than dropping them silently on save. */
		const all = pending.length > 0 ? [...staged, ...pending.map(stage)] : staged;

		setCategoryError(category ? null : localizationConstants.forecastDocumentsCategoryRequired);
		setFilesError(all.length > 0 ? null : localizationConstants.forecastDocumentsFilesRequired);

		if (!category || all.length === 0) {
			/* Whatever was carried off the chip row stays carried, so the
			   reader does not have to press Ladda upp again. */
			if (all !== staged) {
				setStaged(all);
				setPending([]);
			}
			return;
		}

		const created = createDocuments({ category, staged: all });
		if (created.length === 0) {
			showToast("error", t(localizationConstants.forecastDocumentsUploadFailed));
			return;
		}

		savedRef.current = true;
		showToast("success", t(localizationConstants.forecastDocumentsUploaded, { count: created.length }));
		router.push(routes.list);
	}, [category, pending, staged, stage, router, routes.list, t]);

	return {
		category,
		setCategory,
		pending,
		staged,
		rejection,
		refusedCount,
		categoryError,
		filesError,
		dirty,
		leaving,
		setLeaving,
		selectFiles,
		removePending,
		commitPending,
		removeStaged,
		requestLeave,
		leave,
		submit,
	};
}

export type DocumentUploadFormState = ReturnType<typeof useDocumentUploadForm>;
