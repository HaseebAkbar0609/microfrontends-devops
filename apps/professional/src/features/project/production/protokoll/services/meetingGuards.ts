import { isIsoDate, isTime, rangeInversion } from "../meetingTime";
import {
	MEETING_CATEGORIES,
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_NUMBER_MAX_LENGTH,
	PROTOCOL_PARTICIPANTS_MAX,
	PROTOCOL_POINT_NR_MAX_LENGTH,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
	PROTOCOL_TYPES,
} from "../projectProtocol.config";
import type { MeetingCategory, MeetingDetails, MeetingPlan, MeetingPoint, NextMeeting } from "../types";

/*
 * The store's own checks on a meeting — where an endpoint's would stand. The
 * forms already hold these rules; a value that reaches the store without them
 * is refused (`undefined`), never stored half-right. Text is trimmed.
 */

/** Trimmed, or `undefined` when longer than `max`. */
function text(value: string, max: number): string | undefined {
	const trimmed = value.trim();
	return trimmed.length <= max ? trimmed : undefined;
}

const isCategory = (value: string): value is MeetingCategory => (MEETING_CATEGORIES as readonly string[]).includes(value);

/** Each name once, none blank, none overlong, at most the cap. */
function acceptNames(names: string[]): string[] | undefined {
	const accepted = [...new Set(names.map((name) => name.trim()))];
	if (accepted.length > PROTOCOL_PARTICIPANTS_MAX) return undefined;
	return accepted.every((name) => name && name.length <= PROTOCOL_FIELD_MAX_LENGTH) ? accepted : undefined;
}

/**
 * A meeting's shared fields. `required` — the meeting itself — needs Ansvarig,
 * Rubrik and both moments; Nästa möte may leave any of them empty. Either way a
 * set day or time must be real, and the end may not fall before the start.
 */
function acceptPlan(plan: MeetingPlan, required: boolean): MeetingPlan | undefined {
	const fields = {
		host: text(plan.host, PROTOCOL_FIELD_MAX_LENGTH),
		title: text(plan.title, PROTOCOL_NAME_MAX_LENGTH),
		address: text(plan.address, PROTOCOL_FIELD_MAX_LENGTH),
		postalCode: text(plan.postalCode, PROTOCOL_POSTAL_CODE_MAX_LENGTH),
		city: text(plan.city, PROTOCOL_FIELD_MAX_LENGTH),
		location: text(plan.location, PROTOCOL_FIELD_MAX_LENGTH),
		information: text(plan.information, PROTOCOL_NOTE_MAX_LENGTH),
	};
	const participants = acceptNames(plan.participants);
	if (Object.values(fields).some((value) => value === undefined) || !participants) return undefined;

	const days = [plan.startDate, plan.endDate];
	const times = [plan.startTime, plan.endTime];
	if (required && (!fields.host || !fields.title || days.some((day) => !day) || times.some((time) => !time))) return undefined;
	if (days.some((day) => day && !isIsoDate(day)) || times.some((time) => time && !isTime(time))) return undefined;
	if (rangeInversion(plan.startDate, plan.startTime, plan.endDate, plan.endTime)) return undefined;

	return {
		...(fields as Omit<MeetingPlan, "participants" | "startDate" | "startTime" | "endDate" | "endTime">),
		participants,
		startDate: plan.startDate,
		startTime: plan.startTime,
		endDate: plan.endDate,
		endTime: plan.endTime,
	};
}

/** The meeting a Standard protocol records: its plan plus Typ, Kategori and Protokoll nr, all required. */
export function acceptDetails(details: MeetingDetails): MeetingDetails | undefined {
	const plan = acceptPlan(details, true);
	const number = text(details.number, PROTOCOL_NUMBER_MAX_LENGTH);
	const subject = text(details.subject, PROTOCOL_FIELD_MAX_LENGTH);
	const comment = text(details.comment, PROTOCOL_NOTE_MAX_LENGTH);
	if (!plan || !number || subject === undefined || comment === undefined) return undefined;
	if (!(PROTOCOL_TYPES as readonly string[]).includes(details.type) || !isCategory(details.category)) return undefined;
	return { ...plan, type: details.type, category: details.category, number, subject, comment };
}

/** Nästa möte: any field may be empty; Kategori, when set, is one of the list's. */
export function acceptNext(next: NextMeeting): NextMeeting | undefined {
	const plan = acceptPlan(next, false);
	if (!plan || (next.category !== null && !isCategory(next.category))) return undefined;
	return { ...plan, category: next.category };
}

/** The agenda: every point with an id, a Nr and a Rubrik; ids unique. */
export function acceptPoints(points: MeetingPoint[]): MeetingPoint[] | undefined {
	const accepted: MeetingPoint[] = [];
	for (const point of points) {
		const nr = text(point.nr, PROTOCOL_POINT_NR_MAX_LENGTH);
		const title = text(point.title, PROTOCOL_FIELD_MAX_LENGTH);
		const responsible = text(point.responsible, PROTOCOL_FIELD_MAX_LENGTH);
		const description = text(point.description, PROTOCOL_NOTE_MAX_LENGTH);
		const decision = text(point.decision, PROTOCOL_NOTE_MAX_LENGTH);
		if (!point.id || !nr || !title || responsible === undefined || description === undefined || decision === undefined) {
			return undefined;
		}
		accepted.push({ id: point.id, nr, title, responsible, description, decision });
	}
	return new Set(accepted.map((point) => point.id)).size === accepted.length ? accepted : undefined;
}
