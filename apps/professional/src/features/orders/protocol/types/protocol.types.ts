import type {
	ProtocolType,
	ProtocolTemplateType,
	ProtocolStatus,
} from "../constants/protocol.constants";

export interface ProtocolItem {
	id: string;
	orderId: string;
	projectNumber?: string;
	projectName?: string;
	date: string;
	type: ProtocolType | string;
	category?: string;
	address?: string;
	postalCode?: string;
	city?: string;
	participants?: string[];
	location?: string;
	startTime?: string;
	endTime?: string;
	protocolName?: string;
	documentName: string;
	fileUrl?: string;
	fileType: string;
	status: ProtocolStatus;
	lastUpdated?: string;
	responsible?: string;
	isArchived?: boolean;
	notes?: string;
}

export interface CreateProtocolPayload {
	orderId?: string;
	projectNumber?: string;
	projectName?: string;
	date: string;
	type: ProtocolType | string;
	category?: string;
	address?: string;
	postalCode?: string;
	city?: string;
	participants?: string[];
	location?: string;
	startTime?: string;
	endTime?: string;
	protocolName?: string;
	documentName?: string;
	templateType?: ProtocolTemplateType;
	responsible?: string;
	notes?: string;
	file?: File;
}

export interface ProtocolSummary {
	totalProtocols: number;
	completed: number;
	pending: number;
}

export interface ProtocolMeetingPoint {
	id: string;
	nr: string;
	subject: string;
	description?: string;
	decision?: string;
	responsible?: string;
	status?: "completed" | "in_progress" | "not_started" | string;
}

export interface ProtocolMeetingInfo {
	host?: string;
	startTime?: string;
	startDate?: string;
	endTime?: string;
	endDate?: string;
	topic?: string;
	protocolNumber?: string;
	participants?: string[];
	rubrik?: string;
	category?: string;
	location?: string;
	address?: string;
	postalCode?: string;
	city?: string;
	information?: string;
	comment?: string;
}

export interface ProtocolDetailData {
	protocol: ProtocolItem;
	meetingInfo: ProtocolMeetingInfo;
	nextMeeting?: ProtocolMeetingInfo;
	points: ProtocolMeetingPoint[];
}

export interface UpdateProtocolFullPayload {
	startDate?: string;
	startTime?: string;
	endDate?: string;
	endTime?: string;
	host?: string;
	participants?: string[];
	protocolNumber?: string;
	topic?: string;
	rubrik?: string;
	category?: string;
	location?: string;
	address?: string;
	postalCode?: string;
	city?: string;
	information?: string;
	comment?: string;
	nextMeeting?: ProtocolMeetingInfo;
}

export type ProtocolSortField = "date" | "type" | "documentName" | "status";
export type SortOrder = "asc" | "desc";
