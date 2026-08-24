import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

const B2B_BASE_PATH = "/professionals/b2b";

export const b2bDashboardKpisSchema = z.object({
	kpiStatus: z.object({
		activeProjects: z.number().default(0),
		ongoingBilling: z.number().default(0),
		delayedMilestones: z.number().default(0),
	}),
	ongoingProjects: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			refNr: z.string().optional().default(""),
		})
	).default([]),
	upcomingActivities: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			date: z.string().optional(),
		})
	).default([]),
	financialOverview: z.object({
		activeProjects: z.number().default(0),
		activeOrders: z.number().default(0),
		completedChecks: z.number().default(0),
		totalRevenue: z.number().optional(),
		totalCost: z.number().optional(),
		netMargin: z.number().optional(),
	}),
	guaranteeCommitments: z.object({
		guaranteedPointsOpen: z.number().default(0),
		jobsInPlanningPhase: z.number().default(0),
		awaitingCustomerResponse: z.number().default(0),
	}),
	events: z.object({
		numberOfQuotes: z.number().default(0),
		totalKronor: z.string().default("0 kr"),
	}),
	quickActions: z.object({
		count: z.number().default(0),
	}),
});

export type B2BDashboardKpis = z.infer<typeof b2bDashboardKpisSchema>;

export const EMPTY_B2B_KPIS: B2BDashboardKpis = {
	kpiStatus: {
		activeProjects: 0,
		ongoingBilling: 0,
		delayedMilestones: 0,
	},
	ongoingProjects: [],
	upcomingActivities: [],
	financialOverview: {
		activeProjects: 0,
		activeOrders: 0,
		completedChecks: 0,
		totalRevenue: 0,
		totalCost: 0,
		netMargin: 0,
	},
	guaranteeCommitments: {
		guaranteedPointsOpen: 0,
		jobsInPlanningPhase: 0,
		awaitingCustomerResponse: 0,
	},
	events: {
		numberOfQuotes: 0,
		totalKronor: "0 kr",
	},
	quickActions: {
		count: 0,
	},
};

export async function getB2BDashboardKpisAction(): Promise<ActionResult<B2BDashboardKpis>> {
	try {
		const response = await axiosInstance.get<ApiResponse<unknown>>(`${B2B_BASE_PATH}/dashboard-kpis`);
		const rawData = response.data?.data ?? response.data;
		const parsed = b2bDashboardKpisSchema.safeParse(rawData);
		if (parsed.success) {
			return { success: true, data: parsed.data, error: null };
		}
		return { success: false, data: EMPTY_B2B_KPIS, error: "Invalid KPI response structure" };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch B2B dashboard KPIs";
		return { success: false, data: EMPTY_B2B_KPIS, error: errorMessage };
	}
}
