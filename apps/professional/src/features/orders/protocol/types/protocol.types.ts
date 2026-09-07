import type {
	ProtocolType,
	ProtocolTemplateType,
	ProtocolStatus,
} from "../constants/protocol.constants";

export interface ProtocolItem {
	id: string;
	orderId: string;
	date: string;
	type: ProtocolType | string;
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
	date: string;
	type: ProtocolType | string;
	protocolName?: string;
	documentName?: string;
	templateType?: ProtocolTemplateType;
	notes?: string;
	file?: File;
}

export interface ProtocolSummary {
	totalProtocols: number;
	completed: number;
	pending: number;
}

export type ProtocolSortField = "date" | "type" | "documentName" | "status";
export type SortOrder = "asc" | "desc";
