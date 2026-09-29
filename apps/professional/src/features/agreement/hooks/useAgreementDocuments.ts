"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
	AgreementDocumentItem,
	AgreementDocFileType,
	AgreementDocumentsSortField,
	AgreementDocumentsSortOrder,
	AvailableDocumentOption,
} from "../types/agreementDocuments";
import {
	INITIAL_AGREEMENT_DOCUMENTS,
	AGREEMENT_DOCUMENTS_STORAGE_KEY,
} from "../constants/agreementDocuments";
import {
	fetchAgreementCenterDocumentsAction,
	uploadAgreementCenterDocumentAction,
	deleteAgreementCenterDocumentAction,
} from "../api/agreementDocumentsApi";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface PendingFileItem {
	id: string;
	name: string;
	file?: File;
	isTemplate?: boolean;
	fileType: AgreementDocFileType;
}

export function useAgreementDocuments() {
	const t = useTranslate();
	const [documents, setDocuments] = useState<AgreementDocumentItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pendingFiles, setPendingFiles] = useState<PendingFileItem[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [sortField, setSortField] = useState<AgreementDocumentsSortField>("date");
	const [sortOrder, setSortOrder] = useState<AgreementDocumentsSortOrder>("desc");
	const [docToDelete, setDocToDelete] = useState<AgreementDocumentItem | null>(null);

	// Initialize data
	useEffect(() => {
		let isMounted = true;
		async function loadDocuments() {
			try {
				if (typeof window !== "undefined") {
					const saved = localStorage.getItem(AGREEMENT_DOCUMENTS_STORAGE_KEY);
					if (saved) {
						try {
							const parsed = JSON.parse(saved);
							if (Array.isArray(parsed) && parsed.length > 0) {
								if (isMounted) {
									setDocuments(parsed);
									setIsLoading(false);
									return;
								}
							}
						} catch {
							// continue to fetch from API
						}
					}
				}

				const res = await fetchAgreementCenterDocumentsAction();
				if (isMounted) {
					if (res.success && res.data) {
						setDocuments(res.data);
					} else {
						setDocuments(INITIAL_AGREEMENT_DOCUMENTS);
					}
				}
			} catch {
				if (isMounted) {
					setDocuments(INITIAL_AGREEMENT_DOCUMENTS);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadDocuments();
		return () => {
			isMounted = false;
		};
	}, []);

	// Save to localStorage whenever documents change
	const persistDocuments = useCallback((newDocs: AgreementDocumentItem[]) => {
		setDocuments(newDocs);
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					AGREEMENT_DOCUMENTS_STORAGE_KEY,
					JSON.stringify(newDocs),
				);
			} catch {
				// Ignore storage errors
			}
		}
	}, []);

	// Sort toggling
	const handleSort = useCallback(
		(field: AgreementDocumentsSortField) => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder("asc");
			}
		},
		[sortField],
	);

	// Sorted documents list
	const sortedDocuments = useMemo(() => {
		return [...documents].sort((a, b) => {
			const aVal = (a[sortField] || "").toLowerCase();
			const bVal = (b[sortField] || "").toLowerCase();
			const cmp = aVal.localeCompare(bVal);
			return sortOrder === "asc" ? cmp : -cmp;
		});
	}, [documents, sortField, sortOrder]);

	// Select local files into pending queue
	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			const newPending: PendingFileItem[] = Array.from(files).map(
				(file, index) => {
					const lower = file.name.toLowerCase();
					const fileType: AgreementDocFileType = lower.endsWith(".pdf")
						? "pdf"
						: lower.endsWith(".doc") || lower.endsWith(".docx")
							? "doc"
							: "img";
					return {
						id: `pending_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
						name: file.name,
						file,
						fileType,
					};
				},
			);

			setPendingFiles((prev) => [...prev, ...newPending]);
			e.target.value = "";
		},
		[],
	);

	// Add a template / mock document into pending queue
	const handleSelectTemplate = useCallback(
		(template: AvailableDocumentOption) => {
			if (
				pendingFiles.some((p) => p.name === template.name) ||
				documents.some((d) => d.name === template.name)
			) {
				return;
			}
			setPendingFiles((prev) => [
				...prev,
				{
					id: `pending_tmpl_${Date.now()}_${template.id}`,
					name: template.name,
					isTemplate: true,
					fileType: template.fileType,
				},
			]);
		},
		[pendingFiles, documents],
	);

	// Remove single item from pending queue
	const handleRemovePending = useCallback((id: string) => {
		setPendingFiles((prev) => prev.filter((item) => item.id !== id));
	}, []);

	// Upload all pending files
	const handleUploadPending = useCallback(async () => {
		if (pendingFiles.length === 0) return;

		setIsUploading(true);
		const today = new Date().toISOString().split("T")[0];
		const createdDocs: AgreementDocumentItem[] = [];

		try {
			for (const item of pendingFiles) {
				if (item.file) {
					const res = await uploadAgreementCenterDocumentAction(item.file);
					createdDocs.push({
						id:
							res.data?.id ||
							`doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
						date: today,
						name: item.name,
						fileName: item.name,
						fileType: item.fileType,
						url: res.data?.file_url_path || `/mock/${item.name}`,
						size: `${(item.file.size / (1024 * 1024)).toFixed(1)} MB`,
					});
				} else {
					// Template / mock selection
					createdDocs.push({
						id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
						date: today,
						name: item.name,
						fileName: item.name,
						fileType: item.fileType,
						url: `/mock/${item.name}`,
						size: "1.0 MB",
					});
				}
			}

			const updated = [...createdDocs, ...documents];
			persistDocuments(updated);
			setPendingFiles([]);
			showToast("success", t(localizationConstants.agreementDocUploadSuccess));
		} catch (_error) {
			showToast("error", t(localizationConstants.agreementDocUploadError));
		} finally {
			setIsUploading(false);
		}
	}, [pendingFiles, documents, persistDocuments, t]);

	// Delete document action
	const handleConfirmDelete = useCallback(async () => {
		if (!docToDelete) return;
		try {
			await deleteAgreementCenterDocumentAction(docToDelete.id);
			const updated = documents.filter((d) => d.id !== docToDelete.id);
			persistDocuments(updated);
			showToast("success", t(localizationConstants.agreementDocDeleteSuccess));
		} catch {
			// Fallback local remove
			const updated = documents.filter((d) => d.id !== docToDelete.id);
			persistDocuments(updated);
			showToast("success", t(localizationConstants.agreementDocDeleteSuccess));
		} finally {
			setDocToDelete(null);
		}
	}, [docToDelete, documents, persistDocuments, t]);

	return {
		documents: sortedDocuments,
		rawDocumentsCount: documents.length,
		isLoading,
		pendingFiles,
		isUploading,
		sortField,
		sortOrder,
		docToDelete,
		handleSort,
		handleFileSelect,
		handleSelectTemplate,
		handleRemovePending,
		handleUploadPending,
		setDocToDelete,
		handleConfirmDelete,
	};
}
