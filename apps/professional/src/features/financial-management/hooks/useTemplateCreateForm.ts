"use client";

import { useCallback, useRef, useState } from "react";

import { baseNameOf } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { TemplateCategory, TemplateUploadInput } from "../types/forecastTemplates.types";

export interface TemplateCreateFormState {
	category: TemplateCategory | null;
	setCategory: (category: TemplateCategory) => void;
	file: File | null;
	setFile: (file: File | null) => void;
	documentName: string;
	setDocumentName: (value: string) => void;
	description: string;
	setDescription: (value: string) => void;
	categoryError: TranslationKeys | null;
	fileError: TranslationKeys | null;
	setFileError: (error: TranslationKeys | null) => void;
	nameError: TranslationKeys | null;
	submit: (event: React.FormEvent) => void;
}

/**
 * The create dialog's four fields and what makes them valid.
 *
 * Errors are held as keys rather than translated text, so switching language
 * with the dialog open rewrites them rather than leaving Swedish on an English
 * screen. Every field is checked on submit before any of them bails out, so an
 * empty form shows all of its problems at once instead of one per attempt.
 */
export function useTemplateCreateForm(
	onCreate: (input: TemplateUploadInput) => boolean,
	onClose: () => void,
): TemplateCreateFormState {
	const [category, setCategoryValue] = useState<TemplateCategory | null>(null);
	const [file, setFileValue] = useState<File | null>(null);
	const [documentName, setDocumentNameValue] = useState("");
	const [description, setDescription] = useState("");
	const [categoryError, setCategoryError] = useState<TranslationKeys | null>(null);
	const [fileError, setFileError] = useState<TranslationKeys | null>(null);
	const [nameError, setNameError] = useState<TranslationKeys | null>(null);

	/* The picked file names the document, until the reader names it themselves. */
	const nameTouched = useRef(false);

	const setCategory = useCallback((next: TemplateCategory) => {
		setCategoryValue(next);
		setCategoryError(null);
	}, []);

	const setFile = useCallback((picked: File | null) => {
		setFileValue(picked);
		if (picked && !nameTouched.current) {
			setDocumentNameValue(baseNameOf(picked.name));
			setNameError(null);
		}
	}, []);

	const setDocumentName = useCallback((value: string) => {
		nameTouched.current = true;
		setDocumentNameValue(value);
		setNameError(null);
	}, []);

	const submit = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();

			const name = documentName.trim();
			setCategoryError(category ? null : localizationConstants.forecastTemplatesCategoryRequired);
			setNameError(name ? null : localizationConstants.forecastTemplatesNameRequired);
			/* "Filen är för stor" says more than "välj en fil", so a refusal the
			   picker already made stands rather than being written over. */
			if (!file) {
				setFileError((previous) => previous ?? localizationConstants.forecastTemplatesFileRequired);
			}
			if (!category || !file || !name) return;

			const notes = description.trim();
			if (onCreate({ category, documentName: name, description: notes || undefined, file })) {
				onClose();
			}
		},
		[category, file, documentName, description, onCreate, onClose],
	);

	return {
		category,
		setCategory,
		file,
		setFile,
		documentName,
		setDocumentName,
		description,
		setDescription,
		categoryError,
		fileError,
		setFileError,
		nameError,
		submit,
	};
}
