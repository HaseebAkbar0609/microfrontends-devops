import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type {
	BestallarePaymentPlan,
	UeLevPaymentPlan,
	PaymentPlanDetail,
} from "@/features/orders/payment-plan/types/paymentPlan.types";
import {
	MOCK_BESTALLARE_PLANS,
	MOCK_UE_LEV_PLANS,
	getPaymentPlanMockByOrderId,
} from "@/features/orders/payment-plan/data/paymentPlan.mock";

const ORDERS_BASE_PATH = "/professionals/orders";

export const paymentPlanItemSchema = z.object({
	id: z.string(),
	planNumber: z.number().default(1),
	name: z.string().default(""),
	fileName: z.string().default("Kontrakt.pdf"),
	fileType: z.enum(["pdf", "doc"]).default("pdf"),
	fileSize: z.string().optional(),
	status: z.enum(["not_invoiced", "invoiced", "paid", "overdue"]).default("not_invoiced"),
	createdAt: z.string().optional(),
	totalAmount: z.number().optional(),
});

export const ueLevPaymentPlanItemSchema = z.object({
	id: z.string(),
	companyName: z.string(),
	totalAmount: z.number().default(0),
	status: z.enum(["approved", "under_review", "not_ready", "invoiced", "paid"]).default("not_ready"),
	role: z.string().optional(),
	contactPerson: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
});

export const paymentMilestoneSchema = z.object({
	id: z.string(),
	date: z.string(),
	activity: z.string(),
	lyft: z.string(),
	belopp: z.number().default(0),
	innehallet: z.number().default(0),
	attErhalla: z.number().default(0),
	percentage: z.number().optional(),
	status: z.enum(["not_invoiced", "invoiced", "paid", "overdue"]).optional(),
});

export const paymentPlanDocumentSchema = z.object({
	id: z.string(),
	date: z.string(),
	type: z.string(),
	fileName: z.string(),
	fileType: z.enum(["pdf", "doc", "image"]).default("pdf"),
	fileUrl: z.string().optional(),
});

export const paymentPlanDetailSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	planNumber: z.number().default(1),
	title: z.string(),
	projectInfo: z.object({
		projectNr: z.string(),
		project: z.string(),
		kvartersNamn: z.string(),
		bestallare: z.string(),
		kontraktSumma: z.number(),
		startDatum: z.string(),
		slutDatum: z.string(),
	}),
	summary: z.object({
		kontraktsumma: z.number(),
		skapadAv: z.string(),
		datum: z.string(),
		reviderad: z.string(),
		innehallnaMedelPerAcontoPercent: z.number(),
		totaltInnehalletAvKontraktsummaPercent: z.number(),
		belopp: z.number(),
		beloppInnehalletTotalt: z.number(),
	}),
	milestones: z.array(paymentMilestoneSchema).default([]),
	documents: z.array(paymentPlanDocumentSchema).default([]),
	status: z.enum(["draft", "sent", "approved"]).default("draft"),
});

export async function getBestallarePaymentPlansAction(
	orderId: string
): Promise<ActionResult<BestallarePaymentPlan[]>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/payment-plans/bestallare`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = z.array(paymentPlanItemSchema).safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return { success: true, data: MOCK_BESTALLARE_PLANS, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: MOCK_BESTALLARE_PLANS,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getUeLevPaymentPlansAction(
	orderId: string
): Promise<ActionResult<UeLevPaymentPlan[]>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/payment-plans/ue-lev`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = z.array(ueLevPaymentPlanItemSchema).safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return { success: true, data: MOCK_UE_LEV_PLANS, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: MOCK_UE_LEV_PLANS,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getPaymentPlanDetailAction(
	orderId: string,
	planId: string
): Promise<ActionResult<PaymentPlanDetail>> {
	try {
		const res = await axiosInstance.get<ApiResponse<unknown>>(
			`${ORDERS_BASE_PATH}/${orderId}/payment-plans/${planId}`
		);
		const raw = res.data?.data ?? res.data;
		const parsed = paymentPlanDetailSchema.safeParse(raw);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return {
			success: true,
			data: getPaymentPlanMockByOrderId(orderId, planId),
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: getPaymentPlanMockByOrderId(orderId, planId),
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function createPaymentPlanAction(
	orderId: string,
	payload: Partial<BestallarePaymentPlan>
): Promise<ActionResult<BestallarePaymentPlan>> {
	try {
		const res = await axiosInstance.post<ApiResponse<BestallarePaymentPlan>>(
			`${ORDERS_BASE_PATH}/${orderId}/payment-plans`,
			payload
		);
		const data = res.data?.data || (res.data as unknown as BestallarePaymentPlan);
		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallback: BestallarePaymentPlan = {
			id: `plan-${Date.now()}`,
			planNumber: payload.planNumber || 1,
			name: payload.name || "Ny betalningsplan",
			fileName: payload.fileName || "Kontrakt.pdf",
			fileType: "pdf",
			status: "not_invoiced",
			createdAt: new Date().toISOString().split("T")[0],
			totalAmount: payload.totalAmount || 0,
		};
		return { success: true, data: fallback, error: apiError.response?.data?.message || null };
	}
}

export async function deletePaymentPlanAction(
	orderId: string,
	planId: string
): Promise<ActionResult<{ success: boolean }>> {
	try {
		await axiosInstance.delete(`${ORDERS_BASE_PATH}/${orderId}/payment-plans/${planId}`);
		return { success: true, data: { success: true }, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return { success: true, data: { success: true }, error: apiError.response?.data?.message || null };
	}
}
