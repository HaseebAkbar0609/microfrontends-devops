"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";

import type { WarrantyCommitment, WarrantyCommitmentInput } from "../types";
import { emptyWarrantyDraft, warrantySchema, type WarrantyFormValues } from "./warrantySchema";

/**
 * The commitment as the form edits it. Its stored documents become drafts
 * carrying their ids and no `File`, which is how the store knows to keep them
 * rather than mint a second URL for the same bytes.
 */
function draftFrom(commitment?: WarrantyCommitment): WarrantyFormValues {
	if (!commitment) return emptyWarrantyDraft();

	return {
		date: commitment.date,
		name: commitment.name,
		reminderDate: commitment.reminderDate,
		emails: commitment.reminderEmails.length > 0 ? commitment.reminderEmails.map((value) => ({ value })) : [{ value: "" }],
		documents: commitment.documents.map(({ id, name, fileName }) => ({ id, name, fileName })),
	};
}

export interface UseWarrantyFormOptions {
	commitment?: WarrantyCommitment;
	/** Stores the commitment; `false` when the store refused it and the dialog should stay open. */
	onSave: (input: WarrantyCommitmentInput, id?: string) => boolean;
	onClose: () => void;
}

/**
 * The dialog's form: the commitment it opened on, the address rows, and a Spara
 * that trims the addresses and drops the blank ones. A failed Spara focuses the
 * first invalid field; a double press never stores it twice.
 */
export function useWarrantyForm({ commitment, onSave, onClose }: UseWarrantyFormOptions) {
	const savedRef = useRef(false);

	const form = useForm<WarrantyFormValues>({
		resolver: zodResolver(warrantySchema) as Resolver<WarrantyFormValues>,
		defaultValues: draftFrom(commitment),
		mode: "onTouched",
	});

	const emailArray = useFieldArray({ control: form.control, name: "emails" });

	const submit = form.handleSubmit((values) => {
		if (savedRef.current) return;
		savedRef.current = true;

		const stored = onSave(
			{
				date: values.date,
				name: values.name,
				reminderDate: values.reminderDate,
				reminderEmails: values.emails.map((row) => row.value.trim()).filter(Boolean),
				documents: values.documents,
			},
			commitment?.id,
		);

		if (stored) onClose();
		else savedRef.current = false;
	});

	return { form, emailArray, submit };
}
