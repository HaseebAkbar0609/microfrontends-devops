import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import {
	type BudgetRegisterRow,
	type BudgetRegisterDetail,
	type CreateBudgetFormData,
	type GetBudgetListParams,
	type GetBudgetListResponse,
} from "../types";

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

const BUDGET_SORT_MAP: Record<string, string> = {
	budgetnr: "budget_nr",
	budgetName: "name",
	datum: "date",
	totalKostnad: "total_cost",
	totalInkomst: "total_income",
	status: "status",
};

const mapBudgetFromApi = (item: Record<string, unknown>): BudgetRegisterRow => ({
	id: String(item.id ?? ""),
	budgetnr: String(item.budget_nr ?? item.budgetnr ?? ""),
	budgetName: String(item.name ?? item.budgetName ?? ""),
	datum: String(item.date ?? item.start_date ?? item.datum ?? ""),
	totalKostnad: String(item.total_cost ?? item.totalKostnad ?? ""),
	totalInkomst: String(item.total_income ?? item.total_amount ?? item.totalInkomst ?? ""),
	status: item.status === "inactive" ? "inactive" : "active",
	isFavorite: Boolean(item.is_favorite ?? item.isFavorite ?? false),
});

const mapBudgetToApi = (data: CreateBudgetFormData): Record<string, unknown> => ({
	budget_nr: data.budgetNr ?? "",
	name: data.budgetName,
	total_amount: Number(String(data.totalAmount ?? "").replace(/\s/g, "").replace(",", ".")) || 0,
	currency: data.currency,
	category: data.category,
	start_date: data.startDate,
	end_date: data.endDate,
	description: data.description ?? "",
	avvik_budget: data.avvikBudget ?? false,
	overhead_budget: data.overheadBudget ?? false,
	distribution: data.distribution ?? "K4",
	rows: data.budgetRows?.map((row) => {
		const parseBudgetNum = (val: string | number): number => {
			const str = String(val ?? "").trim();
			if (str === "") return 0;
			const n = Number(str.replace(/\s/g, "").replace(",", "."));
			if (!Number.isFinite(n)) {
				throw new Error("Invalid numeric value in budget row");
			}
			return n;
		};
		return {
			konto: row.konto,
			kostnads_stalle: row.kostnadsStalle,
			arsbelopp: parseBudgetNum(row.arsbelopp),
			fordelning: row.fordelning,
			percent: parseBudgetNum(row.percent),
			months: Array.isArray(row.months) ? row.months.map(parseBudgetNum) : [],
		};
	}) ?? [],
});

export async function createBudgetAPIAction(
	data: CreateBudgetFormData,
): Promise<{ success: boolean; error?: string }> {
	await axiosInstance.post(API_PATH.BUDGETS.CREATE, mapBudgetToApi(data));
	return { success: true };
}

export async function getBudgetListAPIAction(
	params?: GetBudgetListParams,
): Promise<GetBudgetListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	const sortBy = params?.sortBy ? BUDGET_SORT_MAP[params.sortBy] ?? params.sortBy : undefined;
	if (sortBy) queryParams.sort_by = sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
		API_PATH.BUDGETS.LIST,
		{ params: queryParams },
	);
	const items = Array.isArray(res.data?.data) ? res.data.data : [];

	return {
		data: items.map(mapBudgetFromApi),
		total: res.data?.total_items ?? items.length,
		page: res.data?.current_page ?? params?.page ?? 1,
		limit: res.data?.page_size ?? params?.limit ?? 50,
		totalPages: res.data?.total_pages ?? (Math.ceil(items.length / (params?.limit ?? 50)) || 1),
	};
}

export async function getBudgetDetailAPIAction(
	id: string,
): Promise<BudgetRegisterDetail | null> {
	const res = await axiosInstance.get(API_PATH.BUDGETS.GET(id));
	const data = res.data?.data;
	if (!data) return null;
	const budgetVsActualRaw = data.budget_vs_actual;
	const budgetVsActual = budgetVsActualRaw && typeof budgetVsActualRaw === "object"
		? {
			budget_amount: Number(budgetVsActualRaw.budget_amount ?? 0),
			actual_spend: Number(budgetVsActualRaw.actual_spend ?? 0),
			difference: Number(budgetVsActualRaw.difference ?? 0),
			percent_used: Number(budgetVsActualRaw.percent_used ?? 0),
		}
		: undefined;

	const expenseBreakdownRaw = Array.isArray(data.expense_breakdown) ? data.expense_breakdown : [];
	const expenseBreakdown = expenseBreakdownRaw.map((entry: Record<string, unknown>) => ({
		category: String(entry.category ?? ""),
		budgeted: Number(entry.budgeted ?? 0),
		actual: Number(entry.actual ?? 0),
	}));

	const detail: BudgetRegisterDetail = {
		id: String(data.id ?? id),
		budgetnr: String(data.budget_nr ?? ""),
		name: String(data.name ?? ""),
		date: data.date ? String(data.date) : undefined,
		totalCost: data.total_cost !== null && data.total_cost !== undefined ? String(data.total_cost) : undefined,
		totalIncome: data.total_income !== null && data.total_income !== undefined ? String(data.total_income) : undefined,
		totalAmount: data.total_amount !== null && data.total_amount !== undefined ? Number(data.total_amount) : undefined,
		currency: data.currency ? String(data.currency) : undefined,
		category: data.category ? String(data.category) : undefined,
		startDate: data.start_date ? String(data.start_date) : undefined,
		endDate: data.end_date ? String(data.end_date) : undefined,
		description: data.description ? String(data.description) : undefined,
		status: data.status === "inactive" ? "inactive" : "active",
		isFavorite: Boolean(data.is_favorite ?? false),
		budgetVsActual,
		expenseBreakdown,
		createdAt: data.created_at ? String(data.created_at) : undefined,
	};

	return detail;
}

export async function deleteBudgetAPIAction(id: string): Promise<boolean> {
	await axiosInstance.delete(API_PATH.BUDGETS.DELETE(id));
	return true;
}

export async function toggleBudgetStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	await axiosInstance.post(API_PATH.BUDGETS.TOGGLE_STATUS, {
		ids,
		status: targetStatus,
	});
	return true;
}

export async function toggleBudgetFavoriteAPIAction(
	id: string,
	isFavorite: boolean,
): Promise<boolean> {
	await axiosInstance.post(API_PATH.BUDGETS.TOGGLE_FAVORITE(id), {
		is_favorite: isFavorite,
	});
	return true;
}