import axiosInstance from "@/lib/axiosInstance";
import type { PrivateCustomersAnalytics } from "@/features/customers/types/types";

const PRIVATE_ANALYTICS_PATH = "/api/v1/teams/private/analytics";

interface PrivateAnalyticsApiResponse {
  success: boolean;
  message: string;
  data: PrivateCustomersAnalytics;
}

export async function getPrivateAnalyticsAPIAction(): Promise<PrivateCustomersAnalytics> {
  const response = await axiosInstance.get<PrivateAnalyticsApiResponse>(PRIVATE_ANALYTICS_PATH);
  return response.data.data;
}
