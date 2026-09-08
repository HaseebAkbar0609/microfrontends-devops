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

	async getProtocolDetail(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<ProtocolItem | null> {
		try {
			const res = await axiosInstance.get<ProtocolItem>(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			if (res && res.data) return res.data;
		} catch (err) {
			console.warn("[protocolsApi.getProtocolDetail] Simulating get detail:", err);
		}
		const fallback = MOCK_PROTOCOLS.find((p) => p.id === id) || null;
		return fallback;
	},

	async createProtocol(payload: CreateProtocolPayload): Promise<ProtocolItem> {
		const orderId = payload.orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
		let uploadedUrl: string | undefined;

		// Handle file upload if a real File is attached
		if (payload.file) {
			try {
				const formData = new FormData();
				formData.append("file", payload.file);
				const uploadRes = await axiosInstance.post<{ url: string }>(API_PATH.ORDERS.UPLOAD_FILE, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				if (uploadRes && uploadRes.data && uploadRes.data.url) {
					uploadedUrl = uploadRes.data.url;
				}
			} catch (uploadErr) {
				console.warn("[protocolsApi.createProtocol] File upload error fallback:", uploadErr);
			}
		}

		try {
			const res = await axiosInstance.post<ProtocolItem>(API_PATH.ORDERS.PROTOCOLS(orderId), {
				...payload,
				fileUrl: uploadedUrl || undefined,
			});
			if (res && res.data) return res.data;
		} catch (err) {
			console.warn("[protocolsApi.createProtocol] Simulating created protocol:", err);
		}

		const newProtocol: ProtocolItem = {
			id: `proto-${Date.now()}`,
			orderId,
			projectNumber: payload.projectNumber || PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER,
			projectName: payload.projectName || PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME,
			date: payload.date || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE,
			type: payload.type || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
			category: payload.category || PROTOCOL_CONSTANTS.DEFAULT_CATEGORY,
			address: payload.address || "",
			postalCode: payload.postalCode || "-",
			city: payload.city || "-",
			participants: payload.participants || [...PROTOCOL_CONSTANTS.DEFAULT_PARTICIPANTS],
			location: payload.location || PROTOCOL_CONSTANTS.DEFAULT_LOCATION,
			startTime: payload.startTime || PROTOCOL_CONSTANTS.DEFAULT_START_TIME,
			endTime: payload.endTime || PROTOCOL_CONSTANTS.DEFAULT_END_TIME,
			protocolName: payload.protocolName || `${payload.type} ${payload.date}`,
			documentName: payload.documentName || payload.file?.name || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileUrl: uploadedUrl,
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

	async archiveProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<boolean> {
		try {
			await axiosInstance.post(API_PATH.ORDERS.PROTOCOL_ARCHIVE(orderId, id));
			return true;
		} catch (err) {
			console.warn("[protocolsApi.archiveProtocol] Falling back to updateProtocol:", err);
			try {
				await axiosInstance.put(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id), { isArchived: true });
			} catch {
				// Simulated success fallback
			}
			return true;
		}
	},

	async downloadProtocol(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<Blob | null> {
		try {
			const res = await axiosInstance.get(API_PATH.ORDERS.PROTOCOL_DOWNLOAD(orderId, id), {
				responseType: "blob",
			});
			if (res && res.data) {
				return res.data as Blob;
			}
		} catch (err) {
			console.warn("[protocolsApi.downloadProtocol] API download endpoint fallback to client generator:", err);
		}
		return null;
	},

	async downloadAllProtocols(
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<Blob | null> {
		try {
			const res = await axiosInstance.get(API_PATH.ORDERS.PROTOCOLS_DOWNLOAD_ALL(orderId), {
				responseType: "blob",
			});
			if (res && res.data) {
				return res.data as Blob;
			}
		} catch (err) {
			console.warn("[protocolsApi.downloadAllProtocols] API bulk download endpoint fallback to client generator:", err);
		}
		return null;
	},
};
