import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { AgreementListTableProps } from "@/features/agreement/types/agreement";
import type { AgreementDetail, AgreementDetailContact, AgreementDetailDocument } from "@/features/agreement/types/agreementDetail";
import type { CreateAgreementFullData } from "@/features/agreement/types/agreementCreate";

// Helper for the new base path since we haven't added it to constants yet
const AGREEMENTS_BASE_PATH = "/professionals/agreement";

export async function getAgreementDashboardKpisAction(): Promise<ActionResult<Record<string, unknown>>> {
	try {
		const response = await axiosInstance.get<ApiResponse<Record<string, unknown>>>(`${AGREEMENTS_BASE_PATH}/dashboard-kpis`);
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch KPIs";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function getAgreementsListAction(params: {
	skip?: number;
	limit?: number;
	search?: string;
	department?: string;
	status?: string;
	sort_by?: string;
	sort_dir?: string;
}): Promise<ActionResult<AgreementListTableProps>> {
	try {
		const queryParams = new URLSearchParams();
		if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
		if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
		if (params.search) queryParams.append("search", params.search);
		if (params.department) queryParams.append("department", params.department);
		if (params.status) queryParams.append("status", params.status);
		if (params.sort_by) queryParams.append("sort_by", params.sort_by);
		if (params.sort_dir) queryParams.append("sort_dir", params.sort_dir);

		const response = await axiosInstance.get<{ data: AgreementListTableProps["data"]; total_items: number }>(`${AGREEMENTS_BASE_PATH}/list?${queryParams.toString()}`);
		const result = {
			data: response.data.data || [],
			totalItems: response.data.total_items ?? 0,
		};
		return { success: true, data: result, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch agreements";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function getAgreementDepartmentsAction(): Promise<ActionResult<string[]>> {
	try {
		const response = await axiosInstance.get<ApiResponse<string[]>>(`${AGREEMENTS_BASE_PATH}/departments`);
		return { success: true, data: response.data.data || [], error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch departments";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function getAgreementDetailAction(id: string): Promise<ActionResult<AgreementDetail>> {
	try {
		const response = await axiosInstance.get<ApiResponse<AgreementDetail>>(`${AGREEMENTS_BASE_PATH}/${id}`);
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch agreement details";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function getAgreementDocumentsAction(): Promise<ActionResult<AgreementDetailDocument[]>> {
	try {
		const response = await axiosInstance.get<ApiResponse<AgreementDetailDocument[]>>(`${AGREEMENTS_BASE_PATH}/documents`);
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch agreement documents";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function createAgreementAction(data: CreateAgreementFullData): Promise<ActionResult<Record<string, unknown>>> {
	try {
		const payload = {
			...data,
			contacts: data.contacts.map((c) => ({
				first_name: c.fornamn,
				last_name: c.efternamn,
				email: c.mail || null,
				mobile: c.mobil || null,
				role: c.roll || null,
			})),
		};
		const response = await axiosInstance.post<ApiResponse<Record<string, unknown>>>(`${AGREEMENTS_BASE_PATH}/create`, payload);
		showToast("success", "Agreement created successfully");
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to create agreement";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function updateAgreementAction(id: string, data: Record<string, unknown>): Promise<ActionResult<Record<string, unknown>>> {
	try {
		const response = await axiosInstance.patch<ApiResponse<Record<string, unknown>>>(`${AGREEMENTS_BASE_PATH}/${id}`, data);
		showToast("success", "Agreement updated successfully");
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to update agreement";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function deleteAgreementAction(id: string): Promise<ActionResult<void>> {
	try {
		await axiosInstance.delete(`${AGREEMENTS_BASE_PATH}/${id}`);
		showToast("success", "Agreement deleted successfully");
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to delete agreement";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function addAgreementContactAction(agreementId: string, data: Record<string, unknown>): Promise<ActionResult<AgreementDetailContact>> {
	try {
		const response = await axiosInstance.post<ApiResponse<AgreementDetailContact>>(`${AGREEMENTS_BASE_PATH}/${agreementId}/contacts`, data);
		showToast("success", "Contact added successfully");
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to add contact";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function updateAgreementContactAction(agreementId: string, contactId: string, data: Record<string, unknown>): Promise<ActionResult<AgreementDetailContact>> {
	try {
		const response = await axiosInstance.put<ApiResponse<AgreementDetailContact>>(`${AGREEMENTS_BASE_PATH}/${agreementId}/contacts/${contactId}`, data);
		showToast("success", "Contact updated successfully");
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to update contact";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function deleteAgreementContactAction(agreementId: string, contactId: string): Promise<ActionResult<void>> {
	try {
		await axiosInstance.delete(`${AGREEMENTS_BASE_PATH}/${agreementId}/contacts/${contactId}`);
		showToast("success", "Contact deleted successfully");
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to delete contact";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function deleteAgreementDocumentAction(agreementId: string, documentId: string): Promise<ActionResult<void>> {
	try {
		await axiosInstance.delete(`${AGREEMENTS_BASE_PATH}/${agreementId}/documents/${documentId}`);
		showToast("success", "Document deleted successfully");
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to delete document";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}

export async function uploadAgreementMediaAction(file: File): Promise<ActionResult<{ id: string, file_url_path?: string }>> {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("media_type", "general");

		const response = await axiosInstance.post<ApiResponse<{ id: string, file_url_path?: string }>>(`/media/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return { success: true, data: response.data?.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to upload media";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}


