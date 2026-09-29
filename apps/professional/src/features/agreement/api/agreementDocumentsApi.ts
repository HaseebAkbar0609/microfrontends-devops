import axiosInstance from "@/lib/axiosInstance";
import { uploadAgreementMediaAction } from "@/api-actions/agreements/agreements";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { AgreementDocumentItem } from "../types/agreementDocuments";
import { INITIAL_AGREEMENT_DOCUMENTS } from "../constants/agreementDocuments";

const AGREEMENTS_DOCUMENTS_BASE_PATH = "/professionals/agreement/documents";

export async function fetchAgreementCenterDocumentsAction(): Promise<
	ActionResult<AgreementDocumentItem[]>
> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<AgreementDocumentItem[]>
		>(AGREEMENTS_DOCUMENTS_BASE_PATH);
		if (response.data && response.data.data && response.data.data.length > 0) {
			return { success: true, data: response.data.data, error: null };
		}
		return { success: true, data: INITIAL_AGREEMENT_DOCUMENTS, error: null };
	} catch (_error: unknown) {
		// Fallback gracefully to initial documents
		return { success: true, data: INITIAL_AGREEMENT_DOCUMENTS, error: null };
	}
}

export async function uploadAgreementCenterDocumentAction(
	file: File,
): Promise<ActionResult<{ id: string; file_url_path?: string }>> {
	return uploadAgreementMediaAction(file);
}

export async function deleteAgreementCenterDocumentAction(
	documentId: string,
): Promise<ActionResult<void>> {
	try {
		await axiosInstance.delete(
			`${AGREEMENTS_DOCUMENTS_BASE_PATH}/${documentId}`,
		);
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to delete document";
		return { success: false, data: null, error: errorMessage };
	}
}
