import axiosInstance from "@/lib/axiosInstance";
import type { CreateCustomerFormData } from "@/features/customers/types/types";

const MOCK_ENABLE = false;
const CUSTOMERS_CREATE_PATH = "/api/v1/teams/private/accounts";

export interface CreateCustomerResult {
  success: boolean;
  error: string | null;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      detail?: Array<{ msg?: string }>;
    };
  };
}

export async function createPrivateCustomerAPIAction(
  data: CreateCustomerFormData
): Promise<CreateCustomerResult> {
  if (MOCK_ENABLE) {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, error: null };
  }

  try {
    await axiosInstance.post(CUSTOMERS_CREATE_PATH, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.privateEmail,
      personal_id: data.personalNumber,
      phone_number: data.phone,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
    });
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const errorMsg =
      errorObj?.response?.data?.message ||
      errorObj?.response?.data?.detail?.[0]?.msg ||
      "Failed to create customer";
    return { success: false, error: errorMsg };
  }
}
