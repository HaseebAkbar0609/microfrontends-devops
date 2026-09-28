import axiosInstance from "@/lib/axiosInstance";
import { BASE_API_VERSION } from "@/constants/api";
import { safeExternalUrl } from "@/lib/safeUrl";
import type { ApiResponse } from "@/types/api";
import type { ProjectDocumentItem } from "../create/types";

interface UploadedMedia {
	id: string;
	file_name: string;
	file_size: number;
}

export interface UploadedProjectDocument extends ProjectDocumentItem {
	fileUrl: string | null;
}

export async function uploadProjectDocument(file: File): Promise<UploadedMedia> {
	const body = new FormData();
	body.append("file", file);
	body.append("media_type", "professional_project_document");
	const response = await axiosInstance.post<ApiResponse<UploadedMedia>>("/media/upload", body, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	if (!response.data.data) throw new Error("PROJECT_DOCUMENT_UPLOAD_RESPONSE_INVALID");
	return response.data.data;
}

export async function listProjectDocuments(projectId: string): Promise<UploadedProjectDocument[]> {
	const response = await axiosInstance.get<ApiResponse<UploadedProjectDocument[]>>(
		`/professionals/projects/${encodeURIComponent(projectId)}/documents`,
	);
	if (!response.data.data) throw new Error("PROJECT_DOCUMENT_LIST_RESPONSE_INVALID");
	return response.data.data.map((doc) => {
		const safe = safeExternalUrl(doc.fileUrl);
		return { ...doc, fileUrl: safe
			? (safe.startsWith("/") && /^https?:\/\//.test(BASE_API_VERSION)
				? new URL(safe, BASE_API_VERSION).href : safe)
			: null };
	});
}
