import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	AccountPlanRow,
	AccountPlanDetail,
	CreateAccountPlanFormData,
	GetAccountPlanListParams,
	GetAccountPlanListResponse,
} from "../types";
import { MOCK_ACCOUNT_PLAN_DATA } from "../mockdata/accounts";

export type { AccountPlanRow, AccountPlanDetail };

const mapAccountFromApi = (item: Record<string, unknown>): AccountPlanRow => ({
	id: String(item.id ?? ""),
	accountNumber: String(item.account_number ?? item.accountNumber ?? ""),
	accountName: String(item.account_name ?? item.accountName ?? ""),
	accountType: String(item.account_type ?? item.accountType ?? "Asset"),
	vatCode: String(item.vat_code ?? item.vatCode ?? "-"),
	sru: String(item.sru ?? ""),
	autoAccount: String(item.auto_account ?? item.autoAccount ?? "SEK"),
	openingBalance: String(item.opening_balance ?? item.openingBalance ?? "0"),
	budget: String(item.budget ?? "0"),
	status: (item.status as "active" | "inactive") ?? "active",
});

export async function getAccountPlanListAPIAction(
	params?: GetAccountPlanListParams,
): Promise<GetAccountPlanListResponse> {
	try {
		const queryParams: Record<string, string | number> = {};
		if (params?.page) queryParams.page = params.page;
		if (params?.limit) queryParams.limit = params.limit;
		if (params?.search) queryParams.search = params.search;
		if (params?.accountType && params.accountType !== "all") queryParams.account_type = params.accountType;
		if (params?.status && params.status !== "all") queryParams.status = params.status;
		if (params?.sortBy) queryParams.sort_by = params.sortBy;
		if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

		const res = await axiosInstance.get(API_PATH.ACCOUNTS.LIST, { params: queryParams });
		const data = res.data?.data;

		if (data?.items) {
			return {
				data: (data.items as Record<string, unknown>[]).map(mapAccountFromApi),
				total: data?.total ?? 0,
				page: data?.page ?? params?.page ?? 1,
				limit: data?.limit ?? params?.limit ?? 10,
				totalPages: Math.ceil((data?.total ?? 0) / (data?.limit ?? params?.limit ?? 10)),
			};
		}
	} catch (error) {
		if (process.env.NEXT_PUBLIC_USE_MOCK !== "true" && process.env.NODE_ENV === "production") {
			throw error;
		}
	}

	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 10);
	const search = params?.search?.toLowerCase().trim();
	const accountType = params?.accountType ?? "all";
	const status = params?.status ?? "all";
	const sortBy = params?.sortBy;
	const sortOrder = params?.sortOrder;

	let filtered = [...MOCK_ACCOUNT_PLAN_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.accountNumber.toLowerCase().includes(search) ||
				item.accountName.toLowerCase().includes(search),
		);
	}

	if (accountType && accountType !== "all") {
		filtered = filtered.filter((item) => item.accountType === accountType);
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

export async function createAccountPlanAPIAction(
	data: CreateAccountPlanFormData,
): Promise<{ success: boolean; id: string; error?: string }> {
	try {
		const res = await axiosInstance.post(API_PATH.ACCOUNTS.CREATE, {
			account_number: data.accountNumber,
			account_name: data.accountName,
			account_type: data.accountType || "Asset",
			vat_code: data.vatCode || null,
			sru: data.sru || null,
			auto_account: data.autoAccount || null,
			opening_balance: data.openingBalance || "0",
			budget: data.budget || "0",
			description: data.description || null,
			status: data.accountStatus || "active",
			cost_center_mode: data.costCenterMode || "obligatoriskt",
			project_mode: data.projectMode || "obligatoriskt",
			suggested_cost_center: data.suggestedCostCenter || null,
			suggested_project: data.suggestedProject || null,
		});
		return { success: true, id: String(res.data?.data?.id ?? Date.now()) };
	} catch (error) {
		if (process.env.NEXT_PUBLIC_USE_MOCK !== "true" && process.env.NODE_ENV === "production") {
			throw error;
		}
	}

	const newId = String(Date.now());
	const newRow: AccountPlanRow = {
		id: newId,
		accountNumber: data.accountNumber,
		accountName: data.accountName,
		accountType: data.accountType || "Asset",
		vatCode: data.vatCode || "-",
		sru: data.sru || "-",
		autoAccount: data.autoAccount || "SEK",
		openingBalance: data.openingBalance || "0",
		budget: data.budget || "0",
		status: (data.accountStatus as "active" | "inactive") || "active",
	};

	// Check duplicate in mock data
	const exists = MOCK_ACCOUNT_PLAN_DATA.some(
		(acc) => acc.accountNumber.toLowerCase() === data.accountNumber.toLowerCase(),
	);
	if (exists) {
		return { success: false, id: "", error: "validationAccountNumberUnique" };
	}

	MOCK_ACCOUNT_PLAN_DATA.unshift(newRow);
	return { success: true, id: newId };
}

export async function updateAccountPlanAPIAction(
	id: string,
	data: CreateAccountPlanFormData,
): Promise<{ id: string }> {
	try {
		const res = await axiosInstance.patch(API_PATH.ACCOUNTS.UPDATE(id), {
			account_number: data.accountNumber,
			account_name: data.accountName,
			account_type: data.accountType,
			vat_code: data.vatCode || null,
			sru: data.sru || null,
			auto_account: data.autoAccount || null,
			opening_balance: data.openingBalance || "0",
			budget: data.budget || "0",
			description: data.description || null,
		});
		return { id: String(res.data?.data?.id ?? id) };
	} catch (error) {
		if (process.env.NEXT_PUBLIC_USE_MOCK !== "true" && process.env.NODE_ENV === "production") {
			throw error;
		}
		return { id };
	}
}

export async function toggleAccountStatusAPIAction(
	id: string,
	status: "active" | "inactive",
): Promise<{ success: boolean }> {
	try {
		await axiosInstance.patch(API_PATH.ACCOUNTS.TOGGLE_STATUS(id), { status });
		return { success: true };
	} catch (error) {
		if (process.env.NEXT_PUBLIC_USE_MOCK !== "true" && process.env.NODE_ENV === "production") {
			throw error;
		}
		return { success: false };
	}
}

export async function getAccountPlanDetailAPIAction(
	id: string,
): Promise<AccountPlanDetail | null> {
	try {
		const res = await axiosInstance.get(API_PATH.ACCOUNTS.UPDATE(id));
		const data = res.data?.data;
		if (data) {
			return {
				...mapAccountFromApi(data),
				costCenterMode: data.cost_center_mode || undefined,
				projectMode: data.project_mode || undefined,
				suggestedCostCenter: data.suggested_cost_center || undefined,
				suggestedProject: data.suggested_project || undefined,
				description: data.description || "",
			};
		}
	} catch (error) {
		if (process.env.NEXT_PUBLIC_USE_MOCK !== "true" && process.env.NODE_ENV === "production") {
			throw error;
		}
	}

	const found = MOCK_ACCOUNT_PLAN_DATA.find((item) => item.id === id);
	if (found) {
		const detail = found as AccountPlanDetail;
		return {
			...found,
			costCenterMode: detail.costCenterMode || undefined,
			projectMode: detail.projectMode || undefined,
			suggestedCostCenter: detail.suggestedCostCenter || undefined,
			suggestedProject: detail.suggestedProject || undefined,
		};
	}
	return null;
}
