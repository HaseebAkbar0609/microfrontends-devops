import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { MOCK_PROTOCOLS } from "../data/protocol.mock";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type { ProtocolItem, CreateProtocolPayload } from "../types/protocol.types";

export const protocolsApi = {
	async getProtocols(orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID): Promise<ProtocolItem[]> {
		try {
			const res = await axiosInstance.get<ProtocolItem[]>(API_PATH.ORDERS.PROTOCOLS(orderId));
			if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
				return res.data;
			}
			return MOCK_PROTOCOLS;
		} catch (err) {
			console.warn("[protocolsApi.getProtocols] Falling back to mock data:", err);
			return MOCK_PROTOCOLS;
		}
	},

	async createProtocol(payload: CreateProtocolPayload): Promise<ProtocolItem> {
		const orderId = payload.orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
		try {
			const res = await axiosInstance.post<ProtocolItem>(API_PATH.ORDERS.PROTOCOLS(orderId), payload);
			if (res && res.data) return res.data;
		} catch (err) {
			console.warn("[protocolsApi.createProtocol] Simulating created protocol:", err);
		}

		const newProtocol: ProtocolItem = {
			id: `proto-${Date.now()}`,
			orderId,
			date: payload.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE,
			type: payload.type || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
			protocolName: payload.protocolName || `${payload.type} ${payload.date}`,
			documentName: payload.documentName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileType: PROTOCOL_CONSTANTS.DEFAULT_FILE_TYPE,
			status: "not_started",
			lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
			responsible: "Kalle Svensson",
			isArchived: false,
			notes: payload.notes || "",
		};

		return newProtocol;
	},

	async updateProtocol(
		id: string,
		payload: Partial<ProtocolItem>,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<ProtocolItem> {
		try {
			const res = await axiosInstance.put<ProtocolItem>(
				API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id),
				payload
			);
			if (res && res.data) return res.data;
		} catch (err) {
			console.warn("[protocolsApi.updateProtocol] Simulating update:", err);
		}

		return {
			id,
			orderId,
			date: payload.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE,
			type: payload.type || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
			documentName: payload.documentName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileType: payload.fileType || PROTOCOL_CONSTANTS.DEFAULT_FILE_TYPE,
			status: payload.status || "in_progress",
			lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
			...payload,
		};
	},

	async deleteProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<boolean> {
		try {
			await axiosInstance.delete(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			return true;
		} catch (err) {
			console.warn("[protocolsApi.deleteProtocol] Simulating deletion:", err);
			return true;
		}
	},
};
