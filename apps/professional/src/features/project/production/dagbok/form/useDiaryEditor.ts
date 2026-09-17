"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import type { ProjectDiaryState } from "../hooks/useProjectDiary";
import type { DiaryRowByKind, DiaryRowKind, ProjectDiary, WeatherReading } from "../types";
import { diaryFormSchema, toDiaryContent, toDiaryFormValues, type DiaryFormValues } from "./diaryFormSchema";

export type DiaryConfirm = "publish" | "discard" | "clearSignatures" | null;

/**
 * One diary's page as a form: the readings and rows its dialogs hand back, the
 * two notes, and the footer's flows.
 *
 * - Spara utkast saves. Saving changed content removes the signatures, so a
 *   signed diary asks first.
 * - Publicera validates, confirms, saves any changes and publishes.
 * - Avbryt puts back what is stored, after a confirm.
 *
 * The page keys this on the diary's id, so switching days starts a fresh form.
 */
export function useDiaryEditor(diary: ProjectDiary, state: ProjectDiaryState) {
	const [confirm, setConfirm] = useState<DiaryConfirm>(null);
	const locked = diary.status === "publicerad";

	const form = useForm<DiaryFormValues>({
		resolver: zodResolver(diaryFormSchema) as Resolver<DiaryFormValues>,
		defaultValues: toDiaryFormValues(diary),
	});
	const dirty = form.formState.isDirty;
	const signed = Boolean(diary.signatures.platschef || diary.signatures.bestallare);

	useBeforeUnloadWarning(dirty && !locked);

	const setRows = useCallback(
		<K extends DiaryRowKind>(kind: K, rows: DiaryRowByKind[K][]) =>
			form.setValue(kind as DiaryRowKind, rows as never, { shouldDirty: true }),
		[form],
	);

	/** Adds a row, or replaces the one with the same id. */
	const putRow = useCallback(
		<K extends DiaryRowKind>(kind: K, row: DiaryRowByKind[K]) => {
			const rows = form.getValues(kind) as DiaryRowByKind[K][];
			const exists = rows.some((entry) => entry.id === row.id);
			setRows(kind, exists ? rows.map((entry) => (entry.id === row.id ? row : entry)) : [...rows, row]);
		},
		[form, setRows],
	);

	const removeRow = useCallback(
		(kind: DiaryRowKind, id: string) =>
			setRows(kind, (form.getValues(kind) as { id: string }[]).filter((entry) => entry.id !== id) as never),
		[form, setRows],
	);

	const addReading = useCallback(
		(reading: WeatherReading) => form.setValue("weather", [...form.getValues("weather"), reading], { shouldDirty: true }),
		[form],
	);

	const removeReading = useCallback(
		(id: string) => form.setValue("weather", form.getValues("weather").filter((entry) => entry.id !== id), { shouldDirty: true }),
		[form],
	);

	/** Stores the values and makes them the form's new baseline. */
	const persist = useCallback(
		(values: DiaryFormValues) => {
			const saved = state.save(diary.id, toDiaryContent(values));
			if (saved) form.reset(values);
			return saved;
		},
		[state, diary.id, form],
	);

	const requestSave = form.handleSubmit((values) => {
		if (signed && form.formState.isDirty) setConfirm("clearSignatures");
		else persist(values);
	});

	const confirmSave = form.handleSubmit((values) => {
		setConfirm(null);
		persist(values);
	});

	const requestPublish = form.handleSubmit(() => setConfirm("publish"));

	const confirmPublish = form.handleSubmit((values) => {
		setConfirm(null);
		if (form.formState.isDirty && !persist(values)) return;
		state.publish(diary.id);
	});

	const requestDiscard = () => {
		if (form.formState.isDirty) setConfirm("discard");
	};

	const confirmDiscard = () => {
		setConfirm(null);
		form.reset(toDiaryFormValues(diary));
	};

	return {
		form,
		locked,
		dirty,
		confirm,
		closeConfirm: () => setConfirm(null),
		putRow,
		removeRow,
		addReading,
		removeReading,
		requestSave,
		confirmSave,
		requestPublish,
		confirmPublish,
		requestDiscard,
		confirmDiscard,
	};
}

export type DiaryEditorState = ReturnType<typeof useDiaryEditor>;
