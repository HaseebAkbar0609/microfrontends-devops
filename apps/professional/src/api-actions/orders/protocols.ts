import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type {
	ProtocolItem,
	ProtocolDetailData,
	ProtocolMeetingPoint,
	CreateProtocolPayload,
} from "@/features/orders/protocol/types/protocol.types";
import {
	MOCK_PROTOCOLS,
	MOCK_MEETING_INFO,
	MOCK_NEXT_MEETING,
	MOCK_MEETING_POINTS,
} from "@/features/orders/protocol/data/protocol.mock";

const ORDERS_BASE_PATH = "/professionals/orders";

/* -------------------------------------------------------------------------- */
/* Zod Schemas                                                                */
/* -------------------------------------------------------------------------- */
export const protocolItemSchema = z.object({
	id: z.string(),
	orderId: z.string().default(""),
	projectNumber: z.string().optional(),
	projectName: z.string().optional(),
	date: z.string().default(""),
	type: z.string().default(""),
	templateType: z.enum(["standard", "action", "upload"]).optional(),
	category: z.string().optional(),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	participants: z.array(z.string()).optional(),
	location: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	protocolName: z.string().optional(),
	documentName: z.string().default(""),
	fileUrl: z.string().optional(),
	fileType: z.string().default("pdf"),
	status: z.enum(["not_started", "in_progress", "completed"]).default("not_started"),
	lastUpdated: z.string().optional(),
	responsible: z.string().optional(),
	isArchived: z.boolean().optional(),
	notes: z.string().optional(),
});

export const protocolMeetingInfoSchema = z.object({
	host: z.string().optional(),
	startTime: z.string().optional(),
	startDate: z.string().optional(),
	endTime: z.string().optional(),
	endDate: z.string().optional(),
	topic: z.string().optional(),
	protocolNumber: z.string().optional(),
	participants: z.array(z.string()).optional(),
	rubrik: z.string().optional(),
	category: z.string().optional(),
	location: z.string().optional(),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	information: z.string().optional(),
	comment: z.string().optional(),
});

export const protocolMeetingPointSchema = z.object({
	id: z.string(),
	nr: z.string().default(""),
	subject: z.string().default(""),
	description: z.string().optional(),
	decision: z.string().optional(),
	responsible: z.string().optional(),
	status: z.string().optional(),
});

export const protocolDetailSchema = z.object({
	protocol: protocolItemSchema,
	meetingInfo: protocolMeetingInfoSchema,
	nextMeeting: protocolMeetingInfoSchema.optional(),
	points: z.array(protocolMeetingPointSchema).default([]),
});

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function buildMockFullDetail(id: string, orderId: string): ProtocolDetailData {
	const protocol = MOCK_PROTOCOLS.find((p) => p.id === id) || {
		id,
		orderId,
		date: "",
		type: "",
		protocolName: "",
		documentName: "",
		fileType: "pdf",
		status: "not_started" as const,
		lastUpdated: "",
		responsible: "",
		isArchived: false,
		notes: "",
	};

	return {
		protocol,
		meetingInfo: {
			...MOCK_MEETING_INFO,
			host: protocol.responsible || MOCK_MEETING_INFO.host,
			startDate: protocol.date || MOCK_MEETING_INFO.startDate,
			endDate: protocol.date || MOCK_MEETING_INFO.endDate,
			rubrik: protocol.protocolName || MOCK_MEETING_INFO.rubrik,
			category: protocol.category || MOCK_MEETING_INFO.category,
			location: protocol.location || MOCK_MEETING_INFO.location,
			address: protocol.address || MOCK_MEETING_INFO.address,
			postalCode: protocol.postalCode || MOCK_MEETING_INFO.postalCode,
			city: protocol.city || MOCK_MEETING_INFO.city,
			information: protocol.notes || MOCK_MEETING_INFO.information,
		},
		nextMeeting: MOCK_NEXT_MEETING,
		points: [...MOCK_MEETING_POINTS],
	};
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProtocolsAction(
	orderId: string
): Promise<ActionResult<ProtocolItem[]>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = z.array(protocolItemSchema).safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return { success: true, data: MOCK_PROTOCOLS, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: MOCK_PROTOCOLS,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getProtocolDetailAction(
	orderId: string,
	protocolId: string
): Promise<ActionResult<ProtocolItem | null>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = protocolItemSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		const fallback = MOCK_PROTOCOLS.find((p) => p.id === protocolId) || null;
		return { success: true, data: fallback, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallback = MOCK_PROTOCOLS.find((p) => p.id === protocolId) || null;
		return {
			success: true,
			data: fallback,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getProtocolFullDetailAction(
	orderId: string,
	protocolId: string
): Promise<ActionResult<ProtocolDetailData>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = protocolDetailSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return {
			success: true,
			data: buildMockFullDetail(protocolId, orderId),
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: buildMockFullDetail(protocolId, orderId),
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function createProtocolAction(
	orderId: string,
	payload: CreateProtocolPayload
): Promise<ActionResult<ProtocolItem>> {
	try {
		const res = await axiosInstance.post<ApiResponse<ProtocolItem>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols`,
			payload
		);
		const data = res.data?.data || (res.data as unknown as ProtocolItem);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallback: ProtocolItem = {
			id: `proto-${Date.now()}`,
			orderId,
			date: payload.date || "",
			type: payload.type || "",
			templateType: payload.templateType,
			documentName: payload.documentName || payload.file?.name || "",
			fileType: "pdf",
			status: "not_started",
			lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
			responsible: payload.responsible || "",
			isArchived: false,
			notes: payload.notes || "",
			projectNumber: payload.projectNumber,
			projectName: payload.projectName,
			category: payload.category,
			address: payload.address,
			postalCode: payload.postalCode,
			city: payload.city,
			participants: payload.participants,
			location: payload.location,
			startTime: payload.startTime,
			endTime: payload.endTime,
			protocolName: payload.protocolName,
		};
		return { success: true, data: fallback, error: apiError.response?.data?.message || null };
	}
}

export async function updateProtocolAction(
	orderId: string,
	protocolId: string,
	payload: Partial<ProtocolItem>
): Promise<ActionResult<ProtocolItem>> {
	try {
		const res = await axiosInstance.put<ApiResponse<ProtocolItem>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}`,
			payload
		);
		const data = res.data?.data || (res.data as unknown as ProtocolItem);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: { id: protocolId, orderId, documentName: "", fileType: "pdf", status: "not_started", ...payload } as ProtocolItem,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function updateProtocolFullAction(
	orderId: string,
	protocolId: string,
	payload: import("@/features/orders/protocol/types/protocol.types").UpdateProtocolFullPayload
): Promise<ActionResult<ProtocolDetailData>> {
	try {
		const res = await axiosInstance.put<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}`,
			payload
		);
		const raw = res.data?.data ?? res.data;
		const parsed = protocolDetailSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return {
			success: true,
			data: buildMockFullDetail(protocolId, orderId),
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: buildMockFullDetail(protocolId, orderId),
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function deleteProtocolAction(
	orderId: string,
	protocolId: string
): Promise<ActionResult<{ success: boolean }>> {
	try {
		await axiosInstance.delete(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}`
		);
		return { success: true, data: { success: true }, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: { success: true }, error: apiError.response?.data?.message || null };
	}
}

export async function archiveProtocolAction(
	orderId: string,
	protocolId: string
): Promise<ActionResult<{ success: boolean }>> {
	try {
		await axiosInstance.post(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/archive`
		);
		return { success: true, data: { success: true }, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: { success: true }, error: apiError.response?.data?.message || null };
	}
}

export async function downloadProtocolAction(
	orderId: string,
	protocolId: string
): Promise<ActionResult<Blob | null>> {
	try {
		const res = await axiosInstance.get(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/download`,
			{ responseType: "blob" }
		);
		if (res?.data) {
			return { success: true, data: res.data as Blob, error: null };
		}
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: null, error: apiError.response?.data?.message || null };
	}
}

export async function downloadAllProtocolsAction(
	orderId: string
): Promise<ActionResult<Blob | null>> {
	try {
		const res = await axiosInstance.get(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/download-all`,
			{ responseType: "blob" }
		);
		if (res?.data) {
			return { success: true, data: res.data as Blob, error: null };
		}
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: null, error: apiError.response?.data?.message || null };
	}
}

export async function createPointAction(
	orderId: string,
	protocolId: string,
	point: Omit<ProtocolMeetingPoint, "id">
): Promise<ActionResult<ProtocolMeetingPoint>> {
	try {
		const res = await axiosInstance.post<ApiResponse<ProtocolMeetingPoint>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/points`,
			point
		);
		const data = res.data?.data || (res.data as unknown as ProtocolMeetingPoint);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: { ...point, id: `point-${Date.now()}` },
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function updatePointAction(
	orderId: string,
	protocolId: string,
	pointId: string,
	payload: Partial<ProtocolMeetingPoint>
): Promise<ActionResult<ProtocolMeetingPoint>> {
	try {
		const res = await axiosInstance.put<ApiResponse<ProtocolMeetingPoint>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/points/${pointId}`,
			payload
		);
		const data = res.data?.data || (res.data as unknown as ProtocolMeetingPoint);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: { id: pointId, nr: "", subject: "", ...payload },
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function deletePointAction(
	orderId: string,
	protocolId: string,
	pointId: string
): Promise<ActionResult<{ success: boolean }>> {
	try {
		await axiosInstance.delete(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/points/${pointId}`
		);
		return { success: true, data: { success: true }, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: { success: true }, error: apiError.response?.data?.message || null };
	}
}

export async function updatePointStatusAction(
	orderId: string,
	protocolId: string,
	pointId: string,
	status: string
): Promise<ActionResult<ProtocolMeetingPoint>> {
	try {
		const res = await axiosInstance.patch<ApiResponse<ProtocolMeetingPoint>>(
			`${ORDERS_BASE_PATH}/${orderId}/protocols/${protocolId}/points/${pointId}/status`,
			{ status }
		);
		const data = res.data?.data || (res.data as unknown as ProtocolMeetingPoint);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: { id: pointId, nr: "", subject: "", status },
			error: apiError.response?.data?.message || null,
		};
	}
}
