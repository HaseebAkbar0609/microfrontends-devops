"use client";

import { useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MeetingPoint } from "../types";
import { pointSchema, type PointValues } from "./meetingPointSchema";

/**
 * The point dialog's form: a point's own values to edit, or an empty one
 * numbered `nextNr`. A double Spara adds it once.
 */
export function useMeetingPointForm(point: MeetingPoint | undefined, nextNr: string, onSave: (values: PointValues) => void) {
	const t = useTranslate();
	const translateError = useCallback((message: string) => t(message as TranslationKeys), [t]);
	const savedRef = useRef(false);

	const form = useForm<PointValues>({
		resolver: zodResolver(pointSchema) as Resolver<PointValues>,
		defaultValues: point
			? { nr: point.nr, responsible: point.responsible, title: point.title, description: point.description, decision: point.decision }
			: { nr: nextNr, responsible: "", title: "", description: "", decision: "" },
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		if (savedRef.current) return;
		savedRef.current = true;
		onSave(values);
	});

	return { form, submit, translateError };
}
