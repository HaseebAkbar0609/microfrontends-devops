"use client";

import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type FieldPath, type Resolver } from "react-hook-form";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { todayIso } from "../../../shared/todayIso";
import { buildProjectRecordInfo } from "../../data/projectRecordInfo.mock";
import { editBlockReason, isLocked } from "../ataRules";
import * as store from "../services/projectAtaService";
import type { AtaStatus, ProjectAta } from "../types";
import {
	ATA_STEP_ONE_FIELD_PATHS,
	ataFormSchema,
	draftOf,
	emptyAtaDraft,
	type AtaFormValues,
} from "./ataFormSchema";
import { firstErrorPath } from "./firstErrorPath";

export type AtaStep = 1 | 2;

export interface UseAtaFormOptions {
	projectId: string;
	/** The saved ÄTA being opened; omit to create one. */
	ataId?: string;
	initialStep: AtaStep;
}

/**
 * The ÄTA form's draft, steps and persistence, shared by Skapa, Visa detaljer
 * and Redigera.
 *
 * One form holds both steps, so a Tillbaka to step 1 keeps what step 2 changed.
 * Nothing reaches the store until Spara or Skicka; `persist` is the only write.
 */
export function useAtaForm({ projectId, ataId, initialStep }: UseAtaFormOptions) {
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	const [existing] = useState<ProjectAta | undefined>(() => (ataId ? store.getAta(projectId, ataId) : undefined));
	const [recordInfo] = useState(() => buildProjectRecordInfo(projectId));
	const [defaultValues] = useState(() => (existing ? draftOf(existing) : emptyAtaDraft(recordInfo)));
	const [previewNumber] = useState(() => store.nextAtaNumber(projectId));
	const [invoiceOptions] = useState(() => store.listSupplierInvoiceOptions(projectId));
	const [timeReportOptions] = useState(() => store.listTimeReportOptions(projectId));
	const currentUser = useCurrentUserName(localizationConstants.projectAtaYou);

	const form = useForm<AtaFormValues>({
		resolver: zodResolver(ataFormSchema) as Resolver<AtaFormValues>,
		defaultValues,
		mode: "onTouched",
	});

	const [step, setStep] = useState<AtaStep>(initialStep);
	/* A new ÄTA's Datum on the preview, read in the Förhandsgranska click. */
	const [previewDate, setPreviewDate] = useState("");
	const stepHeadingRef = useRef<HTMLHeadingElement>(null);

	const status: AtaStatus = existing?.status ?? "utkast";
	const locked = isLocked(status);

	const showStep = useCallback((next: AtaStep) => {
		setStep(next);
		setTimeout(() => stepHeadingRef.current?.focus(), 0);
	}, []);

	const goToPreview = useCallback(async () => {
		if (!(await form.trigger(ATA_STEP_ONE_FIELD_PATHS, { shouldFocus: true }))) return;
		if (!existing) setPreviewDate(todayIso());
		showStep(2);
	}, [existing, form, showStep]);

	/** Sends a failed save to the step holding the first error, and focuses it. */
	const revealErrors = useCallback(
		(errors: FieldErrors<AtaFormValues>) => {
			const onStepOne = Boolean(errors.client || errors.info);
			setStep(onStepOne ? 1 : 2);
			const path = firstErrorPath(errors);
			if (path) setTimeout(() => form.setFocus(path as FieldPath<AtaFormValues>), 0);
		},
		[form],
	);

	/** The only write: create or update. `undefined` when the store refuses (a locked ÄTA). */
	const persist = useCallback(
		(values: AtaFormValues): ProjectAta | undefined => {
			const today = todayIso();
			return existing
				? store.updateAta(projectId, existing.id, values, today)
				: store.createAta(projectId, values, { createdBy: currentUser, today });
		},
		[currentUser, existing, projectId],
	);

	return {
		form,
		project,
		existing,
		recordInfo,
		invoiceOptions,
		timeReportOptions,
		missing: Boolean(ataId) && !existing,
		number: existing?.number ?? previewNumber,
		status,
		locked,
		lockReason: editBlockReason(status),
		meta: {
			createdBy: existing?.createdBy ?? currentUser,
			createdDate: existing?.createdDate ?? previewDate,
			revisedDate: existing?.revisedDate ?? "",
		},
		step,
		showStep,
		stepHeadingRef,
		goToPreview,
		revealErrors,
		persist,
	};
}

export type AtaFormState = ReturnType<typeof useAtaForm>;
