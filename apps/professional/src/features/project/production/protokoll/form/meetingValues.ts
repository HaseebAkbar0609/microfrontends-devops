import { emptyMeetingPlan } from "../meetingDefaults";
import type { MeetingDetails, MeetingPlan, MeetingPoint, NewMeetingInput, NextMeeting, ProtocolMeeting } from "../types";
import type { EditMeetingValues, NewMeetingValues } from "./meetingSchema";

/*
 * Between the forms' values and the stored meeting. The forms hold Typ and
 * Kategori as nullable, for an empty select; the store never does.
 */

/** Only the shared fields, so a form's extra keys never ride along into the store. */
function planOf(values: MeetingPlan): MeetingPlan {
	const { host, title, address, postalCode, city, location, participants, startDate, startTime, endDate, endTime, information } = values;
	return {
		host,
		title,
		address,
		postalCode,
		city,
		location,
		participants: [...participants],
		startDate,
		startTime,
		endDate,
		endTime,
		information,
	};
}

/** Nytt möte, empty — each opening of the dialog starts from it. */
export function emptyMeetingDraft(): NewMeetingValues {
	return { ...emptyMeetingPlan(), type: null, category: null };
}

/** What Nytt möte hands the store; `undefined` while Typ or Kategori is unset, which the schema already refuses. */
export function meetingInputFrom(values: NewMeetingValues): NewMeetingInput | undefined {
	if (!values.type || !values.category) return undefined;
	return { ...planOf(values), type: values.type, category: values.category };
}

/** The edit page's starting values. */
export function editValuesOf(meeting: ProtocolMeeting): EditMeetingValues {
	const { details, next } = meeting;
	return {
		...planOf(details),
		type: details.type,
		category: details.category,
		number: details.number,
		subject: details.subject,
		comment: details.comment,
		next: { ...planOf(next), category: next.category },
	};
}

/** The meeting as the edit page saves it; `undefined` while Typ or Kategori is unset. */
export function detailsFrom(values: EditMeetingValues): MeetingDetails | undefined {
	if (!values.type || !values.category) return undefined;
	return {
		...planOf(values),
		type: values.type,
		category: values.category,
		number: values.number,
		subject: values.subject,
		comment: values.comment,
	};
}

export function nextFrom(values: EditMeetingValues["next"]): NextMeeting {
	return { ...planOf(values), category: values.category };
}

/** Every name the meeting records, so a picker can still show one the project's list has lost. */
export function storedNamesOf(meeting: ProtocolMeeting, points: MeetingPoint[] = meeting.points): string[] {
	const { details, next } = meeting;
	return [details.host, ...details.participants, next.host, ...next.participants, ...points.map((point) => point.responsible)].filter(
		Boolean,
	);
}
