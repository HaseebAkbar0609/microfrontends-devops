import axiosInstance from "@/lib/axiosInstance";
import {
	ProfessionalAccountItem,
	ProfessionalRow,
	ProfessionalsListApiResponse,
	ProfessionalStatus,
} from "@/types/company";

const PROFESSIONALS_ACCOUNTS_PATH = "/companies/list";
const DEFAULT_PAGE_SIZE = 10;


export interface ListProfessionalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: ProfessionalStatus;
}

export interface ProfessionalsListResult<T = ProfessionalRow> {
	items: T[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

function mapItemToRow(item: ProfessionalAccountItem): ProfessionalRow {
	return {
		id: item.id || item.company_id || "",
		contactUserId: item.contact_user_id ?? "",
		companyName: item.company_name ?? "",
		orgNo: item.organization_number ?? "",
		category: item.company_category?.name || item.category?.name || "",
		contactPerson: item.contact_person ?? "",
		email: item.email ?? "",
		phone: item.phone ?? "",
		city: item.city ?? "",
		status: (item.status ?? "pending") as ProfessionalStatus,
	};
}

export async function listProfessionalsAPIAction(
	params: ListProfessionalsParams = {},
): Promise<ProfessionalsListResult<ProfessionalRow>> {
	const response = await axiosInstance.get<ProfessionalsListApiResponse>(
		PROFESSIONALS_ACCOUNTS_PATH,
		{
			params: {
				page: params.page ?? 1,
				page_size: params.pageSize ?? DEFAULT_PAGE_SIZE,
				search: params.search || undefined,
				status: params.status || undefined,
			},
		},
	);
	
	const payload = response.data;

	return {
		items: (payload.data ?? []).map(mapItemToRow),
		totalItems: payload.total_items ?? 0,
		totalPages: payload.total_pages ?? 1,
		currentPage: payload.current_page ?? (params.page ?? 1),
	};
}
