import axiosInstance from "@/lib/axiosInstance";
import type { CreateCustomerFormData } from "@/features/customers/types/types";

const MOCK_ENABLE = true; // TODO: set to false when real API is available
const CUSTOMERS_CREATE_PATH = "/api/v1/teams/customer/private/create";

export interface CreateCustomerResult {
  success: boolean;
  error: string | null;
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
      personal_number: data.personalNumber,
      private_email: data.privateEmail,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
    });
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to create customer" };
  }
}
