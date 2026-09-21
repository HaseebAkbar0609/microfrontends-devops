"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type FieldPath, type Resolver } from "react-hook-form";

import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { firstErrorPath } from "../../ata/form/firstErrorPath";
import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import { editMeetingSchema, type EditMeetingValues } from "../form/meetingSchema";
import { detailsFrom, editValuesOf, nextFrom, storedNamesOf } from "../form/meetingValues";
import { useMeetingPeople } from "../hooks/useMeetingPeople";
import { protocolUrls } from "../protocolNav";
import * as store from "../services/projectProtocolService";
import { ALL_SECTIONS_OPEN, sectionOf, type EditSection } from "./editSections";

const NO_NAMES: string[] = [];

/**
 * Redigera protokoll: the meeting and Nästa möte, pre-filled from the store.
 *
 * Read once — the store changes only when this page saves, and then it leaves.
 * A collapsed section's fields are not on the page, so a failed Spara opens
 * every section holding an error and focuses the first. The points are the
 * protocol page's and are not touched here.
 */
export function useProtocolEditForm(projectId: string, protocolId: string) {
	const t = useTranslate();
	const router = useRouter();
	const translateError = useCallback((message: string) => t(message as TranslationKeys), [t]);

	const [existing] = useState(() => store.getProtocol(projectId, protocolId));
	const meeting = existing?.meeting;

	const form = useForm<EditMeetingValues>({
		resolver: zodResolver(editMeetingSchema) as Resolver<EditMeetingValues>,
		defaultValues: meeting ? editValuesOf(meeting) : undefined,
		mode: "onTouched",
	});

	const storedNames = useMemo(() => (meeting ? storedNamesOf(meeting) : NO_NAMES), [meeting]);
	const people = useMeetingPeople(projectId, storedNames);

	const [sections, setSections] = useState(ALL_SECTIONS_OPEN);
	const setSectionOpen = useCallback((section: EditSection, open: boolean) => {
		setSections((current) => ({ ...current, [section]: open }));
	}, []);

	const dirty = form.formState.isDirty;
	useBeforeUnloadWarning(dirty);

	const revealErrors = useCallback(
		(errors: FieldErrors<EditMeetingValues>) => {
			const withErrors = Object.keys(errors).map(sectionOf);
			setSections((current) => ({ ...current, ...Object.fromEntries(withErrors.map((section) => [section, true])) }));
			const first = firstErrorPath(errors);
			/* A tick later, once a reopened section has mounted its fields. */
			if (first) setTimeout(() => form.setFocus(first as FieldPath<EditMeetingValues>), 0);
		},
		[form],
	);

	/* `handleSubmit`'s callback is synchronous; the ref stops a fast second Spara. */
	const savedRef = useRef(false);

	const save = form.handleSubmit((values) => {
		if (savedRef.current || !existing) return;
		const details = detailsFrom(values);
		const updated = details ? store.updateMeeting(projectId, existing.id, details, nextFrom(values.next)) : undefined;
		if (!updated) {
			showToast("error", t(localizationConstants.projectProtocolSaveFailed));
			return;
		}
		savedRef.current = true;
		showToast("success", t(localizationConstants.projectProtocolSavedToast));
		router.push(protocolUrls.view(projectId, existing.id));
	}, revealErrors);

	/** Back to the protocol without saving — the page asks first when anything changed. */
	const leave = useCallback(() => router.push(protocolUrls.view(projectId, protocolId)), [projectId, protocolId, router]);

	return { meeting, form, people, sections, setSectionOpen, dirty, save, leave, translateError };
}
