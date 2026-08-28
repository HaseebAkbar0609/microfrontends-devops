"use client";

import { useCallback, useMemo, useState } from "react";

import type { PendingUploadFile } from "@/components/form";
import { MOCK_PURCHASE_AGREEMENT_DOCS } from "../data/purchaseAgreementDocs.mock";
import type {
	PurchaseAgreementDocument,
	PurchaseDocumentFileType,
} from "../types/purchase.types";

export type PurchaseDocumentSortField =
	| "date"
	| "supplier"
	| "documentName"
	| "reference";

/** The supplier attributed to files uploaded in this session. */
const UPLOAD_SUPPLIER = "Beijer Byggmaterial";

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
) {
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

	const selectFiles = useCallback((files: File[]) => {
		setPendingFiles((previous) => {
			const existing = new Set(previous.map((item) => item.name));
			const added = files
				.filter((file) => !existing.has(file.name))
				.map((file) => ({ name: file.name, file }));
			return [...previous, ...added];
		});
	}, []);

	const removePending = useCallback((name: string) => {
		setPendingFiles((previous) =>
			previous.filter((item) => item.name !== name),
		);
	}, []);

	/** Moves the pending files into the table. Returns how many were added. */
	const commitPendingFiles = useCallback(() => {
		if (pendingFiles.length === 0) return 0;

		const today = new Date().toISOString().slice(0, 10);
		const added = pendingFiles.map((pending, index) => ({
			id: `upload-${today}-${pending.name}-${index}`,
			date: today,
			supplier: UPLOAD_SUPPLIER,
			documentName: pending.name,
			reference: "-",
			fileType: fileTypeOf(pending.name),
			fileUrl: URL.createObjectURL(pending.file),
		}));

		setDocuments((previous) => [...added, ...previous]);
		setPendingFiles([]);
		return added.length;
	}, [pendingFiles]);

	const removeDocument = useCallback((id: string) => {
        setDocuments((previous) => {
            const target = previous.find((doc) => doc.id === id);
            if (target?.fileUrl) URL.revokeObjectURL(target.fileUrl);
            return previous.filter((doc) => doc.id !== id);
        });
	}, []);

	const sortedDocuments = useMemo(() => {
		return [...documents].sort((a, b) => {
			const valueA = a[sortBy].toLowerCase();
			const valueB = b[sortBy].toLowerCase();

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
