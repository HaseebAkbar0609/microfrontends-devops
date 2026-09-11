import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { AtaItem } from "@/features/orders/ata/types/ata.types";
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
	status: z.enum(["ok", "redovisad", "forhandling", "pending", "approved", "rejected", "draft"]).default("ok"),
	attested: z.enum(["ja", "nej", "ej_klart"]).default("ej_klart"),
	attestedDate: z.string().optional(),
	notes: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const ataListSchema = z.array(ataItemSchema);

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
		if (parsed.success) {
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
