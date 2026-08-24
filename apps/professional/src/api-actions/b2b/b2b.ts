import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

const B2B_BASE_PATH = "/professionals/b2b";

export interface B2BDashboardKpis {
	kpiStatus: {
		activeProjects: number;
		ongoingBilling: number;
		delayedMilestones: number;
	};
	ongoingProjects: Array<{
		id: string;
		name: string;
		refNr: string;
	}>;
	upcomingActivities: Array<{
		id: string;
		title: string;
		date?: string;
	}>;
	financialOverview: {
		activeProjects: number;
		activeOrders: number;
		completedChecks: number;
		totalRevenue?: number;
		totalCost?: number;
		netMargin?: number;
	};
	guaranteeCommitments: {
		guaranteedPointsOpen: number;
		jobsInPlanningPhase: number;
		awaitingCustomerResponse: number;
	};
	events: {
		numberOfQuotes: number;
		totalKronor: string;
	};
	quickActions: {
		count: number;
	};
}

export const DEFAULT_B2B_KPIS: B2BDashboardKpis = {
	kpiStatus: {
		activeProjects: 5,
		ongoingBilling: 12,
		delayedMilestones: 2,
	},
	ongoingProjects: [
		{ id: "1", name: "Project 2025-001", refNr: "PRJ-001" },
		{ id: "2", name: "Project: 2025-002", refNr: "PRJ-002" },
		{ id: "3", name: "Project 2025-003", refNr: "PRJ-003" },
	],
	upcomingActivities: [
		{ id: "1", title: "Slutbesiktning 2025-002" },
		{ id: "2", title: "Produktionsstart 2025-003" },
	],
	financialOverview: {
		activeProjects: 5,
		activeOrders: 15,
		completedChecks: 45,
		totalRevenue: 2450000,
		totalCost: 1890000,
		netMargin: 560000,
	},
	guaranteeCommitments: {
		guaranteedPointsOpen: 5,
		jobsInPlanningPhase: 2,
		awaitingCustomerResponse: 1,
	},
	events: {
		numberOfQuotes: 7,
		totalKronor: "Totalt: 15 800 000 kronor",
	},
	quickActions: {
		count: 20,
	},
};

export async function getB2BDashboardKpisAction(): Promise<ActionResult<B2BDashboardKpis>> {
	try {
		const response = await axiosInstance.get<ApiResponse<B2BDashboardKpis>>(`${B2B_BASE_PATH}/dashboard-kpis`);
		if (response.data && response.data.data) {
			return { success: true, data: response.data.data, error: null };
		}
		return { success: true, data: DEFAULT_B2B_KPIS, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch B2B dashboard KPIs";
		return { success: false, data: DEFAULT_B2B_KPIS, error: errorMessage };
	}
}
