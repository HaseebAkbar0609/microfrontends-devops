import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { MOCK_PROTOCOLS, MOCK_MEETING_INFO, MOCK_NEXT_MEETING, MOCK_MEETING_POINTS } from "../data/protocol.mock";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type {
	ProtocolItem,
	CreateProtocolPayload,
	ProtocolDetailData,
	ProtocolMeetingPoint,
} from "../types/protocol.types";

function buildMockFullDetail(id: string, orderId: string): ProtocolDetailData {
	const protocol = MOCK_PROTOCOLS.find((p) => p.id === id) || {
		id,
		orderId,
		date: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE,
		type: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
		protocolName: "Byggmöte Vecka 36",
		documentName: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
		fileType: PROTOCOL_CONSTANTS.DEFAULT_FILE_TYPE,
		status: "completed" as const,
		lastUpdated: "2025-09-01 14:30",
		responsible: "Kalle Svensson",
		isArchived: false,
		notes: "Genomgång av framdrift och tidsplan för vecka 36.",
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

export const protocolsApi = {
	async getProtocols(orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID): Promise<ProtocolItem[]> {
		try {
			const res = await axiosInstance.get<ProtocolItem[]>(API_PATH.ORDERS.PROTOCOLS(orderId));
			if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
				return res.data;
			}
			return MOCK_PROTOCOLS;
		} catch (error) {
			console.warn(
				"[protocolsApi.getProtocols] Request failed, using mock data fallback:",
				error instanceof Error ? error.message : error,
			);
			return MOCK_PROTOCOLS;
		}
	},

	async getProtocolDetail(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolItem | null> {
		try {
			const res = await axiosInstance.get<ProtocolItem>(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			if (res?.data) return res.data;
		} catch (error) {
			console.warn(
				"[protocolsApi.getProtocolDetail] Request failed, using mock data fallback:",
				error instanceof Error ? error.message : error,
			);
		}
		return MOCK_PROTOCOLS.find((p) => p.id === id) || null;
	},

	async getProtocolFullDetail(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolDetailData> {
		try {
			const res = await axiosInstance.get<ProtocolDetailData>(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			if (res?.data && res.data.protocol) return res.data;
		} catch (error) {
			console.warn(
				"[protocolsApi.getProtocolFullDetail] Request failed, using mock data fallback:",
				error instanceof Error ? error.message : error,
			);
		}
		return buildMockFullDetail(id, orderId);
	},

	async createProtocol(payload: CreateProtocolPayload): Promise<ProtocolItem> {
		const orderId = payload.orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;

		let uploadedUrl: string | undefined;
		if (payload.file) {
			const formData = new FormData();
			formData.append("file", payload.file);
			const uploadRes = await axiosInstance.post<{ url: string }>(API_PATH.ORDERS.UPLOAD_FILE, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (uploadRes?.data?.url) {
				uploadedUrl = uploadRes.data.url;
			}
		}

		const res = await axiosInstance.post<ProtocolItem>(API_PATH.ORDERS.PROTOCOLS(orderId), {
			...payload,
			fileUrl: uploadedUrl || undefined,
		});
		return res.data;
	},

	async updateProtocol(
		id: string,
		payload: Partial<ProtocolItem>,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolItem> {
		const res = await axiosInstance.put<ProtocolItem>(
			API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id),
			payload,
		);
		return res.data;
	},

	async updateProtocolFull(
		id: string,
		payload: import("../types/protocol.types").UpdateProtocolFullPayload,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolDetailData> {
		const res = await axiosInstance.put<ProtocolDetailData>(
			API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id),
			payload,
		);
		return res.data;
	},

	async deleteProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<boolean> {
		await axiosInstance.delete(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
		return true;
	},

	async archiveProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<boolean> {
		await axiosInstance.post(API_PATH.ORDERS.PROTOCOL_ARCHIVE(orderId, id));
		return true;
	},

	async downloadProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<Blob | null> {
		try {
			const res = await axiosInstance.get(API_PATH.ORDERS.PROTOCOL_DOWNLOAD(orderId, id), {
				responseType: "blob",
			});
			if (res?.data) return res.data as Blob;
		} catch (error) {
			console.warn(
				"[protocolsApi.downloadProtocol] Request failed:",
				error instanceof Error ? error.message : error,
			);
		}
		return null;
	},

	async downloadAllProtocols(
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<Blob | null> {
		try {
			const res = await axiosInstance.get(API_PATH.ORDERS.PROTOCOLS_DOWNLOAD_ALL(orderId), {
				responseType: "blob",
			});
			if (res?.data) return res.data as Blob;
		} catch (error) {
			console.warn(
				"[protocolsApi.downloadAllProtocols] Request failed:",
				error instanceof Error ? error.message : error,
			);
		}
		return null;
	},

	async createPoint(
		protocolId: string,
		point: Omit<ProtocolMeetingPoint, "id">,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolMeetingPoint> {
		const res = await axiosInstance.post<ProtocolMeetingPoint>(
			API_PATH.ORDERS.PROTOCOL_POINTS(orderId, protocolId),
			point,
		);
		return res.data;
	},

	async updatePoint(
		protocolId: string,
		pointId: string,
		payload: Partial<ProtocolMeetingPoint>,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolMeetingPoint> {
		const res = await axiosInstance.put<ProtocolMeetingPoint>(
			API_PATH.ORDERS.PROTOCOL_POINT_DETAIL(orderId, protocolId, pointId),
			payload,
		);
		return res.data;
	},

	async deletePoint(
		protocolId: string,
		pointId: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<boolean> {
		await axiosInstance.delete(
			API_PATH.ORDERS.PROTOCOL_POINT_DETAIL(orderId, protocolId, pointId),
		);
		return true;
	},

	async updatePointStatus(
		protocolId: string,
		pointId: string,
		status: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	): Promise<ProtocolMeetingPoint> {
		const res = await axiosInstance.patch<ProtocolMeetingPoint>(
			API_PATH.ORDERS.PROTOCOL_POINT_STATUS(orderId, protocolId, pointId),
			{ status },
		);
		return res.data;
	},
};
