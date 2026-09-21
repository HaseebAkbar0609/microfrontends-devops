import { mockDate } from "../../../constants/mockData";
import type { ProjectProtocol, ProtocolMeeting } from "../types";
import { MEETING_5001_SELF_CHECK, MEETING_5001_SITE_MEETING } from "./projectProtocolMeetings.mock";

/** A Standard row reads its day, Typ and Benämning from its meeting, as the store keeps them. */
const standard = (id: string, projectId: string, meeting: ProtocolMeeting, extra: Partial<ProjectProtocol> = {}): ProjectProtocol => ({
	id,
	projectId,
	kind: "standard",
	date: meeting.details.startDate,
	type: meeting.details.type,
	name: meeting.details.title,
	archived: false,
	meeting,
	...extra,
});

/**
 * Each project's protocols.
 *
 * 5001 carries the frame's Byggmöte rows plus a Skyddsrond, two Standard
 * meetings — one with its Nästa möte planned and sent, one without — and one
 * archived row so Filter → Arkiverade has something to show. 5000 has two;
 * 5002 none, for the empty state. The frame's "filename.pdf" and 2025-09-01 are placeholder copy; these
 * count days from `mockDate`, which is deterministic — never `new Date()` in a
 * mock. Seeded files have no stored URL, so they cannot be opened.
 */
export const SEEDED_PROJECT_PROTOCOLS: ProjectProtocol[] = [
	{
		id: "protocol-5001-1",
		projectId: "5001",
		kind: "upload",
		date: mockDate(-7),
		type: "byggmote",
		name: "Byggmöte 4",
		fileName: "Byggmöte 4.pdf",
		archived: false,
	},
	standard("protocol-5001-2", "5001", MEETING_5001_SELF_CHECK),
	standard("protocol-5001-7", "5001", MEETING_5001_SITE_MEETING, { sentAt: mockDate(-1) }),
	{
		id: "protocol-5001-3",
		projectId: "5001",
		kind: "upload",
		date: mockDate(-14),
		type: "skyddsrond",
		name: "Skyddsrond vecka 28",
		fileName: "Skyddsrond v28.pdf",
		archived: false,
	},
	{
		id: "protocol-5001-4",
		projectId: "5001",
		kind: "upload",
		date: mockDate(-21),
		type: "byggmote",
		name: "Byggmöte 3",
		fileName: "Byggmöte 3.pdf",
		archived: false,
	},
	{
		id: "protocol-5001-5",
		projectId: "5001",
		kind: "upload",
		date: mockDate(-35),
		type: "byggmote",
		name: "Byggmöte 2",
		fileName: "Byggmöte 2.pdf",
		archived: false,
	},
	{
		id: "protocol-5001-6",
		projectId: "5001",
		kind: "upload",
		date: mockDate(-49),
		type: "byggmote",
		name: "Byggmöte 1",
		fileName: "Byggmöte 1.pdf",
		archived: true,
	},
	{
		id: "protocol-5000-1",
		projectId: "5000",
		kind: "upload",
		date: mockDate(-10),
		type: "byggmote",
		name: "Byggmöte 1",
		fileName: "Byggmöte 1.pdf",
		archived: false,
	},
	{
		id: "protocol-5000-2",
		projectId: "5000",
		kind: "action",
		date: mockDate(-4),
		type: "kvalitetskontroll",
		name: "Kvalitetskontroll stomme",
		archived: false,
	},
];
