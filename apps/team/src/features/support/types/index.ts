import type { TranslationKeys } from "@/utils/translation/constants";

/** How the customer reached support. */
export type SupportChannel = "phone" | "email" | "chat";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketStatus =
	| "new"
	| "inProgress"
	| "waiting"
	| "escalated"
	| "resolved";

/** First line handles local support; second line is the global technical team. */
export type SupportLine = "first" | "second";

export type SupportCustomerType = "private" | "professional";

export type TicketActionType =
	| "comment"
	| "status"
	| "escalation"
	| "assignment";

/** One entry in a ticket's action log. */
export type TicketAction = {
	id: string;
	at: string;
	/** Agent id, or null when the entry was written by the system. */
	authorId: string | null;
	/** Free text for a comment; empty when the entry is generated. */
	text: string;
	/** Set on generated entries so the log can be localized. */
	messageKey?: TranslationKeys;
	/** Value interpolated into `messageKey`, already localized where needed. */
	messageValue?: string;
	type: TicketActionType;
};

export type SupportTicket = {
	id: string;
	subject: string;
	customer: string;
	customerType: SupportCustomerType;
	channel: SupportChannel;
	priority: TicketPriority;
	status: TicketStatus;
	line: SupportLine;
	country: string;
	/** Agent id rather than a name, so a rename cannot orphan the ticket. */
	assigneeId: string | null;
	createdAt: string;
	/** Negative once the SLA has been breached. */
	slaMinutesLeft: number;
	/** Private customer id or professional company id when picked from the register. */
	customerId: string | null;
	description: string;
	actions: TicketAction[];
};

export type SupportAgent = {
	id: string;
	name: string;
	country: string;
	line: SupportLine;
	online: boolean;
	activeTickets: number;
	roleKey: TranslationKeys;
};

/** One bucket in the volume chart, counted per channel. */
export type VolumePoint = {
	label: string;
	phone: number;
	email: number;
	chat: number;
};

export type VolumeRange = "day" | "week" | "month";

export type CountryLoad = {
	country: string;
	open: number;
	agents: number;
};

/** Draft accepted by the create-ticket form. */
export type SupportTicketDraft = Pick<
	SupportTicket,
	| "subject"
	| "customer"
	| "customerType"
	| "channel"
	| "priority"
	| "line"
	| "country"
	| "assigneeId"
	| "customerId"
	| "description"
>;

export type TicketLineFilter = SupportLine | "all" | "escalated";
export type TicketChannelFilter = SupportChannel | "all";
export type AgentLineFilter = SupportLine | "all";
