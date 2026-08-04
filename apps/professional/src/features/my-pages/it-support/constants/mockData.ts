import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export type ItTicketStatus = "notSent" | "done" | "ongoing";

export interface ItTicket {
	id: string;
	date: string;
	name: string;
	status: ItTicketStatus;
	description: string;
	files: string[];
}

export const IT_TICKET_STATUS_KEY: Record<ItTicketStatus, string> = {
	notSent: localizationConstants.itSupportStatusNotSent,
	done: localizationConstants.itSupportStatusDone,
	ongoing: localizationConstants.itSupportStatusOngoing,
};

const TICKET_DESCRIPTION =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const ticketDefaults = {
	description: TICKET_DESCRIPTION,
	files: ["Document 1.pdf", "Document 2.pdf"],
};

export const IT_TICKETS: ItTicket[] = [
	{
		id: "t-1",
		date: mockDate(-596),
		name: "Systemfel",
		status: "notSent",
		...ticketDefaults,
	},
	{
		id: "t-2",
		date: mockDate(-602),
		name: "Systemfel",
		status: "done",
		...ticketDefaults,
	},
	{
		id: "t-3",
		date: mockDate(-601),
		name: "Kärm dåligt...",
		status: "ongoing",
		...ticketDefaults,
	},
	{
		id: "t-4",
		date: mockDate(-601),
		name: "Kärm dåligt...",
		status: "done",
		...ticketDefaults,
	},
	{
		id: "t-5",
		date: mockDate(-601),
		name: "Kärm dåligt...",
		status: "ongoing",
		...ticketDefaults,
	},
	{
		id: "t-6",
		date: mockDate(-601),
		name: "Kärm dåligt...",
		status: "done",
		...ticketDefaults,
	},
];
