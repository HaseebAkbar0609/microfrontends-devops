"use client";

import { useCallback, useState } from "react";
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
	const t = useTranslate();

	const form = useForm<ConsultantTypeFormValues>({
		resolver: zodResolver(consultantTypeSchema),
		defaultValues: EMPTY_CONSULTANT_TYPE,
		mode: "onSubmit",
	});

	const reset = useCallback(() => {
		form.reset(EMPTY_CONSULTANT_TYPE);
		setEditingId(null);
	}, [form]);

	const startEditing = useCallback(
		(type: ConsultantType) => {
			form.reset(toConsultantTypeForm(type));
			setEditingId(type.id);
		},
		[form],
	);

	const submit = form.handleSubmit(async (values) => {
		const input = toConsultantTypeInput(values);
		try {
			if (editingId) {
				await update.mutateAsync({ id: editingId, input });
				showToast("success", t(localizationConstants.contentConsultantTypeUpdatedToast));
			} else {
				await create.mutateAsync(input);
				showToast("success", t(localizationConstants.contentConsultantTypeCreatedToast));
			}
			reset();
		} catch (error) {
			const status = apiErrorStatus(error);
			if (status === 409) {
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
			if (status === 404 && editingId) {
				// Deleted in another tab: the draft has nothing left to save into.
				showToast("error", apiErrorText(error, t(localizationConstants.contentConsultantTypeNotFound)));
				reset();
				return;
			}
			showToast("error", apiErrorText(error, t(localizationConstants.contentConsultantTypeSaveFailed)));
		}
	});

	return { form, submit, reset, startEditing, editingId };
}

export type ConsultantTypeFormState = ReturnType<typeof useConsultantTypeForm>;
