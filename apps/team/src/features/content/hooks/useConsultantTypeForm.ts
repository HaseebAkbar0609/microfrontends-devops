"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	consultantTypeSchema,
	EMPTY_CONSULTANT_TYPE,
	toConsultantTypeForm,
	toConsultantTypeInput,
	type ConsultantTypeFormValues,
} from "../schemas/consultantType.schema";
import type { ConsultantType } from "../types";
import { apiErrorStatus, apiErrorText } from "../utils/apiErrors";
import type { ConsultantTypesState } from "./useConsultantTypes";

/**
 * Draft, validation and save for the consultant type form. A duplicate name
 * (409) lands inline under the name; anything else the server refuses is a toast.
 */
export function useConsultantTypeForm({ create, update }: ConsultantTypesState) {
	const [editingId, setEditingId] = useState<string | null>(null);
	// Read after a save resolves: the form may have moved on to another type.
	const editingIdRef = useRef<string | null>(null);
	const t = useTranslate();

	const form = useForm<ConsultantTypeFormValues>({
		resolver: zodResolver(consultantTypeSchema),
		defaultValues: EMPTY_CONSULTANT_TYPE,
		mode: "onSubmit",
	});

	const edit = useCallback((id: string | null) => {
		editingIdRef.current = id;
		setEditingId(id);
	}, []);

	const reset = useCallback(() => {
		form.reset(EMPTY_CONSULTANT_TYPE);
		edit(null);
	}, [form, edit]);

	const startEditing = useCallback(
		(type: ConsultantType) => {
			form.reset(toConsultantTypeForm(type));
			edit(type.id);
		},
		[form, edit],
	);

	const submit = form.handleSubmit(async (values) => {
		const input = toConsultantTypeInput(values);
		const savingId = editingId;
		// A late response must never reset or flag another record's draft.
		const isStillOpen = () => editingIdRef.current === savingId;
		try {
			if (savingId) {
				await update.mutateAsync({ id: savingId, input });
				showToast("success", t(localizationConstants.contentConsultantTypeUpdatedToast));
			} else {
				await create.mutateAsync(input);
				showToast("success", t(localizationConstants.contentConsultantTypeCreatedToast));
			}
			if (isStillOpen()) reset();
		} catch (error) {
			const status = apiErrorStatus(error);
			if (status === 409) {
				if (!isStillOpen()) return;
				form.setError(
					"name",
					{
						type: "server",
						message: apiErrorText(
							error,
							t(localizationConstants.contentConsultantTypeNameExists),
						),
					},
					{ shouldFocus: true },
				);
				return;
			}
			if (status === 404 && savingId) {
				// Deleted in another tab: the draft has nothing left to save into.
				showToast("error", apiErrorText(error, t(localizationConstants.contentConsultantTypeNotFound)));
				if (isStillOpen()) reset();
				return;
			}
			showToast("error", apiErrorText(error, t(localizationConstants.contentConsultantTypeSaveFailed)));
		}
	});

	return {
		form,
		submit,
		reset,
		startEditing,
		editingId,
		isSaving: form.formState.isSubmitting,
	};
}

export type ConsultantTypeFormState = ReturnType<typeof useConsultantTypeForm>;
