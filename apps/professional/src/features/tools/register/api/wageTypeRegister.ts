import axiosInstance from "@/lib/axiosInstance";
import {
	wageTypeSchema,
	type WageTypeRow,
	type GetWageTypeListParams,
	type GetWageTypeListResponse,
	type CreateWageTypeFormData,
} from "../types";
import { MOCK_WAGE_TYPES } from "../mockdata/wageTypes";
import { z } from "zod";

const WAGE_TYPE_API_PATH = {
	LIST: "/api/v1/professional/wage-types",
	DETAIL: (id: string) => `/api/v1/professional/wage-types/${id}`,
	CREATE: "/api/v1/professional/wage-types",
	UPDATE: (id: string) => `/api/v1/professional/wage-types/${id}`,
	TOGGLE_STATUS: "/api/v1/professional/wage-types/toggle-status",
};

export async function getWageTypeListAPIAction(
	params?: GetWageTypeListParams,
): Promise<GetWageTypeListResponse> {
	try {
		const res = await axiosInstance.get(WAGE_TYPE_API_PATH.LIST, {
			params: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 50,
				search: params?.search,
				status: params?.status,
				sort_by: params?.sortBy,
				sort_order: params?.sortOrder,
			},
		});

		const data = res.data?.data;
		const items = Array.isArray(data) ? data : data?.items ?? [];

		if (items.length > 0) {
			const validated = z.array(wageTypeSchema).safeParse(
				items.map((item: Record<string, unknown>) => ({
					id: String(item.id ?? ""),
					code: String(item.code ?? ""),
					name: String(item.name ?? ""),
					personalType: String(item.personalType ?? item.personal_type ?? "Tjänstemän"),
					unit: String(item.unit ?? ""),
					wageForm: String(item.wageForm ?? item.wage_form ?? "Fast lön"),
					transactionType: String(item.transactionType ?? item.transaction_type ?? "Br.lön"),
					preliminaryTax: String(item.preliminaryTax ?? item.preliminary_tax ?? "Ja 30%"),
					employerContribution: String(item.employerContribution ?? item.employer_contribution ?? "Ja 30%"),
					createdAt: String(item.createdAt ?? item.created_at ?? ""),
					updatedAt: String(item.updatedAt ?? item.updated_at ?? ""),
					accountNumber: String(item.accountNumber ?? item.account_number ?? ""),
					status: item.status === "inactive" ? "inactive" : "active",
					description: item.description ? String(item.description) : undefined,
					factor: item.factor ? String(item.factor) : undefined,
				})),
			);

			if (validated.success) {
				return {
					data: validated.data,
					total: res.data?.data?.total ?? items.length,
					page: res.data?.data?.page ?? params?.page ?? 1,
					limit: res.data?.data?.limit ?? params?.limit ?? 50,
					totalPages: res.data?.data?.totalPages ?? 1,
				};
			}
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
	}

	// Local development mock fallback
	if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_USE_MOCK === "true") {
		const page = Math.max(1, params?.page ?? 1);
		const limit = Math.max(1, params?.limit ?? 50);
		const search = params?.search?.toLowerCase().trim();
		const statusFilter = params?.status?.toLowerCase().trim();

		let filtered = [...MOCK_WAGE_TYPES];

		if (search) {
			filtered = filtered.filter(
				(item) =>
					item.code.toLowerCase().includes(search) ||
					item.name.toLowerCase().includes(search) ||
					(item.accountNumber && item.accountNumber.toLowerCase().includes(search)),
			);
		}

		if (statusFilter && statusFilter !== "all") {
			filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter);
		}

		if (params?.sortBy) {
			const field = params.sortBy as keyof WageTypeRow;
			const order = params.sortOrder === "desc" ? -1 : 1;

			filtered.sort((a, b) => {
				const aVal = a[field as keyof typeof a];
				const bVal = b[field as keyof typeof b];

				if (field === "code" || field === "accountNumber") {
					const numA = parseFloat(String(aVal)) || 0;
					const numB = parseFloat(String(bVal)) || 0;
					return (numA - numB) * order;
				}

				return String(aVal).localeCompare(String(bVal)) * order;
			});
		}

		const total = filtered.length;
		const totalPages = Math.ceil(total / limit) || 1;
		const startIndex = (page - 1) * limit;
		const paginatedData = filtered.slice(startIndex, startIndex + limit);

		return { data: paginatedData, total, page, limit, totalPages };
	}

	return { data: [], total: 0, page: 1, limit: 50, totalPages: 1 };
}

export async function getWageTypeDetailAPIAction(
	id: string,
): Promise<WageTypeRow | null> {
	try {
		const res = await axiosInstance.get(WAGE_TYPE_API_PATH.DETAIL(id));
		const data = res.data?.data;
		if (data) {
			const parsed = wageTypeSchema.safeParse({
				id: String(data.id ?? id),
				code: String(data.code ?? ""),
				name: String(data.name ?? ""),
				personalType: String(data.personalType ?? data.personal_type ?? "Tjänstemän"),
				unit: String(data.unit ?? ""),
				wageForm: String(data.wageForm ?? data.wage_form ?? "Fast lön"),
				transactionType: String(data.transactionType ?? data.transaction_type ?? "Br.lön"),
				preliminaryTax: String(data.preliminaryTax ?? data.preliminary_tax ?? "Ja 30%"),
				employerContribution: String(data.employerContribution ?? data.employer_contribution ?? "Ja 30%"),
				createdAt: String(data.createdAt ?? data.created_at ?? ""),
				updatedAt: String(data.updatedAt ?? data.updated_at ?? ""),
				accountNumber: String(data.accountNumber ?? data.account_number ?? ""),
				status: data.status === "inactive" ? "inactive" : "active",
				description: data.description ? String(data.description) : undefined,
				factor: data.factor ? String(data.factor) : undefined,
			});
			if (parsed.success) {
				return parsed.data;
			}
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
	}

	if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_USE_MOCK === "true") {
		const found = MOCK_WAGE_TYPES.find((item) => item.id === id);
		if (found) {
			const parsed = wageTypeSchema.safeParse(found);
			if (parsed.success) {
				return parsed.data;
			}
		}
	}

	return null;
}

export async function createWageTypeAPIAction(
	data: CreateWageTypeFormData,
): Promise<{ success: boolean; data?: WageTypeRow; error?: string }> {
	try {
		const res = await axiosInstance.post(WAGE_TYPE_API_PATH.CREATE, data);
		if (res.data?.success && res.data?.data) {
			return { success: true, data: res.data.data };
		}
		return { success: false, error: res.data?.message ?? "Failed to create wage type" };
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}

		// Mock implementation
		const codeExists = MOCK_WAGE_TYPES.some((item) => item.code === data.code);
		if (codeExists) {
			return { success: false, error: "wageTypeDuplicateCodeError" };
		}

		const newId = String(MOCK_WAGE_TYPES.length + 1);
		const newWageType: WageTypeRow = {
			id: newId,
			code: data.code,
			name: data.name,
			personalType: "Tjänstemän",
			unit: data.unit,
			wageForm: "Fast lön",
			transactionType: "Br.lön",
			preliminaryTax: "Ja 30%",
			employerContribution: "Ja 30%",
			createdAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date().toISOString().split("T")[0],
			accountNumber: data.accountNumber ?? "",
			status: data.status === "inactive" ? "inactive" : "active",
			description: data.description ?? "",
			factor: data.factor ?? "1.0",
		};

		MOCK_WAGE_TYPES.push(newWageType);
		return { success: true, data: newWageType };
	}
}

export async function updateWageTypeAPIAction(
	id: string,
	data: Partial<CreateWageTypeFormData>,
): Promise<{ success: boolean; data?: WageTypeRow; error?: string }> {
	try {
		const res = await axiosInstance.put(WAGE_TYPE_API_PATH.UPDATE(id), data);
		if (res.data?.success && res.data?.data) {
			return { success: true, data: res.data.data };
		}
		return { success: false, error: res.data?.message ?? "Failed to update wage type" };
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}

		// Mock implementation
		const foundIndex = MOCK_WAGE_TYPES.findIndex((item) => item.id === id);
		if (foundIndex === -1) {
			return { success: false, error: "Wage type not found" };
		}

		if (data.code) {
			const codeExists = MOCK_WAGE_TYPES.some((item) => item.code === data.code && item.id !== id);
			if (codeExists) {
				return { success: false, error: "wageTypeDuplicateCodeError" };
			}
		}

		const current = MOCK_WAGE_TYPES[foundIndex];
		const updatedWageType: WageTypeRow = {
			...current,
			code: data.code ?? current.code,
			name: data.name ?? current.name,
			unit: data.unit ?? current.unit,
			accountNumber: data.accountNumber ?? current.accountNumber,
			description: data.description ?? current.description,
			factor: data.factor ?? current.factor,
			status: data.status ?? current.status,
			updatedAt: new Date().toISOString().split("T")[0],
		};

		MOCK_WAGE_TYPES[foundIndex] = updatedWageType;
		return { success: true, data: updatedWageType };
	}
}

export async function toggleWageTypeStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	try {
		await axiosInstance.post(WAGE_TYPE_API_PATH.TOGGLE_STATUS, {
			ids,
			status: targetStatus,
		});
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
		// Mock implementation
		MOCK_WAGE_TYPES.forEach((item) => {
			if (ids.includes(item.id)) {
				item.status = targetStatus;
			}
		});
		return true;
	}
}
