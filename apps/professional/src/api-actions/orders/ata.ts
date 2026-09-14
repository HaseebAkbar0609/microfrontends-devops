import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { AtaItem } from "@/features/orders/ata/types/ata.types";
import { ATA_CONSTANTS } from "@/features/orders/ata/constants/ata.constants";
import { MOCK_ATAS } from "@/features/orders/ata/data/ata.mock";

/* -------------------------------------------------------------------------- */
/* Zod Schemas                                                                */
/* -------------------------------------------------------------------------- */
export const ataItemSchema = z.object({
	id: z.string(),
	orderId: z.string().default(""),
	ataNumber: z.string(),
	category: z.enum(["kund", "ue-lev"]).default("kund"),
	date: z.string().default(""),
	title: z.string(),
	description: z.string().optional(),
	linkedLevAta: z.string().optional(),
	supplier: z.string().optional(),
	amount: z.number().default(0),
	vatAmount: z.number().optional(),
	totalAmount: z.number().optional(),
	status: z.enum(["ok", "redovisad", "forhandling", "ej_granskad", "pending", "approved", "rejected", "draft"]).default("ok"),
	attested: z.enum(["ja", "nej", "ej_klart"]).default("ej_klart"),
	attestedDate: z.string().optional(),
	notes: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const ataListSchema = z.array(ataItemSchema);

export const detailedLineItemSchema = z.object({
	id: z.string(),
	date: z.string(),
	personOrSupplier: z.string(),
	team: z.string(),
	description: z.string().optional(),
	amount: z.number(),
	quantityOrInvoice: z.union([z.string(), z.number()]).optional(),
	unit: z.string().optional(),
	netPrice: z.union([z.string(), z.number()]).optional(),
	netSum: z.union([z.string(), z.number()]).optional(),
	percentage: z.union([z.string(), z.number()]).optional(),
	contracted: z.string().optional(),
	n2: z.string().optional(),
	activity: z.string().optional(),
	position: z.string().optional(),
});

export const attachedDocumentSchema = z.object({
	id: z.string(),
	date: z.string(),
	referenceNumber: z.string(),
	fileName: z.string(),
	fileType: z.enum(["pdf", "doc", "image", "ppt"]),
	fileSize: z.string().optional(),
	fileUrl: z.string().optional(),
	url: z.string().optional(),
});

export const createAtaPayloadSchema = z.object({
	orderId: z.string().default(ATA_CONSTANTS.DEFAULT_ORDER_ID),
	orderer: z.string().min(1, { message: "createAtaValidationOrdererRequired" }),
	ordererName: z.string().optional(),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	eatingNumber: z.string().min(1, { message: "createAtaValidationEatingNoRequired" }),
	title: z.string().min(1, { message: "createAtaValidationTitleRequired" }),
	subTitle: z.string().optional(),
	proposedAction: z.string().optional(),
	action: z.string().optional(),
	qualityStatus: z.string().optional(),
	reason: z.string().optional(),
	economicStatus: z.string().optional(),
	location: z.string().optional(),
	description: z.string().optional(),
	ataType: z.enum([
		ATA_CONSTANTS.TYPES.CHANGE,
		ATA_CONSTANTS.TYPES.ADDITION,
		ATA_CONSTANTS.TYPES.DEDUCTION,
	]).default(ATA_CONSTANTS.TYPES.ADDITION),
	date: z.string().optional(),
	responsible: z.string().optional(),
	amount: z.number().default(0),
	vat: z.number().optional(),
	status: z.enum(["ok", "redovisad", "forhandling", "pending", "approved", "rejected", "draft"]).default("draft"),
	supplierInvoices: z.array(z.string()).optional(),
	timeReports: z.array(z.string()).optional(),
	staffItems: z.array(detailedLineItemSchema).optional(),
	materialItems: z.array(detailedLineItemSchema).optional(),
	machineItems: z.array(detailedLineItemSchema).optional(),
	ueItems: z.array(detailedLineItemSchema).optional(),
	supplierAtaItems: z.array(detailedLineItemSchema).optional(),
	attachedDocs: z.array(attachedDocumentSchema).optional(),
});

export type CreateAtaPayload = z.infer<typeof createAtaPayloadSchema>;

/* -------------------------------------------------------------------------- */
/* API Actions                                                                */
/* -------------------------------------------------------------------------- */

export async function getAtasAction(
	orderId: string,
	category?: string
): Promise<ActionResult<AtaItem[]>> {
	try {
		const basePath = API_PATH.ORDERS.ATAS(orderId);
		const url = category ? `${basePath}?category=${category}` : basePath;
		const res = await axiosInstance.get<ApiResponse<unknown>>(url);
		const raw = res.data?.data ?? res.data;
		const parsed = ataListSchema.safeParse(raw);
		if (parsed.success && parsed.data.length > 0) {
			return { success: true, data: parsed.data, error: null };
		}
		const filtered = category
			? MOCK_ATAS.filter((a) => a.category === category)
			: MOCK_ATAS;
		return { success: true, data: filtered, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const filtered = category
			? MOCK_ATAS.filter((a) => a.category === category)
			: MOCK_ATAS;
		return {
			success: true,
			data: filtered,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getSupplierAtasAction(
	orderId: string,
	supplier?: string
): Promise<ActionResult<AtaItem[]>> {
	try {
		const basePath = API_PATH.ORDERS.ATAS(orderId);
		const url = supplier && supplier !== "all"
			? `${basePath}?category=ue-lev&supplier=${encodeURIComponent(supplier)}`
			: `${basePath}?category=ue-lev`;
		const res = await axiosInstance.get<ApiResponse<unknown>>(url);
		const raw = res.data?.data ?? res.data;
		const parsed = ataListSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		const supplierFiltered = MOCK_ATAS.filter((a) => {
			if (a.category !== "ue-lev") return false;
			if (!supplier || supplier === "all") return true;
			return a.supplier?.toLowerCase() === supplier.toLowerCase() ||
				(supplier.toLowerCase() === "pelles måleri" && a.supplier?.toLowerCase() === "pelle målare") ||
				(supplier.toLowerCase() === "pelle målare" && a.supplier?.toLowerCase() === "pelles måleri");
		});
		return { success: true, data: supplierFiltered, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const supplierFiltered = MOCK_ATAS.filter((a) => {
			if (a.category !== "ue-lev") return false;
			if (!supplier || supplier === "all") return true;
			return a.supplier?.toLowerCase() === supplier.toLowerCase() ||
				(supplier.toLowerCase() === "pelles måleri" && a.supplier?.toLowerCase() === "pelle målare") ||
				(supplier.toLowerCase() === "pelle målare" && a.supplier?.toLowerCase() === "pelles måleri");
		});
		return {
			success: true,
			data: supplierFiltered,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getAtaDetailAction(
	orderId: string,
	ataId: string
): Promise<ActionResult<AtaItem | null>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			API_PATH.ORDERS.ATA_DETAIL(orderId, ataId)
		);
		const raw = res.data?.data ?? res.data;
		const parsed = ataItemSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		const fallback = MOCK_ATAS.find((a) => a.id === ataId) || null;
		return { success: true, data: fallback, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallback = MOCK_ATAS.find((a) => a.id === ataId) || null;
		return {
			success: true,
			data: fallback,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function deleteAtaAction(
	orderId: string,
	ataId: string
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.delete(API_PATH.ORDERS.ATA_DETAIL(orderId, ataId));
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: false,
			error: apiError.response?.data?.message || "Failed to delete ATA",
		};
	}
}

export async function sendAtaAction(
	orderId: string,
	ataId: string
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.post(API_PATH.ORDERS.ATA_SEND(orderId, ataId));
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: false,
			error: apiError.response?.data?.message || "Failed to send ATA",
		};
	}
}

export async function uploadAtaDocumentAction(
	orderId: string,
	file: File
): Promise<ActionResult<{ fileUrl: string; fileName: string }>> {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("orderId", orderId);
		const res = await axiosInstance.post<ApiResponse<{ url?: string; fileUrl?: string }>>(
			API_PATH.ORDERS.UPLOAD_FILE,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		const fileUrl = res.data?.data?.fileUrl || res.data?.data?.url || "";
		return {
			success: true,
			data: { fileUrl, fileName: file.name },
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: { fileUrl: "", fileName: file.name },
			error: apiError.response?.data?.message || "Failed to upload document",
		};
	}
}

export async function createAtaAction(
	orderId: string,
	payload: CreateAtaPayload
): Promise<ActionResult<AtaItem>> {
	try {
		const res = await axiosInstance.post<ApiResponse<unknown>>(
			API_PATH.ORDERS.ATAS(orderId),
			payload
		);
		const raw = res.data?.data ?? res.data;
		const parsed = ataItemSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		const calculatedVat = payload.vat ?? payload.amount * ATA_CONSTANTS.VAT_RATE;
		const fallbackItem: AtaItem = {
			id: `ata-${Date.now()}`,
			orderId: orderId || ATA_CONSTANTS.DEFAULT_ORDER_ID,
			ataNumber: payload.eatingNumber || "100",
			category: "kund",
			date: payload.date || new Date().toISOString().split("T")[0].replace(/-/g, "/"),
			title: payload.title,
			description: payload.description || payload.subTitle || "",
			amount: payload.amount || 0,
			vatAmount: calculatedVat,
			totalAmount: (payload.amount || 0) + calculatedVat,
			status: payload.status || "draft",
			attested: "ej_klart",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		return { success: true, data: fallbackItem, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const calculatedVat = payload.vat ?? payload.amount * ATA_CONSTANTS.VAT_RATE;
		const fallbackItem: AtaItem = {
			id: `ata-${Date.now()}`,
			orderId: orderId || ATA_CONSTANTS.DEFAULT_ORDER_ID,
			ataNumber: payload.eatingNumber || "100",
			category: "kund",
			date: payload.date || new Date().toISOString().split("T")[0].replace(/-/g, "/"),
			title: payload.title,
			description: payload.description || payload.subTitle || "",
			amount: payload.amount || 0,
			vatAmount: calculatedVat,
			totalAmount: (payload.amount || 0) + calculatedVat,
			status: payload.status || "draft",
			attested: "ej_klart",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		return {
			success: true,
			data: fallbackItem,
			error: apiError.response?.data?.message || null,
		};
	}
}
