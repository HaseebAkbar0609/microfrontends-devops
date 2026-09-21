"use client";

import { useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { NewMeetingInput } from "../types";
import { newMeetingSchema, type NewMeetingValues } from "./meetingSchema";
import { emptyMeetingDraft, meetingInputFrom } from "./meetingValues";

/**
 * Nytt möte's form. `onCreate` stores the meeting and opens it; it returns
 * `false` when the store refused, which leaves the dialog open. `handleSubmit`'s
 * callback is synchronous, so a fast second Nästa would create the meeting
 * twice — the ref stops it.
 */
export function useNewMeetingForm(onCreate: (input: NewMeetingInput) => boolean) {
	const t = useTranslate();
	const translateError = useCallback((message: string) => t(message as TranslationKeys), [t]);
	const savedRef = useRef(false);

	const form = useForm<NewMeetingValues>({
		resolver: zodResolver(newMeetingSchema) as Resolver<NewMeetingValues>,
		defaultValues: emptyMeetingDraft(),
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		const input = meetingInputFrom(values);
		if (savedRef.current || !input) return;
		savedRef.current = true;
		if (!onCreate(input)) savedRef.current = false;
	});

	return { form, submit, translateError };
}
