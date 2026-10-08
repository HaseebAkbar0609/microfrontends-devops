import { t } from "i18next";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { Supplier } from "@/features/suppliers/types/types";
import { handleApiError } from "@/utils/apiError";
import localizationConstants from "@/utils/translation/constants";

export interface CreateSupplierPayload {
	companyName: string;
	category: string;
	orgNo: string;
	email: string;
	contactFirstName: string;
	contactLastName: string;
	mobileNo: string;
}

export async function createSupplierAPIAction(
	payload: CreateSupplierPayload,
): Promise<ActionResult<Supplier>> {
	try {
		const { data: res } = await axiosInstance.post<{
			success: boolean;
			message?: string;
			data?: { id: string; company_name: string; organization_number?: string };
		}>(API_PATH.SUPPLIER.CREATE, {
			company_name: payload.companyName,
			category: payload.category || undefined,
			org_no: payload.orgNo || undefined,
			email: payload.email,
			contact_first_name: payload.contactFirstName || undefined,
			contact_last_name: payload.contactLastName || undefined,
			mobile_no: payload.mobileNo || undefined,
		});

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || t(localizationConstants.supplierCreateError),
			};
		}

		const newSupplier: Supplier = {
			id: res.data.id,
			companyName: payload.companyName,
			orgNo: res.data.organization_number || payload.orgNo,
			contactPersonName: `${payload.contactFirstName} ${payload.contactLastName}`.trim(),
			email: payload.email,
			mobileNumber: payload.mobileNo,
		};

		return { success: true, data: newSupplier, error: null };
	} catch (error: unknown) {
		return handleApiError(error, t(localizationConstants.supplierCreateError));
	}
}
