import { generateTempId } from "@/lib/tempId";
import { fileRejection, mintTypedUrl, revokeUrls } from "../../../shared/recordFiles";
import { SEEDED_PROJECT_PROTOCOLS } from "../data/projectProtocols.mock";
import { emptyNextMeeting } from "../meetingDefaults";
import {
	PROTOCOL_DIALOG_KINDS,
	PROTOCOL_FILE_RULES,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NUMBER_SEQUENCE_DIGITS,
	PROTOCOL_TYPES,
} from "../projectProtocol.config";
import type {
	MeetingDetails,
	MeetingPoint,
	NewMeetingInput,
	NextMeeting,
	ProjectProtocol,
	ProjectProtocolInput,
} from "../types";
import { acceptDetails, acceptNext, acceptPoints } from "./meetingGuards";

/**
 * The project's protocols, in memory.
 *
 * There is no protocol endpoint for a project — the order module's are
 * order-scoped — so this stands in for one, as the record's other sections'
 * services do: a module-level array every read goes through, each mutator
 * reassigning it. A change survives a visit to another section; a hard reload
 * resets to the seed. Nothing is persisted to browser storage (AGENTS.md
 * rule 6). Rows go in and out as deep copies, so a caller never holds the
 * store's own meeting.
 *
 * It also stands in for the upload endpoint, so it owns the PDFs' `blob:`
 * URLs: minted when an upload is stored, revoked when the protocol is deleted.
 * Archiving keeps them, since the protocol can come back.
 */
let protocols: ProjectProtocol[] = SEEDED_PROJECT_PROTOCOLS.map((row) => structuredClone(row));

const copy = (row: ProjectProtocol): ProjectProtocol => structuredClone(row);

const find = (projectId: string, id: string) => protocols.find((row) => row.projectId === projectId && row.id === id);

const replace = (target: ProjectProtocol, next: ProjectProtocol) => {
	protocols = protocols.map((row) => (row === target ? next : row));
	return copy(next);
};

/** The list's columns follow the meeting: its start day, Typ and Rubrik. */
const rowFields = (details: MeetingDetails) => ({ date: details.startDate, type: details.type, name: details.title });

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listProtocols(projectId: string): ProjectProtocol[] {
	return protocols
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(copy);
}

/** One of the project's protocols; `undefined` for an id that is not this project's. */
export function getProtocol(projectId: string, id: string): ProjectProtocol | undefined {
	const row = find(projectId, id);
	return row ? copy(row) : undefined;
}

/**
 * Stores an Action or uploaded protocol, or refuses one the dialog should
 * already have stopped: a missing day, an unknown kind or type, a blank or
 * overlong name, an upload without a valid PDF, or a PDF on an Action
 * protocol. Standard protocols carry a meeting and come through
 * `createMeeting`. The form's checks run in the browser; these stand where the
 * endpoint's would.
 */
export function createProtocol(projectId: string, input: ProjectProtocolInput): ProjectProtocol | undefined {
	const name = input.name.trim();
	if (!input.date || !name || name.length > PROTOCOL_NAME_MAX_LENGTH) return undefined;
	if (!(PROTOCOL_DIALOG_KINDS as readonly string[]).includes(input.kind)) return undefined;
	if (!(PROTOCOL_TYPES as readonly string[]).includes(input.type)) return undefined;

	const upload = input.kind === "upload";
	if (upload !== Boolean(input.file)) return undefined;
	if (input.file && fileRejection(input.file, PROTOCOL_FILE_RULES)) return undefined;

	const protocol: ProjectProtocol = {
		id: generateTempId(),
		projectId,
		kind: input.kind,
		date: input.date,
		type: input.type,
		name,
		fileName: input.file?.name,
		url: input.file ? mintTypedUrl(input.file, PROTOCOL_FILE_RULES.types) : undefined,
		archived: false,
	};
	protocols = [protocol, ...protocols];
	return copy(protocol);
}

/**
 * The next Protokoll nr: the project number and a sequence one past the
 * project's highest — "5001-03" after "5001-02". A number edited into another
 * shape is not counted.
 */
function nextProtocolNumber(projectId: string, projectNo: string): string {
	const prefix = `${projectNo}-`;
	const highest = protocols.reduce((max, row) => {
		const number = row.projectId === projectId ? row.meeting?.details.number : undefined;
		const sequence = number?.startsWith(prefix) ? number.slice(prefix.length) : "";
		return /^\d+$/.test(sequence) ? Math.max(max, Number(sequence)) : max;
	}, 0);
	return `${prefix}${String(highest + 1).padStart(PROTOCOL_NUMBER_SEQUENCE_DIGITS, "0")}`;
}

/** Stores a Standard protocol from Nytt möte, numbered, with an empty Nästa möte and no points. */
export function createMeeting(projectId: string, projectNo: string, input: NewMeetingInput): ProjectProtocol | undefined {
	const details = acceptDetails({ ...input, number: nextProtocolNumber(projectId, projectNo), subject: "", comment: "" });
	if (!details) return undefined;

	const protocol: ProjectProtocol = {
		id: generateTempId(),
		projectId,
		kind: "standard",
		...rowFields(details),
		archived: false,
		meeting: { details, next: emptyNextMeeting(), points: [] },
	};
	protocols = [protocol, ...protocols];
	return copy(protocol);
}

/** The edit page's save: the meeting and Nästa möte. The points are the view's and stay as they are. */
export function updateMeeting(
	projectId: string,
	id: string,
	details: MeetingDetails,
	next: NextMeeting,
): ProjectProtocol | undefined {
	const target = find(projectId, id);
	const acceptedDetails = acceptDetails(details);
	const acceptedNext = acceptNext(next);
	if (!target?.meeting || !acceptedDetails || !acceptedNext) return undefined;

	return replace(target, {
		...target,
		...rowFields(acceptedDetails),
		meeting: { ...target.meeting, details: acceptedDetails, next: acceptedNext },
	});
}

/** The view's Spara: the whole agenda at once. */
export function savePoints(projectId: string, id: string, points: MeetingPoint[]): ProjectProtocol | undefined {
	const target = find(projectId, id);
	const accepted = acceptPoints(points);
	if (!target?.meeting || !accepted) return undefined;

	return replace(target, { ...target, meeting: { ...target.meeting, points: accepted } });
}

/** Skicka: records the day it was sent. */
export function markProtocolSent(projectId: string, id: string, sentAt: string): ProjectProtocol | undefined {
	const target = find(projectId, id);
	if (!target?.meeting) return undefined;
	return replace(target, { ...target, sentAt });
}

/** Reversible, so the list asks no confirm. */
export function setProtocolArchived(projectId: string, id: string, archived: boolean): void {
	protocols = protocols.map((row) => (row.projectId === projectId && row.id === id ? { ...row, archived } : row));
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeProtocol(projectId: string, id: string): void {
	const target = find(projectId, id);
	if (!target) return;
	protocols = protocols.filter((row) => row !== target);
	revokeUrls([target]);
}
