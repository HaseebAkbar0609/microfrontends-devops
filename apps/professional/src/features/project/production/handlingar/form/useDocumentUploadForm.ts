"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import type { ProjectDocumentInput, ProjectDocumentKind } from "../types";
import { documentUploadSchema, emptyDocumentUpload, type DocumentUploadValues } from "./documentUploadSchema";

export interface UseDocumentUploadFormOptions {
	kind: ProjectDocumentKind;
	/** Stores the upload; `false` when the store refused it and the dialog should stay open. */
	onUpload: (input: ProjectDocumentInput) => boolean;
	onClose: () => void;
}

/**
 * The upload dialog's form. A failed Spara focuses the first invalid field;
 * a double press never stores the file twice.
 */
export function useDocumentUploadForm({ kind, onUpload, onClose }: UseDocumentUploadFormOptions) {
	const savedRef = useRef(false);

	const form = useForm<DocumentUploadValues>({
		resolver: zodResolver(documentUploadSchema) as Resolver<DocumentUploadValues>,
		defaultValues: emptyDocumentUpload(kind),
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		if (savedRef.current || !values.file) return;
		savedRef.current = true;
		const stored = onUpload({ kind, name: values.name, category: values.category, file: values.file });
		if (stored) onClose();
		else savedRef.current = false;
	});

	return { form, submit };
}
