import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_FIELD_MAX_LENGTH, PROTOCOL_NOTE_MAX_LENGTH, PROTOCOL_NUMBER_MAX_LENGTH } from "../projectProtocol.config";
import { categorySchema, checkHost, checkMoments, checkTexts, issuer, planShape, tooLong, typeSchema } from "./meetingRules";

const M = localizationConstants;

/*
 * Nytt möte and the edit page. Messages are translation keys. Every rule runs
 * in one pass, so a Spara on an empty form names each missing field at once.
 */

/** Nytt möte: Ansvarig, Rubrik, Typ, Kategori and both moments are required. */
export const newMeetingSchema = z.object({ ...planShape, type: typeSchema, category: categorySchema }).superRefine((values, ctx) => {
	const issue = issuer(ctx);
	checkHost(values, issue, true);
	checkTexts(values, issue, true);
	if (!values.type) issue("type", M.projectProtocolTypeRequired);
	if (!values.category) issue("category", M.projectProtocolCategoryRequired);
	checkMoments(values, issue, true);
});

export type NewMeetingValues = z.infer<typeof newMeetingSchema>;

const nextMeetingSchema = z.object({ ...planShape, category: categorySchema });

/**
 * The edit page: the meeting's rules plus Protokoll nr (required), Ämne and
 * Kommentar; Nästa möte's fields are all optional. Issues come in the page's
 * order — Tid, Deltagare, Övrig information, Nästa möte — so the first one is
 * the first on screen.
 */
export const editMeetingSchema = z
	.object({
		...planShape,
		type: typeSchema,
		category: categorySchema,
		number: z.string(),
		subject: z.string(),
		comment: z.string(),
		next: nextMeetingSchema,
	})
	.superRefine((values, ctx) => {
		const issue = issuer(ctx);
		checkMoments(values, issue, true);
		checkHost(values, issue, true);

		if (!values.number.trim()) issue("number", M.projectProtocolNumberRequired);
		else if (tooLong(values.number, PROTOCOL_NUMBER_MAX_LENGTH)) issue("number", M.projectProtocolTooLong);
		if (tooLong(values.subject, PROTOCOL_FIELD_MAX_LENGTH)) issue("subject", M.projectProtocolTooLong);
		checkTexts(values, issue, true);
		if (!values.category) issue("category", M.projectProtocolCategoryRequired);
		if (!values.type) issue("type", M.projectProtocolTypeRequired);
		if (tooLong(values.comment, PROTOCOL_NOTE_MAX_LENGTH)) issue("comment", M.projectProtocolTooLong);

		const nextIssue = issuer(ctx, ["next"]);
		checkHost(values.next, nextIssue, false);
		checkTexts(values.next, nextIssue, false);
		checkMoments(values.next, nextIssue, false);
	});

export type EditMeetingValues = z.infer<typeof editMeetingSchema>;
