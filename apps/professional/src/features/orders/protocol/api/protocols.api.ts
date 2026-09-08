import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { MOCK_PROTOCOLS, MOCK_MEETING_INFO, MOCK_NEXT_MEETING, MOCK_MEETING_POINTS } from "../data/protocol.mock";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type {
	ProtocolItem,
	CreateProtocolPayload,
	ProtocolDetailData,
} from "../types/protocol.types";

const isDev = process.env.NODE_ENV !== "production";

export const protocolsApi = {
	async getProtocols(orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID): Promise<ProtocolItem[]> {
		try {
			const res = await axiosInstance.get<ProtocolItem[]>(API_PATH.ORDERS.PROTOCOLS(orderId));
			if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
				return res.data;
			}
			return isDev ? MOCK_PROTOCOLS : [];
		} catch (err) {
			if (isDev) {
				console.info("[protocolsApi.getProtocols] Using mock data in dev mode.");
				return MOCK_PROTOCOLS;
			}
			throw err;
		}
	},

	async getProtocolDetail(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<ProtocolItem | null> {
		try {
			const res = await axiosInstance.get<ProtocolItem>(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			if (res && res.data) return res.data;
		} catch (_err) {
			if (isDev) {
				console.info("[protocolsApi.getProtocolDetail] Simulating get detail in dev mode.");
			}
		}
		const fallback = isDev ? MOCK_PROTOCOLS.find((p) => p.id === id) || null : null;
		return fallback;
	},

	async getProtocolFullDetail(
		id: string,
		orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID
	): Promise<ProtocolDetailData> {
		try {
			const res = await axiosInstance.get<ProtocolDetailData>(API_PATH.ORDERS.PROTOCOL_DETAIL(orderId, id));
			if (res && res.data && res.data.protocol) return res.data;
		} catch (err) {
			console.warn("[protocolsApi.getProtocolFullDetail] Simulating full detail:", err);
		}

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
			} catch (_uploadErr) {
				if (isDev) {
					console.info("[protocolsApi.createProtocol] File upload fallback in dev mode.");
				}
			}
		}

		try {
			const res = await axiosInstance.post<ProtocolItem>(API_PATH.ORDERS.PROTOCOLS(orderId), {
				...payload,
				fileUrl: uploadedUrl || undefined,
			});
			if (res && res.data) return res.data;
		} catch (err) {
			if (isDev) {
				console.info("[protocolsApi.createProtocol] Simulating created protocol in dev mode.");
			} else {
				throw err;
			}
		}

		const resolvedResponsible =
			payload.responsible?.trim() || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE;

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
			responsible: resolvedResponsible,
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
			if (isDev) {
				console.info("[protocolsApi.updateProtocol] Simulating update in dev mode.");
			} else {
				throw err;
			}
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
			if (isDev) {
				console.info("[protocolsApi.deleteProtocol] Simulating deletion in dev mode.");
				return true;
			}
			throw err;
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
			if (isDev) {
				console.info("[protocolsApi.archiveProtocol] Falling back in dev mode.");
				return true;
			}
			throw err;
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
		} catch (_err) {
			if (isDev) {
				console.info("[protocolsApi.downloadProtocol] API download endpoint fallback to client generator in dev mode.");
			}
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
		} catch (_err) {
			if (isDev) {
				console.info("[protocolsApi.downloadAllProtocols] API bulk download endpoint fallback to client generator in dev mode.");
			}
		}
		return null;
	},
};
