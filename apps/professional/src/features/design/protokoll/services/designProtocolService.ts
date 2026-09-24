import { generateTempId } from "@/lib/tempId";
import { fileRejection, mintTypedUrl, revokeUrls } from "../../../project/shared/recordFiles";
import { SEEDED_DESIGN_PROTOCOLS } from "../data/designProtocols.mock";
import { emptyNextMeeting } from "../../../project/production/protokoll/meetingDefaults";
import {
	PROTOCOL_FILE_RULES,
	PROTOCOL_NUMBER_SEQUENCE_DIGITS,
} from "../../../project/production/protokoll/projectProtocol.config";
import type {
	MeetingDetails,
	MeetingKind,
	NewMeetingInput,
	ProjectProtocol,
	UploadDetails,
} from "../../../project/production/protokoll/types";
import {
	acceptDetails,
	acceptUploadDetails,
} from "../../../project/production/protokoll/services/meetingGuards";

let protocols: ProjectProtocol[] = SEEDED_DESIGN_PROTOCOLS.map((row) =>
	structuredClone(row),
);

const copy = (row: ProjectProtocol): ProjectProtocol => structuredClone(row);

const find = (projectId: string, id: string) =>
	protocols.find((row) => row.projectId === projectId && row.id === id);

const rowFields = (
	details: Pick<MeetingDetails, "startDate" | "type" | "title">,
) => ({
	date: details.startDate,
	type: details.type,
	name: details.title,
});

export function listProtocols(projectId: string): ProjectProtocol[] {
	return protocols
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(copy);
}

export function createUpload(
	projectId: string,
	details: UploadDetails,
	file: File,
): ProjectProtocol | undefined {
	const accepted = acceptUploadDetails(details);
	if (!accepted || fileRejection(file, PROTOCOL_FILE_RULES)) return undefined;

	const protocol: ProjectProtocol = {
		id: generateTempId(),
		projectId,
		kind: "upload",
		...rowFields(accepted),
		fileName: file.name,
		url: mintTypedUrl(file, PROTOCOL_FILE_RULES.types),
		archived: false,
		upload: accepted,
	};
	protocols = [protocol, ...protocols];
	return copy(protocol);
}

function nextProtocolNumber(projectId: string, projectNo: string): string {
	const prefix = `${projectNo}-`;
	const highest = protocols.reduce((max, row) => {
		const number =
			row.projectId === projectId ? row.meeting?.details.number : undefined;
		const sequence = number?.startsWith(prefix)
			? number.slice(prefix.length)
			: "";
		return /^\d+$/.test(sequence) ? Math.max(max, Number(sequence)) : max;
	}, 0);
	return `${prefix}${String(highest + 1).padStart(PROTOCOL_NUMBER_SEQUENCE_DIGITS, "0")}`;
}

export function createMeeting(
	projectId: string,
	projectNo: string,
	kind: MeetingKind,
	input: NewMeetingInput,
): ProjectProtocol | undefined {
	if (kind !== "standard" && kind !== "action") return undefined;
	const details = acceptDetails({
		...input,
		number: nextProtocolNumber(projectId, projectNo),
		subject: "",
		comment: "",
	});
	if (!details) return undefined;

	const protocol: ProjectProtocol = {
		id: generateTempId(),
		projectId,
		kind,
		...rowFields(details),
		archived: false,
		meeting: { details, next: emptyNextMeeting(), points: [] },
	};
	protocols = [protocol, ...protocols];
	return copy(protocol);
}

export function setProtocolArchived(
	projectId: string,
	id: string,
	archived: boolean,
): void {
	protocols = protocols.map((row) =>
		row.projectId === projectId && row.id === id ? { ...row, archived } : row,
	);
}

export function removeProtocol(projectId: string, id: string): void {
	const target = find(projectId, id);
	if (!target) return;
	protocols = protocols.filter((row) => row !== target);
	revokeUrls([target]);
}
