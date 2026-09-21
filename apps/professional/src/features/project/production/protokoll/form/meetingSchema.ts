import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { isIsoDate, isTime, rangeInversion } from "../meetingTime";
import {
	MEETING_CATEGORIES,
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_NUMBER_MAX_LENGTH,
	PROTOCOL_PARTICIPANTS_MAX,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
	PROTOCOL_TYPES,
} from "../projectProtocol.config";

const M = localizationConstants;

/*
 * Nytt möte and the edit page. Messages are translation keys. Every rule runs
 * in one pass, so a Spara on an empty form names each missing field at once.
 */

const planShape = {
	host: z.string(),
	title: z.string(),
	address: z.string(),
	postalCode: z.string(),
	city: z.string(),
	location: z.string(),
	participants: z.array(z.string()),
	startDate: z.string(),
	startTime: z.string(),
	endDate: z.string(),
	endTime: z.string(),
	information: z.string(),
};
const category = z.enum(MEETING_CATEGORIES).nullable();
const type = z.enum(PROTOCOL_TYPES).nullable();

type PlanValues = z.infer<z.ZodObject<typeof planShape>>;
type Issue = (path: string, message: string) => void;

const tooLong = (value: string, max: number) => value.trim().length > max;

/** Ansvarig / Värd — picked from a list, so only its presence is checked. */
function checkHost(values: PlanValues, issue: Issue, required: boolean) {
	if (required && !values.host.trim()) issue("host", M.projectProtocolPersonRequired);
}

/** Rubrik (required on the meeting), the address, Plats, Information and the participant cap. */
function checkTexts(values: PlanValues, issue: Issue, required: boolean) {
	if (required && !values.title.trim()) issue("title", M.projectProtocolTitleRequired);
	else if (tooLong(values.title, PROTOCOL_NAME_MAX_LENGTH)) issue("title", M.projectProtocolTooLong);

	const limits: [keyof PlanValues & string, number][] = [
		["location", PROTOCOL_FIELD_MAX_LENGTH],
		["address", PROTOCOL_FIELD_MAX_LENGTH],
		["postalCode", PROTOCOL_POSTAL_CODE_MAX_LENGTH],
		["city", PROTOCOL_FIELD_MAX_LENGTH],
		["information", PROTOCOL_NOTE_MAX_LENGTH],
	];
	for (const [field, max] of limits) {
		if (tooLong(values[field] as string, max)) issue(field, M.projectProtocolTooLong);
	}
	if (values.participants.length > PROTOCOL_PARTICIPANTS_MAX) issue("participants", M.projectProtocolTooLong);
}

/**
 * Start tid and Slut tid. The meeting needs both days and both times; Nästa
 * möte may leave them empty. The end may not fall before the start — the error
 * sits on the end's day or time, whichever is out of order.
 */
function checkMoments(values: PlanValues, issue: Issue, required: boolean) {
	const days = ["startDate", "endDate"] as const;
	const times = ["startTime", "endTime"] as const;
	for (const field of days) {
		const value = values[field];
		if ((required && !value) || (value && !isIsoDate(value))) issue(field, M.projectProtocolDateRequired);
	}
	for (const field of times) {
		const value = values[field];
		if ((required && !value) || (value && !isTime(value))) issue(field, M.projectProtocolTimeRequired);
	}

	const inversion = rangeInversion(values.startDate, values.startTime, values.endDate, values.endTime);
	if (inversion) issue(inversion === "date" ? "endDate" : "endTime", M.projectProtocolEndBeforeStart);
}

const issuer =
	(ctx: z.RefinementCtx, prefix: string[] = []): Issue =>
	(path, message) =>
		ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...prefix, path], message });

/** Nytt möte: Ansvarig, Rubrik, Typ, Kategori and both moments are required. */
export const newMeetingSchema = z.object({ ...planShape, type, category }).superRefine((values, ctx) => {
	const issue = issuer(ctx);
	checkHost(values, issue, true);
	checkTexts(values, issue, true);
	if (!values.type) issue("type", M.projectProtocolTypeRequired);
	if (!values.category) issue("category", M.projectProtocolCategoryRequired);
	checkMoments(values, issue, true);
});

export type NewMeetingValues = z.infer<typeof newMeetingSchema>;

const nextMeetingSchema = z.object({ ...planShape, category });

/**
 * The edit page: the meeting's rules plus Protokoll nr (required), Ämne and
 * Kommentar; Nästa möte's fields are all optional. Issues come in the page's
 * order — Tid, Deltagare, Övrig information, Nästa möte — so the first one is
 * the first on screen.
 */
export const editMeetingSchema = z
	.object({ ...planShape, type, category, number: z.string(), subject: z.string(), comment: z.string(), next: nextMeetingSchema })
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
