"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	buildEmptyValues,
	buildSectionSchema,
	normaliseValues,
} from "../schemas/contentSection.schema";
import type { ContentRow, ContentRowValues, ContentSection } from "../types";
import { useContentSections } from "./useContentSections";

/**
 * Draft, validation and submit for one section's add/edit form. The workbench
 * stays layout and wiring.
 */
export function useSectionForm(section: ContentSection, sectionKey: string) {
	const { addRow, updateRow } = useContentSections();
	const [editingId, setEditingId] = useState<string | null>(null);
	const t = useTranslate();

	const form = useForm<ContentRowValues>({
		resolver: zodResolver(buildSectionSchema(section)),
		defaultValues: buildEmptyValues(section),
		mode: "onSubmit",
	});

	const reset = useCallback(() => {
		form.reset(buildEmptyValues(section));
		setEditingId(null);
	}, [form, section]);

	const startEditing = useCallback(
		(row: ContentRow) => {
			form.reset(normaliseValues(section, row.values));
			setEditingId(row.id);
		},
		[form, section],
	);

	const submit = form.handleSubmit((values) => {
		if (editingId) {
			updateRow(sectionKey, editingId, values);
			showToast("success", t(localizationConstants.contentRowUpdatedToast));
		} else {
			addRow(sectionKey, values);
			showToast("success", t(localizationConstants.contentRowCreatedToast));
		}
		reset();
	});

	return { form, submit, reset, startEditing, editingId };
}
