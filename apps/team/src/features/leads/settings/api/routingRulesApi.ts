import axiosInstance from "@/lib/axiosInstance";

export interface RoutingRuleApiData {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  order_index: number;
  criteria?: Record<string, unknown>;
}

export const fetchRoutingRules = async (): Promise<RoutingRuleApiData[]> => {
  const { data } = await axiosInstance.get<{ data: RoutingRuleApiData[] }>(
    "/api/v1/teams/leads/routing-rules"
  );
  return data.data;
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
