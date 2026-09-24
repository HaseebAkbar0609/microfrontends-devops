import { mockDate } from "../../../project/constants/mockData";
import type { ProjectProtocol } from "../../../project/production/protokoll/types";

export const SEEDED_DESIGN_PROTOCOLS: ProjectProtocol[] = [
	{
		id: "dprotocol-6001-1",
		projectId: "6001",
		kind: "upload",
		date: mockDate(-7),
		type: "byggmote",
		name: "Byggmöte 3",
		fileName: "Byggmöte 3.pdf",
		archived: false,
	},
	{
		id: "dprotocol-6001-2",
		projectId: "6001",
		kind: "upload",
		date: mockDate(-21),
		type: "byggmote",
		name: "Byggmöte 2",
		fileName: "Byggmöte 2.pdf",
		archived: false,
	},
	{
		id: "dprotocol-6001-3",
		projectId: "6001",
		kind: "upload",
		date: mockDate(-35),
		type: "byggmote",
		name: "Byggmöte 1",
		fileName: "Byggmöte 1.pdf",
		archived: false,
	},
];
