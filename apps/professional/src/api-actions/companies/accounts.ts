import axiosInstance from "@/lib/axiosInstance";
import {
	ProfessionalAccountItem,
	ProfessionalRow,
	ProfessionalsListApiResponse,
	ProfessionalStatus,
} from "@/types/company";

const PROFESSIONALS_ACCOUNTS_PATH = "/companies/list";
const DEFAULT_PAGE_SIZE = 100;


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


export function mapItemToRow(item: ProfessionalAccountItem): ProfessionalRow {
	const id = item.id || item.company_id || "";
	const companyName = item.company_name ?? "";
	const organizationNumber = item.organization_number ?? "";
	const category =
		item.category_info?.name ||
		item.company_category?.name ||
		item.category?.name ||
		"";

	return {
		id,
		company_id: id,
		contactUserId: item.contact_user_id ?? "",
		companyName,
		company_name: companyName,
		company_category: category,
		orgNo: organizationNumber,
		organization_number: organizationNumber,
		created_at: item.created_at ?? null,
		updated_at: item.updated_at ?? null,
		category,
		contactPerson: item.contact_person ?? "",
		email: item.email ?? "",
		phone: item.phone ?? "",
		city: item.city ?? "",
		status: (item.status ?? "active") as ProfessionalStatus,
	};
}

export async function listAllProfessionalsAPIAction(
	params: Omit<ListProfessionalsParams, "page"> = {},
): Promise<ProfessionalsListResult<ProfessionalRow>> {
	const firstPage = await listProfessionalsAPIAction({ ...params, page: 1 });
	if (firstPage.totalPages <= 1) return firstPage;

	const remainingPages = await Promise.all(
		Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
			listProfessionalsAPIAction({ ...params, page: index + 2 }),
		),
	);

	return {
		...firstPage,
		items: [firstPage, ...remainingPages].flatMap((page) => page.items),
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
