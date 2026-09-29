import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";

const count = z.number().int().nonnegative();
const money = z.string().regex(/^\d+(\.\d+)?$/).refine((value) => Number.isFinite(Number(value)));
const item = z.object({
    id: z.string().uuid(), calc_no: z.string().min(1), project_name: z.string().min(1),
    status: z.enum(["not_started", "in_progress", "completed"]), created_at: count,
    latest_offer_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
});
const dashboard = z.object({
    summary: z.object({
        total: count, status_counts: z.object({ not_started: count, in_progress: count, completed: count }),
        values: z.array(z.object({ currency: z.string().regex(/^[A-Z]{3}$/), total: money, average: money, count })),
        missing_value_count: count,
    }),
    sections: z.array(z.object({ id: z.string(), state: z.enum(["connected", "unavailable"]), reason: z.string().nullable() })),
    recentActivity: z.array(item), upcomingItems: z.array(item),
    monthlyCounts: z.array(z.object({ month: z.string().regex(/^\d{4}-\d{2}$/), count })),
    metadata: z.object({ company_id: z.string(), user_id: z.string(), generated_at: count, source: z.literal("professional_calculations") }),
});

export type CalculationDashboardData = z.infer<typeof dashboard>;
export const CALCULATION_DASHBOARD_QUERY_KEY = "calculation-dashboard";
export const CALCULATION_OVERVIEW_QUERY_KEY = "calculation-overview";
export const CALCULATION_DEFAULT_CURRENCY = "SEK";
export const CALCULATION_DASHBOARD_STALE_MS = 60_000;
export const CALCULATION_OVERVIEW_HREF = "/module/business/calculation/overview";

export async function getCalculationDashboard(companyId: string, userId: string, signal?: AbortSignal) {
    const response = await axiosInstance.get(API_PATH.CALCULATIONS.DASHBOARD, {
        headers: { "X-Company-ID": companyId }, signal,
    });
    if (response.data?.success !== true) throw new Error("CALCULATION_DASHBOARD_UNAVAILABLE");
    const result = dashboard.parse(response.data.data);
    if (result.metadata.company_id !== companyId || result.metadata.user_id !== userId) {
        throw new Error("CALCULATION_DASHBOARD_SCOPE_MISMATCH");
    }
    return result;
}
