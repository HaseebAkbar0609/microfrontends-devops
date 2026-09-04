import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface UpdateSupplierPayload {
	companyName?: string;
	category?: string;
	orgNo?: string;
	email?: string;
	contactFirstName?: string;
	contactLastName?: string;
	mobileNo?: string;
}

export async function updateSupplierAPIAction(
	supplierId: string,
	payload: UpdateSupplierPayload,
): Promise<ActionResult<{ id: string }>> {
	try {
		const { data: res } = await axiosInstance.put<{
			success: boolean;
			message?: string;
			data?: { id: string };
		}>(API_PATH.SUPPLIER.update(supplierId), {
			company_name: payload.companyName,
			category: payload.category,
			org_no: payload.orgNo,
			email: payload.email,
			contact_first_name: payload.contactFirstName,
			contact_last_name: payload.contactLastName,
			mobile_no: payload.mobileNo,
		});

		if (!res || res.success === false || !res.data) {
			return { success: false, data: null, error: res?.message || "Failed to update supplier" };
		}

		return { success: true, data: res.data, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to update supplier");
	}
}
