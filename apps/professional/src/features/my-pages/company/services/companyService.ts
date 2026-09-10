import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
	CompanyAttachment,
	CompanyContact,
	CompanyContentItem,
	CompanyContentKind,
	CompanyInfo,
} from "../types";

interface CompanyUsersResponse {
	data: Array<{
		id: string;
		role: string;
		user_full_name?: string | null;
		user_email?: string | null;
		department?: string | null;
		position?: string | null;
		city?: string | null;
		mobile?: string | null;
	}>;
}

export interface CreateCompanyContentInput {
	kind: CompanyContentKind;
	title?: string;
	body: string;
	recipient?: string;
	attachments?: CompanyAttachment[];
	metadata?: Record<string, unknown>;
}

export async function getCompanyInfo(companyId: string): Promise<CompanyInfo> {
	const response = await axiosInstance.get<ApiResponse<CompanyInfo>>(
		`/companies/get/${companyId}`,
	);
	return response.data.data;
}

export async function listCompanyContacts(
	companyId: string,
	search?: string,
): Promise<CompanyContact[]> {
	const response = await axiosInstance.get<CompanyUsersResponse>(
		`/companies/user/list/${companyId}`,
		{ params: { page: 1, page_size: 100, search: search || undefined } },
	);
	return (response.data.data ?? []).map((item) => ({
		id: item.id,
		title: item.position || item.role,
		name: item.user_full_name || item.user_email || "—",
		department: item.department || "—",
		city: item.city || "—",
		mobile: item.mobile || "—",
		email: item.user_email || "—",
		role: item.role,
	}));
}

export async function listCompanyContent(
	companyId: string,
	kind: CompanyContentKind,
	search?: string,
): Promise<CompanyContentItem[]> {
	const response = await axiosInstance.get<ApiResponse<CompanyContentItem[]>>(
		`/companies/${companyId}/content`,
		{ params: { kind, search: search || undefined } },
	);
	return response.data.data ?? [];
}

export async function createCompanyContent(
	companyId: string,
	input: CreateCompanyContentInput,
): Promise<CompanyContentItem> {
	const response = await axiosInstance.post<ApiResponse<CompanyContentItem>>(
		`/companies/${companyId}/content`,
		input,
	);
	return response.data.data;
}

export async function deleteCompanyContent(
	companyId: string,
	itemId: string,
): Promise<void> {
	await axiosInstance.delete(`/companies/${companyId}/content/${itemId}`);
}

export async function uploadCompanyAttachment(file: File): Promise<CompanyAttachment> {
	const form = new FormData();
	form.append("file", file);
	form.append("media_type", "company_content");
	const response = await axiosInstance.post<
		ApiResponse<{ id: string; file_name: string }>
	>("/media/upload", form);
	return {
		media_id: response.data.data.id,
		file_name: response.data.data.file_name,
	};
}
