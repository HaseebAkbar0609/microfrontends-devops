"use client";

import { useCallback, useRef } from "react";
import { uploadProjectDocument } from "../services/projectDocumentService";
import type { ProjectDocumentItem } from "./types";

export function useProjectDocumentUploads() {
	const files = useRef(new Map<string, File>());
	const uploads = useRef(new Map<string, ReturnType<typeof uploadProjectDocument>>());
	const registerFile = useCallback((id: string, file: File) => files.current.set(id, file), []);
	const discardFile = useCallback((id: string) => {
		files.current.delete(id);
		uploads.current.delete(id);
	}, []);
	const prepareDocuments = useCallback(async (documents: ProjectDocumentItem[]) => {
		const prepared: ProjectDocumentItem[] = [];
		for (const document of documents) {
			const file = files.current.get(document.id);
			if (!file) {
				prepared.push(document);
				continue;
			}
			let upload = uploads.current.get(document.id);
			if (!upload) {
				upload = uploadProjectDocument(file).catch((error: unknown) => {
					uploads.current.delete(document.id);
					throw error;
				});
				uploads.current.set(document.id, upload);
			}
			const media = await upload;
			prepared.push({ ...document, id: media.id, fileName: media.file_name,
				fileSize: `${(media.file_size / 1024).toFixed(1)} KB` });
		}
		return prepared;
	}, []);
	const hasPendingUploads = (documents: ProjectDocumentItem[]) =>
		documents.some((document) => files.current.has(document.id));
	return { registerFile, discardFile, prepareDocuments, hasPendingUploads };
}
