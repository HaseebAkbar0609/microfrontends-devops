import type { MeetingPlan, NextMeeting } from "./types";

/** A meeting with nothing filled in — the start of Nytt möte, and of every Nästa möte. */
export function emptyMeetingPlan(): MeetingPlan {
	return {
		host: "",
		title: "",
		address: "",
		postalCode: "",
		city: "",
		location: "",
		participants: [],
		startDate: "",
		startTime: "",
		endDate: "",
		endTime: "",
		information: "",
	};
}

/** Nästa möte before the edit page fills it. */
export function emptyNextMeeting(): NextMeeting {
	return { ...emptyMeetingPlan(), category: null };
}
