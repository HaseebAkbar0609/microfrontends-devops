"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { useTranslate } from "@/utils/translation/translate";
import { INSPECTION_DOCUMENTS_MAX } from "../projectInspection.config";
import type { InspectionInput, ProjectInspection } from "../types";
import { draftOf, emptyInspectionDraft, inspectionSchema, type InspectionFormValues } from "./inspectionSchema";

export interface UseInspectionFormOptions {
	/** The inspection being edited; omit to add one. */
	inspection?: ProjectInspection;
	/** A new inspection's Datum, `yyyy-MM-dd` — read in the click that opened the dialog. */
	today: string;
	onSave: (input: InspectionInput, id?: string) => void;
	onClose: () => void;
}

/**
 * The Besiktning dialog's form: its draft, validation and submit. Nothing is
 * stored until Spara passes the schema; Stäng leaves the inspection as it was.
 */
export function useInspectionForm({ inspection, today, onSave, onClose }: UseInspectionFormOptions) {
	const t = useTranslate();
	/* A second Spara before the dialog unmounts must not add the inspection twice. */
	const savedRef = useRef(false);
	const [defaultValues] = useState(() => (inspection ? draftOf(inspection) : emptyInspectionDraft(today)));

	const form = useForm<InspectionFormValues>({
		resolver: zodResolver(inspectionSchema) as Resolver<InspectionFormValues>,
		defaultValues,
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		if (savedRef.current) return;
		savedRef.current = true;
		onSave(values, inspection?.id);
		onClose();
	});

	/* Schema messages are keys; the file ceiling fills the one that names it. */
	const translateError = (message: string) => t(message, { max: INSPECTION_DOCUMENTS_MAX });

	return { form, isEdit: Boolean(inspection), submit, translateError };
}
