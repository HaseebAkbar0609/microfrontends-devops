"use client";

import { useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { UploadDetails } from "../types";
import { uploadSchema, type UploadFormValues } from "./uploadSchema";
import { emptyUploadDraft, uploadDetailsFrom } from "./uploadValues";

/**
 * Nytt protokoll's form. `onSave` stores the details and the file and returns
 * `false` when the store refused them, which keeps the dialog open; on success
 * it closes. `handleSubmit`'s callback is synchronous, so the ref stops a fast
 * second Spara from storing it twice.
 */
export function useUploadProtocolForm(onSave: (details: UploadDetails, file: File) => boolean, onClose: () => void) {
	const t = useTranslate();
	const translateError = useCallback((message: string) => t(message as TranslationKeys), [t]);
	const savedRef = useRef(false);

	const form = useForm<UploadFormValues>({
		resolver: zodResolver(uploadSchema) as Resolver<UploadFormValues>,
		defaultValues: emptyUploadDraft(),
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		const details = uploadDetailsFrom(values);
		if (savedRef.current || !details || !values.file) return;
		savedRef.current = true;
		if (onSave(details, values.file)) onClose();
		else savedRef.current = false;
	});

	return { form, submit, translateError };
}
