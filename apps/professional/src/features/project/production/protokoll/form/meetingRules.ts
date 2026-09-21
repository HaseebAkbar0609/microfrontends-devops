import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { isIsoDate, isTime, rangeInversion } from "../meetingTime";
import {
	MEETING_CATEGORIES,
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_PARTICIPANTS_MAX,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
	PROTOCOL_TYPES,
} from "../projectProtocol.config";

const M = localizationConstants;

/*
 * The rules the protocol forms share — Nytt möte, the edit page and Ladda upp.
 * Messages are translation keys.
 */

/** A meeting's shared fields, as the forms hold them. */
export const planShape = {
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

/** Nullable, so an untouched select holds no value. */
export const categorySchema = z.enum(MEETING_CATEGORIES).nullable();
export const typeSchema = z.enum(PROTOCOL_TYPES).nullable();

type PlanValues = z.infer<z.ZodObject<typeof planShape>>;
type MomentValues = Pick<PlanValues, "startDate" | "startTime" | "endDate" | "endTime">;

export type Issue = (path: string, message: string) => void;

export const tooLong = (value: string, max: number) => value.trim().length > max;

/** Adds issues to a schema's context, under `prefix` — `["next"]` for Nästa möte. */
export const issuer =
	(ctx: z.RefinementCtx, prefix: string[] = []): Issue =>
	(path, message) =>
		ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...prefix, path], message });

/** Ansvarig / Värd — picked from a list, so only its presence is checked. */
export function checkHost(values: Pick<PlanValues, "host">, issue: Issue, required: boolean) {
	if (required && !values.host.trim()) issue("host", M.projectProtocolPersonRequired);
}

/** Rubrik (required on a meeting or an upload), the address, Plats, Information and the participant cap. */
export function checkTexts(values: Omit<PlanValues, "host">, issue: Issue, required: boolean) {
	if (required && !values.title.trim()) issue("title", M.projectProtocolTitleRequired);
	else if (tooLong(values.title, PROTOCOL_NAME_MAX_LENGTH)) issue("title", M.projectProtocolTooLong);

	const limits: [keyof Omit<PlanValues, "host" | "participants">, number][] = [
		["location", PROTOCOL_FIELD_MAX_LENGTH],
		["address", PROTOCOL_FIELD_MAX_LENGTH],
		["postalCode", PROTOCOL_POSTAL_CODE_MAX_LENGTH],
		["city", PROTOCOL_FIELD_MAX_LENGTH],
		["information", PROTOCOL_NOTE_MAX_LENGTH],
	];
	for (const [field, max] of limits) {
		if (tooLong(values[field], max)) issue(field, M.projectProtocolTooLong);
	}
	if (values.participants.length > PROTOCOL_PARTICIPANTS_MAX) issue("participants", M.projectProtocolTooLong);
}

/**
 * Start tid and Slut tid. A meeting or an upload needs both days and both
 * times; Nästa möte may leave them empty. The end may not fall before the
 * start — the error sits on the end's day or time, whichever is out of order.
 */
export function checkMoments(values: MomentValues, issue: Issue, required: boolean) {
	for (const field of ["startDate", "endDate"] as const) {
		const value = values[field];
		if ((required && !value) || (value && !isIsoDate(value))) issue(field, M.projectProtocolDateRequired);
	}
	for (const field of ["startTime", "endTime"] as const) {
		const value = values[field];
		if ((required && !value) || (value && !isTime(value))) issue(field, M.projectProtocolTimeRequired);
	}

	const inversion = rangeInversion(values.startDate, values.startTime, values.endDate, values.endTime);
	if (inversion) issue(inversion === "date" ? "endDate" : "endTime", M.projectProtocolEndBeforeStart);
}
