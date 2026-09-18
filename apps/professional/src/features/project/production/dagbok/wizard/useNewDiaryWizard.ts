"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import { todayIso } from "../../../shared/todayIso";
import { diaryUrls } from "../diaryNav";
import type { DiaryProjectFacts } from "../hooks/useDiaryProject";
import * as store from "../services/projectDiaryService";
import type { DiaryRowByKind, DiaryRowKind } from "../types";
import type { ConfirmationValues } from "./confirmationSchema";
import { diaryWizardSchema, emptyWizardValues, toDiaryContent, WIZARD_STEP_ONE_PATHS, type DiaryWizardValues } from "./wizardSchema";

export type WizardStep = 1 | 2;

/**
 * "Ny dagbok": one form over both steps, the step being shown, and what the
 * Bekräftelse modal does with it.
 *
 * Step 1 is checked before the reader can leave it, with focus on the first
 * field that fails; a day that already has a diary is refused here and again by
 * the store. Spara creates the draft with the weather and rows collected, signs
 * it, and opens that day.
 */
export function useNewDiaryWizard(projectId: string, facts: DiaryProjectFacts, initialDate: string, createdBy: string) {
	const { t } = useTranslation();
	const router = useRouter();
	const savedRef = useRef(false);
	const [step, setStep] = useState<WizardStep>(1);
	const [confirming, setConfirming] = useState(false);
	const [leaving, setLeaving] = useState(false);

	const takenDates = useMemo(() => new Set(store.listDiaries(projectId).map((diary) => diary.date)), [projectId]);

	const form = useForm<DiaryWizardValues>({
		resolver: zodResolver(
			diaryWizardSchema.refine((values) => !takenDates.has(values.date), {
				path: ["date"],
				message: localizationConstants.projectDiaryDateTaken,
			}),
		) as Resolver<DiaryWizardValues>,
		defaultValues: emptyWizardValues(takenDates.has(initialDate) ? "" : initialDate, createdBy),
		mode: "onTouched",
	});

	useBeforeUnloadWarning(form.formState.isDirty && !savedRef.current);

	const leave = useCallback(() => router.push(diaryUrls.list(projectId)), [router, projectId]);

	const putRow = useCallback(
		<K extends DiaryRowKind>(kind: K, row: DiaryRowByKind[K]) => {
			const rows = form.getValues(kind) as DiaryRowByKind[K][];
			const exists = rows.some((entry) => entry.id === row.id);
			form.setValue(kind, (exists ? rows.map((entry) => (entry.id === row.id ? row : entry)) : [...rows, row]) as never, {
				shouldDirty: true,
			});
		},
		[form],
	);

	const removeRow = useCallback(
		(kind: DiaryRowKind, id: string) =>
			form.setValue(kind, (form.getValues(kind) as { id: string }[]).filter((entry) => entry.id !== id) as never, {
				shouldDirty: true,
			}),
		[form],
	);

	/** Nästa: step 1 has to pass first; from step 2 it asks for the signature. */
	const next = useCallback(async () => {
		if (step === 2) {
			setConfirming(true);
			return;
		}
		if (await form.trigger(WIZARD_STEP_ONE_PATHS, { shouldFocus: true })) setStep(2);
	}, [step, form]);

	const back = useCallback(() => setStep(1), []);

	const cancel = useCallback(() => {
		if (form.formState.isDirty) setLeaving(true);
		else leave();
	}, [form, leave]);

	/** Spara in the modal: create the day, sign it, and go there. `false` keeps the modal open. */
	const create = useCallback(
		(confirmation: ConfirmationValues): boolean => {
			if (savedRef.current) return false;
			const values = form.getValues();
			const today = todayIso();

			const created = store.createDiary(projectId, values.date, { createdBy: values.createdBy, today }, toDiaryContent(values));
			if (!created) {
				showToast("error", t(localizationConstants.projectDiaryActionFailed));
				return false;
			}

			store.signDiary(projectId, created.id, confirmation.role, {
				name: confirmation.clarification,
				today,
				fileName: confirmation.file?.name,
			});

			savedRef.current = true;
			showToast("success", t(localizationConstants.projectDiaryCreatedToast));
			router.push(diaryUrls.list(projectId, created.date));
			return true;
		},
		[form, projectId, router, t],
	);

	return {
		form,
		step,
		facts,
		confirming,
		leaving,
		closeConfirm: () => setConfirming(false),
		closeLeaving: () => setLeaving(false),
		next,
		back,
		cancel,
		leave,
		create,
		putRow,
		removeRow,
	};
}

export type NewDiaryWizardState = ReturnType<typeof useNewDiaryWizard>;
