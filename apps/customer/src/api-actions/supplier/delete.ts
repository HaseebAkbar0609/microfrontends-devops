import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export async function deleteSupplierAPIAction(
	supplierId: string,
): Promise<ActionResult<null>> {
	try {
		const { data: res } = await axiosInstance.delete<{
			success: boolean;
			message?: string;
		}>(API_PATH.SUPPLIER.delete(supplierId));

		if (!res || res.success === false) {
			return { success: false, data: null, error: res?.message || "Failed to delete supplier" };
		}

		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to delete supplier");
	}
}
