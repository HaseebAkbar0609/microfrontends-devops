import { CustomerRegisterRow, MOCK_CUSTOMER_REGISTER_DATA } from "../mockdata/customers";

export type { CustomerRegisterRow };

export interface GetCustomerRegisterListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | "active" | "inactive";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCustomerRegisterListResponse {
	data: CustomerRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export async function getCustomerRegisterListAPIAction(
	params?: GetCustomerRegisterListParams,
): Promise<GetCustomerRegisterListResponse> {
	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 10);
	const search = params?.search?.toLowerCase().trim();
	const status = params?.status ?? "all";
	const sortBy = params?.sortBy;
	const sortOrder = params?.sortOrder;

	// Simulate realistic backend network response delay
	await new Promise((resolve) => setTimeout(resolve, 150));

	let filtered = [...MOCK_CUSTOMER_REGISTER_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.customerNo.toLowerCase().includes(search) ||
				item.name.toLowerCase().includes(search) ||
				item.orgNo.toLowerCase().includes(search) ||
				item.email.toLowerCase().includes(search) ||
				item.city.toLowerCase().includes(search) ||
				item.phone.toLowerCase().includes(search) ||
				item.address.toLowerCase().includes(search),
		);
	}

	if (status && status !== "all") {
		filtered = filtered.filter((item) => item.status === status);
	}

	if (sortBy) {
		filtered.sort((a, b) => {
			const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? "");
			const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? "");
			const cmp = aVal.localeCompare(bVal);
			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const total = filtered.length;
	const totalPages = Math.ceil(total / limit) || 1;
	const startIndex = (page - 1) * limit;
	const paginatedData = filtered.slice(startIndex, startIndex + limit);

	return {
		data: paginatedData,
		total,
		page,
		limit,
		totalPages,
	};
}
