"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	buildEmptyValues,
	buildRegisterSchema,
	toFormValues,
	toRowValues,
	type RegisterFormValues,
} from "../schemas/registerSection.schema";
import type { MarketingRow, MarketingSection } from "../types";
import { useMarketingRegisters } from "./useMarketingRegisters";

/**
 * Draft, validation and submit for one register's add/edit dialog.
 *
 * The form is reset on every open, so a row edited after another row is closed
 * can never show the previous row's values — the prototype captured the row in
 * a `useState` initialiser and never resynced.
 */
export function useRegisterForm(
	section: MarketingSection,
	sectionKey: string,
	onDone: () => void,
) {
	const { addRow, updateRow } = useMarketingRegisters();
	const [editingId, setEditingId] = useState<string | null>(null);
	const t = useTranslate();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(buildRegisterSchema(section)),
		defaultValues: buildEmptyValues(section),
		mode: "onSubmit",
	});

	const startCreating = useCallback(() => {
		form.reset(buildEmptyValues(section));
		setEditingId(null);
	}, [form, section]);

	const startEditing = useCallback(
		(row: MarketingRow) => {
			form.reset(toFormValues(section, row.values));
			setEditingId(row.id);
		},
		[form, section],
	);

	const submit = form.handleSubmit((values) => {
		const rowValues = toRowValues(section, values);
		if (editingId) {
			updateRow(sectionKey, editingId, rowValues);
			showToast("success", t(localizationConstants.marketingRowUpdatedToast));
		} else {
			addRow(sectionKey, rowValues);
			showToast("success", t(localizationConstants.marketingRowCreatedToast));
		}
		onDone();
	});

	return { form, submit, startCreating, startEditing, editingId };
}
