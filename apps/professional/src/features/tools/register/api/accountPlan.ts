import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	AccountPlanRow,
	AccountPlanDetail,
	CreateAccountPlanFormData,
	GetAccountPlanListParams,
	GetAccountPlanListResponse,
} from "../types";

export type { AccountPlanRow, AccountPlanDetail };

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

const ACCOUNT_SORT_MAP: Record<string, string> = {
	accountNumber: "account_number",
	accountName: "account_name",
	accountType: "account_type",
	vatCode: "vat_code",
	sru: "sru",
	autoAccount: "auto_account",
	openingBalance: "opening_balance",
	budget: "budget",
	status: "status",
};

function toSortBy(sortBy?: string): string | undefined {
	if (!sortBy) return undefined;
	return ACCOUNT_SORT_MAP[sortBy] ?? sortBy;
}

const mapAccountFromApi = (item: Record<string, unknown>): AccountPlanRow => ({
	id: String(item.id ?? ""),
	accountNumber: String(item.account_number ?? ""),
	accountName: String(item.account_name ?? ""),
	accountType: String(item.account_type ?? "Asset"),
	vatCode: String(item.vat_code ?? "-"),
	sru: String(item.sru ?? ""),
	autoAccount: String(item.auto_account ?? "SEK"),
	openingBalance: String(item.opening_balance ?? "0"),
	budget: String(item.budget ?? "0"),
	status: item.status === "inactive" ? "inactive" : "active",
});

const mapAccountToApi = (data: CreateAccountPlanFormData): Record<string, unknown> => ({
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

export async function getAccountPlanListAPIAction(
	params?: GetAccountPlanListParams,
): Promise<GetAccountPlanListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.accountType && params.accountType !== "all") queryParams.account_type = params.accountType;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	const sortBy = toSortBy(params?.sortBy);
	if (sortBy) queryParams.sort_by = sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(API_PATH.ACCOUNTS.LIST, {
		params: queryParams,
	});
	const items = Array.isArray(res.data?.data) ? res.data.data : [];
	const total = res.data?.total_items ?? items.length;
	const page = res.data?.current_page ?? params?.page ?? 1;
	const backendPageSize = Number(res.data?.page_size);
	const limit = Number.isFinite(backendPageSize) && backendPageSize > 0
		? backendPageSize
		: (params?.limit ?? 10);
	const effectiveLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
	return {
		data: items.map(mapAccountFromApi),
		total,
		page,
		limit: effectiveLimit,
		totalPages: res.data?.total_pages ?? (Math.ceil(total / effectiveLimit) || 1),
	};
}

export async function createAccountPlanAPIAction(
	data: CreateAccountPlanFormData,
): Promise<{ success: boolean; id: string; error?: string }> {
	try {
		const res = await axiosInstance.post(API_PATH.ACCOUNTS.CREATE, mapAccountToApi(data));
		return { success: true, id: String(res.data?.data?.id ?? "") };
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 409) {
			return { success: false, id: "", error: "validationAccountNumberUnique" };
		}
		throw error;
	}
}

export async function updateAccountPlanAPIAction(
	id: string,
	data: CreateAccountPlanFormData,
): Promise<{ id: string }> {
	const res = await axiosInstance.put(API_PATH.ACCOUNTS.UPDATE(id), mapAccountToApi(data));
	return { id: String(res.data?.data?.id ?? id) };
}

export async function toggleAccountStatusAPIAction(
	id: string,
	status: "active" | "inactive",
): Promise<{ success: boolean }> {
	await axiosInstance.patch(API_PATH.ACCOUNTS.TOGGLE_STATUS(id), { status });
	return { success: true };
}

export async function getAccountPlanDetailAPIAction(id: string): Promise<AccountPlanDetail | null> {
	const res = await axiosInstance.get(API_PATH.ACCOUNTS.GET(id));
	const data = res.data?.data;
	if (!data) return null;
	return {
		...mapAccountFromApi(data),
		costCenterMode: data.cost_center_mode || undefined,
		projectMode: data.project_mode || undefined,
		suggestedCostCenter: data.suggested_cost_center || undefined,
		suggestedProject: data.suggested_project || undefined,
		description: data.description || "",
	};
}