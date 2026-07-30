import axiosInstance from "@/lib/axiosInstance";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      detail?: Array<{ msg?: string }>;
    };
  };
}

export async function deletePrivateCustomerAPIAction(
  customerId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await axiosInstance.delete(`/api/v1/teams/private/customers/${customerId}`);
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const errorMsg =
      errorObj?.response?.data?.message ||
      errorObj?.response?.data?.detail?.[0]?.msg ||
      "Failed to delete customer";
    return { success: false, error: errorMsg };
  }
}

export async function updatePrivateCustomerStatusAPIAction(
  customerId: string,
  status: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const targetStatus = status === "inactive" ? "suspended" : status;
    await axiosInstance.patch(`/api/v1/teams/private/customers/${customerId}/status`, {
      status: targetStatus,
    });
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const errorMsg =
      errorObj?.response?.data?.message ||
      errorObj?.response?.data?.detail?.[0]?.msg ||
      "Failed to update customer status";
    return { success: false, error: errorMsg };
  }
}
