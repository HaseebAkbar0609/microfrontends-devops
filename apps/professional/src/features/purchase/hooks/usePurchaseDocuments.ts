"use client";

import { useCallback, useMemo, useState } from "react";

import type { PendingUploadFile } from "@/components/form";
import { isAllowedUpload } from "@/lib/validation/fileUpload";
import { MOCK_PURCHASE_AGREEMENT_DOCS } from "../data/purchaseAgreementDocs.mock";
import type {
	PurchaseAgreementDocument,
	PurchaseDocumentFileType,
} from "../types/purchase.types";

export type PurchaseDocumentSortField =
	| "date"
	| "supplier"
	| "documentName"
	| "reference"
	| "fileType"
	| "purchaseNo";

/** Attributes stamped onto files uploaded in this session, plus what may be uploaded. */
export interface PurchaseDocumentUploadDefaults {
	supplier?: string;
	purchaseNo?: string;
	reference?: string;
	/**
	 * Extensions the picker will actually take, e.g. `[".pdf", ".png"]`,
	 * enforced by `checkUploadedFile` rather than by the input's advisory
	 * `accept`. Omitted means unrestricted, which is what the callers that
	 * predate this did.
	 */
	acceptExtensions?: string[];
	/** Per-file ceiling in bytes. Omitted means unrestricted. */
	maxFileSizeBytes?: number;
}

/** What `selectFiles` took and what it turned away, so callers can say so. */
export interface SelectFilesResult {
	added: number;
	rejected: string[];
}

const FALLBACK_UPLOAD_DEFAULTS: Required<
	Pick<PurchaseDocumentUploadDefaults, "supplier" | "reference">
> = {
	supplier: "Beijer Byggmaterial",
	reference: "-",
};

function fileTypeOf(name: string): PurchaseDocumentFileType {
	return name.toLowerCase().endsWith(".pdf") ? "pdf" : "doc";
}

/**
 * Attached-document state for any purchase document list: sorting, plus adding
 * and removing rows. Uploads stay in local state — there is no purchase upload
 * endpoint, and the rest of this module is mock-backed.
 */
export function usePurchaseDocuments(
	initialDocuments: PurchaseAgreementDocument[] = MOCK_PURCHASE_AGREEMENT_DOCS,
	uploadDefaults: PurchaseDocumentUploadDefaults = {},
) {
	const { supplier, purchaseNo, reference, acceptExtensions, maxFileSizeBytes } =
		uploadDefaults;
	const [documents, setDocuments] =
		useState<PurchaseAgreementDocument[]>(initialDocuments);
	const [pendingFiles, setPendingFiles] = useState<PendingUploadFile[]>([]);
	const [sortBy, setSortBy] = useState<PurchaseDocumentSortField>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const handleSort = useCallback(
		(field: PurchaseDocumentSortField) => {
			if (sortBy === field) {
				setSortOrder((previous) =>
					previous === "asc" ? "desc" : "asc",
				);
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	/**
	 * Takes the files the caller allows and reports the rest by name, so a
	 * rejected file is visibly turned away rather than silently dropped.
	 */
	const selectFiles = useCallback(
		(files: File[]): SelectFilesResult => {
			const allowed: File[] = [];
			const rejected: string[] = [];

			for (const file of files) {
				if (isAllowedUpload(file, { acceptExtensions, maxFileSizeBytes })) {
					allowed.push(file);
				} else {
					rejected.push(file.name);
				}
			}

			let added = 0;
			setPendingFiles((previous) => {
				const existing = new Set(previous.map((item) => item.name));
				const next = allowed
					.filter((file) => !existing.has(file.name))
					.map((file) => ({ name: file.name, file }));
				added = next.length;
				return [...previous, ...next];
			});

			return { added, rejected };
		},
		[acceptExtensions, maxFileSizeBytes],
	);

	const removePending = useCallback((name: string) => {
		setPendingFiles((previous) =>
			previous.filter((item) => item.name !== name),
		);
	}, []);

	/**
	 * Moves the pending files into the table and returns the rows it added.
	 *
	 * The rows rather than a count, because `setDocuments` has not flushed by
	 * the time a caller building a payload needs to read them.
	 */
	const commitPendingFiles = useCallback((): PurchaseAgreementDocument[] => {
		if (pendingFiles.length === 0) return [];

		const today = new Date().toISOString().slice(0, 10);
		const added = pendingFiles.map((pending, index) => ({
			id: `upload-${today}-${pending.name}-${index}`,
			date: today,
			supplier: supplier ?? FALLBACK_UPLOAD_DEFAULTS.supplier,
			purchaseNo,
			documentName: pending.name,
			reference: reference ?? FALLBACK_UPLOAD_DEFAULTS.reference,
			fileType: fileTypeOf(pending.name),
			fileUrl: URL.createObjectURL(pending.file),
		}));

		setDocuments((previous) => [...added, ...previous]);
		setPendingFiles([]);
		return added;
	}, [pendingFiles, purchaseNo, reference, supplier]);

	const removeDocument = useCallback((id: string) => {
        setDocuments((previous) => {
            const target = previous.find((doc) => doc.id === id);
            if (target?.fileUrl) URL.revokeObjectURL(target.fileUrl);
            return previous.filter((doc) => doc.id !== id);
        });
	}, []);

	const sortedDocuments = useMemo(() => {
		return [...documents].sort((a, b) => {
			// `purchaseNo` is optional, so an absent value sorts as empty
			// rather than throwing.
			const valueA = (a[sortBy] ?? "").toLowerCase();
			const valueB = (b[sortBy] ?? "").toLowerCase();

			let comparison = 0;
			if (valueA < valueB) comparison = -1;
			if (valueA > valueB) comparison = 1;

			return sortOrder === "asc" ? comparison : -comparison;
		});
	}, [documents, sortBy, sortOrder]);

	return {
		documents: sortedDocuments,
		pendingFiles,
		selectFiles,
		removePending,
		commitPendingFiles,
		removeDocument,
		sortBy,
		sortOrder,
		handleSort,
	};
}
