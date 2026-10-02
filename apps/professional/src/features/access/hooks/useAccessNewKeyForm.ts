"use client";

import { useCallback, useState } from "react";
import { useAccessNewDraft } from "../context/AccessNewDraftContext";
import type { AccessFieldError, AccessKeyErrors, AccessNewKey, AccessNewKeyForm } from "../types/accessNew.types";
import { addAccessTag, nextKeyId, validateKey } from "../utils/accessNew";

const EMPTY_FORM: AccessNewKeyForm = { type: "", regNo: "", startDate: "", returnDate: "", company: "", person: "" };

/**
 * The key form of step 2: its fields, the places the key opens (kept as tags), the
 * inline errors, and saving it into the draft. Saving clears the form for the next key.
 */
export function useAccessNewKeyForm() {
	const { keys, addKey } = useAccessNewDraft();
	const [form, setForm] = useState<AccessNewKeyForm>(EMPTY_FORM);
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [tagError, setTagError] = useState<AccessFieldError | undefined>();
	const [errors, setErrors] = useState<AccessKeyErrors>({});

	const setField = useCallback(
		<K extends keyof AccessNewKeyForm>(field: K, value: AccessNewKeyForm[K]) =>
			setForm((current) => ({ ...current, [field]: value })),
		[],
	);

	const submitTag = useCallback(() => {
		const result = addAccessTag(tags, tagInput);
		setTagError(result.error);
		if (result.error) return;
		setTags(result.tags);
		setTagInput("");
	}, [tags, tagInput]);

	const removeTag = useCallback((tag: string) => setTags((current) => current.filter((existing) => existing !== tag)), []);

	/** Saves the key if everything is valid and returns it; otherwise shows the errors and returns null. */
	const save = useCallback((): AccessNewKey | null => {
		const found = validateKey(form, tags);
		setErrors(found);
		if (Object.keys(found).length > 0) return null;
		const key = addKey(form, tags);
		if (!key) return null;
		setForm(EMPTY_FORM);
		setTags([]);
		setTagInput("");
		setTagError(undefined);
		return key;
	}, [form, tags, addKey]);

	return { form, setField, tags, tagInput, setTagInput, tagError, submitTag, removeTag, errors, save, keyId: nextKeyId(keys) };
}

export type AccessNewKeyFormState = ReturnType<typeof useAccessNewKeyForm>;
