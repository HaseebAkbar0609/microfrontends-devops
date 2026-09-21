import type { UseFormReturn } from "react-hook-form";

import type { ProjectPerson } from "../../hooks/useProjectPeople";
import type { EditMeetingValues } from "../form/meetingSchema";

/** The edit page's collapsible sections, top to bottom. */
export type EditSection = "time" | "people" | "other" | "next";

export const ALL_SECTIONS_OPEN: Record<EditSection, boolean> = { time: true, people: true, other: true, next: true };

const TIME_FIELDS = new Set(["startDate", "startTime", "endDate", "endTime"]);
const PEOPLE_FIELDS = new Set(["host", "participants"]);

/** Which section holds a field, by its top-level name — "next.*" is all Nästa möte. */
export function sectionOf(field: string): EditSection {
	if (field === "next") return "next";
	if (TIME_FIELDS.has(field)) return "time";
	if (PEOPLE_FIELDS.has(field)) return "people";
	return "other";
}

/** What every section takes. */
export interface EditSectionProps {
	form: UseFormReturn<EditMeetingValues>;
	people: ProjectPerson[];
	translateError: (message: string) => string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
