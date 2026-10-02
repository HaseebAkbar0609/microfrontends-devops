"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
	PersonalDocumentsState,
	PersonalDocumentFileItem,
} from "../types/personalDocument.types";
import { INITIAL_PERSONAL_DOCUMENTS } from "../constants/personalDocument.mock";
import localizationConstants from "@/utils/translation/constants";

interface UsePersonalDocumentsOptions {
	initialDocs?: PersonalDocumentFileItem[];
	onUploadCallback?: (tags: string[]) => void;
	onDeleteCallback?: (id: string) => void;
}

export function usePersonalDocuments(options?: UsePersonalDocumentsOptions) {
	const [state, setState] = useState<PersonalDocumentsState>(() => ({
		metadata: INITIAL_PERSONAL_DOCUMENTS.metadata,
		documents: options?.initialDocs && options.initialDocs.length > 0
			? options.initialDocs
			: INITIAL_PERSONAL_DOCUMENTS.documents,
	}));
	const [uploadTags, setUploadTags] = useState<string[]>([]);
	const [docToDelete, setDocToDelete] = useState<PersonalDocumentFileItem | null>(null);
	const [previewDocName, setPreviewDocName] = useState<string | null>(null);

	const handleRemoveUploadTag = useCallback((tag: string) => {
		setUploadTags((prev) => prev.filter((t) => t !== tag));
	}, []);

	const handleAddFiles = useCallback((files: FileList | File[]) => {
		const newNames: string[] = [];
		Array.from(files).forEach((file) => {
			if (file.name && !uploadTags.includes(file.name)) {
				newNames.push(file.name);
			}
		});
		if (newNames.length > 0) {
			setUploadTags((prev) => [...prev, ...newNames]);
		}
	}, [uploadTags]);

	const handleUpload = useCallback((tagsToUpload?: string[]) => {
		const targetTags = tagsToUpload || uploadTags;
		if (targetTags.length === 0) return;

		const today = new Date().toISOString().split("T")[0];
		const newDocs: PersonalDocumentFileItem[] = targetTags.map((name, idx) => ({
			id: `pdoc_${Date.now()}_${idx}`,
			date: today,
			name: name.replace(/\.[^/.]+$/, ""),
			fileFormat: name.toLowerCase().endsWith(".doc") || name.toLowerCase().endsWith(".docx") ? "DOC" : "PDF",
			fileSize: "1.0 MB",
		}));

		setState((prev) => ({
			...prev,
			documents: [...newDocs, ...prev.documents],
		}));
		options?.onUploadCallback?.(targetTags);
		setUploadTags([]);
		toast.success(localizationConstants.personalDocToastUploaded);
	}, [uploadTags, options]);

	const handleConfirmDelete = useCallback(() => {
		if (docToDelete) {
			setState((prev) => ({
				...prev,
				documents: prev.documents.filter((doc) => doc.id !== docToDelete.id),
			}));
			options?.onDeleteCallback?.(docToDelete.id);
			toast.success(localizationConstants.personalDocToastDeleted);
			setDocToDelete(null);
		}
	}, [docToDelete, options]);

	const handlePreviewDoc = useCallback((name: string) => {
		setPreviewDocName(name);
	}, []);

	const handleClosePreviewDoc = useCallback(() => {
		setPreviewDocName(null);
	}, []);

	return {
		metadata: state.metadata,
		documents: state.documents,
		uploadTags,
		docToDelete,
		previewDocName,
		setDocToDelete,
		handleRemoveUploadTag,
		handleAddFiles,
		handleUpload,
		handleConfirmDelete,
		handlePreviewDoc,
		handleClosePreviewDoc,
	};
}
