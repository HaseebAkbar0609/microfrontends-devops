import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";

export const RoutingRuleApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
  order_index: z.number().optional().default(0),
  criteria: z.record(z.unknown()).optional().nullable(),
});

export const RoutingRulesResponseSchema = z.object({
  data: z.array(RoutingRuleApiSchema).optional().default([]),
});

export interface RoutingRuleApiData {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  order_index: number;
  criteria?: Record<string, unknown>;
}

export const fetchRoutingRules = async (): Promise<RoutingRuleApiData[]> => {
  const { data } = await axiosInstance.get(
    "/api/v1/teams/leads/routing-rules"
  );
  const parsed = RoutingRulesResponseSchema.parse(data);
  return (parsed.data || []) as RoutingRuleApiData[];
};

export const createRoutingRule = async (
  payload: Omit<RoutingRuleApiData, "id">
): Promise<RoutingRuleApiData> => {
  const { data } = await axiosInstance.post<{ data: RoutingRuleApiData }>(
    "/api/v1/teams/leads/routing-rules",
    payload
  );
  return data.data;
};

export const updateRoutingRule = async (
  ruleId: string,
  payload: Partial<Omit<RoutingRuleApiData, "id">>
): Promise<RoutingRuleApiData> => {
  const { data } = await axiosInstance.patch<{ data: RoutingRuleApiData }>(
    `/api/v1/teams/leads/routing-rules/${ruleId}`,
    payload
  );
  return data.data;
};

export const deleteRoutingRule = async (ruleId: string): Promise<boolean> => {
  const { data } = await axiosInstance.delete<{ success: boolean }>(
    `/api/v1/teams/leads/routing-rules/${ruleId}`
  );
  return data.success;
};
